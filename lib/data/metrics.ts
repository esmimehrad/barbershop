import { createClient } from "@/lib/supabase/server";

export type DashboardMetrics = {
  /** North Star: share of customers who came back for a 2nd+ completed visit. */
  repeatRate: number;
  /** No-shows ÷ finished appointments over the trailing window. */
  noShowRate: number;
  /** Booked minutes today ÷ available capacity minutes today. */
  utilization: number;
  /** Outstanding credit the shop owes customers (sum of balances). */
  creditLiability: number;
  /** Raw counts for the schedule header. */
  bookedToday: number;
  completedToday: number;
  noShowToday: number;
};

const WINDOW_DAYS = 30;

function todayBounds(): { start: string; end: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  return {
    start: new Date(y, m, d, 0, 0, 0).toISOString(),
    end: new Date(y, m, d, 23, 59, 59).toISOString(),
  };
}

/**
 * Dashboard rates + counts. Percentages are ratios in [0,1]; the UI formats
 * them. These are read-only aggregates — no business rule is re-implemented,
 * we only count what the DB already recorded.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();
  const { start, end } = todayBounds();

  const [repeatRate, noShowRate, utilization, creditLiability, todayCounts] =
    await Promise.all([
      computeRepeatRate(supabase),
      computeNoShowRate(supabase),
      computeUtilization(supabase, start, end),
      computeCreditLiability(supabase),
      computeTodayCounts(supabase, start, end),
    ]);

  return { repeatRate, noShowRate, utilization, creditLiability, ...todayCounts };
}

type DB = Awaited<ReturnType<typeof createClient>>;

/** Repeat rate = customers with ≥2 completed visits ÷ customers with ≥1. */
async function computeRepeatRate(supabase: DB): Promise<number> {
  const { data } = await supabase
    .from("appointment")
    .select("client_id")
    .eq("status", "completed");
  if (!data || data.length === 0) return 0;

  const perClient = new Map<string, number>();
  for (const row of data) {
    perClient.set(row.client_id, (perClient.get(row.client_id) ?? 0) + 1);
  }
  const withAny = perClient.size;
  if (withAny === 0) return 0;
  let repeat = 0;
  for (const count of perClient.values()) if (count >= 2) repeat += 1;
  return repeat / withAny;
}

/** No-show rate over the trailing window = no_show ÷ (completed + no_show). */
async function computeNoShowRate(supabase: DB): Promise<number> {
  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000).toISOString();
  const countByStatus = async (status: "completed" | "no_show") => {
    const { count } = await supabase
      .from("appointment")
      .select("id", { count: "exact", head: true })
      .eq("status", status)
      .gte("starts_at", since);
    return count ?? 0;
  };
  const [completed, noShow] = await Promise.all([
    countByStatus("completed"),
    countByStatus("no_show"),
  ]);
  const finished = completed + noShow;
  return finished === 0 ? 0 : noShow / finished;
}

/** Utilization = booked minutes today ÷ available capacity minutes today. */
async function computeUtilization(
  supabase: DB,
  start: string,
  end: string,
): Promise<number> {
  const dayOfWeek = new Date(start).getDay();

  const [{ data: windows }, { data: appts }, { data: staff }] = await Promise.all([
    supabase
      .from("staff_availability")
      .select("staff_id, start_time, end_time")
      .eq("day_of_week", dayOfWeek),
    supabase
      .from("appointment")
      .select("starts_at, ends_at")
      .in("status", ["booked", "completed"])
      .gte("starts_at", start)
      .lte("starts_at", end),
    supabase.from("staff").select("id").eq("is_active", true),
  ]);

  const activeIds = new Set((staff ?? []).map((s) => s.id));
  const capacityMin = (windows ?? [])
    .filter((w) => activeIds.has(w.staff_id))
    .reduce((sum, w) => sum + minutesBetween(w.start_time, w.end_time), 0);
  if (capacityMin === 0) return 0;

  const bookedMin = (appts ?? []).reduce(
    (sum, a) =>
      sum + (new Date(a.ends_at).getTime() - new Date(a.starts_at).getTime()) / 60_000,
    0,
  );
  return Math.min(1, bookedMin / capacityMin);
}

async function computeCreditLiability(supabase: DB): Promise<number> {
  const { data } = await supabase.from("client").select("credit_balance");
  return (data ?? []).reduce((sum, c) => sum + (c.credit_balance ?? 0), 0);
}

async function computeTodayCounts(supabase: DB, start: string, end: string) {
  const countByStatus = async (status: "booked" | "completed" | "no_show") => {
    const { count } = await supabase
      .from("appointment")
      .select("id", { count: "exact", head: true })
      .eq("status", status)
      .gte("starts_at", start)
      .lte("starts_at", end);
    return count ?? 0;
  };
  const [bookedToday, completedToday, noShowToday] = await Promise.all([
    countByStatus("booked"),
    countByStatus("completed"),
    countByStatus("no_show"),
  ]);
  return { bookedToday, completedToday, noShowToday };
}

/** Minutes between two `HH:MM[:SS]` clock strings (same day, end ≥ start). */
function minutesBetween(start: string, end: string): number {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  return Math.max(0, toMin(end) - toMin(start));
}

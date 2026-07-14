import { createClient } from "@/lib/supabase/server";

export type DashboardMetrics = {
  bookedToday: number;
  completedToday: number;
  noShowToday: number;
  creditLiability: number;
};

/** Lightweight dashboard counts. Full analytics come later; low-fi shows shape. */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

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

  const { data: clients } = await supabase.from("client").select("credit_balance");
  const creditLiability = (clients ?? []).reduce((sum, c) => sum + (c.credit_balance ?? 0), 0);

  return { bookedToday, completedToday, noShowToday, creditLiability };
}

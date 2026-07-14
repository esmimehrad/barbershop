import { createClient } from "@/lib/supabase/server";

function todayRange(): { start: string; end: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  return {
    start: new Date(y, m, d, 0, 0, 0).toISOString(),
    end: new Date(y, m, d, 23, 59, 59).toISOString(),
  };
}

const APPT_SELECT =
  "id, starts_at, ends_at, status, amount_due, client:client_id(name), staff:staff_id(name), service:service_id(name)";

export type AppointmentRow = {
  id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  amount_due: number;
  client: { name: string } | null;
  staff: { name: string } | null;
  service: { name: string } | null;
};

/** All appointments today (dashboard). RLS scopes to what the viewer may see. */
export async function listTodayAppointments(): Promise<AppointmentRow[]> {
  const supabase = await createClient();
  const { start, end } = todayRange();
  const { data } = await supabase
    .from("appointment")
    .select(APPT_SELECT)
    .gte("starts_at", start)
    .lte("starts_at", end)
    .order("starts_at", { ascending: true });
  return (data ?? []) as unknown as AppointmentRow[];
}

/** A client's own appointments (account / rebook). */
export async function listClientAppointments(clientId: string): Promise<AppointmentRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("appointment")
    .select(APPT_SELECT)
    .eq("client_id", clientId)
    .order("starts_at", { ascending: false });
  return (data ?? []) as unknown as AppointmentRow[];
}

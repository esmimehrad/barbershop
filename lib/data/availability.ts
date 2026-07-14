import { createClient } from "@/lib/supabase/server";

export type Slot = { startISO: string; endISO: string; label: string };

const STEP_MS = 15 * 60_000;

function fmtTime(ms: number): string {
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Free slots for a staff member on a date: availability windows for that
 * weekday, minus existing booked appointments, minus holidays, minus the past.
 * This is a READ query — the double-booking rule is enforced by the DB trigger
 * on write, never re-implemented here.
 */
export async function getAvailableSlots(
  staffId: string,
  durationMinutes: number,
  dateISO: string,
): Promise<Slot[]> {
  const supabase = await createClient();
  const dayOfWeek = new Date(`${dateISO}T00:00:00`).getDay();

  const { data: holidays } = await supabase
    .from("holiday_closure")
    .select("id")
    .eq("date", dateISO)
    .or(`staff_id.eq.${staffId},staff_id.is.null`);
  if (holidays && holidays.length > 0) return [];

  const { data: windows } = await supabase
    .from("staff_availability")
    .select("start_time, end_time")
    .eq("staff_id", staffId)
    .eq("day_of_week", dayOfWeek);
  if (!windows || windows.length === 0) return [];

  const dayStart = new Date(`${dateISO}T00:00:00`).toISOString();
  const dayEnd = new Date(`${dateISO}T23:59:59`).toISOString();
  const { data: appts } = await supabase
    .from("appointment")
    .select("starts_at, ends_at")
    .eq("staff_id", staffId)
    .eq("status", "booked")
    .gte("starts_at", dayStart)
    .lte("starts_at", dayEnd);

  const busy = (appts ?? []).map(
    (a) => [new Date(a.starts_at).getTime(), new Date(a.ends_at).getTime()] as const,
  );
  const durMs = durationMinutes * 60_000;
  const now = Date.now();
  const slots: Slot[] = [];

  for (const w of windows) {
    let cursor = new Date(`${dateISO}T${w.start_time}`).getTime();
    const windowEnd = new Date(`${dateISO}T${w.end_time}`).getTime();
    while (cursor + durMs <= windowEnd) {
      const start = cursor;
      const end = cursor + durMs;
      const overlaps = busy.some(([bs, be]) => start < be && end > bs);
      if (!overlaps && start > now) {
        slots.push({
          startISO: new Date(start).toISOString(),
          endISO: new Date(end).toISOString(),
          label: fmtTime(start),
        });
      }
      cursor += STEP_MS;
    }
  }
  return slots;
}

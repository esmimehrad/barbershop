import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/features/schedule/RowActions";
import type { AppointmentRow } from "@/lib/data/appointments";
import type { Staff } from "@/lib/data/staff";

const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "destructive"> = {
  booked: "neutral",
  completed: "success",
  late_released: "warning",
  no_show: "destructive",
  cancelled: "neutral",
};

function time(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/**
 * Today's schedule as one column per provider (Flow 10.2 — both tracks in a
 * single grid). Stacks to one column on phones; scrolls horizontally when
 * several providers work the same day.
 */
export function ProviderColumns({
  staff,
  appointments,
}: {
  staff: Staff[];
  appointments: AppointmentRow[];
}) {
  const byStaff = new Map<string, AppointmentRow[]>();
  for (const appt of appointments) {
    const list = byStaff.get(appt.staff_id) ?? [];
    list.push(appt);
    byStaff.set(appt.staff_id, list);
  }

  if (appointments.length === 0) {
    return <p className="text-sm text-muted-foreground">No appointments today.</p>;
  }

  return (
    <div className="grid gap-3 sm:auto-cols-[minmax(15rem,1fr)] sm:grid-flow-col sm:overflow-x-auto">
      {staff.map((member) => {
        const rows = byStaff.get(member.id) ?? [];
        return (
          <section key={member.id} className="flex min-w-0 flex-col gap-2">
            <h3 className="text-sm font-semibold">
              {member.name}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                {member.role === "lash_specialist" ? "lash" : "barber"}
              </span>
            </h3>
            {rows.length === 0 ? (
              <p className="text-xs text-muted-foreground">Open all day</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {rows.map((a) => (
                  <li key={a.id}>
                    <Card>
                      <CardContent className="flex flex-col gap-1 py-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium tabular-nums">
                            {time(a.starts_at)} · {a.client?.name ?? "Client"}
                          </span>
                          <Badge tone={STATUS_TONE[a.status] ?? "neutral"}>{a.status}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{a.service?.name}</span>
                        {a.client?.preferences ? (
                          <span className="text-xs text-muted-foreground">
                            ↳ {a.client.preferences}
                          </span>
                        ) : null}
                        <RowActions id={a.id} status={a.status} />
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

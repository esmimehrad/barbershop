import Link from "next/link";
import { canSee, getSessionContext } from "@/lib/auth";
import { listTodayAppointments } from "@/lib/data/appointments";
import { getDashboardMetrics } from "@/lib/data/metrics";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/features/schedule/RowActions";

const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "destructive"> = {
  booked: "neutral",
  completed: "success",
  late_released: "warning",
  no_show: "destructive",
  cancelled: "neutral",
};

export default async function DashboardPage() {
  const session = await getSessionContext();
  const appts = await listTodayAppointments();
  const showMetrics = canSee(session.accessLevel, "metrics");
  const metrics = showMetrics ? await getDashboardMetrics() : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Today</h1>
          <p className="text-sm text-muted-foreground">
            {session.displayName} · {session.accessLevel}
          </p>
        </div>
        <Link href="/dashboard/settings" className="text-sm underline">
          Settings
        </Link>
      </div>

      {metrics ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Metric label="Booked" value={String(metrics.bookedToday)} />
          <Metric label="Completed" value={String(metrics.completedToday)} />
          <Metric label="No-shows" value={String(metrics.noShowToday)} />
          <Metric label="Credit liability" value={formatMoney(metrics.creditLiability)} />
        </div>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Schedule</h2>
        {appts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments today.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {appts.map((a) => (
              <li key={a.id}>
                <Card>
                  <CardContent className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <div className="font-medium tabular-nums">
                        {new Date(a.starts_at).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        · {a.client?.name ?? "Client"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {a.service?.name} · {a.staff?.name}
                      </div>
                      <Badge tone={STATUS_TONE[a.status] ?? "neutral"} className="mt-1">
                        {a.status}
                      </Badge>
                    </div>
                    <RowActions id={a.id} status={a.status} />
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-3">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  );
}

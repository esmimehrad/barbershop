import Link from "next/link";
import { canSee, getSessionContext } from "@/lib/auth";
import { listTodayAppointments } from "@/lib/data/appointments";
import { listActiveStaff } from "@/lib/data/staff";
import { getDashboardMetrics } from "@/lib/data/metrics";
import { listRecentActivity } from "@/lib/data/activity";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ProviderColumns } from "@/features/schedule/ProviderColumns";

const pct = (r: number) => `${Math.round(r * 100)}%`;

export default async function DashboardPage() {
  const session = await getSessionContext();
  const showMetrics = canSee(session.accessLevel, "metrics");

  const [appts, staff, metrics, activity] = await Promise.all([
    listTodayAppointments(),
    listActiveStaff(),
    showMetrics ? getDashboardMetrics() : Promise.resolve(null),
    showMetrics ? listRecentActivity() : Promise.resolve([]),
  ]);

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
          <Metric label="Repeat visits ★" value={pct(metrics.repeatRate)} />
          <Metric label="No-show rate" value={pct(metrics.noShowRate)} />
          <Metric label="Utilization" value={pct(metrics.utilization)} />
          <Metric label="Credit liability" value={formatMoney(metrics.creditLiability)} />
        </div>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Schedule</h2>
        <ProviderColumns staff={staff} appointments={appts} />
      </section>

      {metrics ? (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Activity</h2>
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent credit activity.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {activity.map((item) => (
                <li key={item.id}>
                  <Card>
                    <CardContent className="flex items-center justify-between py-2 text-sm">
                      <span>
                        <span className="capitalize">{item.reason.replace(/_/g, " ")}</span>
                        {" · "}
                        <span className="text-muted-foreground">{item.clientName}</span>
                      </span>
                      <span
                        className={`tabular-nums ${item.amount < 0 ? "text-muted-foreground" : "text-success"}`}
                      >
                        {item.amount < 0 ? "−" : "+"}
                        {formatMoney(Math.abs(item.amount))}
                      </span>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
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

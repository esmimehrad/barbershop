import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";
import { getClientProfile } from "@/lib/data/clients";
import { listClientAppointments } from "@/lib/data/appointments";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AccountPage() {
  const session = await getSessionContext();
  if (!session.clientId) redirect("/auth/dev");

  const [client, appts] = await Promise.all([
    getClientProfile(session.clientId),
    listClientAppointments(session.clientId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Welcome back, {client?.name}</h1>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card>
          <CardContent className="py-3">
            <div className="text-xs text-muted-foreground">Credit balance</div>
            <div className="text-lg font-semibold tabular-nums">
              {formatMoney(client?.credit_balance ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3">
            <div className="text-xs text-muted-foreground">Referral code</div>
            <div className="text-lg font-semibold">{client?.referral_code}</div>
          </CardContent>
        </Card>
      </div>

      <Link href="/book">
        <Button className="w-full">Book again</Button>
      </Link>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Your appointments</h2>
        {appts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {appts.map((a) => (
              <li key={a.id}>
                <Card>
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">{a.service?.name}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {new Date(a.starts_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        · {a.staff?.name}
                      </div>
                    </div>
                    <Badge>{a.status}</Badge>
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

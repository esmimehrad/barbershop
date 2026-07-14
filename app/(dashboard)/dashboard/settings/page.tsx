import Link from "next/link";
import { canSee, getSessionContext } from "@/lib/auth";
import { listBookableServices, listAddons } from "@/lib/data/services";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const TABS = [
  "Access levels",
  "Staff & services",
  "Schedule & holidays",
  "Services & pricing",
  "RFM cashback",
  "Promotions",
  "Gallery",
];

/** Low-fi settings hub: real services list, other tabs stubbed. */
export default async function SettingsPage() {
  const session = await getSessionContext();
  const canAdmin = canSee(session.accessLevel, "staff_admin");
  const [services, addons] = await Promise.all([
    listBookableServices("haircut"),
    listAddons("haircut"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Settings</h1>
        <Link href="/dashboard" className="text-sm underline">
          Back
        </Link>
      </div>

      <nav className="flex flex-wrap gap-2 text-sm">
        {TABS.map((t) => (
          <span key={t} className="rounded-[var(--radius)] border border-border px-2 py-1">
            {t}
          </span>
        ))}
      </nav>

      {!canAdmin ? (
        <p className="text-xs text-muted-foreground">
          Some sections are limited to owner/manager access.
        </p>
      ) : null}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Services & pricing</h2>
        <ul className="flex flex-col gap-2">
          {[...services, ...addons].map((s) => (
            <li key={s.id}>
              <Card>
                <CardContent className="flex items-center justify-between py-3 text-sm">
                  <span>
                    {s.name}
                    {s.is_addon ? " · add-on" : ""}
                    {s.is_package ? " · package" : ""}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {s.duration_minutes}m · {formatMoney(s.price)}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-[var(--radius)] border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
        [ Access levels · Staff assignments · Schedule/holidays · RFM · Promotions · Gallery —
        low-fi placeholders, editing wired in a later pass ]
      </p>
    </div>
  );
}

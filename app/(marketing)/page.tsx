import Link from "next/link";
import { listBookableServices } from "@/lib/data/services";
import { listActiveStaff } from "@/lib/data/staff";
import { staffDisplayName } from "@/lib/staff-name";
import { formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Marketing content is largely static → cache it.
export const revalidate = 3600;

/** Low-fi landing. Sections are wireframe blocks; real services/staff read live. */
export default async function LandingPage() {
  const [haircuts, staff] = await Promise.all([
    listBookableServices("haircut"),
    listActiveStaff(),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 p-4 py-10">
      {/* Hero */}
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          [ hero — image + slogan later ]
        </p>
        <h1 className="text-3xl font-bold">Classic cuts. Book in seconds.</h1>
        <div className="flex gap-2">
          <Link href="/book?track=haircut">
            <Button>Find times — Haircut</Button>
          </Link>
          <Link href="/book?track=eyelash">
            <Button variant="secondary">Eyelash</Button>
          </Link>
        </div>
      </section>

      {/* Services */}
      <Section title="Services">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {haircuts.map((s) => (
            <Link key={s.id} href={`/book?track=haircut&serviceId=${s.id}`}>
              <Card className="hover:bg-muted">
                <CardContent className="flex items-center justify-between py-3">
                  <span>{s.name}</span>
                  <span className="tabular-nums text-sm text-muted-foreground">
                    from {formatMoney(s.price)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Barbers */}
      <Section title="Meet the team">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {staff.map((m) => (
            <Card key={m.id}>
              <CardContent className="py-4">
                <div className="mb-2 aspect-square rounded-[var(--radius)] bg-muted" aria-hidden />
                <div className="font-medium">{staffDisplayName(m)}</div>
                <div className="text-xs text-muted-foreground">{m.specialty}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {[
        "Eyelash — before/after reveal",
        "Gallery — work / space",
        "Testimonials — Google reviews",
        "Contact — map, phone, hours",
      ].map((label) => (
        <Section key={label} title={label}>
          <div className="rounded-[var(--radius)] border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            [ {label} — low-fi placeholder ]
          </div>
        </Section>
      ))}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

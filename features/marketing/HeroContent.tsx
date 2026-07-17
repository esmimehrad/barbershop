import Link from "next/link";
import type { Service } from "@/lib/data/services";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

/** Headline/CTA/service-chip overlay shared by the cinematic hero and its reduced-motion fallback. */
export function HeroContent({ services }: { services: Service[] }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--bds-ink)]/80">
        Fadehouse Barbershop &amp; Lash Studio
      </p>
      <h1 className="font-display max-w-2xl text-4xl leading-[1.05] text-[var(--bds-ink)] sm:text-6xl">
        Precision cuts. Old-world craft.
      </h1>
      <p className="max-w-md text-base text-[var(--bds-ink)]/85 sm:text-lg">
        Two chairs, one standard: every guest leaves sharper than they walked in.
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/book?track=haircut">
          <Button className="min-w-40">Find times</Button>
        </Link>
        <a
          href="#services"
          className="text-sm font-medium text-[var(--bds-ink)] underline underline-offset-4 hover:text-primary"
        >
          See all services
        </a>
      </div>

      {services.length > 0 ? (
        <ul className="flex flex-wrap gap-2 pt-4">
          {services.slice(0, 3).map((service) => (
            <li key={service.id}>
              <Link
                href={`/book?track=haircut&serviceId=${service.id}`}
                className="inline-flex items-center gap-2 rounded-[var(--bds-radius-pill)] border border-[var(--bds-ink)]/25 bg-[var(--bds-ink)]/10 px-4 py-2 text-sm text-[var(--bds-ink)] backdrop-blur transition-colors hover:border-primary hover:bg-primary/20"
              >
                {service.name}
                <span className="tabular-nums text-[var(--bds-ink)]/70">
                  {formatMoney(service.price)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

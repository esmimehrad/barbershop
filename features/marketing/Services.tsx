import Link from "next/link";
import type { Service } from "@/lib/data/services";
import { formatMoney } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-2xl text-foreground sm:text-4xl">Services</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Every cut is booked with a real time slot, no guesswork, no waiting room.
        </p>
      </ScrollReveal>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-3">
        {services.map((service, i) => (
          <ScrollReveal key={service.id} delayMs={Math.min(i * 60, 360)}>
            <Link
              href={`/book?track=haircut&serviceId=${service.id}`}
              className="group flex h-full flex-col justify-between gap-4 rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm transition-[box-shadow,transform,border-color,background-color] duration-base ease-bds hover:-translate-y-1 hover:border-primary hover:bg-primary/10 hover:shadow-md sm:gap-6 sm:p-6"
            >
              <div>
                <h3 className="text-base font-semibold text-card-foreground sm:text-lg">
                  {service.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {service.duration_minutes} min
                </p>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-primary group-hover:underline sm:text-sm">
                  Book this
                </span>
                <span className="tabular-nums text-base font-semibold text-card-foreground sm:text-lg">
                  {formatMoney(service.price)}
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

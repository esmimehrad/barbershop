import Link from "next/link";
import type { Service } from "@/lib/data/services";
import { Button } from "@/components/ui/button";
import { FigureImage } from "@/components/ui/figure-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { BeforeAfterSlider } from "@/features/marketing/BeforeAfterSlider";
import { formatMoney } from "@/lib/utils";

export function EyelashShowcase({ services }: { services: Service[] }) {
  return (
    <section className="bg-[var(--bds-paper-raised)] px-4 py-12 sm:px-6 sm:py-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal>
          <BeforeAfterSlider
            before={
              <FigureImage
                src="/images/eyelash/before.jpg"
                alt="Before lash extensions"
                placeholderVariant="wide"
                className="h-full w-full"
              />
            }
            after={
              <FigureImage
                src="/images/eyelash/after.jpg"
                alt="After lash extensions"
                placeholderVariant="wide"
                className="h-full w-full"
              />
            }
          />
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Lash Studio
          </p>
          <h2 className="font-display mt-3 text-2xl text-foreground sm:text-4xl">
            Lashes that do the mornings for you.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Drag the slider to see the difference. Every set is custom-mapped to your eye
            shape by our lash specialist — no templates, no rush.
          </p>

          {services.length > 0 ? (
            <ul className="mt-6 flex flex-col gap-2">
              {services.slice(0, 3).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/book?track=eyelash&serviceId=${service.id}`}
                    className="group flex items-center justify-between rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary hover:bg-primary/15"
                  >
                    <span className="font-medium text-card-foreground transition-colors group-hover:text-primary">
                      {service.name}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {formatMoney(service.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          <Link href="/book?track=eyelash" className="mt-6 inline-block">
            <Button>Find eyelash times</Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

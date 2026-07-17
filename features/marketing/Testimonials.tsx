import { Star } from "lucide-react";
import { testimonials } from "@/features/marketing/testimonials-content";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Testimonials() {
  return (
    <section className="bg-[var(--bds-paper-raised)] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto w-full max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            What guests are saying
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delayMs={Math.min(i * 80, 240)}>
              <figure className="flex h-full flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-6 shadow-sm transition-[box-shadow,transform,border-color,background-color] duration-slow ease-bds hover:-translate-y-1 hover:border-primary hover:bg-primary/10 hover:shadow-md">
                <div className="flex gap-0.5 text-[var(--bds-brass)]" aria-hidden="true">
                  {Array.from({ length: t.rating }, (_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-card-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="text-sm font-medium text-muted-foreground">
                  {t.author}
                  {t.role ? <span className="font-normal"> · {t.role}</span> : null}
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

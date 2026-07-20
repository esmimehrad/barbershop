import { FigureImage } from "@/components/ui/figure-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/**
 * No counter row (cuts/years/clients) — the landing spec calls for real
 * numbers here and none have been supplied yet. Fabricating stats would
 * undercut the "$10k, detail-obsessed" bar this page is aiming for, not
 * support it. Add the row back once the shop provides real figures.
 */
export function About() {
  return (
    <section id="about" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-24">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal>
          <FigureImage
            src="/images/about.jpg"
            alt="Inside the Fadehouse barbershop"
            placeholderVariant="wide"
            className="aspect-[4/5] w-full rounded-[var(--radius)] shadow-md sm:aspect-[3/4]"
          />
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            What sets us apart
          </p>
          <h2 className="font-display mt-3 text-2xl text-foreground sm:text-4xl">
            Not a chain. Not a franchise. Just craft.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Every barber here trained for years before earning a chair. We don’t rush
            appointments to fit more in — we book real time, so every cut gets the attention
            it deserves. It’s the kind of shop where regulars are remembered by name, and
            first-timers leave as regulars.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

import { MapPin, Phone, Clock } from "lucide-react";
import { businessInfo, formatAddress } from "@/features/marketing/business-info";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function Contact() {
  return (
    <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-24">
      <ScrollReveal>
        <h2 className="font-display text-2xl text-foreground sm:text-4xl">Find us</h2>
      </ScrollReveal>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal className="flex flex-col gap-6">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="text-base text-foreground">{formatAddress()}</span>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <a href={`tel:${businessInfo.phone}`} className="text-base text-foreground transition-colors hover:text-primary hover:underline">
              {businessInfo.phoneDisplay}
            </a>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {businessInfo.hours.map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-muted-foreground">{h.label}</dt>
                  <dd className="text-foreground">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </ScrollReveal>

        <ScrollReveal
          delayMs={100}
          className="flex aspect-[4/3] items-center justify-center rounded-[var(--radius)] border border-dashed border-border bg-muted text-sm text-muted-foreground lg:aspect-auto"
        >
          Map coming soon
        </ScrollReveal>
      </div>
    </section>
  );
}

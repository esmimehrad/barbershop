import Image from "next/image";
import type { Service } from "@/lib/data/services";
import { HeroContent } from "@/features/marketing/HeroContent";

/**
 * Mobile landing hero (< 768px) — a single static image, no video/scroll
 * animation. Self-contained: editing this file cannot affect the desktop hero.
 * Only the headline/CTA overlay (`HeroContent`) is shared.
 */
export function HeroMobile({ services }: { services: Service[] }) {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[92dvh] items-end overflow-hidden bg-[var(--bds-paper-deep)]"
    >
      <Image
        src="/images/hero-final.jpg"
        alt="Fadehouse barber station"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 object-cover"
      />
      {/* Brightened treatment: a soft gradient only near the bottom keeps the
          headline + CTA legible while letting the image read clearly. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--bds-paper-deep)]/70 via-[var(--bds-paper-deep)]/15 to-transparent" />

      <div className="px-4 pb-16 pt-32 sm:px-6 sm:pb-24">
        <HeroContent services={services} />
      </div>
    </section>
  );
}

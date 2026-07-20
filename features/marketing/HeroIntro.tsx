import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * The immediate booking prompt shown at the very top of the hero — both
 * tracks front-and-center so a first-time visitor can book straight away
 * without scrolling. In the cinematic hero it fades in on load and vanishes
 * as the user scrolls into the sequence (see Hero.tsx); the scroll cue hints
 * that the page continues below.
 */
export function HeroIntro() {
  return (
    <div className="flex flex-col items-center gap-6 px-6 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--bds-ink)]/70">
        Fadehouse Barbershop &amp; Lash Studio
      </p>
      <h1 className="font-display text-4xl leading-[1.05] text-[var(--bds-ink)] sm:text-6xl">
        Book your seat.
      </h1>
      <p className="max-w-sm text-base text-[var(--bds-ink)]/80">
        Pick your service and reserve a real time slot in seconds.
      </p>

      <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center">
        <Link href="/book?track=haircut">
          <Button className="w-full min-w-44 sm:w-auto">Book a Haircut</Button>
        </Link>
        <Link href="/book?track=eyelash">
          <Button variant="secondary" className="w-full min-w-44 sm:w-auto">
            Book Eyelash
          </Button>
        </Link>
      </div>

      <span
        aria-hidden="true"
        className="mt-6 flex flex-col items-center gap-1 text-xs uppercase tracking-[0.2em] text-[var(--bds-ink)]/60"
      >
        Scroll to explore
        <span className="animate-bounce text-primary">↓</span>
      </span>
    </div>
  );
}

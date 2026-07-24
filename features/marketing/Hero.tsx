"use client";

import { useEffect, useState } from "react";
import type { Service } from "@/lib/data/services";
import { HeroDesktop, StaticHero } from "@/features/marketing/HeroDesktop";
import { HeroMobile } from "@/features/marketing/HeroMobile";

/** Below this width the hero is the static mobile crossfade, not the desktop sequence. */
const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Landing hero selector — the only place that decides mobile vs desktop.
 *
 * - **Mobile** (< 768px) → `HeroMobile` (static crossfade, no animation).
 * - **Desktop** (≥ 768px) → `HeroDesktop` (cinematic scroll sequence, or its
 *   static fallback under reduced-motion).
 *
 * The two hero implementations live in separate files and share nothing but the
 * `HeroContent` copy, so editing one can never affect the other. The choice is
 * re-evaluated on resize so switching viewports always shows the right hero.
 * Before mount (SSR / no-JS) it renders the neutral `StaticHero`.
 */
export function Hero({ services }: { services: Service[] }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return <StaticHero services={services} />;
  return isMobile ? <HeroMobile services={services} /> : <HeroDesktop services={services} />;
}

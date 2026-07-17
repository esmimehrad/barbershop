"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Inertia-smoothed scroll for the marketing surface only — mounted from
 * app/(marketing)/layout.tsx, so it initializes on entering `/` and tears
 * down the moment the route changes to /book or /dashboard, leaving native
 * scroll physics untouched everywhere else in the app (booking forms,
 * dashboard tables). Synced to GSAP's ticker so Hero's ScrollTrigger-driven
 * canvas sequence stays frame-accurate under the smoothed scroll position.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

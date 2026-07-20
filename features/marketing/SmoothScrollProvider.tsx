"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LenisContext = createContext<Lenis | null>(null);

/** Access the active Lenis instance (null under reduced motion / before mount). */
export const useSmoothScroll = () => useContext(LenisContext);

/**
 * Inertia-smoothed scroll for the marketing surface only — mounted from
 * app/(marketing)/layout.tsx, so it initializes on entering `/` and tears
 * down the moment the route changes to /book or /dashboard, leaving native
 * scroll physics untouched everywhere else in the app (booking forms,
 * dashboard tables). Synced to GSAP's ticker so Hero's ScrollTrigger-driven
 * canvas sequence stays frame-accurate under the smoothed scroll position.
 *
 * The instance is exposed via context so nav links can `scrollTo()` a section
 * with the same inertia instead of a hard jump.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const instance = new Lenis({ duration: 1.1, smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- publish the just-created instance to consumers
    setLenis(instance);

    return () => {
      gsap.ticker.remove(onTick);
      instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

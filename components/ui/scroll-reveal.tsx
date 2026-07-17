"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms, e.g. index * 70 for a grid. */
  delayMs?: number;
}

/**
 * Fades/slides children in once they enter the viewport. Reduced-motion
 * users (or anyone whose observer hasn't fired yet, e.g. no-JS) always see
 * final-state content — this only ever adds polish, never gates visibility.
 */
export function ScrollReveal({ children, className, delayMs = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // One-time read of a browser-only preference on mount — can't be known during SSR render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-revealed={revealed}
      style={{ transitionDelay: revealed ? `${delayMs}ms` : "0ms" }}
      className={cn(
        "opacity-0 translate-y-6 scale-[0.97] transition-[opacity,transform] duration-slow ease-bds",
        "data-[revealed=true]:opacity-100 data-[revealed=true]:translate-y-0 data-[revealed=true]:scale-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

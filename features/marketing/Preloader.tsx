"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "fadehouse-preloader-seen";
const HARD_CAP_MS = 1500;

/** Brief brand moment on first visit this session; skipped on repeat views, capped at 1.5s. */
export function Preloader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    // One-time read of a browser-only session flag on mount — can't be known during SSR render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "1");
    const timer = setTimeout(() => setVisible(false), HARD_CAP_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bds-paper)] transition-opacity duration-base ease-bds"
    >
      <span className="font-display animate-pulse text-3xl tracking-[0.15em] text-[var(--bds-ink)]">
        FADEHOUSE
      </span>
    </div>
  );
}

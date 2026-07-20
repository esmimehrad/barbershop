"use client";

import { useEffect, useState } from "react";
import { useMousePosition } from "@/lib/hooks/use-mouse-position";

const INTERACTIVE = 'a, button, summary, label, input, [role="button"], [data-cursor="hover"]';

/**
 * Luxury custom cursor for the marketing surface: a precise gold dot that
 * tracks the pointer exactly, plus a larger ring that trails it with a smooth
 * lag and swells over interactive elements. Desktop only — it never mounts on
 * touch/coarse-pointer devices — and it drops the trailing lag under
 * `prefers-reduced-motion`. Scoped to the marketing layout, so the native
 * cursor returns on the booking/dashboard surfaces.
 */
export function CustomCursor() {
  const { x, y } = useMousePosition();
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    // Fine-pointer (mouse) devices only — no custom cursor on touchscreens.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // One-time read of browser-only capabilities on mount — unknowable during SSR render.
    /* eslint-disable react-hooks/set-state-in-effect */
    setEnabled(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    /* eslint-enable react-hooks/set-state-in-effect */
    document.documentElement.classList.add("custom-cursor-active");

    const onFirstMove = () => setVisible(true);
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setHovering(Boolean(target?.closest?.(INTERACTIVE)));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onFirstMove, { once: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onFirstMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (!enabled) return null;

  // Keep the ring near its resting size on hover — a gentle swell, not a big one.
  const ringScale = hovering ? 1.25 : pressed ? 0.8 : 1;
  const base = `translate(${x}px, ${y}px) translate(-50%, -50%)`;

  return (
    <>
      {/* Trailing ring — white for contrast against the dark theme so the pointer is always legible. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[100] h-6 w-6 rounded-full border border-white ${
          hovering ? "bg-white/20" : ""
        } ${reduced ? "" : "transition-[transform,background-color] duration-200 ease-out"} ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: `${base} scale(${ringScale})` }}
      />
      {/* Precise dot */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-white ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: base }}
      />
    </>
  );
}

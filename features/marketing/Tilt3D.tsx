"use client";

import { useEffect, useRef, type ReactNode } from "react";

const MAX_DEG = 10;

/**
 * Pointer-driven 3D tilt. The inner layer rotates toward the cursor within a
 * perspective viewport; children marked with `translateZ(...)` (and a
 * preserve-3d parent) lift off the surface, giving the card real depth. Pure
 * DOM writes (no React state → no re-renders), disabled under
 * `prefers-reduced-motion`, and inert on touch (mousemove never fires).
 */
export function Tilt3D({ children, className }: { children: ReactNode; className?: string }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const enabled = useRef(true);

  useEffect(() => {
    enabled.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = innerRef.current;
    if (!el || !enabled.current) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateY(${px * 2 * MAX_DEG}deg) rotateX(${-py * 2 * MAX_DEG}deg)`;
  };

  const handleLeave = () => {
    if (innerRef.current) innerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div className={className} style={{ perspective: "1000px" }}>
      <div
        ref={innerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="h-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
      >
        {children}
      </div>
    </div>
  );
}

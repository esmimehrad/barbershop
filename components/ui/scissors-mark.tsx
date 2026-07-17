import { cn } from "@/lib/utils";

/**
 * Animated scissors mark for the nav logo — two blades hinged at a shared
 * pivot, each independently rotating open and closed in a continuous snip
 * loop (see the `scissors-a`/`scissors-b` keyframes in app/globals.css).
 * A hand-drawn SVG rather than the raster logo photo in assets/, since only
 * a vector with separately-animatable parts can actually open and close.
 */
export function ScissorsMark({ className }: { className?: string }) {
  const bladeOrigin = { transformBox: "view-box" as const, transformOrigin: "24px 24px" };

  return (
    <svg viewBox="0 0 48 48" className={cn("text-primary", className)} aria-hidden="true">
      <g className="animate-scissors-a" style={bladeOrigin}>
        <rect x="23" y="6" width="2.2" height="32" rx="1.1" fill="currentColor" />
        <circle cx="24" cy="39" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      </g>
      <g className="animate-scissors-b" style={bladeOrigin}>
        <rect x="23" y="6" width="2.2" height="32" rx="1.1" fill="currentColor" />
        <circle cx="24" cy="39" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      </g>
      <circle cx="24" cy="24" r="2" fill="currentColor" />
    </svg>
  );
}

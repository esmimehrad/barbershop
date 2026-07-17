import { cn } from "@/lib/utils";

export interface RazorSpinnerProps {
  className?: string;
  label?: string;
}

/**
 * Double-edge razor blade loading spinner — stylized from the shape in
 * assets/assets/photos/10-razor-icon-scroll-progress-reference.jpg (the
 * blade silhouette + slotted holes), redrawn as a clean SVG rather than
 * using that file directly: the source photo bakes in a skull motif (the
 * project's own asset docs already flag that as "remove unless approved")
 * and a third-party TikTok watermark, neither of which belongs in shipped
 * product UI. Pure CSS rotation, so it automatically goes inert under the
 * app's global `prefers-reduced-motion` rule (app/globals.css).
 */
export function RazorSpinner({ className, label = "Loading" }: RazorSpinnerProps) {
  return (
    <div role="status" aria-label={label} className={cn("inline-flex", className)}>
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10 animate-spin text-[var(--bds-brass)]"
        style={{ animationDuration: "1.1s" }}
        aria-hidden="true"
      >
        <rect
          x="6"
          y="18"
          width="36"
          height="12"
          rx="1.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
        />
        <line x1="24" y1="18" x2="24" y2="30" stroke="currentColor" strokeWidth="2.25" />
        {[13, 35].map((cx) => (
          <path
            key={cx}
            d={`M${cx - 3} 21 L${cx} 24 L${cx - 3} 27 M${cx + 3} 21 L${cx} 24 L${cx + 3} 27`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

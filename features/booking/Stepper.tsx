import { cn } from "@/lib/utils";
import { STEPS } from "./params";

/** Multi-step progress indicator (accessibility: ordered list, current marked). */
export function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-1 text-xs" aria-label="Booking steps">
      {STEPS.map((label, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <li key={label} className="flex items-center gap-1">
            <span
              aria-current={active ? "step" : undefined}
              className={cn(
                "rounded-[var(--radius)] px-2 py-1",
                active && "bg-primary text-primary-foreground",
                done && "bg-muted text-foreground",
                !active && !done && "text-muted-foreground",
              )}
            >
              {i + 1}. {label}
            </span>
            {i < STEPS.length - 1 ? (
              <span aria-hidden className="text-muted-foreground">
                ›
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

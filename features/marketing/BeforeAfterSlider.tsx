"use client";

import { useState, type ReactNode } from "react";

export interface BeforeAfterSliderProps {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}

/**
 * A single before/after pair with a draggable reveal — the simplified
 * replacement for the spec's 5-frame pinned sequence (needs only 2 real
 * photos). Built on a native range input so drag, click, and keyboard
 * (arrow keys) all work with zero custom pointer-event code.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [value, setValue] = useState(50);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--radius)] shadow-md select-none sm:aspect-[16/10]">
      <div className="absolute inset-0">{after}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        {before}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-primary"
        style={{ left: `${value}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-md">
          ↔
        </span>
      </div>

      <span className="pointer-events-none absolute top-3 left-3 rounded-[var(--bds-radius-pill)] bg-[var(--bds-paper-deep)]/80 px-3 py-1 text-xs font-medium text-[var(--bds-ink)]">
        {beforeLabel}
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-[var(--bds-radius-pill)] bg-[var(--bds-paper-deep)]/80 px-3 py-1 text-xs font-medium text-[var(--bds-ink)]">
        {afterLabel}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label={`Reveal ${afterLabel.toLowerCase()} vs. ${beforeLabel.toLowerCase()}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}

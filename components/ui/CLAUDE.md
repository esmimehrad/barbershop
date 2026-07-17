# components/ui/ — low-fi primitives

Hand-rolled, token-driven primitives for the low-fi draft: `button`, `card`, `badge`, `field`, `app-header`. Plus several cross-surface primitives built for the landing page but reusable anywhere: `figure-image` (image slot that degrades to an on-brand placeholder when the file isn't present yet, delegates real-photo rendering to `loaded-image`), `loaded-image` (client island: shows `razor-spinner` until the real photo has actually loaded, then fades it in with a hover zoom), `scroll-reveal` (IntersectionObserver → CSS reveal wrapper, reduced-motion aware), `razor-spinner` (brand loading spinner — CSS-animated, no dependency; a redrawn SVG, not the raw reference photo — see its own doc comment for why), and `scissors-mark` (the animated nav logo — two SVG blades opening/closing around a shared pivot).

## Rules
- Style **only** via semantic tokens / Tailwind utilities (`bg-primary`, `text-muted-foreground`, `rounded-[var(--radius)]`). No raw hex, no raw px.
- Interactive controls: min touch target ≥44px (`min-h-11`), keep the focus ring.
- Status color is always paired with a text label (never color-only).
- No data fetching here — pure presentation, typed props.

## Later
In the styling/hardening pass these can be swapped for shadcn/Radix (see `design-system/INTEGRATION-NEXTJS.md`) without changing call sites, since everything is token-driven.

See `components/CLAUDE.md`.

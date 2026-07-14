# components/ui/ — low-fi primitives

Hand-rolled, token-driven primitives for the low-fi draft: `button`, `card`, `badge`, `field`, `app-header`.

## Rules
- Style **only** via semantic tokens / Tailwind utilities (`bg-primary`, `text-muted-foreground`, `rounded-[var(--radius)]`). No raw hex, no raw px.
- Interactive controls: min touch target ≥44px (`min-h-11`), keep the focus ring.
- Status color is always paired with a text label (never color-only).
- No data fetching here — pure presentation, typed props.

## Later
In the styling/hardening pass these can be swapped for shadcn/Radix (see `design-system/INTEGRATION-NEXTJS.md`) without changing call sites, since everything is token-driven.

See `components/CLAUDE.md`.

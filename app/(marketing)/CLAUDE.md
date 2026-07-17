# app/(marketing)/ — public landing

The marketing surface at `/`. Entry point into the booking flow (two-track CTAs).

## Rules
- Static/ISR (`export const revalidate`) — mostly read-only, SEO-friendly.
- `page.tsx` is a thin orchestrator: one `Promise.all` fetch via `lib/data/*`, then renders the section components from `features/marketing/` in order. Section-building logic lives there, not in `page.tsx`.
- Both booking CTAs enter `/book` with the correct `track` — never mix tracks.
- All imagery goes through `components/ui/figure-image.tsx` so missing photos (see `features/marketing/CLAUDE.md`) degrade to on-brand placeholders instead of broken images.
- Motion is CSS-only (`components/ui/scroll-reveal.tsx` + a couple of progressive-enhancement CSS rules in `app/globals.css`) — vertical scroll only, respects `prefers-reduced-motion`. No animation library.

See `app/CLAUDE.md` and `features/marketing/CLAUDE.md`.

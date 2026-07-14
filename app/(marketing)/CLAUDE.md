# app/(marketing)/ — public landing

The marketing surface at `/`. Entry point into the booking flow (two-track CTAs).

## Rules
- Static/ISR (`export const revalidate`) — mostly read-only, SEO-friendly.
- Low-fi: hero/gallery/testimonials/contact are wireframe placeholders; services and staff read live from `lib/data/`.
- Both booking CTAs enter `/book` with the correct `track` — never mix tracks.
- Motion is deferred to the styling pass; keep it out for now.

See `app/CLAUDE.md`.

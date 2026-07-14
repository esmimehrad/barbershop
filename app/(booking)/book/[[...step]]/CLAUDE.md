# book/[[...step]]/ — wizard step switch

Optional catch-all. `page.tsx` reads the first path segment (`service` | `addons` | `provider` | `time` | `review` | `confirmed`), maps it to a step index, and renders the step. Unknown steps → `notFound()`.

## Rules
- No step logic here — delegate to `features/booking/steps.tsx`.
- Pass parsed booking params (and raw searchParams where a step needs `date`/`error`/`id`).

See `app/(booking)/book/CLAUDE.md`.

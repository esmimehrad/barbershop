# app/(dashboard)/dashboard/ — today + settings

`/dashboard` (today's schedule + metrics) and `/dashboard/settings` (admin config).

## Rules
- Today view reads `lib/data/appointments` + `lib/data/metrics`; row actions come from `features/schedule/RowActions`.
- Metrics/pricing cards render only when `canSee()` permits.
- Marking complete relies on the DB trigger for credit — the page never computes credit itself.

See `app/(dashboard)/CLAUDE.md`.

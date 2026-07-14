# features/ — feature modules

Code grouped by feature (not by file type): each folder owns its composed UI and feature logic. Cross-cutting primitives come from `components/ui/`; data/writes from `lib/`.

## Structure
- `booking/` — the booking wizard (URL-driven steps).
- `schedule/` — dashboard schedule interactions.

## Rules
- A feature reads via `lib/data/` and mutates via `lib/actions/` — never Supabase directly.
- Server Components by default; add a client island only for real interactivity.

See root `CLAUDE.md`.

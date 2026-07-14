# components/ — shared UI

Cross-cutting presentational components used across surfaces. Feature-specific UI lives in `features/`, not here.

## Structure
- `ui/` — low-fi primitives (Button, Card, Badge, Field, AppHeader).

## Rules
- Presentational only — no data fetching or business logic.
- Styled via semantic tokens / Tailwind utilities. No raw hex or px.
- Keep components small and composable; type all props.

See root `CLAUDE.md`.

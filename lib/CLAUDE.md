# lib/ — non-UI logic

The application's brain-adjacent layer: Supabase access, server actions, validation, auth, and small utilities. No JSX components live here.

## Structure
- `supabase/` — SSR clients (server / browser / middleware).
- `data/` — READ layer (queries through RLS), one module per aggregate.
- `actions/` — WRITE layer (`"use server"` mutations).
- `validation/` — zod schemas shared by actions and forms.
- `auth.ts` — resolves the session to client/staff + access level; `canSee()` gate.
- `utils.ts` — `cn()` classnames, `formatMoney()`.

## Rules
- Never re-implement DB business logic here (double-booking, credit math, `amount_due`) — call the database.
- Everything is typed via `@/types/database`. No `any`.
- Reads never mutate; writes go through `actions/`.

See root `CLAUDE.md` and the `frontend-developer` skill for global rules.

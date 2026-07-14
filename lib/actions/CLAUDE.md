# lib/actions/ — WRITE layer (Server Actions)

Every mutation is a `"use server"` function here: `booking`, `appointments`, `auth`.

## The shape of every action
1. **Validate** input with a zod schema (`lib/validation/`) — actions are public endpoints, never trust input.
2. **Authorize** the caller (`getSessionContext()`), belt-and-suspenders with RLS.
3. **Call** the DB (insert/update). Let triggers enforce invariants.
4. **Revalidate** affected paths (`revalidatePath`).

## Rules
- Orchestration only — no business logic (credit math, conflict checks live in the DB).
- Return a small `{ ok, error }` result, or `redirect()` for form-driven flows.
- Don't read-then-recompute what a trigger already computes (e.g. `amount_due`).

See `lib/CLAUDE.md`.

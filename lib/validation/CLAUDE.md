# lib/validation/ — zod schemas

Input schemas shared by Server Actions and forms. Keeps validation in one place and the types inferred (`z.infer`).

## Rules
- One concern per schema; export the inferred type alongside it.
- Validate at the action boundary before any DB call.
- Don't encode business rules here that the DB already enforces — validate shape/format, not domain invariants.

See `lib/CLAUDE.md`.

# types/ — generated Supabase types

`database.ts` is generated from the live schema and is the source of truth for row/insert/update shapes and enums.

## Rules
- **Do not hand-edit.** Regenerate after any schema change:
  `npx supabase gen types typescript --project-id umarerwvbsqokekotfbw`
  (or the Supabase MCP `generate_typescript_types`).
- Consume via the `Tables<>`, `TablesInsert<>`, `Enums<>` helpers it exports.
- App code should never define parallel hand-written row types.

See root `CLAUDE.md`.

# lib/data/ — READ layer

Query functions grouped one module per aggregate: `services`, `staff`, `availability`, `appointments`, `credit`, `clients`, `metrics`. Server Components call these; components never query Supabase directly.

## Rules
- **Reads only.** No inserts/updates/deletes here — those live in `lib/actions/`.
- Return typed rows from `@/types/database` (`Tables<"...">`). No `any`.
- Never re-implement a DB rule. `availability.ts` *reads* free slots; the double-booking guarantee is the DB trigger on write, not this query.
- Keep functions small and named `getX` / `listX`.
- RLS scopes results to the caller — don't add ad-hoc auth filtering that duplicates it.

See `lib/CLAUDE.md`.

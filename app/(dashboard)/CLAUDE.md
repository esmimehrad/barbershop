# app/(dashboard)/ — staff / owner surface

Touch-first dashboard. `layout.tsx` redirects non-staff to `/auth/dev`.

## Rules
- Access-level gating with `canSee()` (owner/manager/staff) — hide pricing/metrics/credit from base staff. This is belt-and-suspenders on top of RLS; never rely on client-only hiding.
- Core actions (complete/late/no-show) are one-tap and touch-friendly; destructive ones confirm.
- The permission matrix is a **placeholder** (FS-10.5 `[OPEN]`) — flagged in `lib/auth.ts`.

See `app/CLAUDE.md`.

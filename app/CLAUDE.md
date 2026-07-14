# app/ — Next.js App Router

Routes for the three surfaces, split by route group (groups don't add URL segments).

## Groups
- `(marketing)/` → `/` — public landing, static/ISR.
- `(booking)/` → `/book`, `/account` — customer surface, dynamic.
- `(dashboard)/` → `/dashboard`, `/dashboard/settings` — staff surface, access-gated.
- `auth/` → `/auth/dev` — sign-in (dev stub now, phone OTP later).

## Rules
- **Server Components by default.** Add `'use client'` only for real interactivity.
- Pages read via `lib/data/`, mutate via `lib/actions/`. No Supabase or business logic inline.
- `layout.tsx` (root) loads tokens + fonts and sets the viewport.
- Configure caching explicitly (Next 15+ defaults to uncached).

See root `CLAUDE.md` and the `frontend-developer` skill.

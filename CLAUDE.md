# Barbershop Booking Platform

Next.js (App Router) frontend over a fully-scaffolded Supabase backend. Web-only, mobile-primary, three surfaces: marketing landing · customer booking · staff/owner dashboard.

## Doing frontend work? Follow the `frontend-developer` skill.

For ANY UI/frontend task, use the **`frontend-developer`** skill — it defines the mandatory workflow and guardrails. In short:

1. **Orient in the codebase** before writing (reuse, don't duplicate).
2. Read **`docs/engineering/FRONTEND_ARCHITECTURE-v0_0_1.md`** — the source of truth for structure & patterns.
3. Read **`design-system/`** — `TOKENS.md` then `INTEGRATION-NEXTJS.md`; component specs in `components/general/*`.
4. Build, then run the skill's definition-of-done self-check.

## Non-negotiables

- **DB is the brain; frontend is the face.** Never re-implement backend logic (double-booking, credit math, `amount_due`, two-track rules) in JS — it lives in Supabase triggers/functions. Call it.
- **No hardcoding.** Every color/spacing/type value is a `--bds-*` token / Tailwind theme utility. No raw hex/px in components. No parallel dark palette.
- **Server-first.** RSC by default; `'use client'` only for real interactivity. Reads via `lib/data/*`; writes via Server Actions that validate (zod) → authorize → call DB → revalidate.
- **Follow the guidelines; keep it simple; write clean code; name things clearly.** Don't overcomplicate or add deps without need.
- **Accessibility & touch minimums** (contrast, focus, 44px targets, reduced-motion, 375px-first) are required on every surface.
- **Blocked on an `[OPEN]` decision** (permission matrix, credit opt-in vs. auto, redemption cap %, brand name)? Don't guess — read from config or ask.

## Companion skills
`ui-ux-pro-max` (UX/visual decisions) · `ui-styling` (shadcn/Radix + Tailwind) · `design-system` (tokens/specs) · `design` (brand/assets).

## Key docs
- Product: `docs/product/` (PRD, feature specs, user flows)
- Engineering: `docs/engineering/` (frontend architecture, data model, Supabase, stack)
- Design: `docs/design/` (landing / booking / admin page specs)

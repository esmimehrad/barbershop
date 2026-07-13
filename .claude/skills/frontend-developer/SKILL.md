---
name: frontend-developer
description: "Workflow and guardrails for building the Barbershop booking platform frontend (Next.js App Router + Supabase). Use for ANY frontend/UI task in this repo — pages, components, the booking wizard, staff dashboard, marketing landing, styling, or forms. Enforces a mandatory reading order (codebase → FRONTEND_ARCHITECTURE → design-system), server-first RSC patterns, token-driven styling (no hardcoding), accessibility minimums, clean code, and a definition-of-done self-check. Pairs with the ui-ux-pro-max, ui-styling, design-system, and design skills for visual decisions."
---

# Frontend Developer — Barbershop Booking Platform

Operational guide for building this project's frontend. Keep it simple, follow the guidelines, ship clean code. This skill tells you **the order to work in**, **the rules that don't bend**, and **how to know you're done**.

## When to use
Any task that changes how the app looks, renders, or behaves: pages, components, the booking flow, the staff dashboard, the landing page, styling, forms, or client interactivity.

## When to skip
Pure backend/DB work, Supabase migrations, edge functions, or non-UI scripts.

---

## 1. Workflow — do these in order, every time

**Step 0 · Orient in the codebase (read before writing).**
Survey what already exists so you extend it instead of duplicating it:
- `package.json` / configs — framework version, scripts, deps already available. Add nothing you don't need.
- Existing `app/`, `components/`, `lib/`, `features/` — reuse patterns, utilities, and components already there.
- `lib/data/*` and the generated Supabase types — the data contract you build on.
- Nearby files to your task — match their style, naming, and structure.

**Step 1 · Read `docs/engineering/FRONTEND_ARCHITECTURE-v0_0_1.md`.**
This is the source of truth for structure and patterns (server-first, data-access layer, Server Actions, the two contracts, accessibility). Everything you build must conform to it. Also skim the relevant page spec in `docs/design/` (Landing / Booking / Admin) for the screen you're building.

**Step 2 · Read `design-system/` — `TOKENS.md` then `INTEGRATION-NEXTJS.md`.**
Learn the token layer (`--bds-*`), the semantic aliases, and the two-tier component approach. The seven components in `design-system/components/general/*` (`.prompt.md` + `.d.ts`) are the **visual + prop spec** — read the one you need before building it.

**Step 3 · Check `docs/product/` open questions before coding anything blocked.**
If your task touches an `[OPEN]` decision (permission matrix, credit opt-in vs. automatic, redemption cap %, brand name — see architecture §16), **do not invent a value.** Read it from config or ask. Never let a placeholder harden into a hidden business rule.

**Step 4 · Build the task** following the rules below.

**Step 5 · Run the definition-of-done self-check (§7).**

---

## 2. Non-negotiable rules

**The two contracts (architecture §1, §14):**
1. **Never re-implement backend logic in JS.** Double-booking, credit math, `amount_due`, cashback, two-track eligibility all live in Supabase triggers/functions — call them, never copy them. Spec numbers are validation targets, not logic to code.
2. **Never hardcode visual values.** No raw hex, no raw px for color/spacing/radius/type. Every visual value traces to a `--bds-*` token / Tailwind theme utility (`design-system/TOKENS.md`). No parallel dark palette — the tokens own dark mode.

**Your five standing principles:**
3. **Don't overcomplicate.** Choose the simplest thing that satisfies the spec. No premature abstraction, no speculative config, no extra dependency, no state library where the URL or a reducer suffices. Delete before you add.
4. **Always follow the guidelines** in the architecture doc and design-system. If something contradicts them, stop and flag it — don't silently deviate.
5. **Write clean code.** Small, single-responsibility functions and components; no dead code, no leftover `console.log`, no commented-out blocks. Comments explain *why*, never *what*.
6. **Avoid hardcode.** Config, tokens, generated types, and `[OPEN]` values come from their source — not literals sprinkled in components.
7. **Name things appropriately.** See §5.

---

## 3. How to build (patterns from the architecture doc)

- **Server Components by default.** Add `'use client'` only for genuine interactivity (inputs, motion, one-tap actions). Keep client islands small.
- **Reads:** async Server Components call `lib/data/*` — never query Supabase raw from a component, never `useEffect` for initial data.
- **Writes:** a Server Action that **validates input (zod) → authorizes → calls the DB → revalidates.** Server Actions are public endpoints; never trust their input.
- **Caching is explicit (Next.js 15+):** static/marketing reads `force-cache`/`revalidate`; per-user reads stay dynamic.
- **Booking flow:** state machine with the **URL as the source of truth** for step + selections (deep-links, Back, refresh must all work). Track separation enforced at entry.
- **Group by feature** (`features/booking`, `features/schedule`, …), shared UI in `components/ui/`.
- **Components:** interactive/SSR-critical → shadcn/Radix in `components/ui/`, themed by tokens; brand-display → re-implement from the `design-system` spec against tokens.
- **Types:** use the generated Supabase types. No `any`. Type props explicitly.

---

## 4. Always handle these states (not just the happy path)
- **Loading** — skeleton/shimmer for anything > 300ms (never a blank frame).
- **Empty** — a helpful message + next action, never a blank screen.
- **Error** — a clear message with a recovery path (retry/edit); forms show the error below the field and announce via `aria-live`.
- **Disabled/pending** — disable the submit button during a Server Action; show progress; prevent double-submit (mirrors the DB's idempotency).

## 5. Naming conventions
- **Components:** `PascalCase`, named for what they *are* (`AppointmentCard`, `SlotPicker`, `BookingReviewStep`) — not how they look.
- **Functions/vars:** `camelCase`, verb-first for actions (`applyCredit`, `getAvailableSlots`, `markCompleted`).
- **Server Actions:** verb-first, intent-clear (`bookAppointment`, `releaseSlot`); files in `lib/actions/`.
- **Data-access fns:** `getX` / `listX` / `createX` / `updateX` in `lib/data/`.
- **Booleans:** `is…` / `has…` / `can…`. **Types/interfaces:** `PascalCase`.
- Match the surrounding file's existing conventions over these defaults when they differ.

## 6. Accessibility, touch & responsive (architecture §11–12) — minimums, not extras
- Contrast ≥4.5:1 (verify light + dark); visible focus rings (never remove); keyboard-navigable; no color-only meaning.
- Touch targets ≥44×44px, ≥8px apart; press feedback ≤100ms; confirm destructive actions.
- Motion 150–300ms, transform/opacity only, respect `prefers-reduced-motion`.
- Design at **375px first**; no horizontal scroll; `min-h-dvh`; respect safe areas.
- Money/credit/timers use **tabular figures**; format currency locale-aware, don't concatenate strings.

## 7. Definition of Done — self-check before you say it's finished
- [ ] Conforms to the architecture doc; no backend logic duplicated in JS.
- [ ] Zero hardcoded colors/spacing/type — all tokens. No `any`, no dead code, no stray logs.
- [ ] Server-first: `'use client'` only where needed; reads via `lib/data`, writes via validated Server Actions.
- [ ] Loading + empty + error + disabled states handled.
- [ ] Accessible: contrast, focus, keyboard, 44px targets, reduced-motion.
- [ ] Responsive at 375 / 768 / 1024; no horizontal scroll; dark mode verified.
- [ ] Names are clear and consistent with the codebase.
- [ ] **Verify it actually works** — run the project's checks and the screen:
  - `typecheck` / `lint` / `build` (whatever `package.json` defines)
  - open the affected screen (or use the `run` / `verify` skill) and confirm behavior, not just compilation.
- [ ] No new dependency added without a clear need.
- [ ] If anything was blocked on an `[OPEN]` decision, it's surfaced — not guessed.

---

## Companion skills
- **Visual/UX decisions** (style, color, layout, UX review): `ui-ux-pro-max`.
- **Components & styling** (shadcn/Radix, Tailwind, accessibility patterns): `ui-styling`.
- **Tokens & specs** (token architecture, component states): `design-system`.
- **Brand/assets** (logo, icons, banners): `design`.

Use them for *decisions and references*; this skill governs *how you turn those into clean, conforming code in this repo*.

# Frontend Architecture — Barbershop Booking Platform (MVP)

**Companion to:** PRD v0.8 · Data Model v0.0.2 · User Flows v0.0.2 · Feature Specs v0.0.1 · Stack Recommendation v0.0.1 · Landing/Booking/Admin Page Specs
**Status:** Draft v0.0.2 · **Last updated:** July 13, 2026
**Scope:** How the Next.js frontend is structured and the design patterns it follows. Backend (Supabase) is already scaffolded — see `SUPABASE_DEVELOPMENT.md`.
**Revision note (v0.0.2):** Design-language, token-architecture, accessibility, and design-system integration sections refined using the `ui-ux-pro-max`, `design-system`, `ui-styling`, and `design` skills. See §15 for provenance.

---

## 1. The one principle everything follows

**The database is the brain; the frontend is the face.**

Supabase already enforces the hard business rules through triggers and functions (`SUPABASE_DEVELOPMENT.md` §Functions):

- `prevent_double_booking()` — no two appointments overlap for one staff member
- `enforce_two_track()` — haircut vs. eyelash pools never mix; StaffService gate
- `compute_amount_due()` — `price + add-ons − credit`
- `on_appointment_completed()` — atomic cashback + referral writes
- `recompute_credit_balance()` — balance = signed sum of the ledger
- RLS on all 20 tables — the security boundary

**Consequence:** the frontend must **never re-implement** these rules in JavaScript. It reads data, shows it, and asks the database to perform actions. Any money math, availability logic, or eligibility rule already in the DB is called, not copied. The credit arithmetic in the specs (`$18 → +$2.50 → $20.50 → −$14.80`) is a **validation target**, not logic to re-code.

Two contracts govern the frontend, and both live outside component code:
- **The data contract** — Supabase schema + RLS (§5).
- **The visual contract** — design tokens (§10). Components consume tokens; they never hard-code color, spacing, or type.

---

## 2. Responsive strategy — mobile-primary, works on every screen

**All three surfaces are fully responsive.** Phone is the primary target and the default breakpoint we design against, but nothing is "phone-only" — every screen must render and work correctly on phone, tablet, and desktop.

**Breakpoints (systematic — `ui-ux-pro-max` §5):** `375 / 768 / 1024 / 1440`. Design at 375 first; scale up with fluid layouts. Test explicitly at 375px and in landscape.

| Surface | Primary device | Must also support |
|---|---|---|
| Customer booking + landing | Phone | Tablet, desktop |
| Staff / owner dashboard | **Phone** | Tablet, desktop |

**Staff dashboard is explicitly phone-capable.** Barbers run the shop from their phones — marking done/late/no-show, checking today's schedule, completing appointments. The earlier spec framing of "640px desktop web shells" is superseded: the dashboard is responsive and **the phone layout is a first-class target, not a fallback.**

**Staff UX bar:** the core daily actions (view today, mark complete / late / no-show) must be **one-tap, large touch targets (≥44×44px, ≥8px apart), minimal reading, no dead ends.** A barber mid-cut should complete an appointment in one thumb tap, with visible press feedback within 100ms and a confirm step only on the destructive actions (late-release / no-show — see Admin Spec §Flow 5). Configuration screens (services, pricing, RFM, promotions) can be denser and lean toward tablet/desktop, but must still function on phone.

**Rules:** no horizontal scroll on mobile; `min-h-dvh` not `100vh`; respect safe areas for any fixed nav / bottom CTA bar; never disable zoom (`viewport` with `initial-scale=1`, no `maximum-scale`).

---

## 3. Three surfaces, one codebase

The product is three apps with different needs. We keep them in separate route areas so they don't bleed into each other, while sharing the token layer and the data-access layer.

| Surface | Rendering | Character | Design expression (dials) |
|---|---|---|---|
| **Marketing / landing** | Static / ISR | Animated, SEO, fast, mostly read-only | Expressive · spacious · high motion |
| **Customer booking** | Dynamic | Step-by-step wizard, phone-primary, OTP auth | Calm · standard density · purposeful motion |
| **Staff / owner dashboard** | Dynamic | Access-gated, touch-first actions, config tabs | Dense · quiet motion · tabular data |

They **share** the design tokens (§10) and the data-access layer (§5), so the brand and the database contract stay consistent even though each area behaves differently. Same tokens, different density/motion — not three different visual languages.

---

## 4. Rendering model — server-first with interactive islands

- **Pages are built on the server by default** (RSC) and sent as finished HTML. Fast first paint, good SEO (critical for the landing page's local-SEO goal), less JavaScript shipped. *Don't add `'use client'` for static content* (`ui-ux-pro-max` nextjs §Rendering).
- **Interactivity is added only where needed** — the booking calendar, landing-page motion, the dashboard's one-tap action buttons. Small "islands" of client code inside otherwise-static pages, instead of shipping a heavy app everywhere.
- **Reads** = async Server Components fetch directly through RLS and hand back a finished page. *Never `useEffect` for initial data.*
- **Writes** = single-purpose Server Actions (§5) that ask the database to do one thing, then refresh the screen.
- **Caching is explicit (Next.js 15+):** the fetch default is now *uncached*. Mark static/marketing reads `force-cache` (or use `revalidate`), and leave per-user booking/dashboard reads dynamic. Never assume the default.

---

## 5. Data flow — one door in, one door out

- **All database access goes through a dedicated data-access layer** (`lib/data/*`), organized one module per aggregate (`appointments`, `credit`, `services`, `staff`…). No page ever talks to Supabase "raw."
- Built on Supabase's **generated TypeScript types**, so the DB schema is the source of truth for shapes too.
- **Reading:** Server Components call the data layer's query functions.
- **Writing:** UI calls a **Server Action** — a small, single-purpose server function that:
  1. **Validates input with zod** (Server Actions are public endpoints — never trust their input; `ui-ux-pro-max` nextjs §Security, Severity: High).
  2. **Authorizes** the caller (belt-and-suspenders with RLS).
  3. Calls the database (or a DB function/RPC).
  4. **Revalidates** the affected pages.
- Because the DB triggers already enforce invariants, actions are **validate → authorize → orchestrate → revalidate, not business logic.**
- **Benefit:** if the database changes, you fix one folder, not fifty components.

```
Server Component ──reads──▶ lib/data/*  ──▶ Supabase (RLS)
   UI event      ──writes─▶ Server Action ──▶ zod validate + authz ──▶ lib/data/* ──▶ Supabase (triggers enforce rules)
                                   └──▶ revalidate the page
```

---

## 6. Booking flow — a state machine with the URL as memory

The booking wizard (service → add-ons → provider → time → review → confirm) has real complexity: 6 steps, three deep-link entry states (Booking Spec §3.2), and two tracks that must never mix.

- Model it as **an explicit set of steps with rules for legal transitions** (a state machine — XState or a typed reducer). You can only move to a valid next step.
- **The URL remembers where you are and what's selected**, so landing-page deep-links, browser Back, refresh, and share-links all work. All key states must be reachable by URL (`ui-ux-pro-max` §9 `deep-linking`).
- **Track separation is enforced at entry** — a haircut deep-link never surfaces eyelash providers, matching Data Model §4.

Deep-link entry states to support (Booking Spec §3.2):

| Entry | Skips to |
|---|---|
| Service preselected | Add-ons step |
| Provider preselected | Time step |
| Both preselected | Time step |

**Form UX standards for every step (`ui-ux-pro-max` §8):**
- **Visible labels** (never placeholder-only); mark required fields; persistent helper text for anything ambiguous.
- **Inline validation on blur**, not on keystroke; **error message below the field**, stating cause + fix; on submit error, auto-focus the first invalid field and announce via `aria-live`.
- **Multi-step progress indicator**; allow Back without losing entered data; **auto-save wizard state** (already URL-backed) so an accidental dismissal doesn't reset the flow.
- **Semantic input types** so mobile shows the right keyboard: `tel` for phone (OTP), `numeric` where relevant.
- **Submit feedback:** disable the button during the Server Action and show a spinner; confirm success (checkmark/toast). Prices/credit render with **tabular figures** to prevent layout shift.

---

## 7. Code organization — group by feature

Group files by **feature**, not by file type. Everything about booking lives together; everything about credit lives together.

```
app/
  (marketing)/     landing page + motion islands        ← static / ISR
  (booking)/       book/[[...step]] wizard + account     ← dynamic, OTP-gated
  (dashboard)/     schedule, config tabs                 ← dynamic, access-gated
  auth/            phone → code screens
lib/
  supabase/        server, client, middleware helpers
  data/            appointments, credit, services, staff … (queries, generated types)
  actions/         book, complete, applyCredit, config/*  (server actions + zod)
styles/
  tokens.css       the --bds-* token layer (design-system §10) + Tailwind @theme bridge
components/
  ui/              accessible primitives (shadcn/Radix), themed by tokens
features/
  booking/         state machine, steps, components
  schedule/  credit/  referral/  admin-config/
```

Shared UI comes from `components/ui/` (§10), never re-declared per feature. Every visual value traces to a token.

---

## 8. Auth & permissions — native, server-enforced, twice

- **Use Supabase's built-in phone OTP login** (confirmed native: `signInWithOtp` → SMS/WhatsApp 6-digit code → `verifyOtp`). We build only the two screens (enter phone, enter code) and link `auth.uid()` → the `client`/`staff` row on first sign-in. No hand-rolled OTP table or logic.
  - Reuses the **Twilio** account already provisioned for the notification lifecycle — no new dependency.
  - Matches the data model: `Client.phone` (E.164) is the identity key; RLS helpers (`current_client_id()`, `current_staff_id()`, `current_staff_access_level()`) already resolve `auth.uid()`.
  - Phone input uses `type="tel"` + `autocomplete="one-time-code"` on the code field so the OS can autofill the SMS code.
- **Session lives in cookies (server-side)**, read by middleware.
- **Permissions enforced on the server, twice (belt and suspenders):**
  1. The database (RLS) blocks unauthorized data outright.
  2. The dashboard hides sections the user's `access_level` (owner / manager / staff) shouldn't see.
- **Never rely on the browser alone** to hide sensitive sections.

> Blocked-on-decision: the concrete owner/manager/staff permission matrix is still `[OPEN]` (PRD §10, FS-10.5). It gates *which* sections render, not the pattern.

---

## 9. Design language — the brand direction

The visual identity is **classic-barbershop / heritage**, already encoded in the design system's tokens and fonts. `ui-ux-pro-max` validation confirmed a **bold, editorial** direction (Exaggerated-Minimalism / editorial family) — *not* the generic "calendar-blue Swiss" a naïve booking query returns. Keep the established identity.

**Palette (from the token layer — see §10 for the full table):** warm **cream paper** `#e8ddc6`, near-black warm **ink** `#1c1712`, barber **brick-red** `#a53a2c` (primary), **navy** `#1f3a5c` (secondary), **brass** `#9c762e` (accent + focus ring). Full dark mode is defined. This is a deliberate, cohesive heritage palette — preserve it.

**Type:** **Bevan** (slab-serif display — headings only) + **Archivo** (variable, body/UI, tabular figures). Display face carries the editorial/heritage tone; body face keeps data legible. Base body ≥16px on mobile (avoids iOS auto-zoom), line-height 1.5–1.75, weight for hierarchy (700 headings / 400 body / 500 labels).

**Per-surface expression** (via the density/motion "dials" — same tokens, different intensity):
- **Landing** — expressive: oversized display type (`clamp()`), generous whitespace (spacing `--bds-space-7…9`), the one pinned motion moment (Landing Spec §6).
- **Booking** — calm: standard density, one primary CTA per screen, motion only to signal state changes.
- **Dashboard** — dense: tight spacing (`--bds-space-2…5`), tabular data, quiet motion, information-first.

**Discipline:** one icon set (Lucide/Heroicons — SVG, never emoji as icons), consistent stroke width and sizing tokens, one primary CTA per screen, and a consistent elevation scale (`--bds-shadow-sm/md`).

---

## 10. Design system — token-driven, two-tier components

This section supersedes v0.0.1's "browser-global bundle" contract. The skills (`design-system`, `ui-styling`) surfaced a real problem and a cleaner path.

### 10.1 The problem with consuming the bundle directly
The kit in `design-system/` currently ships as a **design-sync bundle export** — a browser global (`window.BarbershopDesignSystem` via `_ds_bundle.js`) that needs React on `window` and a separate mount node. That model **fights the server-first architecture** in §4: it can't render in Server Components, adds a second React tree, and ships React twice. Consuming it as-is would undermine SSR/RSC on every surface.

### 10.2 The resolution — tokens are the real contract, not the JS bundle
- **The design tokens (`--bds-*`) are the shared, SSR-safe visual contract.** They are pure CSS custom properties — they render on the server, need no JavaScript, and already define the full light/dark heritage palette. Lift them out of the bundle into `styles/tokens.css` as the app's source of truth.
- **Bridge tokens into Tailwind** with the `@theme` directive so utilities and components resolve to the same values (`ui-styling`). One token source → identical look across every component, hand-written or generated.
- **Components are built in-repo, themed by tokens**, using **shadcn/ui + Radix primitives** (`components/ui/`) for anything interactive or SSR-critical — dialogs, forms, menus, the schedule actions. Radix gives correct focus management, keyboard nav, and `aria` for free; shadcn components are RSC-compatible and live in your codebase.
- The bundle's 7 components (`Button`, `Input`, `StatusBadge`, `AppointmentCard`, `ScheduleTable`, `CreditChip`, `SlotPicker`) remain the **visual reference** — their `.prompt.md` / `.html` / `.d.ts` files in `design-system/components/general/*` document the intended look, props, and variants. Re-implement them in `components/ui/` against the tokens (see `design-system/INTEGRATION-NEXTJS.md`).

### 10.3 Three-layer token architecture (`design-system` skill)
```
Primitive (raw)          Semantic (purpose)              Component (per-component)
--bds-red: #a53a2c   →   --color-primary: var(--bds-red) → --button-bg: var(--color-primary)
--bds-paper: #e8ddc6 →   --color-surface: var(--bds-paper)
```
The existing `--bds-*` set already blends primitive + semantic. Add a thin **semantic alias layer** mapping to the names shadcn/Tailwind expect, so generated components adopt the barbershop palette with zero restyling:

| shadcn / Tailwind name | maps to |
|---|---|
| `--background` / `--foreground` | `--bds-paper` / `--bds-ink` |
| `--card` / `--card-foreground` | `--bds-paper-raised` / `--bds-ink` |
| `--muted` / `--muted-foreground` | `--bds-paper-deep` / `--bds-ink-soft` |
| `--primary` / `--primary-foreground` | `--bds-red` / `--bds-red-ink` |
| `--secondary` | `--bds-navy` |
| `--accent` | `--bds-brass` |
| `--border` / `--input` | `--bds-line-strong` |
| `--ring` | `--bds-brass` |
| `--destructive` | `--bds-critical` |
| `--radius` | `--bds-radius-md` (9px) |

Full token tables (spacing, radius, shadow, motion, type) and the mapping live in `design-system/TOKENS.md`. Wiring lives in `design-system/INTEGRATION-NEXTJS.md`.

### 10.4 Rules for app code
- **Never hard-code color/spacing/type** — always a token. No raw hex in components (`design-system` best-practice #1).
- The token **semantic layer enables theming**; dark mode is `prefers-color-scheme` + `data-theme` override, already defined in the tokens — never hand-roll dark colors.
- One icon family; SVG only; consistent sizing tokens.
- If the visual kit is refreshed, re-export it and keep the `--bds-*` token families + the 7 component names — the app changes nothing because it depends on tokens, not the bundle.

---

## 11. Accessibility, touch & motion standards (non-negotiable)

Baseline for every surface (`ui-ux-pro-max` priorities 1–2, 7 — CRITICAL):

**Accessibility**
- Text contrast **≥4.5:1** (≥3:1 large text / UI glyphs); verify independently in light *and* dark mode. The heritage pairs (ink-on-paper) pass comfortably; verify red/brass text pairs before shipping.
- **Visible focus rings** (the brass `--bds-brass` ring is built in — never remove it).
- **Keyboard nav** with tab order matching visual order; escape/back in every modal and wizard step.
- **Never convey meaning by color alone** — status chips and branch states pair color with icon/text.
- Sequential heading hierarchy; descriptive `alt`; `aria-label` on icon-only buttons; move focus to main content on route change.

**Touch & interaction**
- Targets **≥44×44px**, **≥8px** apart; extend hit area if the glyph is smaller.
- Primary interactions on tap/click — **never hover-only**.
- Press feedback within ~100ms; `touch-action: manipulation` to kill the 300ms tap delay.
- **Confirm before destructive actions** (late-release, no-show); offer undo where feasible.

**Motion (`ui-ux-pro-max` §7)**
- Micro-interactions **150–300ms**; animate **transform/opacity only** (never width/height/top/left → no CLS).
- Every animation conveys cause→effect; exits ~60–70% of enter duration; ease-out entering, ease-in exiting. The token layer ships `--bds-ease` + `--bds-dur-fast/base` — use them so motion shares one rhythm.
- **Respect `prefers-reduced-motion`** everywhere: Layer-1 reveals become instant visibility; Layer-2 scale/parallax/color-shift disabled (sticky headers stay — they're navigation); Layer-3 pinned sequence shows its final frame statically (Landing Spec §8).

**Performance (`ui-ux-pro-max` §3)**
- WebP/AVIF, `srcset`/`sizes`, `loading="lazy"` below the fold; declare width/height or `aspect-ratio` (**CLS < 0.1**).
- Route/feature code-splitting (`next/dynamic`); virtualize any list of 50+ rows (busy dashboards); skeletons for loads > 300ms.

---

## 12. Navigation patterns

- **Mobile:** bottom nav **≤5 items**, icon **+ label**, active state highlighted; top-level screens only (no nested sub-nav inside it). Keep placement identical across pages.
- **Desktop (≥1024px):** adaptive — prefer a **sidebar** for the dashboard; bottom/top nav collapses into it.
- **Back is predictable** and **preserves scroll + filter + input state**; never silently reset the stack.
- Destructive/danger actions (logout, delete) are visually and spatially separated from normal nav.
- Modals are for tasks, **not primary navigation**; every modal/sheet has a clear dismiss (swipe-down on mobile) and a scrim strong enough (40–60%) to isolate foreground.

---

## 13. Landing-page motion — progressive enhancement

- Animations are a **nice extra, not a requirement.** Built on lightweight browser features (IntersectionObserver + CSS transforms) — no heavy scroll library unless §10 of the Landing Spec forces it.
- Structure follows the validated **Hero → (proof) → Services → … → Testimonials → Contact** pattern with **social proof before the final CTA**, 3–5 real Google reviews (Landing Spec §11).
- **Everything degrades gracefully** under `prefers-reduced-motion` and slow networks (Landing Spec §8 budget: ≤600KB above-fold, hero ≤300KB, pinned sequence ~1MB total).
- The single pinned frame-sequence (Landing Spec §6) is the only heavy motion piece — one pinned moment per page.

---

## 14. The rules that matter most

1. **Never duplicate backend logic** — booking rules, credit, pricing, two-track eligibility live in the DB; the frontend calls them.
2. **Two contracts, both external to components** — the data contract (Supabase + RLS) and the visual contract (design tokens). Components hard-code neither.
3. **Server-first; interactivity only where needed** — reads via Server Components, writes via validated Server Actions, client code kept small.
4. **Responsive everywhere, phone-primary** — including the staff dashboard, whose core actions must be one-tap and touch-friendly.
5. **Accessibility & touch minimums are non-negotiable** (§11) — contrast, focus, 44px targets, reduced-motion, on every surface.

---

## 15. Provenance — how v0.0.2 was refined

Refined with four design skills (installed in `.claude/skills/`):

| Skill | What it contributed |
|---|---|
| `ui-ux-pro-max` | Accessibility/touch/motion/perf standards (§11), form + navigation UX (§6, §12), Next.js stack rules (§4–5), landing structure (§13); validated the bold-editorial brand direction (§9) over a generic booking template. |
| `design-system` | Three-layer token architecture (primitive→semantic→component) and the "never raw hex" discipline (§10.3). |
| `ui-styling` | shadcn/ui + Radix + Tailwind `@theme` path for accessible, SSR-friendly components sharing one token source (§10.2). |
| `design` | Brand → Tokens → Implement workflow confirming the token-driven handoff (§9–10). |

Real `--bds-*` values were read from `design-system/_ds_bundle.css`; the semantic mapping (§10.3) is grounded in those actual tokens, not assumptions.

---

## 16. Open questions / dependencies

| # | Question | Blocks | Owner |
|---|---|---|---|
| 1 | Adopt token-driven + shadcn path (§10) vs. wrap the browser-global bundle | How components are built | Eng decision (recommended: token-driven) |
| 2 | owner/manager/staff permission matrix | Dashboard section gating (§8, §12) | PRD §10 / FS-10.5 |
| 3 | Credit application: automatic vs. opt-in at booking | Booking review + rebook screens (§6) | PRD §10 / FS-6 |
| 4 | Auth screens not yet wireframed (phone → code) | Booking, account, dashboard entry (§8) | Booking Spec §5.2 |
| 5 | Brand name (Fadehouse vs. Caesar) | Landing + all visual work (§9) | PRD §10 |

*Items 2–5 are product/design decisions; none change the architecture above. Item 1 is the one open engineering decision this revision introduces — §10 makes the recommendation.*

---
name: mobile-app-ui-design
description: Design high-quality, mobile-first screens, flows, and components for the Fadehouse booking platform — as responsive Next.js (App Router) web that also works saved to the phone home screen (Add to Home Screen), NOT as a native app. Use whenever the user asks to design a mobile screen, create app-style mockups, build mobile UI components, improve an existing mobile screen, design an onboarding/booking flow, design mobile navigation, or requests mobile-first interface work. Also trigger on "app design", "mobile UI/UX", "screen design", "make this screen look better", or "make it feel like an app on the phone". This project is web-only Next.js — never propose React Native / Flutter / SwiftUI.
---

# Mobile App UI/UX Design Skill (Fadehouse — Next.js, home-screen web app)

Design professional, polished mobile screens for the **Fadehouse** barbershop & lash studio booking platform. This produces **web** UI (Next.js App Router) that looks and feels like a native app on a phone and can be **saved to the home screen** — it is not a native app and not a full offline PWA.

> **This skill runs UNDER the `frontend-developer` skill.** `frontend-developer` defines the mandatory build workflow and guardrails for this repo; follow it. This skill adds the *mobile-screen craft* (visual/UX quality) and the *home-screen web-app* layer on top. For token/spec details use `design-system`; for shadcn/Radix + Tailwind use `ui-styling`; for UX/visual decisions use `ui-ux-pro-max`. **Never re-implement backend logic** (double-booking, credit math, `amount_due`) in JS — the DB is the brain; call it.

---

## Step 0 — Orient before you design (MANDATORY, do not skip)

You must match what already exists. Never invent a parallel palette, spacing scale, or duplicate a component. Before designing any screen:

1. **Skim the architecture** — `docs/engineering/FRONTEND_ARCHITECTURE-v0_0_1.md` (folder layout, RSC-vs-client rules, `lib/data` reads, `lib/actions` writes).
2. **Read the real tokens** — `design-system/TOKENS.md` and **`styles/tokens.css`** (the live seam). Pull the *actual* values; do not guess hex. Today's brand is **always-dark black & gold**:
   - Surfaces: `--bds-paper` `#121110`, `--bds-paper-raised` `#1e1b17`, `--bds-paper-deep` `#0a0908`
   - Ink/text: `--bds-ink` `#f3ede2`, `--bds-ink-soft` `#a89d8d`
   - Primary (accent, the "10%"): `--bds-gold` `#d7a13c`, focus/secondary highlight `--bds-brass` `#9c762e`
   - Status: `--bds-success`, `--bds-warning`, `--bds-critical`, `--bds-info`
   - Spacing `--bds-space-1..9` (4/8/12/16/24/32/48/64/96), radius `--bds-radius-sm/md/pill`, shadow `--bds-shadow-sm/md`, motion `--bds-dur-fast/base/slow` + `--bds-ease`, type `--bds-font-display` (serif) / `--bds-font-body` (sans).
3. **Reuse existing primitives** — check `components/ui/*` (`button`, `badge`, `card`, `field`, `app-header`, `figure-image`, `scroll-reveal`, `razor-spinner`…) and the specs in `design-system/components/general/*` (`AppointmentCard`, `Button`, `CreditChip`, `Input`, `ScheduleTable`, `SlotPicker`, `StatusBadge`). Compose these before building anything new.
4. **Confirm libraries actually installed** — icons: **`lucide-react`**. Motion: **`gsap`** + **`lenis`** (there is no framer-motion; there is no Recharts). `clsx` + `tailwind-merge` for class composition. Don't import a library that isn't in `package.json`.

If a brand/product decision is `[OPEN]` (permission matrix, credit opt-in, redemption cap, brand name), read from config or ask — don't guess.

---

## Platform — mobile web + Add-to-Home-Screen (not native, not a full PWA)

The three surfaces (marketing `/`, booking `/book` · `/account`, dashboard `/dashboard`) are **one responsive Next.js App Router app**. The mobile experience must:

- **(a)** render perfectly in a **Chrome-on-mobile browser tab**, and
- **(b)** be **saveable to the home screen** (iOS Share → Add to Home Screen; Android Chrome → Add to Home screen) so it launches app-like in `display: standalone` with no browser chrome.

Explicitly **out of scope**: service workers, offline caching, `beforeinstallprompt` install flows, WebAPK/installability engineering. It behaves like a home-screen **bookmark** — data is always live (correct for booking availability). See `references/home-screen-webapp.md` for the manifest + apple-meta + safe-area setup.

---

## Core Philosophy

Great mobile UI isn't about flashiness — it's about intentionality. Every pixel, spacing value, and color choice should serve the user, and feel smooth, personal, and alive. Before designing, answer three things:

1. **What is the user trying to accomplish?** (reduce friction to that goal — usually: book a seat fast)
2. **How should this make them feel?** (trust, calm confidence, a little delight)
3. **What's the one thing they should notice first?** (visual hierarchy)

---

## Design Process

### Step 1 — Understand the context
- Which surface & user? New customer (guided, minimal), returning (fast rebook, saved prefs), or staff/owner (dense, one-tap actions).
- What's the **primary action** on this screen? (book, confirm, check in, reschedule)
- Which booking conventions apply? See `references/industry-conventions.md`.

### Step 2 — Structure first (UX lens)
- Map the flow: what screen comes before and after.
- Keep only the MVP elements for this screen.
- Put primary actions in the **thumb zone** (bottom 1/3).
- **A bottom action/nav bar is mandatory** for primary navigation — when launched from the home screen there is no browser back button or address bar. Provide in-app back/nav.
- Use `100dvh`/`100svh` (never `100vh`) and pad edges with `env(safe-area-inset-*)` so nothing hides under the notch or home indicator.
- Expose content directly instead of hiding behind taps; turn empty states into guidance + a CTA.
- Right input for the job: tappable selections/steppers for common choices; text fields only for precise/repeated entry.

### Step 3 — Apply visual design (UI lens)

**Typography** — one family per role (`--bds-font-display` serif for headings, `--bds-font-body` sans for UI/body). Max ~4 sizes, 2 weights. Tabular/large numerals for prices & stats. Hierarchy via size + weight + ink opacity (`--bds-ink` 100% headings → `--bds-ink-soft` for secondary), not bold-everything.

**Color (60/30/10)** — on this dark brand: **~60%** paper surfaces (`--bds-paper` / `-raised` / `-deep`), **~30%** ink text & lines (`--bds-ink`, `--bds-line`), **~10%** gold accent (`--bds-gold`) reserved for CTAs and the one key indicator per view. Use gold at low opacity for subtle card highlights/secondary buttons. Save `--bds-critical` for genuinely destructive/error moments — overuse kills hierarchy. **All values come from tokens — never a raw hex.**

**Spacing (8-pt grid)** — only `--bds-space-*` steps. Related elements closer, unrelated further; if related text is `--bds-space-4` apart, the gap to the next group is ~2×. Card padding `--bds-space-5`–`-6`. Generous section rhythm.

**Shadows** — soft only (`--bds-shadow-sm/md`), already tuned for the dark surface. Don't hand-roll pure-black/gray shadows.

**Visual cues & imagery** — lucide icons for affordances; real photos/avatars > initials > generic icons for people. Keep imagery style consistent (this is a grooming brand — warm, editorial). Use `figure-image`/`loaded-image` primitives.

### Step 4 — Design for emotion (Peak-End)
Users remember the **peak** and the **end**. Identify the peak (booking confirmed, streak/loyalty milestone) and design a rewarding beat — a tasteful gsap micro-animation, a confirmation card, encouraging copy. Design the ending: a summary/affirmation and a gentle nudge to return. Keep celebration intentional, not loud. **Honor `prefers-reduced-motion`** — gate motion and fall back to instant state.

### Step 5 — Polish & details
- Subtle glow/blur behind a hero element; soft borders using `--bds-line`.
- Micro-animations for state changes via `gsap`/`lenis` or CSS transitions timed with `--bds-dur-*` + `--bds-ease`.
- All tap targets ≥ **44×44px**. Check contrast on the dark surface. Design **error, empty, loading (`razor-spinner`), and success** states for every screen.

---

## Smart patterns
- **Personalize by stage** — new: simple welcome + guided booking; returning: one-tap rebook, saved barber/service; staff: dense stats & quick actions.
- **Never a blank search** — recent, popular services/barbers, personalized picks.
- **Booking status/tracking** — confident status line, humanize with barber photo/name + quick actions, visual timeline over date lists.
- **Category screens** — color-coded service cards with soft backgrounds + clean isolated imagery; consistent rhythm for effortless scanning.
- **Selection over manual input** — tappable service/time options with icons; provide "Other" with a fallback field.

---

## Anti-patterns to avoid
- Proposing React Native / Flutter / SwiftUI, or any service-worker/offline/installable-PWA machinery (out of scope).
- Raw hex/px or a parallel palette — everything is a `--bds-*` token / Tailwind theme utility.
- Importing libraries not in `package.json` (e.g. framer-motion, Recharts).
- `100vh`, CTAs outside the thumb zone, no bottom nav in a home-screen launch.
- >4 font sizes / >2 weights, random spacing, same visual weight everywhere (no hierarchy), label bigger than value.
- Overusing gold/critical; generic empty states with no guidance; sliders for precise/frequent entry.

---

## Implementation notes (repo reality)
- **Server-first RSC by default.** Add `'use client'` only for real interactivity; keep client islands small. Reads via `lib/data/*` in Server Components; writes via Server Actions in `lib/actions/*` (zod validate → authorize → call DB → revalidate).
- **Clean, scalable, reusable code.** Build screens from small composable components; reuse `components/ui/*` and the `design-system/components/general/*` specs before adding anything new; name things clearly. No duplication, no one-off hardcoded values — utilities/tokens only, so screens scale without accumulating cruft.
- **Token-only styling** — express 60/30/10 and the 8-pt grid through existing tokens: `bg-background`/`bg-card`, `text-foreground`/`text-muted-foreground`, `bg-primary text-primary-foreground`, `p-4`/`gap-6`, `rounded-md`, `ring-ring`. Motion via `--bds-dur-*`/`--bds-ease`.
- **Mobile-first 375px baseline** (iPhone SE), then scale up. `rounded-2xl`/`rounded-3xl` map to token radii; use `backdrop-blur` sparingly.
- **Home-screen web-app**: manifest + apple meta + `viewportFit: 'cover'` + safe-area — see `references/home-screen-webapp.md`. No SW.

---

## Definition of done — mobile self-check
Before calling a screen finished, confirm every item:

1. **Oriented first** — read tokens + specs; matched existing tokens/components; invented **no** new styles or duplicate components.
2. **Renders at 375px** and scales up cleanly; content fits the thumb zone; a bottom nav/action bar exists.
3. **Tokens only** — real `--bds-*` values via Tailwind utilities; **zero** raw hex/px; no parallel palette.
4. **Reused primitives** — composed `components/ui/*` / `design-system/components/general/*` where they fit.
5. **Clean & scalable** — small composable components, clear names, no duplication.
6. **Touch & a11y** — 44px targets, visible focus (`ring-ring`), sufficient contrast on the dark surface.
7. **Motion** — honors `prefers-reduced-motion`; uses `--bds-dur-*`; only `gsap`/`lenis`/CSS (no un-installed libs).
8. **States** — error, empty, loading, success all designed.
9. **Safe-area** — `100dvh`/`100svh`, `env(safe-area-inset-*)`; works in a Chrome-mobile tab **and** when launched from the home screen (standalone).
10. **Server-first preserved** — RSC by default, minimal client islands, no backend logic re-implemented in JS.
11. **No PWA claims** — no service worker / offline / installability work introduced.

For booking-domain conventions see `references/industry-conventions.md`; for the home-screen setup see `references/home-screen-webapp.md`.

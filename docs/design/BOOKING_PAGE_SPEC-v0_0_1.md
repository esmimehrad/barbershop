# Booking Page Spec — Barbershop Booking Platform (MVP)

**Companion to:** PRD v0.8 · Data Model v0.0.2 · User Flows v0.0.2 · Feature Specs v0.0.1 · Landing Page Spec v0.0.1
**Counterpart:** Admin Dashboard Spec v0.0.1 (staff/owner web surfaces)
**Source:** `Barbershop_Wireframes_dc.html`
**Status:** Draft v0.0.1 · **Last updated:** July 9, 2026

**Scope:** All **customer-facing** screens — the public website booking flow and the customer's account surfaces. Mobile-first.

**Excluded:**
- Staff and owner web surfaces → see **Admin Dashboard Spec**
- Notification-channel screens (SMS / WhatsApp bubbles, delivery log) → cut per scope decision

---

## 0. Scope note — notifications excluded

The wireframes rendered several customer touchpoints as SMS/WhatsApp bubbles. The channel layer is out. Message *content* survives where it drives a state change; the *delivery mechanism* does not.

| Wireframe screen | Disposition |
|---|---|
| 24h reminder · 1h reminder + late policy | **Cut** |
| Feedback request message | **Cut** — the feedback *form* survives |
| "Both credited" (referral) | **Reframed** as an in-app credit state |
| `slot_opened` ping (waitlist) | **Reframed** as an in-app claim prompt |
| Birthday offer | **Reframed** as an in-app offer surface |
| Promotion offer message | **Reframed** as an in-app grant surface |

The `Notification` entity and its state machine remain in the data model. Only the screens are out. "The customer gets a text" becomes "the customer sees this state on next open."

⚠️ **Consequence:** the waitlist claim and the birthday offer were both *push-initiated*. Without a channel they have no trigger. See §5.

---

## 1. Screen inventory

**22 customer screens across 8 flows.**

| Flow | Screens | Feature Spec | Priority |
|---|---|---|---|
| 1 · Core Booking | 6 | FS-1 | P0 |
| 2 · Priority-Slot Booking | 4 | FS-2 | P1 |
| 4 · Credit Earned (customer half) | 2 | FS-5, FS-12 | P0/P2 |
| 6 · Referral Loop | 4 | FS-9 | P1 |
| 7 · Waitlist Claim | 4 | FS-2 | P1 |
| 8 · Rebook | 2 | FS-6, FS-7 | P0/P1 |
| 9 · Birthday Offer | 2 | FS-8 | P2 |
| 12 · Promotion (customer half) | 4 | FS-14 | P2 |
| **Missing: Authentication** | **0** | — | **P0 gap** |

---

## 2. Flow specs

### Flow 1 — Core Booking · **P0**
*FS-1 · User Flows Flow 1*

| # | Screen | Key elements | Writes |
|---|---|---|---|
| 1 | Choose service / package | Wordmark, personalized greeting, service search, cards: Haircut `from $25` · Beard `from $12` · Lashes `from $70` · Packages `bundles` | — |
| 2 | Attach add-ons | Service header + price, add-on checklist (Beard trim `+$12`, Hot towel `+$5`, Wash & style `+$4`), **running total `$37`** | — |
| 3 | Choose provider | Staff gated by `StaffService` (*only staff assigned Haircut appear*), role + "usual" badge, plus **Any available · first free slot** | — |
| 4 | Pick a time | Day chips → time chips, disabled state for taken slots | — |
| 5 | Review | Line-itemized base + add-ons, provider · day · time, **Apply $18 credit** toggle, `Amount due $37` | — |
| 6 | Confirmed | Success mark, `booked · first_choice` chip, summary, `Amount due $37 — pay at the shop`, **Add to calendar** | `Appointment`, `AppointmentAddon` × n, `price_snapshot`, `addons_snapshot`, `amount_due` |

**Deltas**
- Screen 6's 🔔 *"we'll text you 24h & 1h before"* line — **remove.**
- Screen 3's **"Any available"** is not in FS-1. It implies a staff-agnostic slot query. Add to FS-1 AC-1 or drop it.
- Screen 5 makes credit **opt-in**; FS-6.1 only caps the amount. Flow 8 applies it automatically. **Contradiction — resolve.**

---

### Flow 2 — Priority-Slot Booking · **P1**
*FS-2 · User Flows Flow 2*

| # | Screen | Key elements |
|---|---|---|
| 1 | Rank your top 2 times | Day selector, time grid with **rank badges 1 / 2**; legend `1 — booked if free` · `2 — fallback + waitlist for slot 1`; **Book with priority** |
| 2a | Got your 1st choice *(1st free)* | Success, `first_choice` chip, no waitlist row |
| 2b | Got 2nd + waitlisted *(1st taken)* | Both slots — 2nd `confirmed`, 1st `waitlisted`; `SlotWaitlist · waiting`; `⏱ claim within [TBD window] once notified` |
| 3 | Nearest alternatives *(neither free)* | "Both times taken" + 3 nearest openings, each with **pick**; *never blocked — always suggests options* |

**Deltas**
- Screen 2b's *"We'll text you if it opens up"* is now a **dead promise.**
- `TBD window` = `waitlist_claim_window_minutes` (FS-2.8, PRD §10). Still open.

---

### Flow 4 — Credit Earned (customer half) · **P0 / P2**
*FS-5, FS-12 · User Flows Flow 4*
*(Staff completion screens live in the Admin Dashboard Spec.)*

| # | Screen | Key elements |
|---|---|---|
| 3 | Credit earned | `+$2.50 credit earned · balance now $20.50`, `Amount due $37 — settle at the counter`, **Rate your visit** |
| 4 | Post-session feedback | 5-star input, optional comment, **Send feedback**; `TBD: rating scale · 1 msg vs short form` |

**Deltas**
- Under the notification cut, **feedback is pulled, not pushed** — Screen 4 is reached via Screen 3's *Rate your visit* CTA. The wireframe already wires it this way. ✅

---

### Flow 6 — Referral Loop · **P1**
*FS-9 · User Flows Flow 6*

| # | Screen | Key elements |
|---|---|---|
| 1 | Share your code | `Your code: FADE-RAY9`, **Copy** / **Share**, `Both of you get [TBD credit] when they finish their 1st visit` |
| 2 | New client signs up w/ code | Name · Phone · Referral code (pre-filled, `applied ✓`), `pending` chip, **Create account**; `referred_by_id set · Referral row created` |
| 3 | New client's 1st visit completes | Completion confirm, `completed` |
| 4 | Both credited | **Reframed:** in-app credit state, `Referral · credited`, `+ referral credit · referrer + referred` |

**Deltas**
- `TBD credit` = `referral_fixed_amount` (PRD §10). Still open.
- **Screen 1 has no entry point.** "Refer a friend" is not on the landing page and not in any wireframed nav. It needs a home in the customer account area — currently unwireframed.
- Screen 2 is the **only signup surface in the entire wireframe set** (see §3.3).

---

### Flow 7 — Waitlist Claim · **P1** ⚠️
*FS-2 · User Flows Flow 7*

| # | Screen | Key elements |
|---|---|---|
| 1 | Slot opens *(holder cancels)* | **Reframed:** in-app banner — *"Your 1st-choice slot Tue 1:00 pm opened up. First to claim gets it."* → `Claim 1:00` / `Keep 2:30`; row → `notified` |
| 2 | Claim within window | Countdown to `claim_expires_at` (`Claim before 2:14 pm`), consequence line *moves you to 1:00 & frees your 2:30* |
| 3a | Claimed | `claimed · first_choice`; *old 2:30 freed → re-runs waitlist check* |
| 3b | Expired | `expired`; *released to next waiter / general*; `OPEN: depth cap` |

**Deltas — this flow is the most damaged by the notification cut**

Screen 1 was the **only** trigger that surfaced a claim opportunity. Without push, the claim window ticks while the customer has no idea. Options:

- **(a)** Generous window (hours, not minutes); customer discovers it on next open
- **(b)** **Defer FS-2 to P2** ← recommended
- **(c)** Replace notify-only with auto-reassign to first waiter (which FS-2 explicitly rejects)

FS-2 is already the most logic-heavy P1 spec. **Strong case for deferring the whole waitlist.**

---

### Flow 8 — Rebook · **P0 / P1**
*FS-6, FS-7 · User Flows Flow 8*

| # | Screen | Key elements |
|---|---|---|
| 1 | Return — prefs pre-filled | `Welcome back, Ray`, **Book again — 1 tap**, `Haircut + beard · Marco · your usual · $37`, `$20.50 credit · applies at booking ≤ cap` |
| 2 | Confirm w/ credit applied | `Credit applied −$14.80`, `Amount due $22.20`; *cycle repeats → feeds repeat-visit rate ★* |

**Deltas**
- Applies credit **automatically**, contradicting Flow 1 Screen 5's toggle. **Pick one.**
- `−$14.80` on `$37` implies `redemption_cap_pct = 40%`. That number is `[OPEN]` (FS-6.5). **The wireframe quietly assumed a value. Don't let it harden by accident.**

---

### Flow 9 — Birthday Offer · **P2**
*FS-8 · User Flows Flow 9*

| # | Screen | Key elements |
|---|---|---|
| 1 | Birthday offer | **Reframed:** in-app offer surface, `🎂 [TBD offer]`, **Book now**; `type: birthday · no linked appointment` |
| 2 | Book using offer | `🎂 Offer applied` chip, continues into Flow 1 |

**Delta** — without push, a birthday offer nobody opens the app to see does nothing. **Keep at P2 or park** until a channel exists.

---

### Flow 12 — Promotion (customer half) · **P2**
*FS-14 · User Flows Flow 12*
*(The owner's promotion builder lives in the Admin Dashboard Spec.)*

| # | Screen | Key elements |
|---|---|---|
| 2 | Customer earns it | **Reframed:** in-app grant surface, `PromotionGrant · granted` |
| 3 | Reward attached at booking | Add-on screen with `Beard trim · promo reward · $0` |
| 4a | Redeemed on completion | `Free beard trim applied · redeemed` |
| 4b | Expired | `not used before expiry · expired` |

---

## 3. Relationship to the Landing Page Spec

The Landing Page Spec covers the **public marketing surface**. This document covers the **booking surface**. They meet at four seams.

### 3.1 The seams

| Landing Page | Hands off to | Contract |
|---|---|---|
| **§2 Hero → "Find times"** | Flow 1, Screen 1 or 4 | Hero chips are **featured services**. Tapping one enters Flow 1 with that service **preselected**, skipping Screen 1. No chip selected → enter at Screen 1. |
| **§4 Services → card** | Flow 1, Screen 2 | *"Each card links into the booking flow with that service preselected."* Same contract, deeper catalog. |
| **§7 Meet the barbers → "Book with [name]"** | Flow 1, Screen 4 | Enters with **provider preselected**, skipping Screen 3. Must still enforce `StaffService` — if the barber can't perform the chosen service, the entry point is invalid. |
| **§8 Eyelash → own CTA** | Flow 1, Screen 1 (lash track) | Enters the **eyelash track**. Screen 1 shows only `type = eyelash`. Never mixes tracks. |
| **§3 Featured promo** | Flow 12 | Landing page *displays*; booking flow *redeems*. No booking entry point of its own. |

### 3.2 Deep-link states

Every landing-page CTA is a **partial pre-fill of booking state**. Flow 1 has no wireframe for "entered mid-flow with a preselected service and/or provider."

**Needs a screen state, not a new screen** — but it needs specifying. Three entry states:

| Entry | Skips | Lands on |
|---|---|---|
| Service preselected | Screen 1 | Screen 2 (add-ons) |
| Provider preselected | Screen 3 | Screen 4 (time) |
| Both preselected | Screens 1, 3 | Screen 4 (time) |

### 3.3 Contradiction — where does track selection happen?

The Landing Page Spec is explicit: *"The page never mixes the tracks in a single CTA."*

But **Flow 1 Screen 1 shows Haircut, Beard, Lashes, and Packages in one grid.**

- If the landing page owns track selection → Screen 1 renders **one track only**, filtered by entry point.
- If Screen 1 owns it → the landing page's two-CTA structure is decorative.

Data Model §4 enforces two-track separation at the *availability query*, not the *service list* — so the current Screen 1 is technically legal, just architecturally muddled. **Resolve.**

### 3.4 ⚠️ Identity has no home

Flow 1 Screen 1 greets `Hey Ray`. Flow 8 greets `Welcome back, Ray`.

**There is no login or signup screen in the wireframes** — except Flow 6 Screen 2 (referral signup). The landing page has no auth surface either.

`Client.phone` is the identity key (Data Model §1). **Missing: phone-based lookup / OTP screen.** This is a **P0 gap** and it blocks Flows 1, 6, 7, 8, 9, and 12.

---

## 4. Design language (customer surfaces)

| Pattern | Usage |
|---|---|
| **Status chips** — monospace, lowercase, entity-state literal | `booked · first_choice`, `SlotWaitlist · waiting`, `claimed`, `expired`, `granted`, `redeemed` |
| **`TBD` chip** | Inline placeholder for an unresolved config value (`TBD window`, `TBD credit`, `TBD offer`) |
| **`↳` annotation** | Explains an invisible rule (*only staff assigned Haircut appear*) |
| **Branch chips** | `1st free` (green) / `1st taken` (amber) / `neither free` (red) |

⚠️ The status chips **expose internal enum values to the customer** (`booked · first_choice`). That reads as wireframe annotation, not production copy. **Confirm they're stripped before build.**

**Money is coherent.** `$37` (Haircut $25 + Beard trim $12) recurs across Flows 1, 4, 8. Credit arithmetic checks: `$18 → +$2.50 → $20.50 → −$14.80 → $5.70`.

**Personas.** Ray Ortiz (customer), Marco / Sami (barbers), Lena (lash specialist), Dana (referred client). **Shop is `Fadehouse`** — but the Landing Page Spec references a **Caesar icon** (§3.0). **Brand is not settled.**

---

## 5. Open questions

1. **⚠️ Waitlist without push.** Flow 7's claim window has no trigger. **Recommend deferring FS-2 to P2.** *Blocks FS-2.*
2. **⚠️ Where is authentication?** No login/signup outside referral signup. *P0 gap — blocks 6 flows.*
3. **Credit application: automatic or opt-in?** Flow 1 toggles it; Flow 8 applies it. *Blocks FS-6.*
4. **Does "Any available" provider exist?** Flow 1 Screen 3 offers it; FS-1 does not. *Blocks FS-1.*
5. **Track selection: landing page or Screen 1?** The specs contradict. *Blocks landing §2/§8 and FS-1.*
6. **`redemption_cap_pct`** — wireframe assumes 40%. Still `[OPEN]`. *Blocks FS-6.*
7. **Where does "Refer a friend" live?** No entry point exists. *Blocks FS-9.*
8. **Status chips as production copy?** *Design decision.*
9. **Brand name** — `Fadehouse` vs. `Caesar`. *Blocks all visual work.*

**Newly moot under the notification cut:** the customer-facing halves of FS-3 (entirely), FS-8 (Birthday delivery), and FS-12 (feedback-request delivery).

---

## 6. Next actions

1. **Wireframe the auth screen** (phone → OTP → session). P0.
2. **Resolve credit opt-in vs. automatic**, and pin `redemption_cap_pct`.
3. **Decide track selection ownership** — landing page or Screen 1.
4. **Decide on FS-2.** Deferring the waitlist to P2 simplifies the build materially.
5. **Specify the three deep-link entry states** (§3.2).
6. **Find a home for "Refer a friend."**
7. **Settle the brand** before high-fidelity work.
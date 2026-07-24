# Industry conventions — booking / barbershop & lash studio (Fadehouse)

Domain-specific UX conventions for the Fadehouse surfaces. These map to the repo's component specs in `design-system/components/general/*` (`SlotPicker`, `AppointmentCard`, `ScheduleTable`, `StatusBadge`, `CreditChip`, `Button`, `Input`) — reuse those, don't reinvent. **The DB owns the rules** (availability, double-booking prevention, credit math, `amount_due`); the UI reflects and calls them.

## The booking mental model
A customer books: **service → barber (optional) → date → time slot → confirm**. Minimize steps and never make the user hunt. Show price and duration up front so there are no surprises at confirm.

## Service selection (category screens)
- Color-coded service cards with soft backgrounds and clean isolated imagery; consistent rhythm for effortless scanning.
- Each card: service name, duration, price (tabular numerals), a one-line descriptor. Tappable whole-card, not a tiny button.
- Group by type (cuts, beard, lashes) with clear section headers in `--bds-font-display`.

## Barber / staff selection
- Photo/avatar > initials > generic icon. Show name, specialty, and (if available) next-available hint.
- Allow "Any available" as a first-class, prominent option — many users don't care who.

## Slot / time picking (`SlotPicker`)
- Show a horizontally scrollable day strip, then a grid of time slots for the selected day.
- **Availability is server-truth** — render only bookable slots; disable/grey taken ones; never let the UI imply a slot is free when the DB says otherwise. Optimistic UI must reconcile with the server action result.
- Big tap targets (≥44px), clear selected state using `--bds-gold`. Surface timezone implicitly (local).
- Empty day → guidance ("No openings — try tomorrow" + jump CTA), not a blank grid.

## Confirmation & the peak moment
- Booking confirmed is the **peak** (Peak-End rule): a confident success state — summary card (service, barber, date/time, price/`amount_due`), a tasteful gsap micro-animation, and clear next steps (add to calendar, directions, reschedule).
- Always end with reassurance + a gentle nudge (save to home screen, book again, loyalty progress).

## Status tracking (`StatusBadge`, `AppointmentCard`)
- Open with a confident status line ("Confirmed for Sat 2:00 PM"), humanized with the barber's photo/name and quick actions (reschedule, cancel, message).
- Use a visual timeline for multi-step status rather than a list of dates.
- Status colors come from tokens: `--bds-success` (confirmed/complete), `--bds-warning` (pending/soon), `--bds-critical` (cancelled/no-show), `--bds-info` (informational).

## Credits / loyalty (`CreditChip`)
- Show balance as a compact chip; explain how a credit applies to `amount_due` at checkout — but the math is the DB's; display, don't compute.
- Respect `[OPEN]` product decisions (credit opt-in vs auto, redemption cap %). If undecided, read from config or ask — don't hardcode a rule.

## Staff / owner dashboard (`ScheduleTable`)
- Dense but scannable: today's schedule as the default view, one-tap actions (check-in, complete, mark late/no-show).
- Optimize for glance-ability and speed on mobile — the owner is often standing at the chair, not at a desk.

## Reschedule / cancel
- Make it low-friction and honest about policy (cutoff windows, fees) up front. Confirm destructive actions but don't bury the primary path.
- Never trigger native browser `confirm()` dialogs for this in-app — use an in-app confirm sheet (a design-system dialog), consistent with the rest of the app.

## Cross-cutting
- **Never a blank search/empty state** — offer recent, popular services/barbers, or a re-book of the last appointment.
- **Personalize by stage** — new users get a guided path; returning users get one-tap rebook of their usual; staff get density and speed.
- **Trust signals** — for anything touching money or time, use motion/feedback deliberately so the user feels the action landed.

# Feature Specs & Acceptance Criteria — Barbershop Booking Platform (MVP)

**Companion to:** PRD v0.8 · Data Model v0.0.2 · User Flows v0.0.2 · **Last updated:** July 8, 2026
**Scope:** Buildable units for every in-scope feature (PRD §5, items 1–18), each with acceptance criteria (Given/When/Then) traceable to the data model and flows. Priority: **P0** = launch-blocking, **P1** = launch-desired, **P2** = fast-follow.

**Legend:** AC = acceptance criterion. Entity/field names match Data Model v0.0.2. `[OPEN]` marks an AC blocked on a PRD §10 open question.

---

## FS-1 — Core Booking (single choice) · **P0**
*PRD 1–2 · Flow 1 · Appointment, Service, StaffService, AvailabilityRule, HolidayClosure*

**Summary:** Customer picks a service/package, optionally attaches add-ons, sees only valid providers and open slots, and books.

**Acceptance criteria**
1. Given a selected service, when the provider list renders, then it shows only staff where `Staff.role = Service.allowed_role` **and** a `StaffService` row exists for that service, **and** the date is not in `HolidayClosure` (shop-wide or that staff).
2. Given a selected provider and date, when slots render, then each slot equals a free interval inside an `AvailabilityRule` window, length `Service.duration_minutes`, with no overlapping `Appointment`.
3. Given a package is chosen, when booking, then slot length reflects the package's combined duration and price reflects combined child prices.
4. Given add-ons are attached, when the booking is confirmed, then one `AppointmentAddon` row is written per add-on with its `price_snapshot`.
5. When the booking is confirmed, then an `Appointment` is created with `status=booked`, `booking_priority=first_choice`, `price_snapshot` (base) and `addons_snapshot` (sum) copied, and `amount_due = price_snapshot + addons_snapshot − credit_applied`.
6. Then the confirmation screen shows the amount owed and states payment is settled with the shop at the visit.

---

## FS-2 — Priority-Slot Waitlist · **P1**
*PRD 11 · Flows 2 & 7 · SlotWaitlist, Appointment, Notification*

**Summary:** Customer ranks two preferred slots; if the 1st is taken they take the 2nd and wait on the 1st; when it frees, first to claim wins.

**Acceptance criteria**
1. Given both choices, when the 1st is free, then the customer is booked into it (`first_choice`) and no `SlotWaitlist` row is created.
2. Given the 1st is taken and the 2nd is free, when booking, then the customer is booked into the 2nd (`second_choice`) **and** a `SlotWaitlist` row is created (`status=waiting`, `desired_starts_at`=1st choice, `fallback_appointment_id`=the 2nd-choice appointment).
3. Given neither choice is free, when booking, then the system does not block and instead returns the nearest alternative slots for the customer to pick.
4. Given a `waiting` row, when the appointment blocking `desired_starts_at` (same staff + service) is cancelled, then the row flips to `notified`, `notified_at` and `claim_expires_at` (= `notified_at` + `waitlist_claim_window_minutes`) are stamped, and a `slot_opened` Notification fires.
5. Given a `notified` row, when the customer claims before `claim_expires_at`, then `fallback_appointment_id` is promoted (`starts_at/ends_at`→desired slot, `booking_priority=first_choice`), the old 2nd-choice slot is freed (re-running the waitlist check), and the row flips to `claimed`.
6. Given a `notified` row, when `claim_expires_at` passes with no claim, then the row flips to `expired` and the slot releases to the next `waiting` row (if `waitlist_depth_cap` > 1) or general availability.
7. Given a claim ripple, then it terminates — each promotion moves strictly toward an earlier-preferred slot.
8. `[OPEN]` `waitlist_claim_window_minutes` and `waitlist_depth_cap` must be set before this AC set passes (PRD §10; likely depth = 1 for MVP).

---

## FS-3 — Notification Lifecycle · **P0**
*PRD 3 · Flow 3 · Notification*

**Summary:** Reminders and lifecycle messages over SMS + WhatsApp, logged with delivery status.

**Acceptance criteria**
1. Given a `booked` appointment, when it is 24h out, then a `24h` Notification with confirm/cancel fires on the client's `preferred_channel`.
2. Given the 1h mark, then a `1h` Notification always fires, its text tailored to the 24h response (confirmed / cancelled / no response) and including the 10-min grace late-policy notice.
3. When any Notification is dispatched, then it is logged `queued → sent`/`failed` with `provider_message_id` stored.
4. Given a send fails, then `status=failed` is recorded (retry policy TBD, not launch-blocking).
5. Then `no_show_followup`, `birthday`, `slot_opened`, `feedback_request`, and `promotion` types each fire from their respective triggers (cross-refs FS-5, FS-8, FS-2, FS-11, FS-13).

---

## FS-4 — Late Policy & Staff Release · **P0**
*PRD 4 · Flow 5 · Appointment*

**Acceptance criteria**
1. Given a `booked` appointment, when a staff member taps "mark late", then `status=late_released`, the slot frees, the record is kept, and the waitlist check runs on the freed slot.
2. Given a `booked` appointment, when staff taps "mark no-show", then `status=no_show` and a `no_show_followup` Notification fires.
3. Then no automatic timer ever changes status — `late_released`/`no_show` are staff-triggered only.
4. `[OPEN]` no-show follow-up copy (rebook prompt vs. re-engagement) resolved before FS-4.2 copy is final (PRD §10).

---

## FS-5 — Arrival, Completion & Credit Writes · **P0**
*PRD 7–9, 15, 17 · Flow 4 · Appointment, CreditTransaction, Referral, PromotionGrant, CustomerSegment, Feedback*

**Summary:** On completion, cashback + referral + promotion writes fire atomically, feedback is requested, and the balance is recomputed.

**Acceptance criteria**
1. Given a `booked` appointment, when staff marks `completed`, then `completed_at` is stamped and credit writes fire in one transaction.
2. **Cashback** — then rate = `Service.cashback_rate` if set, else the client's `CustomerSegment.cashback_rate`; a `cashback` CreditTransaction of `+(price_snapshot + addons_snapshot) × rate` is written, linked to the appointment.
3. **Referral** — given the client is `referred_id` on a `pending` Referral and this is their first completed appointment, then the Referral flips to `credited`, `qualifying_appointment_id` links, and two fixed-amount `referral` CreditTransactions are written (referrer + referred).
4. **Promotion** — given the completion satisfies a Promotion `trigger_type`, then a `PromotionGrant` (`granted`) is created; given the appointment redeemed a granted promotion, then that grant flips to `redeemed` and its reward applies.
5. Then `credit_balance` is recomputed as the signed sum of all `CreditTransaction` rows.
6. Then a `feedback_request` Notification fires (capture only, no staff alert).
7. Given writes fire, then they are idempotent — re-marking an already-`completed` appointment does not double-write credit.

---

## FS-6 — Credit Redemption · **P0**
*PRD 8–9 · Flow 4/8 · CreditTransaction, Appointment*

**Acceptance criteria**
1. Given available credit, when booking/checkout, then `credit_applied ≤ min(credit_balance, price_snapshot × redemption_cap_pct)`.
2. When credit is applied, then a `redemption` CreditTransaction of `−credit_applied` is written and `amount_due` reflects the remaining balance owed.
3. Then credit is redeemable against services only — never products (out of scope).
4. Then the shop settles any remainder off-product; no payment data is stored.
5. `[OPEN]` `redemption_cap_pct`, earn rate, and optional expiry set before FS-6 passes (PRD §9–10).

---

## FS-7 — Saved Client Preferences · **P1**
*PRD 5 · Flow 8 · Client*

**Acceptance criteria**
1. Given a returning client, when rebooking, then `usual_provider_id`, last service, and `preferences` notes pre-fill the booking form.
2. Then the client can override any pre-filled value before confirming.

---

## FS-8 — Birthday Offer · **P2**
*PRD 6 · Flow 9 · Notification*

**Acceptance criteria**
1. Given a client with a `birthday`, when the date matches, then a `birthday` Notification (small offer, no linked appointment) fires once per year.
2. Then booking via the offer follows the normal flow.

---

## FS-9 — Referral Loop · **P1**
*PRD 7 · Flow 6 · Referral, Client*

**Acceptance criteria**
1. Given an existing client's `referral_code`, when a new client signs up with it, then `referred_by_id` is set and a `pending` Referral row is created.
2. Then credit is written only on the referred client's **first completed** appointment (see FS-5.3), never on signup or booking.
3. Then a client cannot be `referred_id` on more than one Referral (unique constraint).

---

## FS-10 — Owner Dashboard & Access Levels · **P0**
*PRD 10, 12 · Flows 10–11 · Staff.access_level*

**Acceptance criteria**
1. Given a signed-in user, when the dashboard loads, then only sections permitted by their `access_level` (`owner`/`manager`/`staff`) render.
2. Then only `owner` can edit other users' `access_level`.
3. Then the dashboard shows today's schedule across both tracks, plus no-show rate, repeat-visit rate, utilization, referral activity, and outstanding credit liability.
4. Then one-tap late/no-show/complete marking is available (feeds FS-4, FS-5).
5. `[OPEN]` concrete permission set per named role defined before FS-10.1 passes (PRD §10).

---

## FS-11 — Admin Configuration · **P0**
*PRD 13, 16, 18 · Flow 11 · Service, PackageItem, StaffService, AvailabilityRule, HolidayClosure*

**Acceptance criteria**
1. Given `owner`/`manager` access, when configuring, then services can be created with type, duration, price, `allowed_role`, and flagged `is_package`/`is_addon`.
2. Then packages bundle child services via `PackageItem`; add-ons are attachable to base services/packages.
3. Then a staff member is added with a schedule (`AvailabilityRule`) and assigned specific services (`StaffService`) narrower than their role.
4. Then holiday/closure dates (`HolidayClosure`, shop-wide or per staff) remove bookable slots.
5. Then `amount_due` is auto-computed per booking (base + add-ons − credit); the shop still settles money off-product.
6. Then a staff member with no matching `StaffService` never appears as a provider for that service.

---

## FS-12 — Post-Session Feedback · **P2**
*PRD 14 · Flow 4 · Feedback, Notification*

**Acceptance criteria**
1. Given a `completed` appointment, then a `feedback_request` message fires automatically.
2. When the client responds, then a `Feedback` row (rating and/or comment) is written, unique per appointment.
3. Then no staff alerting occurs in MVP — capture only.
4. `[OPEN]` rating scale and single-message-vs-form decided before FS-12 passes (PRD §10).

---

## FS-13 — RFM Segmentation & Tiered Cashback · **P1**
*PRD 15 · Flow 4 · CustomerSegment, Client.rfm_segment_id, nightly job*

**Acceptance criteria**
1. Given completed-appointment history, when the nightly job runs, then each client's R/F/M is recomputed and `rfm_segment_id` is set to one of three `CustomerSegment` rows.
2. Then cashback at completion reads the client's segment rate current **at completion time** (unless the service overrides).
3. Then a mid-relationship re-segmentation changes only future cashback, never past transactions.
4. `[OPEN]` three segment boundaries and per-segment cashback rates defined before FS-13 passes (PRD §10).

---

## FS-14 — Promotions · **P2**
*PRD 17 · Flow 12 · Promotion, PromotionGrant*

**Acceptance criteria**
1. Given `owner` access, when defining a promotion, then trigger (`first_completed_service`/`nth_visit`/`manual`) and reward (`free_addon`/`fixed_credit`/`percent_off`) are set, with optional `expires_at`.
2. Given a client meets a trigger on completion, then a `PromotionGrant` (`granted`) is created and an offer message fires.
3. When a booking redeems a grant, then on completion the grant flips to `redeemed` and the reward applies (free add-on priced 0 / fixed credit / percent off).
4. Given a grant passes `expires_at` unused, then it flips to `expired`.
5. `[OPEN]` initial promotion rules and whether a reward also earns cashback (stacking) decided before FS-14 passes (PRD §10).

---

## Cross-cutting acceptance criteria

**Two-track & per-staff enforcement (all booking paths, incl. waitlist):** provider candidates must satisfy `Staff.role = Service.allowed_role` **and** an existing `StaffService` row, minus `HolidayClosure`. Haircut and eyelash pools never overlap.

**No payment data:** no path stores card/cash amounts; all money math derives from `price_snapshot` / `addons_snapshot`. Any reintroduction of payment capture is out of scope and rejected.

**Double-booking prevention:** every write of `Appointment.starts_at/ends_at` is validated against existing appointments for that staff member before commit.

**Holiday-over-existing-booking:** a new closure removes future slots but does not auto-cancel existing appointments — staff handle those manually (flagged on the dashboard).

---

## Priority summary

| Priority | Feature specs |
|---|---|
| **P0** (launch-blocking) | FS-1 Booking · FS-3 Notifications · FS-4 Late/Release · FS-5 Completion & Credit · FS-6 Redemption · FS-10 Dashboard & Access · FS-11 Admin Config |
| **P1** (launch-desired) | FS-2 Waitlist · FS-7 Preferences · FS-9 Referral · FS-13 RFM Cashback |
| **P2** (fast-follow) | FS-8 Birthday · FS-12 Feedback · FS-14 Promotions |

**Blocked-on-decision:** FS-2, FS-4, FS-6, FS-10, FS-12, FS-13, FS-14 each carry `[OPEN]` ACs tied to PRD §10 — resolve those numbers/rules before their sets can pass.
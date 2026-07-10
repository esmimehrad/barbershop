# User Flows — Barbershop Booking Platform (MVP)

**Companion to:** PRD v0.8 · Data Model (companion) · **Last updated:** July 8, 2026
**Scope:** The actual paths through the product for all in-scope features (PRD §5), mapped to the entities and state logic in the Data Model.

---

## Flow 1 — Core Booking (single choice)
- Customer opens web app → picks service or **package** (haircut or eyelash) → may attach **add-ons** (e.g. beard trim)
- Provider auto-filtered to staff who match the service's `allowed_role` **and** are assigned that service (StaffService), minus holiday/closure dates
- Selects available time slot
- Confirms booking → Appointment created (`status: booked`, `booking_priority: first_choice`, `price_snapshot` + `addons_snapshot` copied, `amount_due` auto-computed)
- Confirmation shows the amount owed; customer pays the shop directly at the visit (out of product)

## Flow 2 — Priority-Slot Booking (two ranked choices)
- Customer defines 1st and 2nd preferred slots, ranked
- **If 1st choice free** → booked into it (`first_choice`); done
- **If 1st choice taken** → booked into 2nd choice (`second_choice`) **and** added to SlotWaitlist (`status: waiting`, `desired_starts_at` = 1st choice, `fallback_appointment_id` = the 2nd-choice booking)
- **If neither free** → never block; system suggests the nearest alternative times/dates for the customer to pick from
- Customer sees which slot they got + that they're waitlisted for the preferred one

## Flow 3 — Notification Lifecycle (per appointment)
- **24h before** → reminder fires (SMS + WhatsApp) with confirm/cancel option
- **1h before** → always sent; text is tailored to the customer's 24h response (confirmed / cancelled / no response) + late-policy notice (10-min grace window stated)
- **After completion** → `feedback_request` message fires (see Flow 4)
- Each send logged as a Notification (`queued → sent`/`failed`, `provider_message_id` stored)
- Channel follows the client's `preferred_channel`

## Flow 4 — Arrival & Completion (earn credit)
- Customer arrives → barber marks appointment `completed` on the dashboard (`completed_at` stamped)
- Triggers credit writes:
  - **Cashback** → rate = service override, else the client's **RFM segment** rate; basis = base + add-ons → CreditTransaction
  - **Referral** (if applicable, see Flow 6) → two transactions, both parties
  - **Promotion** (see Flow 11) → grant if a trigger is met; redeem + apply reward if this booking used one
  - `credit_balance` recomputed
- **Feedback request** → automatic message asks how the session felt; response captured (rating/comment, no staff alert)
- Customer pays the shop directly; any credit redeemed is recorded as `credit_applied`, and `amount_due` reflects the balance owed

## Flow 5 — Late / No-Show (staff-triggered)
- **Late past grace** → barber taps "mark late" → Appointment `late_released` (slot freed, record kept) → triggers waitlist check on the freed slot
- **No-show** → barber taps "mark no-show" → Appointment `no_show` → fires `no_show_followup` notification (re-engagement / rebook prompt)
- No automatic timer — always manual

## Flow 6 — Referral Loop
- Existing client shares their `referral_code`
- New client signs up with the code → `referred_by_id` set; Referral row created (`status: pending`)
- New client books → arrives → marked `completed`
- **On first completed appt** → Referral flips to `credited`, `qualifying_appointment_id` linked, two fixed-amount `referral` credits written (referrer + referred)

## Flow 7 — Waitlist Claim (slot opens up)
- Customer holding the 1st-choice slot cancels → Appointment `cancelled` → waitlist check runs
- Matching `waiting` row (same `desired_starts_at` + staff + service) → flips to `notified`, `claim_expires_at` set, `slot_opened` notification fires
- **Customer claims within window** → fallback appointment promoted to desired slot (`first_choice`), old 2nd-choice slot freed (re-runs waitlist check), row → `claimed`
- **Window elapses** → row → `expired`, slot released to next waiter / general availability
- First to claim wins (notify-only, not auto-reassigned)

## Flow 8 — Rebook (return loop)
- Post-visit, customer returns → saved preferences pre-fill (last cut/treatment, `usual_provider`, notes)
- Available credit shown; applicable at booking subject to `redemption_cap`
- Books next appointment → cycle repeats (feeds North Star repeat-visit rate)

## Flow 9 — Birthday Offer
- System checks birthday date → automatic reminder + small offer notification (`type: birthday`, no linked appointment)
- Customer books using the offer → normal booking flow

## Flow 10 — Owner Dashboard (staff daily)
- User opens dashboard → sections shown are gated by their **access level** (`owner`/`manager`/`staff`)
- Today's schedule across both chairs + lash track
- Metrics: no-show rate, repeat-visit rate, utilization, referral activity, outstanding credit liability
- One-tap late/no-show marking (feeds Flows 4–5)

## Flow 11 — Admin Configuration (owner setup)
- **Access levels** → owner defines each staff/admin user's access level, gating which dashboard sections they see/act on
- **Staff & services** → owner adds a staff member, sets their schedule, and assigns the specific services they can perform (StaffService) — e.g. one barber trims only, another beard-only
- **Schedule & holidays** → owner sets working schedule and holiday/closure dates (removes bookable slots)
- **Services, packages & pricing** → owner creates services, bundles them into packages, defines add-ons, and sets each price; system auto-computes the customer's amount owed per booking
- **RFM cashback** → owner sets each of the three segment cashback rates; a nightly job re-segments customers
- **Promotions** → owner defines trigger-and-reward offers (see Flow 12)

## Flow 12 — Promotion Loop (return incentive)
- Owner defines a promotion (e.g. *after a first haircut, next visit gets a free beard/facial trim*)
- Customer completes the qualifying visit → PromotionGrant created (`granted`), offer message sent
- Customer books their next visit → promotion reward attached (e.g. add-on priced 0)
- On completion → grant flips to `redeemed`; reward applied
- Unused grants pass `expires_at` → `expired`

---

## Edge cases surfaced by these flows
- **Double-booking across two chairs** → prevented by the availability query filtering on staff role + slot conflict
- **Cancellation cascade** → freeing a slot re-triggers the waitlist check (terminates: each promotion moves toward an earlier-preferred slot)
- **No-show follow-up timing** → *(open question: rebook prompt vs. re-engagement)*
- **Claim window expiry** → needs `waitlist_claim_window_minutes` defined
- **Neither-choice-available** → never block; suggest nearest alternative times/dates
- **Staff assigned no matching service** → they never appear as a provider for that service (StaffService gate)
- **Holiday overlaps an existing booking** → closure removes future slots; existing appointments need manual handling by staff
- **Promotion + cashback stacking** → open question (does a promo reward also earn cashback?)
- **RFM re-segmentation mid-relationship** → cashback uses the segment current *at completion*; a nightly shift changes future rates only
# Data Model — Barbershop Booking Platform (MVP)

**Companion to:** PRD v0.8 · **Last updated:** July 8, 2026
**Scope:** Developer-ready expansion of PRD §8, covering all in-scope features through item 18 (per-barber service assignment).

---

## 1. Entities

### Client
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | string | |
| phone | string (E.164) | unique; identity key |
| birthday | date (nullable) | drives birthday offer |
| preferences | text (nullable) | free notes |
| usual_provider_id | FK → Staff (nullable) | preferred barber/lash specialist |
| referral_code | string | unique; auto-generated |
| referred_by_id | FK → Client (nullable) | who referred this client |
| credit_balance | decimal(10,2) | cache; source of truth = sum of CreditTransactions |
| preferred_channel | enum(`sms`,`whatsapp`) | default notification channel |
| rfm_segment_id | FK → CustomerSegment (nullable) | set by nightly RFM job; drives cashback rate |
| created_at / updated_at | timestamp | |

### Staff
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | string | legacy single-name fallback during identity backfill |
| first_name | string (nullable) | staff identity; completed by an administrator |
| last_name | string (nullable) | staff identity; completed by an administrator |
| email | string (nullable) | case-insensitively unique when present; private operational contact |
| phone | E.164 string (nullable) | private operational contact; validated when present |
| role | enum(`barber`,`lash_specialist`) | gates services performed |
| access_level | enum(`owner`,`manager`,`staff`) | dashboard permissions; `owner` sets others' levels |
| is_active | boolean | |
| created_at / updated_at | timestamp | |

*Access level gates dashboard sections (schedule, pricing, metrics, credit, customer data). `owner` is the only level that can edit other users' access.*

### StaffService
*Join — narrows the role gate to the specific services a staff member performs (PRD 18). A barber may be limited to trims only, another to beard-only.*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| staff_id | FK → Staff | |
| service_id | FK → Service | |
| **unique** (staff_id, service_id) | | one row per pairing |

### AvailabilityRule
*Replaces the "own availability calendar" blob so slot-conflict queries across the two chairs are tractable.*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| staff_id | FK → Staff | |
| day_of_week | integer 0–6 | |
| start_time / end_time | time | |
| effective_from / effective_to | date (nullable) | time-off overrides |

### HolidayClosure
*Admin-defined dates that remove bookable slots (PRD 13). Applies shop-wide or per staff.*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| staff_id | FK → Staff (nullable) | null = shop-wide closure |
| date | date | |
| reason | string (nullable) | e.g. holiday, time off |

### Service
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | string | |
| type | enum(`haircut`,`eyelash`) | the track |
| duration_minutes | integer | slot length |
| price | decimal(10,2) | listed price; credit basis |
| allowed_role | enum(`barber`,`lash_specialist`) | must match Staff.role |
| cashback_rate | decimal(5,4) (nullable) | per-service override; if null, uses the client's RFM-segment rate |
| is_package | boolean | true = this service bundles child services (see PackageItem) |
| is_addon | boolean | true = attachable to a base service/package (e.g. beard trim) |
| is_active | boolean | |

### PackageItem
*Join — which child services compose a package (PRD 16). Only rows where parent `Service.is_package = true`.*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| package_id | FK → Service | parent (is_package = true) |
| child_service_id | FK → Service | a service included in the package |

### Appointment
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| client_id | FK → Client | |
| staff_id | FK → Staff | |
| service_id | FK → Service | |
| starts_at / ends_at | timestamp | ends_at = starts_at + duration |
| status | enum (see §3) | |
| price_snapshot | decimal(10,2) | base service price at booking; stabilizes credit math |
| addons_snapshot | decimal(10,2) | sum of attached add-on prices at booking |
| credit_applied | decimal(10,2) | credit redeemed against this appt |
| amount_due | decimal(10,2) | auto-computed = price_snapshot + addons_snapshot − credit_applied (PRD 13) |
| booking_priority | enum(`first_choice`,`second_choice`) | which of the customer's two picks this booking represents |
| promotion_id | FK → Promotion (nullable) | if this booking redeems a promotion reward |
| completed_at | timestamp (nullable) | |
| created_at / updated_at | timestamp | |

### AppointmentAddon
*Join — add-ons attached to an appointment (PRD 16).*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| appointment_id | FK → Appointment | |
| service_id | FK → Service | the add-on (is_addon = true) |
| price_snapshot | decimal(10,2) | add-on price at booking |

### SlotWaitlist
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| client_id | FK → Client | |
| service_id | FK → Service | |
| staff_id | FK → Staff | |
| desired_starts_at | timestamp | the 1st-choice slot they're waiting on |
| fallback_appointment_id | FK → Appointment | their live 2nd-choice booking |
| status | enum(`waiting`,`notified`,`claimed`,`expired`,`cancelled`) | |
| notified_at | timestamp (nullable) | when slot_opened fired |
| claim_expires_at | timestamp (nullable) | notified_at + claim window |
| created_at / updated_at | timestamp | |

### Referral
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| referrer_id | FK → Client | |
| referred_id | FK → Client | unique |
| status | enum(`pending`,`credited`,`void`) | |
| qualifying_appointment_id | FK → Appointment (nullable) | referred's first completed appt |
| credited_at | timestamp (nullable) | |

### CreditTransaction
*Append-only ledger.*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| client_id | FK → Client | |
| amount | decimal(10,2) | signed: + earn, − redeem |
| reason | enum(`referral`,`cashback`,`redemption`,`manual`,`expiry`) | |
| appointment_id | FK → Appointment (nullable) | source/target |
| created_at | timestamp | |
| expires_at | timestamp (nullable) | if expiry enabled |

### Notification
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| appointment_id | FK → Appointment (nullable) | null for birthday |
| client_id | FK → Client | |
| type | enum(`24h`,`1h`,`no_show_followup`,`birthday`,`slot_opened`) | |
| channel | enum(`sms`,`whatsapp`) | |
| status | enum(`queued`,`sent`,`failed`) | |
| provider_message_id | string (nullable) | Twilio/WhatsApp ref |
| scheduled_for / sent_at | timestamp | |

*Notification `type` gains `feedback_request` (post-completion) and `promotion` (offer message).*

### Feedback
*Captured after an appointment completes (PRD 14). Capture only — no staff alerting in MVP.*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| appointment_id | FK → Appointment | unique |
| client_id | FK → Client | |
| rating | integer (nullable) | scale TBD (PRD open q) |
| comment | text (nullable) | |
| created_at | timestamp | |

### CustomerSegment
*Three RFM segments (PRD 15). Rows are config; `Client.rfm_segment_id` points here. Recomputed nightly.*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | string | e.g. `high`, `mid`, `low` |
| cashback_rate | decimal(5,4) | rate applied to clients in this segment |
| rank | integer | ordering / boundary reference |

### Promotion
*Trigger-and-reward offers (PRD 17), e.g. free add-on on the visit after a first haircut.*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | string | |
| trigger_type | enum(`first_completed_service`,`nth_visit`,`manual`) | what qualifies a client |
| trigger_service_id | FK → Service (nullable) | e.g. first *haircut* |
| reward_type | enum(`free_addon`,`fixed_credit`,`percent_off`) | |
| reward_service_id | FK → Service (nullable) | the free add-on granted |
| reward_amount | decimal(10,2) (nullable) | for credit/percent rewards |
| is_active | boolean | |
| expires_at | timestamp (nullable) | |

### PromotionGrant
*Tracks a promotion earned by a client and its redemption.*

| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| promotion_id | FK → Promotion | |
| client_id | FK → Client | |
| status | enum(`granted`,`redeemed`,`expired`) | |
| earned_appointment_id | FK → Appointment | the qualifying visit |
| redeemed_appointment_id | FK → Appointment (nullable) | where it was used |
| expires_at | timestamp (nullable) | |

---

## 2. Relationships

- Client **1—N** Appointment, CreditTransaction, Notification, SlotWaitlist, Feedback, PromotionGrant
- Client **1—N** Client (self-ref via `referred_by_id`); Client **1—1** Referral as referred
- Client **N—1** CustomerSegment (via `rfm_segment_id`)
- Staff **1—N** Appointment, AvailabilityRule, SlotWaitlist, HolidayClosure; Staff **N—N** Service via StaffService
- Staff.role **must equal** Service.allowed_role, **and** a matching StaffService row must exist, on any Appointment or SlotWaitlist
- Service **1—N** Appointment, SlotWaitlist; Service **N—N** Service via PackageItem (package↔children) and AppointmentAddon (appt↔add-ons)
- Appointment **1—N** CreditTransaction, Notification, AppointmentAddon; Appointment **1—1** Feedback
- Appointment **1—1** SlotWaitlist via `fallback_appointment_id` (a 2nd-choice booking backs at most one waitlist row)
- Promotion **1—N** PromotionGrant; PromotionGrant links earned/redeemed Appointments

---

## 3. State logic

### Appointment status
```
booked ──cancel───────────────▶ cancelled      ⟶ triggers waitlist check on freed slot
booked ──complete─────────────▶ completed       ⟶ triggers credit writes
booked ──staff marks no-show──▶ no_show          ⟶ triggers no_show_followup
booked ──staff marks late─────▶ late_released    (slot freed; record kept)
```
No auto timer — `no_show` / `late_released` are staff-triggered only.

### SlotWaitlist status
```
waiting  ──1st-choice slot's appt cancelled──▶ notified   (slot_opened fires; claim_expires_at set)
notified ──customer claims within window────▶ claimed     (fallback appt promoted to desired_starts_at; old slot freed)
notified ──window elapses─────────────────────▶ expired     (slot released to next waiter / general availability)
waiting/notified ──fallback appt cancelled──▶ cancelled
```

### Waitlist trigger — on any `booked → cancelled`
1. Find `SlotWaitlist` rows where `desired_starts_at` + `staff_id` + `service_id` match the freed slot and status = `waiting`.
2. Per open question (notify-only; cap likely one waiter for MVP): set the matching row to `notified`, stamp `notified_at` and `claim_expires_at`, fire a `slot_opened` Notification.
3. **On claim:** promote `fallback_appointment_id` — set its `starts_at`/`ends_at` to the desired slot, `booking_priority = first_choice`; free the old 2nd-choice slot (which itself re-runs step 1). Set waitlist `claimed`.
4. **On expiry:** set `expired`; re-run step 1 for the next `waiting` row if depth > 1.

> **Termination note:** the claim ripple in step 3 (claiming a slot frees another, re-triggering the waitlist check) terminates because each promotion moves strictly toward an earlier-preferred slot.

### Credit writes — fire only on `booked → completed`
1. **Cashback** — rate = `Service.cashback_rate` if set, else the client's `CustomerSegment.cashback_rate` (RFM). Basis = price_snapshot + addons_snapshot. CreditTransaction(`cashback`, +basis × rate, appointment_id).
   - **Promotion check** — if this completion satisfies a Promotion `trigger_type`, insert a PromotionGrant (`granted`) for the client. If the appointment redeemed a granted promotion, mark that grant `redeemed` and apply its reward (free add-on = add-on priced 0 / fixed credit / percent off).
2. **Referral** — if client is a `referred_id` on a `pending` Referral **and** this is their first completed appt: set Referral `credited`, link qualifying appt, insert **two** `referral` CreditTransactions (referrer + referred, fixed amount).
3. Recompute `credit_balance`.
4. **Feedback request** — fire a `feedback_request` Notification to the client (capture only).

### Redemption
`credit_applied` ≤ min(credit_balance, price_snapshot × redemption_cap%); insert CreditTransaction(`redemption`, −credit_applied). Shop settles remainder off-product.

---

## 4. Two-track separation + per-staff service assignment
Enforced by `Service.type` + `Service.allowed_role` + `Staff.role`, **now narrowed by StaffService**. The availability query filters candidate slots (and waitlist matches) to staff who (a) have a role matching the service's allowed_role **and** (b) have a StaffService row for that specific service, minus HolidayClosure dates. Haircut and eyelash pools never overlap, and within a track a barber only appears for the services they're assigned.

---

## 5. Config — CreditPolicy
*Single settings row; values TBD (PRD §9–10).*

| Setting | Notes |
|---|---|
| default_cashback_rate | per-service `cashback_rate` overrides this |
| referral_fixed_amount | fixed credit per referral, each side |
| redemption_cap_pct | max % of price redeemable per appt |
| credit_expiry_days | nullable — off if unset |
| waitlist_claim_window_minutes | how long a freed slot is held for the notified customer |
| waitlist_depth_cap | max waiters per slot (e.g. 1 for MVP) |

## 6. Nightly RFM job
A scheduled job recomputes each client's Recency / Frequency / Monetary from completed-appointment history, maps them to one of the three `CustomerSegment` rows, and updates `Client.rfm_segment_id`. Cashback at completion reads the client's then-current segment rate (unless the service overrides). Segment boundaries are TBD (PRD open q).

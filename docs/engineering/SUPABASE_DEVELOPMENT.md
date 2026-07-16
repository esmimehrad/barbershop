# Progress Report — Barbershop Booking Platform

**Date:** July 13, 2026
**Project:** Barbershop Booking Platform MVP
**Phase:** Backend infrastructure (Supabase)

---

## Summary

The Supabase backend for the barbershop booking platform is fully scaffolded. All tables, relationships, enum types, triggers, functions, row-level security policies, and indexes are deployed and live. The database is on a clean Postgres 17 instance with zero data — ready for seed data and frontend development.

---

## What's Done

### Supabase Project

- **Project:** `barbershop`
- **Region:** us-east-2
- **Status:** ACTIVE_HEALTHY
- **Database:** Postgres 17.6
- **URL:** `https://umarerwvbsqokekotfbw.supabase.co`

### Migrations Applied (11 total)

| # | Migration | What it does |
|---|---|---|
| 001 | `extensions_and_enums` | Enabled `pg_cron`, `moddatetime`; created 16 enum types |
| 002 | `core_tables` | `client`, `staff`, `service`, `customer_segment` |
| 003 | `staff_configuration` | `staff_service`, `staff_availability`, `holiday_closure`, `staff_calendar_token`, `external_busy_block`, `package_item` |
| 004 | `appointments` | `promotion`, `appointment`, `appointment_addon` |
| 005 | `credit_referral_notifications` | `credit_transaction`, `referral`, `notification` |
| 006 | `feedback_grants_gallery` | `feedback`, `promotion_grant`, `staff_gallery_image` |
| 007 | `credit_policy` | Singleton config table with default values seeded |
| 008 | `rls_policies` | Auth linkage (`user_id` on client/staff), 3 RLS helper functions, ~30 policies across all tables |
| 009 | `functions_and_triggers` | 6 trigger functions for business logic automation |
| 010 | `indexes` | 11 performance indexes on critical query paths |
| 011 | `staff_identity_fields` | Adds nullable first name, last name, email, and E.164 phone fields; lowercased email uniqueness |

### Tables (20)

All tables have RLS enabled.

| Category | Tables |
|---|---|
| Core | `client`, `staff`, `service`, `customer_segment` |
| Staff config | `staff_service`, `staff_availability`, `holiday_closure`, `staff_calendar_token`, `external_busy_block` |
| Services | `package_item` |
| Booking | `appointment`, `appointment_addon` |
| Financial | `credit_transaction`, `referral`, `credit_policy` |
| Notifications | `notification` |
| Engagement | `feedback`, `promotion`, `promotion_grant` |
| Landing page | `staff_gallery_image` |

### Database Functions (9)

| Function | Type | Purpose |
|---|---|---|
| `generate_referral_code()` | Trigger | Auto-generates `FADE-XXXXXX` on client insert |
| `compute_amount_due()` | Trigger | Auto-computes `price + addons - credit` |
| `recompute_credit_balance()` | Trigger | Recalculates balance after every credit transaction |
| `on_appointment_completed()` | Trigger | Fires cashback + referral credit writes atomically on completion |
| `prevent_double_booking()` | Trigger | Blocks overlapping appointments per staff member |
| `enforce_two_track()` | Trigger | Validates staff role + StaffService assignment |
| `current_client_id()` | RLS helper | Resolves `auth.uid()` → client ID |
| `current_staff_id()` | RLS helper | Resolves `auth.uid()` → staff ID |
| `current_staff_access_level()` | RLS helper | Resolves `auth.uid()` → access level enum |

### Row-Level Security

- **Public read:** services, staff, availability, holidays, packages, segments, promotions, gallery, busy blocks
- **Client (authenticated):** own profile, appointments, credit, referrals, notifications, feedback, promotion grants
- **Staff:** all appointments (read/update), all clients (read), feedback
- **Manager+:** credit transactions, credit policy, notifications, referrals
- **Owner/Manager:** full CRUD on services, staff config, availability, holidays, promotions, gallery, packages, calendar tokens, busy blocks
- **Owner only:** staff management, customer segments, credit policy

> **Release blocker:** `staff` is publicly readable, so its `email` and `phone` fields are currently publicly readable too. Restrict the contact fields behind an owner/manager-only read path before storing non-test contact data.

### Credit Policy (seeded)

| Setting | Default Value | Status |
|---|---|---|
| `default_cashback_rate` | 5% | Placeholder — awaiting decision |
| `referral_fixed_amount` | $5.00 | Placeholder — awaiting decision |
| `redemption_cap_pct` | 40% | Placeholder — awaiting decision |
| `credit_expiry_days` | null (no expiry) | Awaiting decision |

---

## What's Excluded (by design)

- **SlotWaitlist** — cut from MVP for complexity
- **`booking_priority`** field — removed with waitlist
- **`slot_opened`** notification type — removed with waitlist
- **Payment integration** — shop handles money directly
- **AI phone/SMS agent** — deferred entirely

---

## What's Next

### Immediate

1. **Seed data** — insert Marco, Sami, Lena as staff; create the shop's services and packages; populate the three RFM customer segments
2. **Auth configuration** — enable phone OTP auth in Supabase dashboard; wire `user_id` linkage on signup
3. **Edge functions** — notification dispatch (Twilio SMS/WhatsApp), nightly RFM re-segmentation, Google reviews cache

### Frontend

4. **Scaffold Next.js app** with Supabase client
5. **Booking flow** (Flow 1 — P0): service → add-ons → provider → time → review → confirmed
6. **Admin dashboard** (Flow 10 — P0): schedule view, one-tap marking, metrics

### Still Blocking (open questions from PRD §10)

| Question | Blocks |
|---|---|
| RFM segment boundaries + per-segment cashback rates | Seed data, FS-13 |
| `redemption_cap_pct` + `referral_fixed_amount` final values | FS-6, FS-9 |
| Permission matrix (owner/manager/staff) — what each sees | FS-10, FS-11 |
| Feedback rating scale (1–5 assumed, not confirmed) | FS-12 |
| Whether promotion rewards also earn cashback | FS-14 |
| Brand name: Fadehouse vs. Caesar | All visual work |
| Credit application: automatic or opt-in at booking | FS-6 |

---

## Architecture Reference

```
┌─────────────────┐     ┌──────────────────┐
│  Next.js App    │────▶│  Supabase        │
│  (Vercel)       │     │                  │
│                 │     │  ├─ Postgres 17   │
│  • Booking flow │     │  ├─ Auth (OTP)    │
│  • Admin dash   │     │  ├─ RLS policies  │
│  • Landing page │     │  ├─ Edge Functions│
└─────────────────┘     │  └─ pg_cron       │
                        └──────────────────┘
                              │
                    ┌─────────┼─────────┐
                    ▼         ▼         ▼
              ┌─────────┐ ┌───────┐ ┌────────┐
              │ Twilio   │ │Google │ │Resend/ │
              │ SMS/WA   │ │Cal API│ │Brevo   │
              └─────────┘ └───────┘ └────────┘
```

**Estimated monthly cost:** $35–65 at launch scale (<300 customers)

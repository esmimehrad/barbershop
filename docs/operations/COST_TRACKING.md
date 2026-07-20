# Application Cost Tracking

**Purpose:** one living ledger of every cost for the Barbershop platform — recurring subscriptions, usage-based charges, and one-time / prepaid top-ups. Update this whenever a charge occurs or a plan changes.

**Last updated:** 2026-07-17

---

## 1. Providers overview

| Provider | Used for | Billing model | Status | Est. monthly |
|---|---|---|---|---|
| **Supabase** | DB · Auth · RLS · edge functions · cron | Subscription (Free → Pro) | Live (Free) | $0 → $25 at launch |
| **Resend** | Transactional email | Usage (free tier generous) | Live | ~$0 at this volume |
| **Twilio** | SMS + WhatsApp (reminders + phone OTP) | **Prepaid balance** + usage | Funding added | ~$10–40 usage |
| **Vercel** | Hosting | Subscription (Free → Pro) | Not deployed yet | $0 (free tier) |
| **Google APIs** | Calendar sync · Places reviews | Usage (largely free tier) | Not integrated | ~$0 |
| **Google One (AI Pro)** | AI Pro plan · 5 TB storage (dev/AI tooling) | Subscription (monthly) | Live | ~CA$7.67 |
| **Microsoft Graph** | Calendar sync | Usage | Not integrated | ~$0 |

*Payments/Stripe are intentionally out of scope — the shop settles money off-product.*

---

## 2. Charge ledger (actual)

| Date | Provider | Description | Type | Amount | Notes |
|---|---|---|---|---|---|
| 2026-07-13 | Twilio | Account funding — credit card ending 1143 | One-time (prepaid) | +$20.00 | Brings prepaid balance to $20.00. |
| 2026-07-13 | Twilio | Phone number rental — +1 (647) 697-6531 (Local, ON Canada; SMS/MMS/Voice) | Recurring (~$1.15/mo, drawn from balance) | −$1.15 | Balance now **$18.85**. `TWILIO_FROM` sender. |
| 2026-07-16 | Google One | Google AI Pro (5 TB) (Google One) — monthly plan | Recurring (subscription) | −CA$7.67 | Direct card charge, 7:12 PM. Item CA$6.79 + CA$0.88 tax. Amount in **CAD** (other rows are USD). First charge. |

**Totals to date**
- One-time / prepaid funded: **$20.00**
- Recurring (monthly): **~$1.15** (Twilio number rental) + **CA$7.67** (Google One AI Pro) + Supabase Pro ($25) once at launch scale.
- Twilio balance remaining: **$18.85** (draws down further per SMS sent).

---

## 3. Budget reference

From `docs/engineering/STACK_RECOMMENDATION-v0_0_1.md`:
- **Target:** $50–150 / month.
- **Estimated at launch (<300 customers):** ~$35–65 / month.

Watch as usage grows: Supabase Pro ($25) kicks in at launch scale, and Twilio SMS/WhatsApp is the main variable cost.

---

## 4. How to log a charge
Add a row to §2 with: date · provider · what it was · type (`recurring` / `usage` / `one-time`/`prepaid`) · amount · notes. Update the totals and `Last updated`. Keep receipts in each provider's dashboard (this file just tracks the running record).

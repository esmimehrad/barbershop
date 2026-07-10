# PRD: Barbershop Booking Platform — MVP

**Status:** Draft v0.8 · **Owner:** [you] · **Last updated:** July 8, 2026

## 1. Problem
A two-chair, two-barber shop (plus a separate eyelash specialist) relies on repeat customers, but bookings, reminders, and client history are managed manually — causing no-shows, lost regulars, and no visibility into whether customers return.

## 2. Goal
Fill the chairs and bring customers back. Ship the smallest product that makes booking effortless, minimizes no-shows through reminders and a clear late policy, makes regulars feel known, and gives customers a reason to return (credit) and to refer others. **Payment is handled by the shop, outside the product.**

## 3. Success metric
**North Star: repeat-visit rate** — % returning within 6 weeks.

Supporting: no-show rate ↓, chair utilization ↑, referred-customer count ↑, credit redemption rate.

## 4. Target users
- **Customer** — books a haircut or eyelash appointment from a phone; earns and spends credit. Pays the shop directly, however the shop prefers.
- **Owner/Staff** — sees the schedule, manages no-shows/late arrivals, knows the regulars, tracks credit and referrals.

## 5. In scope (MVP)
1. **Booking** — pick service, provider, available time. One engine, **two separate availability tracks** (haircut vs. eyelash).
2. **Eyelash as separate track** — own specialist, own availability, own duration/price; bookable standalone.
3. **Notification lifecycle** (SMS + WhatsApp via Twilio + WhatsApp Business API):
   - 24h before — reminder (confirm / cancel)
   - 1h before — reminder + **late-policy notice** (10-min grace window)
   - Post-no-show — follow-up / re-engagement message
4. **Late policy (10-min grace)** — communicated in the 1h reminder; **staff-triggered release** — barber marks late/no-show from the dashboard to free the slot (no automatic timer).
5. **Saved client preferences** — last cut/treatment, notes, usual provider.
6. **Birthday offer** — automatic reminder + small offer.
7. **Referral (credit)** — shareable code; both parties get fixed credit when the referred customer *completes* their first appointment.
8. **Cashback loyalty (credit)** — a % of the completed service's price is returned as credit. Single wallet.
9. **Credit redemption** — credit is spendable on **services only**, subject to a redemption cap; the system records credit applied, the shop settles any remainder directly.
10. **Owner dashboard** — today's schedule, no-show rate, repeat-visit rate, utilization, referral activity, outstanding credit liability, one-tap late/no-show marking.
11. **Priority-slot waitlist** — when booking, a customer may define **two preferred time slots ranked by priority (1st, 2nd choice)**. If the 1st choice is available, they're booked into it. If the 1st choice is already taken by another customer, they're booked into their 2nd choice **and** placed on a waitlist for the 1st. If the customer holding the 1st-choice slot later cancels, the waitlisted customer is **notified** that it opened up and can claim it (notify-only; slot is not auto-reassigned — first to claim wins). Claiming moves their booking from 2nd → 1st choice and frees the 2nd-choice slot. If **neither** choice is free, the system never blocks — it suggests the nearest alternative times/dates.
12. **Admin roles & access levels** — multiple admin/staff users; a top-level admin defines each user's **access level**, gating which parts of the dashboard they can see/act on (schedule, pricing, metrics, credit, customer data).
13. **Admin-defined schedule, holidays & pricing** — admin sets working schedule and holiday/closure dates (which remove bookable slots) and sets service prices. The system **auto-computes the amount owed** by the customer per appointment (price + add-ons − credit applied); the shop still settles money off-product.
14. **Post-session feedback** — after an appointment completes, an automatic message asks the customer how the session felt. Response is captured (rating/comment); no staff alerting in MVP.
15. **RFM customer segmentation → tiered cashback** — customers are grouped into **three segments** via RFM (Recency, Frequency, Monetary), recomputed **nightly**. Each segment maps to a different cashback rate.
16. **Services, packages & add-ons** — admin creates the business's services and sets each price. Services can be **bundled into packages**, and an **add-on** (e.g. beard trim) can be attached to a base service/package at booking. Credit/cashback math uses the combined price.
17. **First-visit / return promotions** — admin defines a promotion triggered by a qualifying visit (e.g. after a first haircut, the customer's *next* visit earns a free add-on such as a beard/facial trim). Redeemed on a later booking.
18. **Per-barber service assignment** — admin adds a staff member, defines their schedule, and restricts **which specific services** they can perform (one barber does trims only, another beard-only). Narrower than the role gate: availability is filtered to staff who both match the service role **and** are assigned that service.

## 6. Out of scope (parked)
**All payment handling / deposits** *(shop manages money itself)*, membership/subscription, punch card, VIP tiers, spend-credit-on-products, product marketplace, affiliate links, Instagram plan, van/B2B, branches, AI try-on, eyelash couple's packages.

*Note: general service **packages/add-ons** and **tiered (RFM) cashback** are now in scope (items 15–17); only the parked items above remain out.*

## 7. Architecture (locked)
- Option B booking (one engine, separate availability tracks).
- Web app first (responsive). Native app parked.
- **No payment integration.** Reminders: Twilio (SMS) + WhatsApp Business API.
- Build & own: booking engine, client records, referral, credit wallet, eyelash track, notification lifecycle, dashboard, branding.

## 8. Core data model
- **Client** — name, phone, birthday, preferences/notes, referral code, referred-by, credit_balance, **rfm_segment**
- **Staff** — name, role (`barber` | `lash_specialist`), working hours, own availability calendar, **access_level**
- **StaffService** — join: which specific services each staff member can perform (narrows the role gate)
- **Service** — name, type (`haircut` | `eyelash`), duration, price, allowed role, cashback_rate, **is_package**, **is_addon**
- **PackageItem** — join: which services compose a package (parent service ↔ child services)
- **Appointment** — client + staff + service + time + status (booked / completed / no-show / late-released / cancelled) + **add-ons** + **amount_due** (auto-computed)
- **Feedback** — appointment + client + rating + comment (captured after completion)
- **CustomerSegment / RFM config** — three segments, each with a cashback rate; recomputed nightly
- **Promotion** — trigger condition (e.g. first completed haircut) + reward (e.g. free add-on next visit) + redemption tracking
- **Holiday / Closure** — dates that remove bookable slots
- **Referral** — referrer + referred client + status; reward = fixed credit on referred's *first completed* appointment
- **CreditTransaction** — client + amount (+/−) + reason (`referral` | `cashback` | `redemption` | `manual`) + linked appointment + timestamp
- **Notification** — appointment + type (`24h` | `1h` | `no_show_followup` | `birthday` | `slot_opened`) + channel (`sms` | `whatsapp`) + status (sent / failed) + timestamp
- **SlotWaitlist** — client + service + staff + desired_time (the 1st-choice slot) + linked fallback appointment (their 2nd-choice booking) + status (`waiting` | `notified` | `claimed` | `expired` | `cancelled`) + timestamps. When the 1st-choice slot's blocking appointment is cancelled, matching `waiting` rows flip to `notified` and a `slot_opened` notification fires; a claim promotes the fallback appointment to the desired time and frees the old slot.

*Note: credit is calculated from the **service's listed price**, so no payment data is stored.*

## 9. Credit policy (configurable)
Earn rate (TBD), granted on completion only, redemption cap (TBD), optional expiry (TBD). Credit basis = service listed price.

## 10. Open questions
- Credit policy numbers (earn rate, cap, expiry); referral credit amount.
- No-show follow-up wording/goal — re-book prompt, or re-engagement?
- Credit basis — confirm **service listed price** is acceptable (vs. staff entering actual amount paid, which would reintroduce a manual money step).
- Priority-slot waitlist — confirm **notify-only manual claim** (vs. auto-reassign to first waitlister). Define a **claim window** (how long the slot is held for the notified customer before it's released to the next in line / general availability). Decide whether the waitlist depth is capped (e.g. one waiter per slot for MVP). *(Neither-choice-available resolved: never block — suggest nearest alternatives.)*
- RFM segmentation — define the **three segment boundaries** (recency/frequency/monetary thresholds) and each segment's cashback rate.
- Promotions — define the initial promotion rules (trigger conditions, rewards, expiry). Whether a promotion reward stacks with cashback.
- Access levels — define the concrete permission set / named roles (e.g. owner, front-desk, barber) and what each can see.
- Feedback — define the rating scale and whether the ask is one message or a short form.

## 11. Risk — no-show exposure
With no deposits (payment is out of scope), no-show defense relies entirely on the reminder lifecycle + 10-min late policy + no-show follow-up. **Monitor no-show rate as a launch-critical metric.** If it climbs, the shop can add its own deposit process outside the product, or a manual "confirm to hold" step could be added later.
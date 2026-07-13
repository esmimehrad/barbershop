# Stack Recommendation — Barbershop Booking Platform (MVP)

**Companion to:** PRD v0.8 · Data Model v0.0.2 · User Flows v0.0.2 · Feature Specs v0.0.1
**Status:** Draft v0.0.1 · **Last updated:** July 10, 2026
**Constraints:** Web-only · under 300 customers · $50–150/mo · priorities: speed → cost → customizability

---

## 1. Recommended stack

| Layer | Recommendation | MVP cost |
|---|---|---|
| Frontend | You + Claude Code (React / Next.js) | $0 |
| Booking engine | Build in Supabase (not a 3rd-party scheduler) | $0 |
| Backend · DB · Auth · Cron | Supabase (Postgres + `pg_cron` + RLS) | $0 → $25/mo at launch |
| Calendar sync | Google Calendar API + Microsoft Graph API (direct) | $0 |
| SMS + WhatsApp | Twilio (or Plivo, ~40% cheaper) | ~$10–40/mo usage |
| Transactional email | Resend (or Brevo) | ~$0 at this volume |
| Hosting | Vercel / Netlify | $0 (free tier) |
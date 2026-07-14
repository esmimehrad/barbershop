# lib/sms/ — Twilio messaging (SMS + WhatsApp)

Server-only Twilio Messages client. `twilio.ts` exports `sendSms({ to, body })` and `sendWhatsApp({ to, body })` via the REST API (raw fetch, no SDK dependency).

## Rules
- **Secrets only:** `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY_SID`, `TWILIO_API_KEY_SECRET`, `TWILIO_FROM` from the server env — never `NEXT_PUBLIC_`, never hardcoded. App auth uses the **API key** (not the account Auth Token).
- Import only from server code (Server Actions / server modules). Never a Client Component.
- Sending is **best-effort** — a failure must not block the core action (a booking still succeeds if the SMS fails).
- `TWILIO_TEST_RECIPIENT` (dev) redirects all SMS to one number until real client numbers are used; remove it for production.
- `to` must be E.164 (`+1…`). Client phone numbers already are; `sendWhatsApp` adds the `whatsapp:` prefix.
- **WhatsApp templates:** free-form WhatsApp only reaches a user inside a 24h session. Business-initiated notifications (reminders/confirmations) need an **approved template** (`ContentSid`) — add that before wiring WhatsApp into automated flows.

## Later
Reminders/notifications move into a Supabase edge function + `pg_cron`, logging to the `notification` table. This module is the SMS/WhatsApp primitive those paths reuse.

See `lib/CLAUDE.md`.

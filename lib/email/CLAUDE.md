# lib/email/ — transactional email (Resend)

Server-only Resend client. `resend.ts` exports `sendEmail({ to, subject, html, from? })`.

## Rules
- **Secret only:** reads `RESEND_API_KEY` from the server env — never `NEXT_PUBLIC_`, never hardcoded.
- Import only from server code (Server Actions / server modules). Never from a Client Component.
- Callers treat sending as **best-effort**: a failure must not block the core action (e.g. a booking still succeeds if the email fails).
- `RESEND_TEST_RECIPIENT` (dev) redirects all mail to one inbox until a domain is verified in Resend; remove it once real recipient addresses + a verified sender domain exist.

## Later
Long-term, transactional dispatch (reminders, confirmations) moves into a Supabase edge function that also logs to the `notification` table (see `SUPABASE_DEVELOPMENT.md`). This module can call or be replaced by it without changing callers.

See `lib/CLAUDE.md`.

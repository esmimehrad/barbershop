# app/auth/ — authentication

Production phone-OTP sign-in screens plus first-time customer onboarding.

## Rules
- Use Supabase native phone OTP (`signInWithOtp` → `verifyOtp`) over Twilio — no custom OTP storage or verification logic.
- On sign-in, the user is linked to a `client` or `staff` row via `user_id`; `getSessionContext()` resolves it.
- Auth mutations live in `lib/actions/auth.ts`.
- Pending phone and return path use short-lived HTTP-only cookies; never put the phone in the URL.
- New phone identities create customer profiles only after OTP verification. Staff must be pre-provisioned in `staff` + `staff_contact`.

See `app/CLAUDE.md`.

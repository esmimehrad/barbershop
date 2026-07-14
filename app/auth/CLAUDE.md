# app/auth/ — authentication

Sign-in screens. Currently a **dev stub** (`dev/`); real phone OTP replaces it in the hardening pass.

## Rules
- Production target: Supabase native phone OTP (`signInWithOtp` → `verifyOtp`) over Twilio — build only the phone/code screens, no custom OTP logic.
- On sign-in, the user is linked to a `client` or `staff` row via `user_id`; `getSessionContext()` resolves it.
- Auth mutations live in `lib/actions/auth.ts`.

See `app/CLAUDE.md`.

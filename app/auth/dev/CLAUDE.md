# app/auth/dev/ — DEV-ONLY sign-in

Preset "sign in as …" buttons for the seeded users (Ray / Marco / Sami), using a shared dev password via `devSignIn` in `lib/actions/auth.ts`.

## Rules
- **Throwaway.** Delete this route (and `supabase/dev_auth.sql`) when phone OTP ships.
- Real Supabase email/password sessions → real RLS + access-level gating are exercised.
- Requires the Email auth provider enabled in the Supabase dashboard.

See `app/auth/CLAUDE.md`.

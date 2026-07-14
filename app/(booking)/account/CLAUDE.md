# app/(booking)/account/ — customer account

`/account`: credit balance, referral code, appointment history, rebook.

## Rules
- Requires a client session (`getSessionContext().clientId`), else redirect to `/auth/dev`.
- Reads via `lib/data/` (clients, appointments); RLS returns only the signed-in client's rows.
- Rebook links back into `/book`.

See `app/(booking)/CLAUDE.md`.

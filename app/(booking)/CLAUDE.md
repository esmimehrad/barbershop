# app/(booking)/ — customer surface

Booking wizard (`/book`) and the customer account (`/account`). Phone-primary (`max-w-md`).

## Rules
- Dynamic (per-user, cookie session). In production, gated behind phone OTP; for the draft, `/auth/dev`.
- `/account` requires a client session (redirects otherwise).
- Wizard logic lives in `features/booking/`; this folder just hosts the routes + layout.

See `app/CLAUDE.md`.

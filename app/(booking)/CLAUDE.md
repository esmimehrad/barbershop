# app/(booking)/ — customer surface

Booking wizard (`/book`) and the customer account (`/account`). Phone-primary (`max-w-md`).

## Rules
- Dynamic (per-user, cookie session). Confirmation and account access are gated behind phone OTP at `/auth`.
- `/account` requires a client session (redirects otherwise).
- Wizard logic lives in `features/booking/`; this folder just hosts the routes + layout.

See `app/CLAUDE.md`.

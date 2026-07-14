# features/booking/ — booking wizard

The 6-step flow (service → add-ons → provider → time → review → confirmed).

## Files
- `params.ts` — parse/build the wizard state from the **URL** (the single source of truth) + step list.
- `Stepper.tsx` — progress indicator.
- `steps.tsx` — the step components (server components).

## Rules
- **URL is the state.** Selections live in searchParams so deep-links, Back, and refresh all work.
- Track separation is enforced at entry — a haircut flow never surfaces eyelash providers.
- Reads via `lib/data/`; the final write is `bookAppointment` in `lib/actions/booking.ts`.
- Keep steps server-rendered; no client state unless a step truly needs it.

See `features/CLAUDE.md`.

# features/schedule/ — dashboard schedule

Staff-facing schedule interactions.

## Files
- `RowActions.tsx` — **client** component: one-tap complete / late / no-show for a booked appointment.

## Rules
- Calls `lib/actions/appointments.ts`; the DB trigger fires credit writes on completion.
- Destructive actions (late-release, no-show) confirm first.
- Buttons stay ≥44px and disable while the action is pending.

See `features/CLAUDE.md`.

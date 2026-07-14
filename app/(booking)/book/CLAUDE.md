# app/(booking)/book/ — booking route

Hosts the wizard's catch-all route `[[...step]]`. The page switches on the step segment and renders the matching component from `features/booking/steps.tsx`.

## Rules
- Selections travel in the URL (searchParams), not local state.
- Keep this thin — logic belongs in `features/booking/`.

See `app/(booking)/CLAUDE.md`.

# dashboard/settings/ — admin configuration

`/dashboard/settings`: the config hub (access levels, staff & services, schedule & holidays, services & pricing, promotions, gallery).

## Rules
- Low-fi: services/pricing read live; the other tabs are wireframe placeholders — editing is wired in a later pass.
- Admin-only sections gate on `canSee(level, "staff_admin")` (owner).
- When editing lands here, mutate via `lib/actions/` (validate → authorize → DB → revalidate).

See `app/(dashboard)/dashboard/CLAUDE.md`.

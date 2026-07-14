# features/admin-config/ — settings tabs

The staff/owner configuration surface (`/dashboard/settings`), one component per tab:
`access-levels`, `staff-services`, `schedule`, `services`, `rfm`, `promotions`.

## Files
- `action-form.tsx` — **client** island: `<ActionForm>` wraps a Server Action
  (`useActionState`) and shows its `{ ok, error }`; `<SubmitButton>` reads
  `useFormStatus` for pending state. Every tab form goes through this.
- `*-tab.tsx` — **server** components; receive pre-fetched data as props from
  `settings/page.tsx`, render forms that post to `lib/actions/admin.ts`.

## Rules
- Reads via `lib/data/admin.ts`; writes via `lib/actions/admin.ts` — never Supabase directly.
- Actions authorize with `canSee()`: `config_admin` (owner+manager) for most,
  `access_admin` (owner) for access levels. Belt-and-suspenders over RLS.
- Tabs are server-first; the only client code is `action-form.tsx`.

## Placeholders (open product decisions — flagged in code)
- Add-ons are **not** gated in staff-services (staff_service add-on gating is `[OPEN]`).
- Package price is set directly, not derived from children (FS-1.3 `[OPEN]`).
- Permission matrix is the placeholder in `lib/auth.ts` (FS-10.5 `[OPEN]`).

See `features/CLAUDE.md`.

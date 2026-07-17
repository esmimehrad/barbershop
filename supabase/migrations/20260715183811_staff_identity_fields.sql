-- 011_staff_identity_fields
-- Applied to the hosted development project on 2026-07-15. Kept here so a
-- fresh environment can reproduce the schema through the normal migration flow.

alter table public.staff
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists email text,
  add column if not exists phone text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.staff'::regclass
      and conname = 'staff_phone_e164_check'
  ) then
    alter table public.staff
      add constraint staff_phone_e164_check
      check (phone is null or phone ~ '^\+[1-9][0-9]{1,14}$');
  end if;
end;
$$;

-- Auth-backed staff can safely inherit their login email. Names remain null
-- until an administrator supplies them; this migration never derives names.
update public.staff as staff
set email = auth_user.email
from auth.users as auth_user
where staff.user_id = auth_user.id
  and staff.email is null
  and auth_user.email is not null;

create unique index if not exists staff_email_lower_unique
  on public.staff (lower(email))
  where email is not null;

-- 012_staff_contact_pii
-- Applied to the hosted development project on 2026-07-15.
--
-- Staff email/phone were publicly readable via the "Public: read active staff"
-- row policy (RLS can't mask columns, and customers + staff share the
-- `authenticated` role). Move that PII into a separate staff_contact table whose
-- RLS restricts reads to owner/manager or the staff member themselves.

create table if not exists public.staff_contact (
  staff_id   uuid primary key references public.staff(id) on delete cascade,
  email      text,
  phone      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_contact_phone_e164_check
    check (phone is null or phone ~ '^\+[1-9][0-9]{1,14}$')
);

-- Case-insensitive email uniqueness when present (NULLs unconstrained).
create unique index if not exists staff_contact_email_lower_unique
  on public.staff_contact (lower(email))
  where email is not null;

-- Carry existing contact values across before dropping the source columns.
insert into public.staff_contact (staff_id, email, phone)
select id, email, phone
from public.staff
where email is not null or phone is not null
on conflict (staff_id) do update
  set email = excluded.email, phone = excluded.phone;

-- Remove PII from the publicly-readable staff table (also removes the
-- staff-level check + unique index added in migration 011).
alter table public.staff drop constraint if exists staff_phone_e164_check;
drop index if exists public.staff_email_lower_unique;
alter table public.staff drop column if exists email;
alter table public.staff drop column if exists phone;

-- RLS: readable only by owner/manager or the staff member themselves;
-- writable by owner (mirrors the "Admin: manage staff" policy on staff).
alter table public.staff_contact enable row level security;

create policy "Staff contact: read for admins or self"
  on public.staff_contact for select
  using (
    current_staff_access_level() in ('owner', 'manager')
    or staff_id = current_staff_id()
  );

create policy "Staff contact: owner manage"
  on public.staff_contact for all
  using (current_staff_access_level() = 'owner')
  with check (current_staff_access_level() = 'owner');

-- Rollback:
--   alter table public.staff add column email text, add column phone text;
--   update public.staff s set email = c.email, phone = c.phone
--     from public.staff_contact c where c.staff_id = s.id;
--   drop table public.staff_contact;
--   (then recreate staff_phone_e164_check + staff_email_lower_unique from 011)

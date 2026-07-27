-- 014_shop_settings_booking_alerts
--
-- Singleton business configuration. First use: the phone number that receives a
-- text whenever a customer books, so the owner is alerted to new appointments.

create table if not exists public.shop_settings (
  id boolean primary key default true,
  booking_alert_phone text,
  updated_at timestamptz not null default now(),
  constraint shop_settings_singleton check (id)
);

insert into public.shop_settings (id) values (true)
  on conflict (id) do nothing;

alter table public.shop_settings enable row level security;

-- Staff may read the config for the dashboard; only owners may change it.
drop policy if exists shop_settings_read_staff on public.shop_settings;
create policy shop_settings_read_staff on public.shop_settings
  for select to authenticated
  using (public.current_staff_id() is not null);

drop policy if exists shop_settings_write_owner on public.shop_settings;
create policy shop_settings_write_owner on public.shop_settings
  for update to authenticated
  using (public.current_staff_access_level() = 'owner')
  with check (public.current_staff_access_level() = 'owner');

-- The booking flow runs as the customer (a client, not staff), so it cannot read
-- shop_settings under RLS. This definer getter exposes only the alert number.
create or replace function public.get_booking_alert_phone()
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select booking_alert_phone from public.shop_settings where id;
$$;

revoke all on function public.get_booking_alert_phone() from public, anon;
grant execute on function public.get_booking_alert_phone() to authenticated;

comment on function public.get_booking_alert_phone() is
  'Returns the owner-configured phone number that receives new-booking SMS alerts.';

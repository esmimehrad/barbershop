-- 013_phone_auth_identity_linking
--
-- Production phone-OTP identity linkage. A verified Supabase Auth user is
-- linked to exactly one application principal:
--   auth.users.phone -> staff_contact.phone -> staff.user_id
--   auth.users.phone -> client.phone        -> client.user_id
--
-- Linking is deliberately performed by authenticated RPCs after verifyOtp().
-- Do not attach identities from an auth.users INSERT trigger: signInWithOtp()
-- may create the Auth row before the caller has proved possession of the phone.

-- client.user_id and staff.user_id already carry unique constraints
-- (client_user_id_key, staff_user_id_key from migration 010_indexes). A full
-- unique index treats multiple NULLs as distinct, so "unique when present"
-- already holds; a second partial index would only duplicate them.
--
-- staff_contact.phone is the one missing guarantee — enforce it so a phone can
-- identify at most one staff member.
create unique index if not exists staff_contact_phone_unique
  on public.staff_contact (phone)
  where phone is not null;

-- The app currently resolves one principal kind per session. Prevent a phone
-- or Auth user from being assigned to both a customer and a staff identity.
create or replace function public.enforce_single_phone_identity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'client' then
    if new.phone is not null and exists (
      select 1
      from public.staff_contact sc
      where sc.phone = new.phone
    ) then
      raise exception 'Phone is already assigned to a staff identity.';
    end if;

    if new.user_id is not null and exists (
      select 1
      from public.staff s
      where s.user_id = new.user_id
    ) then
      raise exception 'Auth user is already assigned to a staff identity.';
    end if;
  elsif tg_table_name = 'staff_contact' then
    if new.phone is not null and exists (
      select 1
      from public.client c
      where c.phone = new.phone
    ) then
      raise exception 'Phone is already assigned to a customer identity.';
    end if;
  elsif tg_table_name = 'staff' then
    if new.user_id is not null and exists (
      select 1
      from public.client c
      where c.user_id = new.user_id
    ) then
      raise exception 'Auth user is already assigned to a customer identity.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_client_phone_identity on public.client;
create trigger enforce_client_phone_identity
before insert or update of phone, user_id on public.client
for each row execute function public.enforce_single_phone_identity();

drop trigger if exists enforce_staff_contact_phone_identity on public.staff_contact;
create trigger enforce_staff_contact_phone_identity
before insert or update of phone on public.staff_contact
for each row execute function public.enforce_single_phone_identity();

drop trigger if exists enforce_staff_user_identity on public.staff;
create trigger enforce_staff_user_identity
before insert or update of user_id on public.staff
for each row execute function public.enforce_single_phone_identity();

create or replace function public.resolve_phone_identity()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_phone text;
  v_linked_user_id uuid;
  v_staff_id uuid;
  v_client_id uuid;
begin
  if v_user_id is null then
    raise exception 'Authentication required.';
  end if;

  select u.phone
    into v_phone
  from auth.users u
  where u.id = v_user_id
    and u.phone_confirmed_at is not null;

  if v_phone is null then
    raise exception 'A verified phone number is required.';
  end if;

  -- Idempotent: return an identity already linked to this Auth user.
  if exists (select 1 from public.staff s where s.user_id = v_user_id) then
    return 'staff';
  end if;

  if exists (select 1 from public.client c where c.user_id = v_user_id) then
    return 'client';
  end if;

  select s.id, s.user_id
    into v_staff_id, v_linked_user_id
  from public.staff s
  join public.staff_contact sc on sc.staff_id = s.id
  where sc.phone = v_phone
    and s.is_active
  limit 1;

  if v_staff_id is not null then
    if v_linked_user_id is not null and v_linked_user_id <> v_user_id then
      raise exception 'This staff profile is already linked.';
    end if;

    update public.staff
      set user_id = v_user_id
    where id = v_staff_id;

    return 'staff';
  end if;

  select c.id, c.user_id
    into v_client_id, v_linked_user_id
  from public.client c
  where c.phone = v_phone
  limit 1;

  if v_client_id is not null then
    if v_linked_user_id is not null and v_linked_user_id <> v_user_id then
      raise exception 'This customer profile is already linked.';
    end if;

    update public.client
      set user_id = v_user_id
    where id = v_client_id;

    return 'client';
  end if;

  return 'needs_profile';
end;
$$;

create or replace function public.create_client_profile(p_name text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_phone text;
  v_kind text;
  v_name text := btrim(p_name);
begin
  if v_user_id is null then
    raise exception 'Authentication required.';
  end if;

  if char_length(v_name) < 2 or char_length(v_name) > 100 then
    raise exception 'Name must be between 2 and 100 characters.';
  end if;

  v_kind := public.resolve_phone_identity();
  if v_kind <> 'needs_profile' then
    return v_kind;
  end if;

  select u.phone
    into v_phone
  from auth.users u
  where u.id = v_user_id
    and u.phone_confirmed_at is not null;

  if v_phone is null then
    raise exception 'A verified phone number is required.';
  end if;

  -- generate_referral_code() supplies referral_code before the row is stored.
  insert into public.client (name, phone, user_id)
  values (v_name, v_phone, v_user_id);

  return 'client';
end;
$$;

-- enforce_single_phone_identity() is a trigger function; triggers invoke it with
-- the table owner's rights regardless of caller grants. Revoke all EXECUTE so it
-- is never exposed as a callable PostgREST RPC endpoint.
revoke all on function public.enforce_single_phone_identity() from public, anon, authenticated;

-- Supabase's default privileges grant EXECUTE on new public functions directly
-- to anon, authenticated, and service_role (not via PUBLIC), so revoking from
-- PUBLIC alone leaves anon able to call these. Explicitly revoke anon: both RPCs
-- require a verified phone identity and must never run for anonymous callers.
revoke all on function public.resolve_phone_identity() from public, anon;
revoke all on function public.create_client_profile(text) from public, anon;
grant execute on function public.resolve_phone_identity() to authenticated;
grant execute on function public.create_client_profile(text) to authenticated;

comment on function public.resolve_phone_identity() is
  'Links the authenticated, phone-verified user to a pre-existing staff or client row.';
comment on function public.create_client_profile(text) is
  'Creates a client row for an authenticated, phone-verified user with no existing identity.';

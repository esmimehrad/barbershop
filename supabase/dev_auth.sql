-- DEV-ONLY auth users for the low-fi draft (no Twilio/phone OTP yet).
-- Creates real Supabase email/password users and links them to seeded
-- client/staff rows via user_id, so RLS + access-level gating are exercised.
-- Password for all: barbershop123. DO NOT use this pattern in production.

create extension if not exists pgcrypto with schema extensions;

do $$
declare
  uid uuid;
begin
  -- Ray — customer (client row)
  if not exists (select 1 from auth.users where email = 'ray@dev.local') then
    uid := gen_random_uuid();
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change)
    values ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      'ray@dev.local', extensions.crypt('barbershop123', extensions.gen_salt('bf')),
      now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', '');
    insert into auth.identities (id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), uid, jsonb_build_object('sub', uid::text, 'email', 'ray@dev.local'),
      'email', uid::text, now(), now(), now());
    update client set user_id = uid where phone = '+14155550123';
  end if;

  -- Marco — staff, access_level owner
  if not exists (select 1 from auth.users where email = 'marco@dev.local') then
    uid := gen_random_uuid();
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change)
    values ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      'marco@dev.local', extensions.crypt('barbershop123', extensions.gen_salt('bf')),
      now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', '');
    insert into auth.identities (id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), uid, jsonb_build_object('sub', uid::text, 'email', 'marco@dev.local'),
      'email', uid::text, now(), now(), now());
    update staff set user_id = uid where name = 'Marco';
  end if;

  -- Sami — staff, access_level staff
  if not exists (select 1 from auth.users where email = 'sami@dev.local') then
    uid := gen_random_uuid();
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new, email_change)
    values ('00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      'sami@dev.local', extensions.crypt('barbershop123', extensions.gen_salt('bf')),
      now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', '', '', '', '');
    insert into auth.identities (id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), uid, jsonb_build_object('sub', uid::text, 'email', 'sami@dev.local'),
      'email', uid::text, now(), now(), now());
    update staff set user_id = uid where name = 'Sami';
  end if;
end $$;

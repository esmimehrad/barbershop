-- Seed data for the low-fi draft. Idempotent-guarded so a re-run is safe.
-- Applied to the live project (umarerwvbsqokekotfbw). Business data only —
-- dev auth users are seeded separately (see supabase/dev_auth.sql).

-- Customer segments (RFM tiers)
insert into customer_segment (name, cashback_rate, rank)
select * from (values ('High', 0.08, 1), ('Mid', 0.05, 2), ('Low', 0.03, 3)) v(name, rate, rank)
where not exists (select 1 from customer_segment);

-- Staff
insert into staff (name, role, access_level, is_active, specialty, bio)
select * from (values
  ('Marco', 'barber'::staff_role, 'owner'::access_level, true, 'Fades & classic cuts', 'Owner and master barber.'),
  ('Sami',  'barber'::staff_role, 'staff'::access_level, true, 'Beards & line-ups', 'Barber specializing in beard work.'),
  ('Lena',  'lash_specialist'::staff_role, 'manager'::access_level, true, 'Classic & volume lashes', 'Lash specialist, own track.')
) v(name, role, access_level, is_active, specialty, bio)
where not exists (select 1 from staff);

-- Services (base, add-ons, package, eyelash)
insert into service (name, type, duration_minutes, price, allowed_role, is_addon, is_package, is_active)
select * from (values
  ('Haircut',          'haircut'::service_type, 30, 25.00, 'barber'::staff_role,          false, false, true),
  ('Skin Fade',        'haircut'::service_type, 45, 30.00, 'barber'::staff_role,          false, false, true),
  ('Beard Trim',       'haircut'::service_type, 15, 12.00, 'barber'::staff_role,          true,  false, true),
  ('Hot Towel',        'haircut'::service_type, 10,  5.00, 'barber'::staff_role,          true,  false, true),
  ('Classic Lash Set', 'eyelash'::service_type, 90, 70.00, 'lash_specialist'::staff_role, false, false, true),
  ('The Works',        'haircut'::service_type, 45, 37.00, 'barber'::staff_role,          false, true,  true)
) v(name, type, duration_minutes, price, allowed_role, is_addon, is_package, is_active)
where not exists (select 1 from service);

-- Package composition: The Works = Haircut + Beard Trim
insert into package_item (package_id, child_service_id)
select p.id, c.id from service p join service c on c.name in ('Haircut', 'Beard Trim')
where p.name = 'The Works'
and not exists (select 1 from package_item);

-- Per-staff service assignments (narrows the role gate)
insert into staff_service (staff_id, service_id)
select s.id, sv.id from staff s join service sv on
     (s.name = 'Marco' and sv.name in ('Haircut','Skin Fade','Beard Trim','Hot Towel','The Works'))
  or (s.name = 'Sami'  and sv.name in ('Haircut','Beard Trim'))
  or (s.name = 'Lena'  and sv.name in ('Classic Lash Set'))
where not exists (select 1 from staff_service);

-- Availability: Mon–Fri 09:00–17:00 for every active staff member
insert into staff_availability (staff_id, day_of_week, start_time, end_time)
select s.id, d.dow, time '09:00', time '17:00'
from staff s cross join (values (1),(2),(3),(4),(5)) d(dow)
where s.is_active
and not exists (select 1 from staff_availability);

-- A returning client (Ray) with a usual provider, a segment, and $18 credit
insert into client (name, phone, referral_code, preferred_channel, usual_provider_id, rfm_segment_id)
select 'Ray Ortiz', '+14155550123', 'FADE-RAY001', 'sms',
       (select id from staff where name = 'Marco'),
       (select id from customer_segment where name = 'Mid')
where not exists (select 1 from client where phone = '+14155550123');

-- Ray's opening credit balance via the ledger (trigger recomputes credit_balance)
insert into credit_transaction (client_id, amount, reason)
select id, 18.00, 'manual' from client where phone = '+14155550123'
and not exists (
  select 1 from credit_transaction ct join client c on c.id = ct.client_id
  where c.phone = '+14155550123'
);

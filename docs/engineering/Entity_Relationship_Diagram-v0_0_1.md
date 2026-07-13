client [icon: user, color: blue] {
  id uuid pk
  name string
  phone string
  birthday date
  preferences text
  referral_code string
  referred_by_id uuid fk
  credit_balance decimal
  preferred_channel enum
  created_at timestamp
  updated_at timestamp
}

staff [icon: scissors, color: purple] {
  id uuid pk
  name string
  role enum
  access_level enum
  is_active boolean
  portrait_url string
  bio text
  specialty string
  landing_display_order integer
  calendar_provider enum
  calendar_id string
  created_at timestamp
  updated_at timestamp
}

staff_calendar_token [icon: key, color: purple] {
  id uuid pk
  staff_id uuid fk
  provider enum
  refresh_token string
  calendar_id string
  created_at timestamp
  updated_at timestamp
}

staff_service [icon: link, color: purple] {
  id uuid pk
  staff_id uuid fk
  service_id uuid fk
}

staff_availability [icon: clock, color: purple] {
  id uuid pk
  staff_id uuid fk
  day_of_week integer
  start_time time
  end_time time
  effective_from date
  effective_to date
}

external_busy_block [icon: calendar-x, color: purple] {
  id uuid pk
  staff_id uuid fk
  source enum
  busy_start timestamp
  busy_end timestamp
  external_event_id string
  synced_at timestamp
}

holiday_closure [icon: calendar-off, color: purple] {
  id uuid pk
  staff_id uuid fk
  date date
  reason string
}

service [icon: tag, color: green] {
  id uuid pk
  name string
  type enum
  duration_minutes integer
  price decimal
  allowed_role enum
  cashback_rate decimal
  is_package boolean
  is_addon boolean
  is_active boolean
  is_featured_on_landing boolean
  landing_display_order integer
}

package_item [icon: package, color: green] {
  id uuid pk
  package_id uuid fk
  child_service_id uuid fk
}

appointment [icon: calendar, color: orange] {
  id uuid pk
  client_id uuid fk
  staff_id uuid fk
  service_id uuid fk
  starts_at timestamp
  ends_at timestamp
  status enum
  price_snapshot decimal
  addons_snapshot decimal
  credit_applied decimal
  amount_due decimal
  promotion_id uuid fk
  external_event_id string
  completed_at timestamp
  created_at timestamp
  updated_at timestamp
}

appointment_addon [icon: plus-circle, color: orange] {
  id uuid pk
  appointment_id uuid fk
  service_id uuid fk
  price_snapshot decimal
}

referral [icon: share-2, color: blue] {
  id uuid pk
  referrer_id uuid fk
  referred_id uuid fk
  status enum
  qualifying_appointment_id uuid fk
  credited_at timestamp
}

credit_transaction [icon: dollar-sign, color: green] {
  id uuid pk
  client_id uuid fk
  amount decimal
  reason enum
  appointment_id uuid fk
  created_at timestamp
  expires_at timestamp
}

notification [icon: bell, color: yellow] {
  id uuid pk
  appointment_id uuid fk
  client_id uuid fk
  type enum
  channel enum
  status enum
  provider_message_id string
  scheduled_for timestamp
  sent_at timestamp
}

promotion [icon: gift, color: red] {
  id uuid pk
  name string
  trigger_type enum
  trigger_service_id uuid fk
  reward_type enum
  reward_service_id uuid fk
  reward_amount decimal
  is_active boolean
  is_featured_on_landing boolean
  expires_at timestamp
}

promotion_grant [icon: award, color: red] {
  id uuid pk
  promotion_id uuid fk
  client_id uuid fk
  status enum
  earned_appointment_id uuid fk
  redeemed_appointment_id uuid fk
  expires_at timestamp
}

staff_gallery_image [icon: image, color: purple] {
  id uuid pk
  url string
  image_group enum
  staff_id uuid fk
  display_order integer
  alt_text string
  created_at timestamp
}

// Client relationships
client.referred_by_id > client.id

// Staff relationships
staff_calendar_token.staff_id > staff.id
staff_service.staff_id > staff.id
staff_service.service_id > service.id
staff_availability.staff_id > staff.id
external_busy_block.staff_id > staff.id
holiday_closure.staff_id > staff.id
staff_gallery_image.staff_id > staff.id

// Service relationships
package_item.package_id > service.id
package_item.child_service_id > service.id

// Appointment relationships
appointment.client_id > client.id
appointment.staff_id > staff.id
appointment.service_id > service.id
appointment.promotion_id > promotion.id
appointment_addon.appointment_id > appointment.id
appointment_addon.service_id > service.id

// Credit and referral
credit_transaction.client_id > client.id
credit_transaction.appointment_id > appointment.id
referral.referrer_id > client.id
referral.referred_id > client.id
referral.qualifying_appointment_id > appointment.id

// Notifications
notification.appointment_id > appointment.id
notification.client_id > client.id

// Promotions
promotion.trigger_service_id > service.id
promotion.reward_service_id > service.id
promotion_grant.promotion_id > promotion.id
promotion_grant.client_id > client.id
promotion_grant.earned_appointment_id > appointment.id
promotion_grant.redeemed_appointment_id > appointment.id
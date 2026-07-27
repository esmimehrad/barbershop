# Production Phone Authentication Setup

The application uses Supabase Phone Auth with SMS OTP. Supabase owns code
generation, delivery, verification, sessions, and refresh-token rotation.

## Supabase Dashboard

1. Open **Authentication → Providers → Phone** and enable Phone Auth.
2. Select **Twilio** or **Twilio Verify** and enter the provider credentials.
   These settings are separate from the application's notification credentials.
3. Use a six-digit OTP, a short expiry, and a resend interval of at least 60 seconds.
4. Under **Authentication → Bot and Abuse Protection**, enable Cloudflare
   Turnstile and add its secret key.
5. Under **Authentication → Rate Limits**, set conservative limits for OTP sends
   and verification attempts.
6. Add the matching Turnstile site key to the application deployment as
   `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
7. Confirm the production Site URL and allowed redirect URLs.

Never commit Twilio credentials, CAPTCHA secrets, or Supabase secret/service-role
keys. The browser app uses only the Supabase publishable key.

## Database

Apply `supabase/migrations/20260727000100_phone_auth_identity_linking.sql`.
It provides two authenticated RPCs:

- `resolve_phone_identity()` links the verified phone to an existing staff or
  customer record.
- `create_client_profile(p_name)` creates a customer profile when no identity
  exists.

Staff access is never self-selected. An owner must create the staff record and
its `staff_contact.phone` value before that person signs in.

## Cutover

1. Keep `/auth/dev` available only while testing the first real OTP.
2. Test returning customer, new customer, owner, staff, invalid code, expired
   code, resend throttling, sign-out, and protected-route return paths.
3. Clear development `user_id` links attached to `@dev.local` users.
4. Delete those development Auth users through Supabase Auth administration.
5. Remove `app/auth/dev/` and `supabase/dev_auth.sql`.

## Verification

Run:

```sh
npm run typecheck
npm run lint
npm run build
```

Then test at 375px width and desktop width with keyboard-only navigation.

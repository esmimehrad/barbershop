# lib/supabase/ — SSR Supabase clients

Thin factories around `@supabase/ssr`. Every DB call in the app resolves through one of these.

## Files
- `server.ts` — `createClient()` for Server Components / Server Actions / Route Handlers (reads the cookie session; RLS applies via `auth.uid()`).
- `client.ts` — `createClient()` for Client Components (browser).
- `middleware.ts` — `updateSession()`; refreshes the auth cookie on every request (wired from root `middleware.ts`).

## Rules
- Only the publishable/anon key is used here. **Never** put the service-role key in app code.
- Don't add query logic here — that belongs in `lib/data/` and `lib/actions/`.
- `server.ts` `setAll` is a safe no-op inside RSC render; middleware does the real cookie refresh.

See `lib/CLAUDE.md` and root `CLAUDE.md`.

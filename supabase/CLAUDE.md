# supabase/ — seed & dev-auth SQL

Reproducible SQL applied to the live project `umarerwvbsqokekotfbw`. There is no local Supabase stack — the backend is cloud-hosted.

## Files
- `seed.sql` — business seed (staff Marco/Sami/Lena, services, package, staff_service, availability, segments, client Ray). Idempotent-guarded.
- `dev_auth.sql` — **DEV-ONLY** email/password auth users linked to seeded rows via `user_id`. Throwaway; removed when phone OTP ships.

## Rules
- Apply via the Supabase MCP (`apply_migration` for DDL, `execute_sql` for data) — no CLI/login available here.
- Don't hardcode generated UUIDs; select by natural keys (name/phone).
- Schema/DDL changes belong in real migrations, not these files.

See root `CLAUDE.md`.

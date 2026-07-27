# supabase/ — schema migrations and business seed

Reproducible SQL applied to the live project `umarerwvbsqokekotfbw`. There is no local Supabase stack — the backend is cloud-hosted.

## Files
- `migrations/` — versioned DDL source; each migration is applied through the Supabase MCP.
- `seed.sql` — business seed (staff Marco/Sami/Lena, services, package, staff_service, availability, client Ray). Idempotent-guarded.
- `dev_auth.sql` — legacy development login fixture; remove after the real phone-OTP cutover is verified.

## Rules
- Apply via the Supabase MCP (`apply_migration` for DDL, `execute_sql` for data) — no CLI/login available here.
- Don't hardcode generated UUIDs; select by natural keys (name/phone).
- Schema/DDL changes belong in real migrations, not these files.

See root `CLAUDE.md`.

import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";
import { staffDisplayName } from "@/lib/staff-name";

export type AccessLevel = Enums<"access_level">;

export type SessionContext = {
  userId: string | null;
  clientId: string | null;
  staffId: string | null;
  accessLevel: AccessLevel | null;
  displayName: string | null;
  kind: "client" | "staff" | null;
};

const ANON: SessionContext = {
  userId: null,
  clientId: null,
  staffId: null,
  accessLevel: null,
  displayName: null,
  kind: null,
};

/**
 * Resolves the signed-in user to their client or staff identity.
 * Staff and client rows are keyed by user_id (linked at sign-in).
 */
export async function getSessionContext(): Promise<SessionContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return ANON;

  const { data: staff } = await supabase
    .from("staff")
    .select("id, name, first_name, last_name, access_level")
    .eq("user_id", user.id)
    .maybeSingle();
  if (staff) {
    return {
      userId: user.id,
      clientId: null,
      staffId: staff.id,
      accessLevel: staff.access_level,
      displayName: staffDisplayName(staff),
      kind: "staff",
    };
  }

  const { data: client } = await supabase
    .from("client")
    .select("id, name")
    .eq("user_id", user.id)
    .maybeSingle();
  if (client) {
    return {
      userId: user.id,
      clientId: client.id,
      staffId: null,
      accessLevel: null,
      displayName: client.name,
      kind: "client",
    };
  }

  return { ...ANON, userId: user.id, displayName: user.email ?? null };
}

/**
 * PLACEHOLDER permission gate — FS-10.5 matrix is [OPEN]. The chosen default:
 *   owner   → everything
 *   manager → everything except access-level changes
 *   staff   → operational view only (no pricing / metrics / credit / config)
 * Mirrors the DB RLS (`current_staff_access_level() in ('owner','manager')`);
 * `access_admin` is stricter (owner-only) than RLS as a UI safeguard.
 * Swap this for the real matrix once the product decision lands.
 */
export type Section =
  | "pricing"
  | "metrics"
  | "credit"
  | "staff_admin"
  | "config_admin"
  | "access_admin";

export function canSee(level: AccessLevel | null, section: Section): boolean {
  if (!level) return false;
  // Access-level administration is owner-only.
  if (section === "access_admin") return level === "owner";
  // staff_admin kept for back-compat with existing call sites (owner-only).
  if (section === "staff_admin") return level === "owner";
  // Config + pricing/metrics/credit: owner and manager, hidden from base staff.
  return level === "owner" || level === "manager";
}

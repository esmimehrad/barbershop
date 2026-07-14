import { createClient } from "@/lib/supabase/server";
import type { Enums } from "@/types/database";

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
    .select("id, name, access_level")
    .eq("user_id", user.id)
    .maybeSingle();
  if (staff) {
    return {
      userId: user.id,
      clientId: null,
      staffId: staff.id,
      accessLevel: staff.access_level,
      displayName: staff.name,
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

/** PLACEHOLDER gate (FS-10.5 matrix is [OPEN]). owner > manager > staff. */
export function canSee(
  level: AccessLevel | null,
  section: "pricing" | "metrics" | "credit" | "staff_admin",
): boolean {
  if (!level) return false;
  if (section === "staff_admin") return level === "owner";
  // pricing / metrics / credit hidden from base "staff" per the wireframe
  return level === "owner" || level === "manager";
}

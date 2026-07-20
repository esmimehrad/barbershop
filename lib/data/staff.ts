import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Staff = Tables<"staff">;

/**
 * Staff plus their contact info (email/phone). Contact lives in the separate
 * `staff_contact` table whose RLS restricts reads to owner/manager or the staff
 * member themselves — so these fields are null for callers who may not see them.
 */
export type StaffWithContact = Staff & { email: string | null; phone: string | null };

type StaffContactEmbed = { email: string | null; phone: string | null } | null;

function flattenContact(
  row: Staff & { staff_contact: StaffContactEmbed | StaffContactEmbed[] },
): StaffWithContact {
  const { staff_contact, ...staff } = row;
  const contact = Array.isArray(staff_contact) ? staff_contact[0] : staff_contact;
  return { ...staff, email: contact?.email ?? null, phone: contact?.phone ?? null };
}

/**
 * Providers eligible for a service: role matches Service.allowed_role AND a
 * staff_service assignment exists (the two-track + per-staff gate). The DB
 * trigger enforce_two_track() re-checks this on write.
 */
export async function listProvidersForService(serviceId: string): Promise<Staff[]> {
  const supabase = await createClient();

  const { data: service } = await supabase
    .from("service")
    .select("allowed_role")
    .eq("id", serviceId)
    .maybeSingle();
  if (!service) return [];

  const { data } = await supabase
    .from("staff")
    .select("*, staff_service!inner(service_id)")
    .eq("staff_service.service_id", serviceId)
    .eq("role", service.allowed_role)
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (data ?? []) as Staff[];
}

export async function getStaff(id: string): Promise<Staff | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("staff").select("*").eq("id", id).maybeSingle();
  return data;
}

/** Active staff for landing display: curated order first, then name as a tiebreaker. */
export async function listActiveStaff(): Promise<Staff[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("staff")
    .select("*")
    .eq("is_active", true)
    .order("landing_display_order", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });
  return data ?? [];
}

/**
 * Active barbers only (role = 'barber'), for the landing "Meet the team"
 * section — the lash specialist is featured separately in the Eyelash
 * section. Driven entirely by what's registered in the DB, so the section
 * grows/shrinks with the roster automatically.
 */
export async function listActiveBarbers(): Promise<Staff[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("staff")
    .select("*")
    .eq("is_active", true)
    .eq("role", "barber")
    .order("landing_display_order", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true });
  return data ?? [];
}

/**
 * Active staff with contact info joined in — for staff-facing surfaces (owner
 * roster, barber detail) that show a `tel:` link. RLS returns email/phone only
 * to owner/manager or the staff member themselves; others get nulls.
 */
export async function listActiveStaffWithContact(): Promise<StaffWithContact[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("staff")
    .select("*, staff_contact(email, phone)")
    .eq("is_active", true)
    .order("name", { ascending: true });
  return (data ?? []).map(flattenContact);
}

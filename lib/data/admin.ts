import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Staff = Tables<"staff">;
export type { StaffWithContact } from "@/lib/data/staff";
import type { StaffWithContact } from "@/lib/data/staff";
export type Service = Tables<"service">;
export type Availability = Tables<"staff_availability">;
export type Holiday = Tables<"holiday_closure">;

export type PromotionRow = Tables<"promotion"> & {
  trigger_service: { name: string } | null;
  reward_service: { name: string } | null;
};

/**
 * READ layer for the admin settings surface. All queries return full config
 * (including inactive rows) so the owner can manage everything; the customer
 * surfaces use the narrower `lib/data/*` reads that filter to active only.
 */

export async function listAllStaff(): Promise<Staff[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("staff").select("*").order("name");
  return data ?? [];
}

/**
 * All staff (incl. inactive) with contact info joined — for admin surfaces that
 * search or display email/phone. RLS on staff_contact still scopes the contact
 * fields to owner/manager or self.
 */
export async function listAllStaffWithContact(): Promise<StaffWithContact[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("staff")
    .select("*, staff_contact(email, phone)")
    .order("name");
  return (data ?? []).map((row) => {
    const { staff_contact, ...staff } = row;
    const contact = Array.isArray(staff_contact) ? staff_contact[0] : staff_contact;
    return { ...staff, email: contact?.email ?? null, phone: contact?.phone ?? null };
  });
}

export async function listAllServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service")
    .select("*")
    .order("type")
    .order("is_addon")
    .order("price");
  return data ?? [];
}

/** Map of staff_id → set of service_ids they can perform. */
export async function getStaffServiceMatrix(): Promise<Map<string, Set<string>>> {
  const supabase = await createClient();
  const { data } = await supabase.from("staff_service").select("staff_id, service_id");
  const matrix = new Map<string, Set<string>>();
  for (const row of data ?? []) {
    const set = matrix.get(row.staff_id) ?? new Set<string>();
    set.add(row.service_id);
    matrix.set(row.staff_id, set);
  }
  return matrix;
}

export async function listAvailability(): Promise<Availability[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("staff_availability")
    .select("*")
    .order("day_of_week")
    .order("start_time");
  return data ?? [];
}

/** Upcoming closures (today onward). */
export async function listHolidays(): Promise<Holiday[]> {
  const supabase = await createClient();
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const { data } = await supabase
    .from("holiday_closure")
    .select("*")
    .gte("date", iso)
    .order("date");
  return data ?? [];
}

export async function listPromotions(): Promise<PromotionRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("promotion")
    .select("*, trigger_service:trigger_service_id(name), reward_service:reward_service_id(name)")
    .order("is_active", { ascending: false })
    .order("name");
  return (data ?? []) as unknown as PromotionRow[];
}

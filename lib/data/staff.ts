import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Staff = Tables<"staff">;

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

export async function listActiveStaff(): Promise<Staff[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("staff")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });
  return data ?? [];
}

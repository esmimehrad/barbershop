import { createClient } from "@/lib/supabase/server";
import type { Enums, Tables } from "@/types/database";

export type Service = Tables<"service">;
export type Track = Enums<"service_type">;

/** Bookable base services + packages for a track (add-ons excluded). */
export async function listBookableServices(track: Track): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service")
    .select("*")
    .eq("type", track)
    .eq("is_addon", false)
    .eq("is_active", true)
    .order("price", { ascending: true });
  return data ?? [];
}

/** Services flagged for landing-page hero/featured display within a track. */
export async function listFeaturedServices(track: Track): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service")
    .select("*")
    .eq("type", track)
    .eq("is_featured_on_landing", true)
    .eq("is_active", true)
    .order("landing_display_order", { ascending: true, nullsFirst: false });
  return data ?? [];
}

/** Add-ons attachable within a track. */
export async function listAddons(track: Track): Promise<Service[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service")
    .select("*")
    .eq("type", track)
    .eq("is_addon", true)
    .eq("is_active", true)
    .order("price", { ascending: true });
  return data ?? [];
}

export async function getService(id: string): Promise<Service | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("service").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getServicesByIds(ids: string[]): Promise<Service[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("service").select("*").in("id", ids);
  return data ?? [];
}

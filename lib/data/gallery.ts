import { createClient } from "@/lib/supabase/server";
import type { Enums, Tables } from "@/types/database";

export type GalleryImage = Tables<"staff_gallery_image">;
export type GalleryGroup = Enums<"gallery_group">;

/** Gallery images, optionally filtered to one group ("work" | "space"). */
export async function listGalleryImages(group?: GalleryGroup): Promise<GalleryImage[]> {
  const supabase = await createClient();
  let query = supabase.from("staff_gallery_image").select("*").order("display_order", { ascending: true });
  if (group) query = query.eq("image_group", group);
  const { data } = await query;
  return data ?? [];
}

export async function listGalleryImagesForStaff(staffId: string): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("staff_gallery_image")
    .select("*")
    .eq("staff_id", staffId)
    .order("display_order", { ascending: true });
  return data ?? [];
}

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type Client = Tables<"client">;

export async function getClientProfile(clientId: string): Promise<Client | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("client").select("*").eq("id", clientId).maybeSingle();
  return data;
}

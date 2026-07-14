import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type CreditPolicy = Tables<"credit_policy">;

export async function getCreditPolicy(): Promise<CreditPolicy | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("credit_policy").select("*").limit(1).maybeSingle();
  return data;
}

export async function getClientCreditBalance(clientId: string): Promise<number> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("client")
    .select("credit_balance")
    .eq("id", clientId)
    .maybeSingle();
  return data?.credit_balance ?? 0;
}

/**
 * Max credit applicable to an appointment of the given price
 * (redemption cap × price, bounded by the balance). Cap value is a policy
 * setting, not hard-coded — FS-6.
 */
export function maxCreditApplicable(
  balance: number,
  price: number,
  redemptionCapPct: number,
): number {
  return Math.max(0, Math.min(balance, price * redemptionCapPct));
}

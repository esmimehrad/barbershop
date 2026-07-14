import { createClient } from "@/lib/supabase/server";

export type ActivityItem = {
  id: string;
  reason: string;
  amount: number;
  clientName: string;
  at: string;
};

/**
 * Recent credit-ledger activity for the owner dashboard (Flow 10.3):
 * cashback earned, referral credited, redemptions. Read-only — the rows are
 * written by DB triggers on completion, never by the frontend.
 */
export async function listRecentActivity(limit = 12): Promise<ActivityItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("credit_transaction")
    .select("id, reason, amount, created_at, client:client_id(name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((row) => ({
    id: row.id,
    reason: String(row.reason),
    amount: row.amount,
    clientName: (row.client as { name: string } | null)?.name ?? "Client",
    at: row.created_at,
  }));
}

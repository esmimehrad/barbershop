"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/auth";
import { appointmentActionInput } from "@/lib/validation/booking";
import type { Enums } from "@/types/database";

type Result = { ok: boolean; error?: string };

async function setStatus(
  appointmentId: string,
  status: Enums<"appointment_status">,
): Promise<Result> {
  const parsed = appointmentActionInput.safeParse({ appointmentId });
  if (!parsed.success) return { ok: false, error: "Invalid appointment." };

  const session = await getSessionContext();
  if (session.kind !== "staff") {
    return { ok: false, error: "Staff only." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("appointment")
    .update({ status })
    .eq("id", parsed.data.appointmentId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  return { ok: true };
}

/** Mark completed → DB triggers fire referral and promotion credit writes. */
export async function markCompleted(appointmentId: string): Promise<Result> {
  return setStatus(appointmentId, "completed");
}

/** Late past grace → free the slot, keep the record (FS-4). */
export async function releaseSlot(appointmentId: string): Promise<Result> {
  return setStatus(appointmentId, "late_released");
}

export async function markNoShow(appointmentId: string): Promise<Result> {
  return setStatus(appointmentId, "no_show");
}

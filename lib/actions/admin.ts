"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canSee, getSessionContext, type Section } from "@/lib/auth";
import {
  accessLevelInput,
  availabilityInput,
  availabilityUpdateInput,
  holidayInput,
  idInput,
  promotionInput,
  serviceStaffInput,
  serviceInput,
  toggleInput,
} from "@/lib/validation/admin";

export type ActionResult = { ok: boolean; error?: string };

/** Authorize the caller for an admin section (belt-and-suspenders over RLS). */
async function authorize(section: Section): Promise<ActionResult | null> {
  const session = await getSessionContext();
  if (session.kind !== "staff") return { ok: false, error: "Staff only." };
  if (!canSee(session.accessLevel, section)) {
    return { ok: false, error: "You don't have access to this setting." };
  }
  return null;
}

function done(): ActionResult {
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}

const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
};

/* ── Access levels (owner-only) ─────────────────────────────────────────── */
export async function setAccessLevel(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("access_admin");
  if (denied) return denied;

  const parsed = accessLevelInput.safeParse({
    staffId: str(fd, "staffId"),
    level: str(fd, "level"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid access level." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("staff")
    .update({ access_level: parsed.data.level })
    .eq("id", parsed.data.staffId);
  return error ? { ok: false, error: error.message } : done();
}

/** Replace the providers assigned to one service, keeping the role gate intact. */
export async function setServiceStaff(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = serviceStaffInput.safeParse({
    serviceId: str(fd, "serviceId"),
    staffIds: fd.getAll("staffIds").map(String),
  });
  if (!parsed.success) return { ok: false, error: "Invalid assignment." };

  const { serviceId } = parsed.data;
  const staffIds = [...new Set(parsed.data.staffIds)];
  const supabase = await createClient();
  const { data: service, error: serviceError } = await supabase
    .from("service")
    .select("allowed_role")
    .eq("id", serviceId)
    .maybeSingle();
  if (serviceError || !service) return { ok: false, error: "Service not found." };

  if (staffIds.length > 0) {
    const { data: eligibleStaff, error: staffError } = await supabase
      .from("staff")
      .select("id")
      .in("id", staffIds)
      .eq("role", service.allowed_role);
    if (staffError || eligibleStaff?.length !== staffIds.length) {
      return { ok: false, error: "Only providers with the matching role can be assigned." };
    }
  }

  const { error: delErr } = await supabase
    .from("staff_service")
    .delete()
    .eq("service_id", serviceId);
  if (delErr) return { ok: false, error: delErr.message };

  if (staffIds.length > 0) {
    const { error: insErr } = await supabase
      .from("staff_service")
      .insert(staffIds.map((staff_id) => ({ staff_id, service_id: serviceId })));
    if (insErr) return { ok: false, error: insErr.message };
  }
  return done();
}

/* ── Schedule (weekly availability) ─────────────────────────────────────── */
export async function addAvailability(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = availabilityInput.safeParse({
    staffId: str(fd, "staffId"),
    dayOfWeek: str(fd, "dayOfWeek"),
    startTime: str(fd, "startTime"),
    endTime: str(fd, "endTime"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid window." };
  }
  const { staffId, dayOfWeek, startTime, endTime } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("staff_availability").insert({
    staff_id: staffId,
    day_of_week: dayOfWeek,
    start_time: startTime,
    end_time: endTime,
  });
  return error ? { ok: false, error: error.message } : done();
}

export async function deleteAvailability(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = idInput.safeParse({ id: str(fd, "id") });
  if (!parsed.success) return { ok: false, error: "Invalid window." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("staff_availability")
    .delete()
    .eq("id", parsed.data.id);
  return error ? { ok: false, error: error.message } : done();
}

export async function updateAvailability(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = availabilityUpdateInput.safeParse({
    id: str(fd, "id"),
    staffId: str(fd, "staffId"),
    dayOfWeek: str(fd, "dayOfWeek"),
    startTime: str(fd, "startTime"),
    endTime: str(fd, "endTime"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid window." };
  }

  const { id, staffId, dayOfWeek, startTime, endTime } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase
    .from("staff_availability")
    .update({ staff_id: staffId, day_of_week: dayOfWeek, start_time: startTime, end_time: endTime })
    .eq("id", id);
  return error ? { ok: false, error: error.message } : done();
}

/* ── Holidays / closures ────────────────────────────────────────────────── */
export async function addHoliday(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = holidayInput.safeParse({
    date: str(fd, "date"),
    staffId: str(fd, "staffId"),
    reason: str(fd, "reason"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid closure." };
  const { date, staffId, reason } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("holiday_closure").insert({
    date,
    staff_id: staffId ?? null, // null = shop-wide closure
    reason: reason ?? null,
  });
  return error ? { ok: false, error: error.message } : done();
}

export async function deleteHoliday(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = idInput.safeParse({ id: str(fd, "id") });
  if (!parsed.success) return { ok: false, error: "Invalid closure." };

  const supabase = await createClient();
  const { error } = await supabase.from("holiday_closure").delete().eq("id", parsed.data.id);
  return error ? { ok: false, error: error.message } : done();
}

/* ── Services, packages & pricing ───────────────────────────────────────── */
export async function saveService(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = serviceInput.safeParse({
    id: str(fd, "id"),
    name: str(fd, "name"),
    type: str(fd, "type"),
    durationMinutes: str(fd, "durationMinutes"),
    price: str(fd, "price"),
    allowedRole: str(fd, "allowedRole"),
    isAddon: fd.get("isAddon") === "on",
    isPackage: fd.get("isPackage") === "on",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid service." };
  }
  const s = parsed.data;
  const row = {
    name: s.name,
    type: s.type,
    duration_minutes: s.durationMinutes,
    // NOTE: package price is stored directly (independent price). Deriving it
    // from child services is an [OPEN] product decision (FS-1.3 vs Flow 11.4).
    price: s.price,
    allowed_role: s.allowedRole,
    is_addon: s.isAddon,
    is_package: s.isPackage,
  };

  const supabase = await createClient();
  const query = s.id
    ? supabase.from("service").update(row).eq("id", s.id)
    : supabase.from("service").insert(row);
  const { error } = await query;
  return error ? { ok: false, error: error.message } : done();
}

export async function toggleService(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = toggleInput.safeParse({
    id: str(fd, "id"),
    active: fd.get("active") === "true",
  });
  if (!parsed.success) return { ok: false, error: "Invalid service." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("service")
    .update({ is_active: parsed.data.active })
    .eq("id", parsed.data.id);
  return error ? { ok: false, error: error.message } : done();
}

/* ── Promotions ─────────────────────────────────────────────────────────── */
export async function createPromotion(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = promotionInput.safeParse({
    name: str(fd, "name"),
    triggerType: str(fd, "triggerType"),
    triggerServiceId: str(fd, "triggerServiceId"),
    rewardType: str(fd, "rewardType"),
    rewardServiceId: str(fd, "rewardServiceId"),
    rewardAmount: str(fd, "rewardAmount"),
    expiresAt: str(fd, "expiresAt"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid promotion." };
  }
  const p = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("promotion").insert({
    name: p.name,
    trigger_type: p.triggerType,
    trigger_service_id: p.triggerServiceId ?? null,
    reward_type: p.rewardType,
    reward_service_id: p.rewardType === "free_addon" ? (p.rewardServiceId ?? null) : null,
    reward_amount: p.rewardType === "free_addon" ? null : (p.rewardAmount ?? null),
    expires_at: p.expiresAt ? new Date(`${p.expiresAt}T23:59:59`).toISOString() : null,
  });
  return error ? { ok: false, error: error.message } : done();
}

export async function togglePromotion(fd: FormData): Promise<ActionResult> {
  const denied = await authorize("config_admin");
  if (denied) return denied;

  const parsed = toggleInput.safeParse({
    id: str(fd, "id"),
    active: fd.get("active") === "true",
  });
  if (!parsed.success) return { ok: false, error: "Invalid promotion." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("promotion")
    .update({ is_active: parsed.data.active })
    .eq("id", parsed.data.id);
  return error ? { ok: false, error: error.message } : done();
}

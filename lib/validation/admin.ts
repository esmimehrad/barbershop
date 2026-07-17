import { z } from "zod";

/** Enum unions kept in sync with the DB (types/database.ts). */
const accessLevel = z.enum(["owner", "manager", "staff"]);
const serviceType = z.enum(["haircut", "eyelash"]);
const staffRole = z.enum(["barber", "lash_specialist"]);
const promotionTrigger = z.enum(["first_completed_service", "nth_visit", "manual"]);
const rewardType = z.enum(["free_addon", "fixed_credit", "percent_off"]);

const uuid = z.string().uuid();
const time = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM");
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const accessLevelInput = z.object({
  staffId: uuid,
  level: accessLevel,
});

export const serviceStaffInput = z.object({
  serviceId: uuid,
  staffIds: z.array(uuid),
});

const availabilityFields = z.object({
  staffId: uuid,
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: time,
  endTime: time,
});

export const availabilityInput = availabilityFields
  .refine((v) => v.startTime < v.endTime, {
    message: "End must be after start.",
    path: ["endTime"],
  });

export const availabilityUpdateInput = availabilityFields
  .extend({ id: uuid })
  .refine((v) => v.startTime < v.endTime, {
    message: "End must be after start.",
    path: ["endTime"],
  });

export const holidayInput = z.object({
  date,
  staffId: uuid.optional(),
  reason: z.string().trim().max(120).optional(),
});

export const serviceInput = z.object({
  id: uuid.optional(),
  name: z.string().trim().min(1).max(80),
  type: serviceType,
  durationMinutes: z.coerce.number().int().min(5).max(480),
  price: z.coerce.number().min(0).max(9999),
  allowedRole: staffRole,
  isAddon: z.boolean().default(false),
  isPackage: z.boolean().default(false),
});

export const promotionInput = z
  .object({
    name: z.string().trim().min(1).max(80),
    triggerType: promotionTrigger,
    triggerServiceId: uuid.optional(),
    rewardType,
    rewardServiceId: uuid.optional(),
    rewardAmount: z.coerce.number().min(0).max(9999).optional(),
    expiresAt: date.optional(),
  })
  .refine((v) => v.rewardType !== "free_addon" || !!v.rewardServiceId, {
    message: "Pick the free add-on service.",
    path: ["rewardServiceId"],
  })
  .refine((v) => v.rewardType === "free_addon" || v.rewardAmount != null, {
    message: "Set the reward amount.",
    path: ["rewardAmount"],
  });

export const idInput = z.object({ id: uuid });
export const toggleInput = z.object({ id: uuid, active: z.boolean() });

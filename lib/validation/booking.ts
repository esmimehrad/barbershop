import { z } from "zod";

export const bookingInput = z.object({
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  startISO: z.string().min(1),
  addonIds: z.array(z.string().uuid()),
  applyCredit: z.boolean(),
});

export type BookingInput = z.infer<typeof bookingInput>;

export const appointmentActionInput = z.object({
  appointmentId: z.string().uuid(),
});

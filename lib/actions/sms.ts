"use server";

import { getSessionContext } from "@/lib/auth";
import { sendSms, sendWhatsApp, type SendSmsResult } from "@/lib/sms/twilio";

/**
 * DEV test send (proves the Twilio wiring). Delivery goes to
 * TWILIO_TEST_RECIPIENT — set it to a real mobile first.
 */
export async function sendTestSms(): Promise<SendSmsResult> {
  const session = await getSessionContext();
  if (!session.userId) return { ok: false, error: "Sign in first." };

  const to = process.env.TWILIO_TEST_RECIPIENT;
  if (!to) return { ok: false, error: "Set TWILIO_TEST_RECIPIENT to a phone number." };

  return sendSms({
    to,
    body: "Hello from the barbershop app — Twilio SMS is working.",
  });
}

/**
 * DEV test WhatsApp send. Requires an open 24h session (message the sender
 * from your phone first) since there's no approved template yet.
 */
export async function sendTestWhatsApp(): Promise<SendSmsResult> {
  const session = await getSessionContext();
  if (!session.userId) return { ok: false, error: "Sign in first." };

  const to = process.env.TWILIO_TEST_RECIPIENT;
  if (!to) return { ok: false, error: "Set TWILIO_TEST_RECIPIENT to a phone number." };

  return sendWhatsApp({
    to,
    body: "Hello from the barbershop app — Twilio WhatsApp is working.",
  });
}

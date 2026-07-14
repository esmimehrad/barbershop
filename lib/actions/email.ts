"use server";

import { getSessionContext } from "@/lib/auth";
import { sendEmail, type SendEmailResult } from "@/lib/email/resend";

/**
 * DEV test send (proves the Resend wiring). Any signed-in user may trigger it;
 * delivery goes to RESEND_TEST_RECIPIENT.
 */
export async function sendTestEmail(): Promise<SendEmailResult> {
  const session = await getSessionContext();
  if (!session.userId) return { ok: false, error: "Sign in first." };

  return sendEmail({
    to: process.env.RESEND_TEST_RECIPIENT ?? "soroushziaee1@gmail.com",
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong> from the barbershop app!</p>",
  });
}

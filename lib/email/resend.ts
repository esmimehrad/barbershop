import "server-only";
import { Resend } from "resend";

const DEFAULT_FROM = process.env.RESEND_FROM ?? "onboarding@resend.dev";

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export type SendEmailResult = { ok: boolean; id?: string; error?: string };

/**
 * Send a transactional email via Resend. Server-only.
 *
 * RESEND_TEST_RECIPIENT (dev) redirects all mail to a single inbox until a
 * sending domain is verified in Resend — so nothing leaks to real addresses
 * during the draft. Callers pass the intended `to`; the override wins if set.
 */
export async function sendEmail({
  to,
  subject,
  html,
  from,
}: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not set" };

  const recipient = process.env.RESEND_TEST_RECIPIENT || to;
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: from ?? DEFAULT_FROM,
    to: recipient,
    subject,
    html,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data?.id };
}

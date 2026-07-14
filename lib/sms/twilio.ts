import "server-only";

const BASE_URL = "https://api.twilio.com/2010-04-01";

export type SendSmsInput = { to: string; body: string };
export type SendSmsResult = { ok: boolean; sid?: string; error?: string };

async function postMessage(params: Record<string, string>): Promise<SendSmsResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const keySid = process.env.TWILIO_API_KEY_SID;
  const keySecret = process.env.TWILIO_API_KEY_SECRET;
  if (!accountSid || !keySid || !keySecret) {
    return { ok: false, error: "Twilio env is not fully set" };
  }
  const auth = Buffer.from(`${keySid}:${keySecret}`).toString("base64");
  const res = await fetch(`${BASE_URL}/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
  });
  const data = (await res.json()) as { sid?: string; message?: string };
  if (!res.ok) return { ok: false, error: data.message ?? `Twilio error ${res.status}` };
  return { ok: true, sid: data.sid };
}

/**
 * Send an SMS via the Twilio Messages REST API. Server-only.
 *
 * Auth uses the API key (SID + secret) per Twilio's production guidance; the
 * account SID identifies the resource path. TWILIO_TEST_RECIPIENT (dev)
 * redirects all SMS to one number so nothing leaks to real customers yet.
 */
export async function sendSms({ to, body }: SendSmsInput): Promise<SendSmsResult> {
  const from = process.env.TWILIO_FROM;
  if (!from) return { ok: false, error: "TWILIO_FROM is not set" };
  const recipient = process.env.TWILIO_TEST_RECIPIENT || to;
  return postMessage({ To: recipient, From: from, Body: body });
}

/**
 * Send a WhatsApp message via Twilio. Free-form text only reaches a user
 * within a 24h session (after they message the sender); business-initiated
 * notifications require an approved template — wire that when templates exist.
 */
export async function sendWhatsApp({ to, body }: SendSmsInput): Promise<SendSmsResult> {
  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!from) return { ok: false, error: "TWILIO_WHATSAPP_FROM is not set" };
  const raw = process.env.TWILIO_TEST_RECIPIENT || to;
  const recipient = raw.startsWith("whatsapp:") ? raw : `whatsapp:${raw}`;
  return postMessage({ To: recipient, From: from, Body: body });
}

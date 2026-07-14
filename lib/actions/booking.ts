"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionContext } from "@/lib/auth";
import { getService, getServicesByIds } from "@/lib/data/services";
import {
  getClientCreditBalance,
  getCreditPolicy,
  maxCreditApplicable,
} from "@/lib/data/credit";
import { bookingInput } from "@/lib/validation/booking";
import { sendEmail } from "@/lib/email/resend";
import { sendSms } from "@/lib/sms/twilio";

function fail(message: string): never {
  redirect(`/book/review?error=${encodeURIComponent(message)}`);
}

/**
 * Create a booking. Validates + authorizes, then writes the appointment and
 * its add-ons. Slot conflict, two-track eligibility, and amount_due are
 * enforced by DB triggers — not re-implemented here.
 */
export async function bookAppointment(formData: FormData) {
  const addonsRaw = String(formData.get("addonIds") ?? "");
  const parsed = bookingInput.safeParse({
    serviceId: formData.get("serviceId"),
    staffId: formData.get("staffId"),
    startISO: formData.get("startISO"),
    addonIds: addonsRaw ? addonsRaw.split(",").filter(Boolean) : [],
    applyCredit: formData.get("applyCredit") === "on",
  });
  if (!parsed.success) fail("Invalid booking details.");
  const input = parsed.data;

  const session = await getSessionContext();
  if (!session.clientId) fail("Sign in as a customer to book.");
  const clientId = session.clientId;

  const service = await getService(input.serviceId);
  if (!service) fail("Service not found.");

  const addons = await getServicesByIds(input.addonIds);
  const addonsSnapshot = addons.reduce((sum, a) => sum + a.price, 0);
  const priceSnapshot = service.price;

  let creditApplied = 0;
  if (input.applyCredit) {
    const policy = await getCreditPolicy();
    const balance = await getClientCreditBalance(clientId);
    creditApplied = maxCreditApplicable(
      balance,
      priceSnapshot,
      policy?.redemption_cap_pct ?? 0,
    );
  }

  const startsAt = new Date(input.startISO);
  const endsAt = new Date(startsAt.getTime() + service.duration_minutes * 60_000);
  const amountDue = priceSnapshot + addonsSnapshot - creditApplied;

  const supabase = await createClient();
  const { data: appt, error } = await supabase
    .from("appointment")
    .insert({
      client_id: clientId,
      staff_id: input.staffId,
      service_id: input.serviceId,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "booked",
      price_snapshot: priceSnapshot,
      addons_snapshot: addonsSnapshot,
      credit_applied: creditApplied,
      amount_due: amountDue,
    })
    .select("id")
    .single();

  if (error || !appt) fail(error?.message ?? "Could not create the booking.");

  if (addons.length > 0) {
    await supabase.from("appointment_addon").insert(
      addons.map((a) => ({
        appointment_id: appt.id,
        service_id: a.id,
        price_snapshot: a.price,
      })),
    );
  }

  if (creditApplied > 0) {
    await supabase.from("credit_transaction").insert({
      client_id: clientId,
      appointment_id: appt.id,
      amount: -creditApplied,
      reason: "redemption",
    });
  }

  // Confirmation notifications — best-effort: a send failure must never block a booking.
  const when = startsAt.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const recipient = process.env.RESEND_TEST_RECIPIENT ?? user?.email ?? undefined;
    if (recipient) {
      await sendEmail({
        to: recipient,
        subject: "Your booking is confirmed",
        html: `<p>You're booked for <strong>${service.name}</strong> on ${when}.</p>
<p>Amount due at the shop: <strong>$${amountDue.toFixed(2)}</strong>.</p>`,
      });
    }
  } catch {
    /* email is non-critical; the booking already succeeded */
  }

  try {
    const { data: client } = await supabase
      .from("client")
      .select("phone")
      .eq("id", clientId)
      .maybeSingle();
    if (client?.phone) {
      await sendSms({
        to: client.phone,
        body: `Booked: ${service.name} on ${when}. Amount due at the shop: $${amountDue.toFixed(2)}.`,
      });
    }
  } catch {
    /* SMS is non-critical; the booking already succeeded */
  }

  revalidatePath("/dashboard");
  revalidatePath("/account");
  redirect(`/book/confirmed?id=${appt.id}`);
}

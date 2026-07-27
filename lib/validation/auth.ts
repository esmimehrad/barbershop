import { z } from "zod";

/**
 * Countries accepted for phone sign-in — Canada only for now. This is the
 * single source of truth for the dial code the form offers and the format the
 * server validates; add an entry here (and its regex below) to support more.
 */
export const SUPPORTED_COUNTRIES = [
  { code: "CA", label: "Canada", dialCode: "+1", flag: "🇨🇦" },
] as const;

export type SupportedCountryCode = (typeof SUPPORTED_COUNTRIES)[number]["code"];

/** Digits in a North American Numbering Plan national number. */
export const NATIONAL_NUMBER_LENGTH = 10;

// Canada uses the NANP: +1 then a 10-digit number whose area code and exchange
// each start with 2-9.
const canadianPhone = /^\+1[2-9]\d{2}[2-9]\d{6}$/;

export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

export const phoneOtpRequestInput = z.object({
  phone: z
    .string()
    .transform(normalizePhone)
    .refine((value) => canadianPhone.test(value), {
      message: "Enter a valid Canadian mobile number, such as (416) 555-0123.",
    }),
  // These arrive from FormData.get(), which yields null (not undefined) when the
  // field is absent — e.g. no captcha token when Turnstile is disabled.
  returnTo: z.string().nullish(),
  captchaToken: z.string().nullish(),
});

export const phoneOtpVerifyInput = z.object({
  token: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => /^\d{6}$/.test(value), {
      message: "Enter the six-digit code from the text message.",
    }),
});

const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailField = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .refine((value) => email.test(value), {
    message: "Enter a valid email address.",
  });

/** Staff / owner email + password sign-in (customers use phone OTP). */
export const staffLoginInput = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password."),
  returnTo: z.string().nullish(),
});

export const passwordResetRequestInput = z.object({
  email: emailField,
});

export const passwordUpdateInput = z.object({
  password: z.string().min(8, "Use at least 8 characters."),
});

export const clientProfileInput = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(100, "Name must be 100 characters or fewer."),
});


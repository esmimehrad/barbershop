"use client";

import { useActionState, useState } from "react";
import { requestPhoneOtp, type AuthActionState } from "@/lib/actions/auth";
import { Field, Input, Select } from "@/components/ui/field";
import { SubmitButton } from "@/features/admin-config/action-form";
import {
  NATIONAL_NUMBER_LENGTH,
  SUPPORTED_COUNTRIES,
} from "@/lib/validation/auth";
import { TurnstileWidget } from "./TurnstileWidget";

const INITIAL_STATE: AuthActionState = {};

/**
 * Extract the 10-digit national number from whatever the user typed or pasted,
 * dropping a leading "1"/"+1" NANP country code they may have included.
 */
function toNationalDigits(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > NATIONAL_NUMBER_LENGTH && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, NATIONAL_NUMBER_LENGTH);
}

/** Format up to 10 NANP digits as "(416) 555-0123" while typing. */
function formatNationalNumber(digits: string): string {
  const d = digits.slice(0, NATIONAL_NUMBER_LENGTH);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function PhoneLoginForm({
  returnTo,
  turnstileSiteKey,
}: {
  returnTo: string;
  turnstileSiteKey?: string;
}) {
  const [state, formAction] = useActionState(requestPhoneOtp, INITIAL_STATE);
  const [countryCode, setCountryCode] = useState<string>(
    SUPPORTED_COUNTRIES[0].code,
  );
  const [nationalDigits, setNationalDigits] = useState("");

  const country =
    SUPPORTED_COUNTRIES.find((entry) => entry.code === countryCode) ??
    SUPPORTED_COUNTRIES[0];
  const e164Phone = `${country.dialCode}${nationalDigits}`;
  const hasError = Boolean(state.fieldErrors?.phone);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="returnTo" value={returnTo} />
      <input type="hidden" name="phone" value={e164Phone} />

      <Field
        label="Mobile number"
        htmlFor="phone-national"
        hint="We will text a six-digit code to this Canadian number."
        error={state.fieldErrors?.phone}
      >
        <div className="flex gap-2">
          <Select
            aria-label="Country"
            className="w-auto shrink-0"
            value={countryCode}
            onChange={(event) => setCountryCode(event.target.value)}
          >
            {SUPPORTED_COUNTRIES.map((entry) => (
              <option key={entry.code} value={entry.code}>
                {entry.flag} {entry.dialCode}
              </option>
            ))}
          </Select>
          <Input
            id="phone-national"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="(416) 555-0123"
            value={formatNationalNumber(nationalDigits)}
            onChange={(event) =>
              setNationalDigits(toNationalDigits(event.target.value))
            }
            aria-invalid={hasError}
            aria-describedby={hasError ? "phone-error" : "phone-hint"}
            required
            autoFocus
          />
        </div>
      </Field>

      <TurnstileWidget siteKey={turnstileSiteKey} />

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton className="w-full" pendingLabel="Sending code…">
        Text me a code
      </SubmitButton>
    </form>
  );
}

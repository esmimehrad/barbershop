"use client";

import { useActionState, useEffect, useState } from "react";
import {
  resendPhoneOtp,
  verifyPhoneOtp,
  type AuthActionState,
} from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SubmitButton } from "@/features/admin-config/action-form";

const INITIAL_STATE: AuthActionState = {};

export function OtpForm() {
  const [verifyState, verifyAction] = useActionState(
    verifyPhoneOtp,
    INITIAL_STATE,
  );

  return (
    <div className="flex flex-col gap-4">
      <form action={verifyAction} className="flex flex-col gap-4">
        <Field
          label="Verification code"
          htmlFor="token"
          hint="The code contains six digits."
          error={verifyState.fieldErrors?.token}
        >
          <Input
            id="token"
            name="token"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            className="text-center text-lg tracking-[0.35em] tabular-nums"
            aria-invalid={Boolean(verifyState.fieldErrors?.token)}
            required
            autoFocus
          />
        </Field>

        {verifyState.error ? (
          <p className="text-sm text-destructive" role="alert">
            {verifyState.error}
          </p>
        ) : null}

        <SubmitButton className="w-full" pendingLabel="Checking code…">
          Verify and continue
        </SubmitButton>
      </form>

      <ResendCodeForm />
    </div>
  );
}

function ResendCodeForm() {
  const [state, formAction] = useActionState(resendPhoneOtp, INITIAL_STATE);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(
      () => setSeconds((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [seconds]);

  return (
    <form action={formAction} className="flex flex-col items-center gap-2">
      <Button
        type="submit"
        variant="ghost"
        disabled={seconds > 0}
        onClick={() => setSeconds(60)}
        className="w-full"
      >
        {seconds > 0 ? `Resend code in ${seconds}s` : "Resend code"}
      </Button>
      {state.error ? (
        <p className="text-xs text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="text-xs text-muted-foreground" role="status">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

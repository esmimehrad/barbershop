"use client";

import { useActionState } from "react";
import {
  requestPasswordReset,
  type AuthActionState,
} from "@/lib/actions/auth";
import { Field, Input } from "@/components/ui/field";
import { SubmitButton } from "@/features/admin-config/action-form";

const INITIAL_STATE: AuthActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    requestPasswordReset,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="email" error={state.fieldErrors?.email}>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@fadehouse.com"
          aria-invalid={Boolean(state.fieldErrors?.email)}
          required
          autoFocus
        />
      </Field>

      {state.message ? (
        <p className="text-sm text-muted-foreground" role="status">
          {state.message}
        </p>
      ) : null}
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton className="w-full" pendingLabel="Sending…">
        Email me a reset link
      </SubmitButton>
    </form>
  );
}

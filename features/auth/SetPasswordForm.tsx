"use client";

import { useActionState } from "react";
import {
  updateStaffPassword,
  type AuthActionState,
} from "@/lib/actions/auth";
import { Field, Input } from "@/components/ui/field";
import { SubmitButton } from "@/features/admin-config/action-form";

const INITIAL_STATE: AuthActionState = {};

export function SetPasswordForm() {
  const [state, formAction] = useActionState(
    updateStaffPassword,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="New password"
        htmlFor="password"
        hint="Use at least 8 characters."
        error={state.fieldErrors?.password}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(state.fieldErrors?.password)}
          required
          autoFocus
        />
      </Field>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton className="w-full" pendingLabel="Saving…">
        Set password
      </SubmitButton>
    </form>
  );
}

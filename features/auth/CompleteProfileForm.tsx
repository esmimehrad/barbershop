"use client";

import { useActionState } from "react";
import {
  completeClientProfile,
  type AuthActionState,
} from "@/lib/actions/auth";
import { Field, Input } from "@/components/ui/field";
import { SubmitButton } from "@/features/admin-config/action-form";

const INITIAL_STATE: AuthActionState = {};

export function CompleteProfileForm() {
  const [state, formAction] = useActionState(
    completeClientProfile,
    INITIAL_STATE,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Full name"
        htmlFor="name"
        hint="We use this name for appointments and reminders."
        error={state.fieldErrors?.name}
      >
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          required
          autoFocus
        />
      </Field>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton className="w-full" pendingLabel="Creating profile…">
        Create my account
      </SubmitButton>
    </form>
  );
}


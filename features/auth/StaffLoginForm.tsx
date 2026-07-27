"use client";

import Link from "next/link";
import { useActionState } from "react";
import { staffSignIn, type AuthActionState } from "@/lib/actions/auth";
import { Field, Input } from "@/components/ui/field";
import { SubmitButton } from "@/features/admin-config/action-form";

const INITIAL_STATE: AuthActionState = {};

export function StaffLoginForm({ returnTo }: { returnTo: string }) {
  const [state, formAction] = useActionState(staffSignIn, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="returnTo" value={returnTo} />

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

      <Field
        label="Password"
        htmlFor="password"
        error={state.fieldErrors?.password}
      >
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(state.fieldErrors?.password)}
          required
        />
      </Field>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton className="w-full" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>

      <Link
        href="/auth/staff/forgot"
        className="min-h-11 text-center text-sm text-muted-foreground underline underline-offset-4"
      >
        Forgot your password?
      </Link>
    </form>
  );
}

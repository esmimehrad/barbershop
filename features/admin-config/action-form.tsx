"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { ActionResult } from "@/lib/actions/admin";

type Action = (formData: FormData) => Promise<ActionResult>;

/**
 * Client wrapper around an admin Server Action. Renders a `<form>`, tracks the
 * returned `{ ok, error }`, and shows an inline error. The submit button reads
 * pending state via <SubmitButton>. Keeps the tabs server-first — only this
 * island is a Client Component.
 */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState(
    async (_prev: ActionResult, fd: FormData) => action(fd),
    { ok: true },
  );
  return (
    <form action={formAction} className={className}>
      {children}
      {state.error ? (
        <p className="text-xs text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}

/** Submit button that disables + relabels while its form is pending. */
export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  ...props
}: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingLabel : children}
    </Button>
  );
}

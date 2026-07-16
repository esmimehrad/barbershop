"use client";

import { Trash2 } from "lucide-react";
import { type ActionResult } from "@/lib/actions/admin";
import { ActionForm, SubmitButton } from "./action-form";

type RemoveAction = (formData: FormData) => Promise<ActionResult>;

/** Icon-only removal action with a confirmation before the server mutation. */
export function ConfirmRemoval({
  action,
  id,
  description,
}: {
  action: RemoveAction;
  id: string;
  description: string;
}) {
  return (
    <ActionForm action={action}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton
        variant="ghost"
        pendingLabel="…"
        className="size-11 shrink-0 px-0"
        aria-label={`Remove ${description}`}
        title={`Remove ${description}`}
        onClick={(event) => {
          if (!window.confirm(`Remove ${description}?`)) event.preventDefault();
        }}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </SubmitButton>
    </ActionForm>
  );
}

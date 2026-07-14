"use client";

import { useState, useTransition } from "react";
import { sendTestEmail } from "@/lib/actions/email";
import { Button } from "@/components/ui/button";

/** DEV: fire the Resend "Hello World" test and show the result inline. */
export function SendTestEmailButton() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setMessage(null);
            const res = await sendTestEmail();
            setMessage(res.ok ? `Sent ✓ (${res.id ?? "ok"})` : `Failed: ${res.error}`);
          })
        }
      >
        {pending ? "Sending…" : "Send test email (Resend)"}
      </Button>
      {message ? (
        <span className="text-xs text-muted-foreground" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}

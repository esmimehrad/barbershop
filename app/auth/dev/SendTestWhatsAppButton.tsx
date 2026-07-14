"use client";

import { useState, useTransition } from "react";
import { sendTestWhatsApp } from "@/lib/actions/sms";
import { Button } from "@/components/ui/button";

/** DEV: fire a Twilio WhatsApp test (needs an open 24h session) and show the result. */
export function SendTestWhatsAppButton() {
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
            const res = await sendTestWhatsApp();
            setMessage(res.ok ? `Sent ✓ (${res.sid ?? "ok"})` : `Failed: ${res.error}`);
          })
        }
      >
        {pending ? "Sending…" : "Send test WhatsApp (Twilio)"}
      </Button>
      {message ? (
        <span className="text-xs text-muted-foreground" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}

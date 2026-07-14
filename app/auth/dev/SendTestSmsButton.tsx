"use client";

import { useState, useTransition } from "react";
import { sendTestSms } from "@/lib/actions/sms";
import { Button } from "@/components/ui/button";

/** DEV: fire a Twilio test SMS and show the result inline. */
export function SendTestSmsButton() {
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
            const res = await sendTestSms();
            setMessage(res.ok ? `Sent ✓ (${res.sid ?? "ok"})` : `Failed: ${res.error}`);
          })
        }
      >
        {pending ? "Sending…" : "Send test SMS (Twilio)"}
      </Button>
      {message ? (
        <span className="text-xs text-muted-foreground" role="status">
          {message}
        </span>
      ) : null}
    </div>
  );
}

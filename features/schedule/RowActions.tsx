"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { markCompleted, markNoShow, releaseSlot } from "@/lib/actions/appointments";

/** One-tap staff actions for a booked appointment. Destructive ones confirm. */
export function RowActions({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (status !== "booked") return null;

  function run(fn: (id: string) => Promise<{ ok: boolean; error?: string }>) {
    setError(null);
    startTransition(async () => {
      const res = await fn(id);
      if (!res.ok) setError(res.error ?? "Action failed.");
    });
  }

  function confirmRun(
    message: string,
    fn: (id: string) => Promise<{ ok: boolean; error?: string }>,
  ) {
    if (window.confirm(message)) run(fn);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-3 gap-1">
        <Button
          className="w-full px-2 text-xs whitespace-nowrap"
          disabled={pending}
          onClick={() => run(markCompleted)}
        >
          Done
        </Button>
        <Button
          className="w-full px-2 text-xs whitespace-nowrap"
          variant="secondary"
          disabled={pending}
          onClick={() =>
            confirmRun("Release this slot (past the 10-min grace)?", releaseSlot)
          }
        >
          Late
        </Button>
        <Button
          className="w-full px-2 text-xs whitespace-nowrap"
          variant="destructive"
          disabled={pending}
          onClick={() => confirmRun("Mark this appointment a no-show?", markNoShow)}
        >
          No-show
        </Button>
      </div>
      {error ? (
        <span className="text-xs text-destructive" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

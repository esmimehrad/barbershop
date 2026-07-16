"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleService } from "@/lib/actions/admin";

/** Activates immediately and confirms before removing a service from booking. */
export function ServiceStatusControl({
  serviceId,
  serviceName,
  isActive,
}: {
  serviceId: string;
  serviceName: string;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const [displayActive, setDisplayActive] = useState(isActive);
  const dialog = useRef<HTMLDivElement>(null);
  const switchVisuals = displayActive
    ? { thumb: "translate-x-0.5 bg-success" }
    : { thumb: "translate-x-3.5 bg-[var(--switch-thumb-off)]" };
  const errorId = `service-status-error-${serviceId}`;

  function updateStatus(nextActive: boolean) {
    const formData = new FormData();
    formData.set("id", serviceId);
    formData.set("active", String(nextActive));
    setError(undefined);

    startTransition(async () => {
      const result = await toggleService(formData);
      if (result.ok) {
        setDisplayActive(nextActive);
        setOpen(false);
      } else {
        setError(result.error ?? "Unable to update this service.");
      }
    });
  }

  function handleAvailabilityClick() {
    if (displayActive) {
      setError(undefined);
      setOpen(true);
    } else {
      updateStatus(true);
    }
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialog.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          role="switch"
          aria-checked={displayActive}
          aria-describedby={error && !open ? errorId : undefined}
          aria-busy={pending}
          data-state={displayActive ? "active" : "inactive"}
          aria-label={`${serviceName} booking availability`}
          title={displayActive ? "Active for booking" : "Inactive for booking"}
          disabled={pending}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          onClick={handleAvailabilityClick}
        >
          <span
            aria-hidden="true"
            className="relative h-5 w-8 rounded-full border border-border bg-muted"
          >
            <span
              className={`absolute left-0 top-0.5 size-4 rounded-full shadow-sm transition-transform ${switchVisuals.thumb}`}
            />
          </span>
        </button>
        {error && !open ? (
          <span id={errorId} className="max-w-40 text-right text-xs text-destructive" role="alert">
            {error}
          </span>
        ) : null}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`service-status-heading-${serviceId}`}
            className="w-full max-w-md rounded-[var(--radius)] border border-border bg-card p-5 shadow-lg"
          >
            <h2 id={`service-status-heading-${serviceId}`} className="text-base font-semibold">
              Deactivate {serviceName}?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Customers will no longer be able to book this service. Existing appointments are unchanged.
            </p>

            <form
              className="mt-5 flex flex-wrap justify-end gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                updateStatus(false);
              }}
            >
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={pending}>
                {pending ? "Updating…" : "Deactivate service"}
              </Button>
            </form>
            {error ? (
              <p className="mt-3 text-xs text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

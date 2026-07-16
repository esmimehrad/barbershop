"use client";

import { Check, Clock3, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import {
  addAvailability,
  deleteAvailability,
  updateAvailability,
} from "@/lib/actions/admin";
import type { Availability, Staff } from "@/lib/data/admin";
import { ActionForm, SubmitButton } from "./action-form";
import { ConfirmRemoval } from "./confirm-removal";

const DAYS = [
  { label: "Sun", fullLabel: "Sunday" },
  { label: "Mon", fullLabel: "Monday" },
  { label: "Tue", fullLabel: "Tuesday" },
  { label: "Wed", fullLabel: "Wednesday" },
  { label: "Thu", fullLabel: "Thursday" },
  { label: "Fri", fullLabel: "Friday" },
  { label: "Sat", fullLabel: "Saturday" },
];

export function WeeklyHoursEditor({
  member,
  availability,
}: {
  member: Staff;
  availability: Availability[];
}) {
  const [selectedDay, setSelectedDay] = useState(() => availability[0]?.day_of_week ?? 1);
  const selectedWindows = useMemo(
    () => availability
      .filter((window) => window.day_of_week === selectedDay)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [availability, selectedDay],
  );
  const workingDays = new Set(availability.map((window) => window.day_of_week)).size;
  const selected = DAYS[selectedDay];

  return (
    <section className="flex flex-col gap-3" aria-labelledby="weekly-hours-heading">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 id="weekly-hours-heading" className="text-sm font-semibold">Weekly hours</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {workingDays} working day{workingDays === 1 ? "" : "s"} · {availability.length} time range{availability.length === 1 ? "" : "s"}
          </p>
        </div>
        {!member.is_active ? <Badge>inactive</Badge> : null}
      </div>

      <Card>
        <CardContent className="p-3">
          <div
            className="grid grid-cols-7 gap-1"
            role="tablist"
            aria-label="Days of the week"
          >
            {DAYS.map((day, dayOfWeek) => {
              const isSelected = dayOfWeek === selectedDay;
              const rangeCount = availability.filter((window) => window.day_of_week === dayOfWeek).length;
              return (
                <button
                  key={day.label}
                  type="button"
                  role="tab"
                  id={`schedule-day-${dayOfWeek}`}
                  aria-controls="schedule-day-panel"
                  aria-selected={isSelected}
                  onClick={() => setSelectedDay(dayOfWeek)}
                  className={`min-h-11 rounded-[var(--radius)] px-1 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  <span className="block">{day.label}</span>
                  <span className="block text-[10px] opacity-80">{rangeCount || "—"}</span>
                </button>
              );
            })}
          </div>

          <div
            id="schedule-day-panel"
            role="tabpanel"
            aria-labelledby={`schedule-day-${selectedDay}`}
            className="mt-4 border-t border-border pt-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold">{selected.fullLabel}</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedWindows.length === 0 ? "Closed" : `${selectedWindows.length} time range${selectedWindows.length === 1 ? "" : "s"}`}
                </p>
              </div>
            </div>

            {selectedWindows.length > 0 ? (
              <ul className="mt-3 flex flex-col divide-y divide-border border-y border-border">
                {selectedWindows.map((window) => (
                  <li key={window.id} className="flex items-start gap-2 py-3">
                    <ActionForm
                      action={updateAvailability}
                      className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] items-end gap-2"
                    >
                      <input type="hidden" name="id" value={window.id} />
                      <input type="hidden" name="staffId" value={member.id} />
                      <input type="hidden" name="dayOfWeek" value={selectedDay} />
                      <Input
                        name="startTime"
                        type="time"
                        defaultValue={toHHMM(window.start_time)}
                        aria-label={`Start time for ${selected.fullLabel}`}
                        required
                      />
                      <Input
                        name="endTime"
                        type="time"
                        defaultValue={toHHMM(window.end_time)}
                        aria-label={`End time for ${selected.fullLabel}`}
                        required
                      />
                      <SubmitButton
                        variant="secondary"
                        pendingLabel="…"
                        className="size-11 px-0"
                        aria-label={`Save hours for ${selected.fullLabel}`}
                        title={`Save hours for ${selected.fullLabel}`}
                      >
                        <Check className="size-4" aria-hidden="true" />
                      </SubmitButton>
                    </ActionForm>
                    <ConfirmRemoval
                      action={deleteAvailability}
                      id={window.id}
                      description={`${toHHMM(window.start_time)}–${toHHMM(window.end_time)} on ${selected.fullLabel}`}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-3 flex min-h-16 items-center gap-2 border-y border-border text-sm text-muted-foreground">
                <Clock3 className="size-4" aria-hidden="true" />
                No hours set for {selected.fullLabel}.
              </div>
            )}

            <ActionForm
              action={addAvailability}
              className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              <input type="hidden" name="staffId" value={member.id} />
              <input type="hidden" name="dayOfWeek" value={selectedDay} />
              <Field label="Start" htmlFor={`start-${selectedDay}`}>
                <Input id={`start-${selectedDay}`} name="startTime" type="time" required />
              </Field>
              <Field label="End" htmlFor={`end-${selectedDay}`}>
                <Input id={`end-${selectedDay}`} name="endTime" type="time" required />
              </Field>
              <SubmitButton className="self-end">
                <Plus className="size-4" aria-hidden="true" />
                Add hours
              </SubmitButton>
            </ActionForm>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function toHHMM(value: string): string {
  return value.slice(0, 5);
}

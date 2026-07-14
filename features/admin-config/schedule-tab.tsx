import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import {
  addAvailability,
  addHoliday,
  deleteAvailability,
  deleteHoliday,
} from "@/lib/actions/admin";
import type { Availability, Holiday, Staff } from "@/lib/data/admin";
import { ActionForm, SubmitButton } from "./action-form";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hhmm = (t: string) => t.slice(0, 5);

/** Weekly working hours + closures (FS-11.3) → staff_availability, holiday_closure. */
export function ScheduleTab({
  staff,
  availability,
  holidays,
}: {
  staff: Staff[];
  availability: Availability[];
  holidays: Holiday[];
}) {
  const staffName = (id: string | null) =>
    id ? (staff.find((s) => s.id === id)?.name ?? "Unknown") : "Whole shop";

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Weekly hours</h3>
        <ul className="flex flex-col gap-1">
          {availability.map((w) => (
            <li key={w.id}>
              <Card>
                <CardContent className="flex items-center justify-between py-2 text-sm">
                  <span className="tabular-nums">
                    {staffName(w.staff_id)} · {DAYS[w.day_of_week]} {hhmm(w.start_time)}–
                    {hhmm(w.end_time)}
                  </span>
                  <ActionForm action={deleteAvailability}>
                    <input type="hidden" name="id" value={w.id} />
                    <SubmitButton variant="ghost" pendingLabel="…" aria-label="Remove window">
                      ✕
                    </SubmitButton>
                  </ActionForm>
                </CardContent>
              </Card>
            </li>
          ))}
          {availability.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hours set yet.</p>
          ) : null}
        </ul>

        <Card>
          <CardContent className="py-3">
            <ActionForm action={addAvailability} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Staff" htmlFor="av-staff">
                  <Select id="av-staff" name="staffId" required>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Day" htmlFor="av-day">
                  <Select id="av-day" name="dayOfWeek" defaultValue="1">
                    {DAYS.map((d, i) => (
                      <option key={d} value={i}>
                        {d}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Start" htmlFor="av-start">
                  <Input id="av-start" name="startTime" type="time" required />
                </Field>
                <Field label="End" htmlFor="av-end">
                  <Input id="av-end" name="endTime" type="time" required />
                </Field>
              </div>
              <SubmitButton className="self-start">Add hours</SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Closures</h3>
        <p className="text-xs text-muted-foreground">
          Closures remove future bookable slots. Existing appointments are not auto-cancelled —
          handle them manually.
        </p>
        <ul className="flex flex-col gap-1">
          {holidays.map((h) => (
            <li key={h.id}>
              <Card>
                <CardContent className="flex items-center justify-between py-2 text-sm">
                  <span className="tabular-nums">
                    {h.date} · {staffName(h.staff_id)}
                    {h.reason ? ` · ${h.reason}` : ""}
                  </span>
                  <ActionForm action={deleteHoliday}>
                    <input type="hidden" name="id" value={h.id} />
                    <SubmitButton variant="ghost" pendingLabel="…" aria-label="Remove closure">
                      ✕
                    </SubmitButton>
                  </ActionForm>
                </CardContent>
              </Card>
            </li>
          ))}
          {holidays.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming closures.</p>
          ) : null}
        </ul>

        <Card>
          <CardContent className="py-3">
            <ActionForm action={addHoliday} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Date" htmlFor="hol-date">
                  <Input id="hol-date" name="date" type="date" required />
                </Field>
                <Field label="Staff (optional)" htmlFor="hol-staff">
                  <Select id="hol-staff" name="staffId" defaultValue="">
                    <option value="">Whole shop</option>
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="Reason (optional)" htmlFor="hol-reason">
                <Input id="hol-reason" name="reason" placeholder="Holiday, vacation…" />
              </Field>
              <SubmitButton className="self-start">Add closure</SubmitButton>
            </ActionForm>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

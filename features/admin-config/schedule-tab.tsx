import Link from "next/link";
import { CalendarDays, ChevronRight, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { addHoliday, deleteHoliday } from "@/lib/actions/admin";
import type { Availability, Holiday, Staff, StaffWithContact } from "@/lib/data/admin";
import { staffDisplayName, staffSearchHaystack } from "@/lib/staff-name";
import { ActionForm, SubmitButton } from "./action-form";
import { ConfirmRemoval } from "./confirm-removal";
import { WeeklyHoursEditor } from "./weekly-hours-editor";

type ScheduleView = "schedules" | "closures";

export function ScheduleTab({
  staff,
  availability,
  holidays,
  selectedStaffId,
  scheduleQuery = "",
  view,
  closureQuery = "",
  closureStaffId,
}: {
  staff: StaffWithContact[];
  availability: Availability[];
  holidays: Holiday[];
  selectedStaffId?: string;
  scheduleQuery?: string;
  view?: string;
  closureQuery?: string;
  closureStaffId?: string;
}) {
  if (view === "closures") {
    return (
      <ClosureManager
        staff={staff}
        holidays={holidays}
        scheduleQuery={scheduleQuery}
        closureQuery={closureQuery}
        closureStaffId={closureStaffId}
      />
    );
  }

  const selectedStaff = staff.find((member) => member.id === selectedStaffId);
  if (selectedStaff) {
    return (
      <StaffScheduleEditor
        member={selectedStaff}
        availability={availability.filter((window) => window.staff_id === selectedStaff.id)}
        scheduleQuery={scheduleQuery}
      />
    );
  }

  return (
    <ScheduleDirectory
      staff={staff}
      availability={availability}
      scheduleQuery={scheduleQuery}
    />
  );
}

function ScheduleDirectory({
  staff,
  availability,
  scheduleQuery,
}: {
  staff: StaffWithContact[];
  availability: Availability[];
  scheduleQuery: string;
}) {
  const query = scheduleQuery.trim().toLocaleLowerCase();
  const filteredStaff = staff.filter(
    (member) => !query || staffSearchHaystack(member).includes(query),
  );

  return (
    <section className="flex flex-col gap-4" aria-labelledby="schedule-directory-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="schedule-directory-heading" className="text-base font-semibold">
            Weekly schedules
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose a staff member to manage their hours.</p>
        </div>
        <Link
          href={scheduleHref({ view: "closures", scheduleQuery })}
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] border border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CalendarDays className="size-4" aria-hidden="true" />
          Closures
        </Link>
      </div>

      <form
        key={scheduleQuery}
        action="/dashboard/settings"
        className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]"
      >
        <input type="hidden" name="tab" defaultValue="schedule" />
        <Input
          name="scheduleQuery"
          type="search"
          defaultValue={scheduleQuery}
          placeholder="Search staff"
          aria-label="Search staff schedules"
        />
        <Button type="submit" variant="secondary">
          <Search className="size-4" aria-hidden="true" />
          Search
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filteredStaff.length} staff member{filteredStaff.length === 1 ? "" : "s"}</span>
        {query ? (
          <Link href="/dashboard/settings?tab=schedule" className="underline">
            Clear search
          </Link>
        ) : null}
      </div>

      {filteredStaff.length === 0 ? (
        <p className="text-sm text-muted-foreground">No staff members match that search.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredStaff.map((member) => {
            const memberAvailability = availability.filter(
              (window) => window.staff_id === member.id,
            );
            const dayCount = new Set(memberAvailability.map((window) => window.day_of_week)).size;
            return (
              <li key={member.id}>
                <Link
                  href={scheduleHref({ staffId: member.id, scheduleQuery })}
                  className="block rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardContent className="flex min-h-16 items-center justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-sm font-semibold">{staffDisplayName(member)}</h3>
                          {!member.is_active ? <Badge>inactive</Badge> : null}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {roleLabel(member.role)} · {hoursSummary(dayCount, memberAvailability.length)}
                        </p>
                      </div>
                      <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function StaffScheduleEditor({
  member,
  availability,
  scheduleQuery,
}: {
  member: Staff;
  availability: Availability[];
  scheduleQuery: string;
}) {
  return (
    <section className="flex flex-col gap-5" aria-labelledby="staff-schedule-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="staff-schedule-heading" className="text-base font-semibold">
            {staffDisplayName(member)}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{roleLabel(member.role)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={scheduleHref({ view: "closures", scheduleQuery })}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius)] border border-border px-3 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CalendarDays className="size-4" aria-hidden="true" />
            Closures
          </Link>
          <Link
            href={scheduleHref({ scheduleQuery })}
            className="inline-flex min-h-11 items-center px-3 text-sm underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Back to staff
          </Link>
        </div>
      </div>

      <WeeklyHoursEditor member={member} availability={availability} />
    </section>
  );
}

function ClosureManager({
  staff,
  holidays,
  scheduleQuery,
  closureQuery,
  closureStaffId,
}: {
  staff: Staff[];
  holidays: Holiday[];
  scheduleQuery: string;
  closureQuery: string;
  closureStaffId?: string;
}) {
  const query = closureQuery.trim().toLocaleLowerCase();
  const filteredHolidays = holidays.filter((holiday) => {
    const member = holiday.staff_id
      ? staff.find((staffMember) => staffMember.id === holiday.staff_id)
      : null;
    const matchesStaff = !closureStaffId || holiday.staff_id === closureStaffId;
    const searchText = [holiday.date, holiday.reason, member ? staffDisplayName(member) : "Whole shop"]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    return matchesStaff && (!query || searchText.includes(query));
  });
  const filtersApplied = Boolean(query || closureStaffId);

  return (
    <section className="flex flex-col gap-5" aria-labelledby="closures-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="closures-heading" className="text-base font-semibold">Closures</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upcoming shop and staff exceptions.</p>
        </div>
        <Link
          href={scheduleHref({ scheduleQuery })}
          className="inline-flex min-h-11 items-center px-3 text-sm underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Back to schedules
        </Link>
      </div>

      <form
        key={`${scheduleQuery}-${closureQuery}-${closureStaffId ?? ""}`}
        action="/dashboard/settings"
        className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem_auto]"
      >
        <input type="hidden" name="tab" defaultValue="schedule" />
        <input type="hidden" name="view" defaultValue="closures" />
        <input type="hidden" name="scheduleQuery" defaultValue={scheduleQuery} />
        <Input
          name="closureQuery"
          type="search"
          defaultValue={closureQuery}
          placeholder="Search date, staff, or reason"
          aria-label="Search closures"
        />
        <Select name="closureStaffId" defaultValue={closureStaffId ?? ""} aria-label="Filter closures by staff">
          <option value="">All schedules</option>
          {staff.map((member) => (
            <option key={member.id} value={member.id}>
              {staffDisplayName(member)}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          <Search className="size-4" aria-hidden="true" />
          Filter
        </Button>
      </form>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{filteredHolidays.length} closure{filteredHolidays.length === 1 ? "" : "s"}</span>
        {filtersApplied ? (
          <Link href={scheduleHref({ view: "closures", scheduleQuery })} className="underline">
            Clear filters
          </Link>
        ) : null}
      </div>

      {filteredHolidays.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming closures match those filters.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredHolidays.map((holiday) => {
            const member = holiday.staff_id
              ? staff.find((staffMember) => staffMember.id === holiday.staff_id)
              : null;
            return (
              <li key={holiday.id}>
                <Card>
                  <CardContent className="flex min-h-16 items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="font-medium tabular-nums">{holiday.date}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {member ? staffDisplayName(member) : "Whole shop"}
                        {holiday.reason ? ` · ${holiday.reason}` : ""}
                      </p>
                    </div>
                    <ConfirmRemoval
                      action={deleteHoliday}
                      id={holiday.id}
                      description={`the ${holiday.date} closure`}
                    />
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <section className="border-t border-border pt-5" aria-labelledby="add-closure-heading">
        <h3 id="add-closure-heading" className="text-sm font-semibold">Add closure</h3>
        <ActionForm action={addHoliday} className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Date" htmlFor="closure-date">
            <Input id="closure-date" name="date" type="date" required />
          </Field>
          <Field label="Schedule" htmlFor="closure-staff">
            <Select id="closure-staff" name="staffId" defaultValue="">
              <option value="">Whole shop</option>
              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {staffDisplayName(member)}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Reason (optional)" htmlFor="closure-reason">
              <Input id="closure-reason" name="reason" placeholder="Holiday, vacation" />
            </Field>
          </div>
          <SubmitButton className="justify-self-start">
            <Plus className="size-4" aria-hidden="true" />
            Add closure
          </SubmitButton>
        </ActionForm>
      </section>
    </section>
  );
}

function scheduleHref({
  staffId,
  scheduleQuery,
  view = "schedules",
  closureQuery,
  closureStaffId,
}: {
  staffId?: string;
  scheduleQuery?: string;
  view?: ScheduleView;
  closureQuery?: string;
  closureStaffId?: string;
}) {
  const params = new URLSearchParams({ tab: "schedule" });
  if (staffId) params.set("staffId", staffId);
  if (scheduleQuery) params.set("scheduleQuery", scheduleQuery);
  if (view === "closures") params.set("view", "closures");
  if (closureQuery) params.set("closureQuery", closureQuery);
  if (closureStaffId) params.set("closureStaffId", closureStaffId);
  return `/dashboard/settings?${params.toString()}`;
}

function hoursSummary(dayCount: number, rangeCount: number): string {
  if (rangeCount === 0) return "No hours set";
  return `${dayCount} day${dayCount === 1 ? "" : "s"} · ${rangeCount} range${rangeCount === 1 ? "" : "s"}`;
}

function roleLabel(role: Staff["role"]): string {
  return role === "lash_specialist" ? "Lash specialist" : "Barber";
}

import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RowActions } from "@/features/schedule/RowActions";
import type { AppointmentRow } from "@/lib/data/appointments";
import type { Staff, StaffWithContact } from "@/lib/data/staff";
import { staffDisplayName } from "@/lib/staff-name";
import { cn, formatMoney } from "@/lib/utils";

const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "destructive"> = {
  booked: "neutral",
  completed: "success",
  late_released: "warning",
  no_show: "destructive",
  cancelled: "neutral",
};

function time(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

/** Today's owner roster or a barber's individual schedule. */
export function ProviderColumns({
  staff,
  appointments,
  view = "owner",
}: {
  staff: StaffWithContact[];
  appointments: AppointmentRow[];
  view?: "owner" | "barber";
}) {
  const byStaff = new Map<string, AppointmentRow[]>();
  for (const appt of appointments) {
    const list = byStaff.get(appt.staff_id) ?? [];
    list.push(appt);
    byStaff.set(appt.staff_id, list);
  }

  if (view === "barber") {
    const member = staff[0] ?? null;
    const rows = member ? (byStaff.get(member.id) ?? []) : appointments;
    const summary = summarize(rows);
    return (
      <div className="flex flex-col gap-4">
        {member ? <ScheduleHeading member={member} summary={summary} /> : null}
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No appointments today.</p>
        ) : (
          <AppointmentList rows={rows} />
        )}
      </div>
    );
  }

  return (
    <div>
      {staff.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active barbers.</p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="hidden grid-cols-[minmax(0,1fr)_6rem_7rem_minmax(10.5rem,0.8fr)_2.25rem] items-center gap-4 border-b border-border bg-muted/30 px-4 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
              <span>Team member</span>
              <span className="text-right">Clients</span>
              <span className="text-right">Revenue</span>
              <span>Phone</span>
              <span className="sr-only">Open dashboard</span>
            </div>
            <ul>
              {staff.map((member) => {
                const summary = summarize(byStaff.get(member.id) ?? []);
                const displayName = staffDisplayName(member);
                return (
                  <li
                    key={member.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_6rem_7rem_minmax(10.5rem,0.8fr)_2.25rem] sm:items-center sm:gap-4 sm:py-3">
                      {/* The dashboard link and tel: link stay as siblings to avoid nested anchors. */}
                      <Link
                        href={`/dashboard/staff/${member.id}`}
                        className="col-span-2 flex min-h-11 min-w-0 items-center rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:col-span-1"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">{displayName}</span>
                          <span className="block text-xs text-muted-foreground">{roleLabel(member.role)}</span>
                        </span>
                      </Link>
                      <RosterStat label="Clients today" value={String(summary.clients)} />
                      <RosterStat label="Revenue today" value={formatMoney(summary.revenue)} />
                      <PhoneLink phone={member.phone} iconOnly />
                      <Link
                        href={`/dashboard/staff/${member.id}`}
                        aria-label={`Open ${displayName}'s dashboard`}
                        title={`Open ${displayName}'s dashboard`}
                        className="flex size-9 items-center justify-center justify-self-end rounded-[var(--radius)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function StaffDashboard({
  member,
  appointments,
}: {
  member: StaffWithContact;
  appointments: AppointmentRow[];
}) {
  const summary = summarize(appointments);

  return (
    <div className="flex flex-col gap-4" aria-labelledby="staff-dashboard-heading">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 id="staff-dashboard-heading" className="text-xl font-bold">
            {staffDisplayName(member)}&apos;s dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Today&apos;s schedule and revenue</p>
          <PhoneLink phone={member.phone} />
        </div>
        <Link href="/dashboard" className="text-sm underline">
          Back to team
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <SummaryCard label="Clients today" value={String(summary.clients)} />
        <SummaryCard label="Appointments" value={String(appointments.length)} />
        <SummaryCard label="Revenue today" value={formatMoney(summary.revenue)} />
      </div>
      {appointments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No appointments today.</p>
      ) : (
        <AppointmentList rows={appointments} />
      )}
    </div>
  );
}

function ScheduleHeading({ member, summary }: { member: StaffWithContact; summary: ScheduleSummary }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">
        {staffDisplayName(member)}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          {roleLabel(member.role)}
        </span>
      </h3>
      <p className="text-xs text-muted-foreground">
        {summary.clients} client{summary.clients === 1 ? "" : "s"} today
      </p>
    </div>
  );
}

/** Tappable phone link (tel:), rendered only when a number is present. */
function PhoneLink({
  phone,
  className,
  iconOnly = false,
}: {
  phone: string | null;
  className?: string;
  iconOnly?: boolean;
}) {
  if (!phone) return null;
  const accessibleLabel = `Call ${phone}`;

  if (iconOnly) {
    return (
      <a
        href={`tel:${phone}`}
        aria-label={accessibleLabel}
        title={accessibleLabel}
        className={cn(
          "flex size-9 items-center justify-center self-center rounded-[var(--radius)] border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className,
        )}
      >
        <Phone className="size-4" aria-hidden="true" />
      </a>
    );
  }

  return (
    <a
      href={`tel:${phone}`}
      aria-label={accessibleLabel}
      className={cn(
        "inline-flex min-h-11 min-w-0 items-center gap-1.5 self-center text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Phone className="size-4" aria-hidden="true" />
      <span className="tabular-nums">{phone}</span>
    </a>
  );
}

function RosterStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 sm:text-right">
      <div className="text-xs text-muted-foreground sm:hidden">{label}</div>
      <div className="text-lg font-semibold tabular-nums sm:text-base">{value}</div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

type ScheduleSummary = {
  clients: number;
  revenue: number;
};

function summarize(rows: AppointmentRow[]): ScheduleSummary {
  const clients = new Set(
    rows.map((appointment) => appointment.client?.id).filter((id): id is string => Boolean(id)),
  );
  return {
    clients: clients.size,
    revenue: rows.reduce((total, appointment) => total + appointment.amount_due, 0),
  };
}

function AppointmentList({
  rows,
}: {
  rows: AppointmentRow[];
}) {
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((a) => (
        <li key={a.id}>
          <Card>
            <AppointmentContent appointment={a} />
          </Card>
        </li>
      ))}
    </ul>
  );
}

function AppointmentContent({ appointment: a }: { appointment: AppointmentRow }) {
  return (
    <CardContent className="flex flex-col gap-2 p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <span className="min-w-0 truncate font-medium tabular-nums">
          {time(a.starts_at)} · {a.client?.name ?? "Client"}
        </span>
        <Badge
          tone={STATUS_TONE[a.status] ?? "neutral"}
          className="whitespace-nowrap"
        >
          {statusLabel(a.status)}
        </Badge>
      </div>
      <span className="text-xs text-muted-foreground">{a.service?.name}</span>
      {a.client?.preferences ? (
        <span className="text-xs text-muted-foreground">
          ↳ {a.client.preferences}
        </span>
      ) : null}
      <RowActions id={a.id} status={a.status} />
    </CardContent>
  );
}

function roleLabel(role: Staff["role"]): string {
  return role === "lash_specialist" ? "lash" : "barber";
}

/**
 * Mirrors Appointment.status from the data model, plus `waitlisted` for
 * SlotWaitlist-linked bookings (Data Model v0.0.2 §1, §3).
 */
export type AppointmentStatus =
  | 'booked'
  | 'completed'
  | 'no_show'
  | 'late_released'
  | 'cancelled'
  | 'waitlisted';

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  booked: 'Booked',
  completed: 'Completed',
  no_show: 'No-show',
  late_released: 'Late-released',
  cancelled: 'Cancelled',
  waitlisted: 'Waitlisted',
};

const STATUS_CLASS: Record<AppointmentStatus, string> = {
  booked: 'bds-pill-booked',
  completed: 'bds-pill-completed',
  no_show: 'bds-pill-no-show',
  late_released: 'bds-pill-late-released',
  cancelled: 'bds-pill-cancelled',
  waitlisted: 'bds-pill-waitlisted',
};

export interface StatusBadgeProps {
  status: AppointmentStatus;
  /** Override the default label, e.g. "Waitlisted · 1st choice". */
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span className={['bds-pill', STATUS_CLASS[status], className].filter(Boolean).join(' ')}>
      {label ?? STATUS_LABEL[status]}
    </span>
  );
}

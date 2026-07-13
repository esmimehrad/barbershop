import { StatusBadge, type AppointmentStatus } from '../StatusBadge/StatusBadge';

export interface AppointmentCardProps {
  /** Service or package name, e.g. "Fade & Line-Up". */
  service: string;
  /** Assigned staff member's name. */
  provider: string;
  /** Optional chair/room label, e.g. "Chair 2". */
  location?: string;
  /** Pre-formatted time range, e.g. "Today, 2:30 PM – 3:00 PM". */
  startLabel: string;
  status: AppointmentStatus;
  /** Appointment.amount_due — omit to hide the due-at-visit row. */
  amountDue?: number;
  currency?: string;
  className?: string;
}

export function AppointmentCard({
  service,
  provider,
  location,
  startLabel,
  status,
  amountDue,
  currency = '$',
  className,
}: AppointmentCardProps) {
  return (
    <div className={['bds-appt-card', className].filter(Boolean).join(' ')}>
      <div className="bds-appt-top">
        <div>
          <div className="bds-appt-service">{service}</div>
          <div className="bds-appt-meta">
            with {provider}
            {location ? ` · ${location}` : ''}
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="bds-appt-time">{startLabel}</div>
      {amountDue != null ? (
        <div className="bds-appt-due">
          <span>Amount due at visit</span>
          <b>
            {currency}
            {amountDue.toFixed(2)}
          </b>
        </div>
      ) : null}
    </div>
  );
}

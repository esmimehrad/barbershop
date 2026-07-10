import { StatusBadge, type AppointmentStatus } from 'barbershop-design-system';

const ALL_STATUSES: AppointmentStatus[] = [
  'booked',
  'completed',
  'late_released',
  'no_show',
  'cancelled',
  'waitlisted',
];

export const AllStatuses = () => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {ALL_STATUSES.map((s) => (
      <StatusBadge key={s} status={s} />
    ))}
  </div>
);

export const CustomLabel = () => <StatusBadge status="waitlisted" label="Waitlisted · 1st choice" />;

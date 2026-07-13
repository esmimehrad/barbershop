import { ScheduleTable, type ScheduleRow } from 'barbershop-design-system';

const ROWS: ScheduleRow[] = [
  { id: '1', time: '2:30 PM', client: 'Marco R.', service: 'Fade & Line-Up', provider: 'David', status: 'booked' },
  { id: '2', time: '3:00 PM', client: 'Priya S.', service: 'Lash Fill', provider: 'Ana', status: 'completed' },
  {
    id: '3',
    time: '3:15 PM',
    client: 'Jonah T.',
    service: 'Beard Trim (add-on)',
    provider: 'David',
    status: 'no_show',
  },
  { id: '4', time: '3:30 PM', client: 'Sam O.', service: "Men's Cut", provider: 'Ana', status: 'late_released' },
];

export const DailyRoster = () => <ScheduleTable rows={ROWS} onComplete={() => {}} onMarkLate={() => {}} onMarkNoShow={() => {}} />;

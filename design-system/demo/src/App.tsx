import { useState } from 'react';
import {
  Button,
  Input,
  StatusBadge,
  AppointmentCard,
  ScheduleTable,
  CreditChip,
  SlotPicker,
  type ScheduleRow,
  type AppointmentStatus,
  type SlotDate,
  type TimeSlot,
} from 'barbershop-design-system';

const DATES: SlotDate[] = [
  { id: 'mon', weekday: 'Mon', day: '6' },
  { id: 'tue', weekday: 'Tue', day: '7' },
  { id: 'wed', weekday: 'Wed', day: '8', isToday: true },
  { id: 'thu', weekday: 'Thu', day: '9' },
  { id: 'fri', weekday: 'Fri', day: '10' },
  { id: 'sat', weekday: 'Sat', day: '11' },
];

const SLOTS: TimeSlot[] = [
  { id: '1', label: '10:00 AM', available: true },
  { id: '2', label: '10:30 AM', available: false },
  { id: '3', label: '11:00 AM', available: true },
  { id: '4', label: '1:00 PM', available: true },
  { id: '5', label: '1:30 PM', available: true },
  { id: '6', label: '2:00 PM', available: false },
  { id: '7', label: '2:30 PM', available: true },
  { id: '8', label: '3:00 PM', available: true },
];

const INITIAL_ROWS: ScheduleRow[] = [
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
];

const ALL_STATUSES: AppointmentStatus[] = [
  'booked',
  'completed',
  'late_released',
  'no_show',
  'cancelled',
  'waitlisted',
];

export default function App() {
  const [rows, setRows] = useState(INITIAL_ROWS);

  const updateStatus = (id: string, status: AppointmentStatus) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const [singleDateId, setSingleDateId] = useState('wed');
  const [singleSlotIds, setSingleSlotIds] = useState<string[]>(['4']);
  const toggleSingle = (id: string) =>
    setSingleSlotIds((prev) => (prev.includes(id) ? [] : [id]));

  const [rankedDateId, setRankedDateId] = useState('wed');
  const [rankedSlotIds, setRankedSlotIds] = useState<string[]>(['3']);
  const toggleRanked = (id: string) =>
    setRankedSlotIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : prev.length < 2 ? [...prev, id] : prev,
    );

  return (
    <div className="demo-wrap">
      <header className="demo-header">
        <h1>Barbershop Design System</h1>
        <p>Live render of the built components — edit src/ in the package and this page hot-reloads.</p>
      </header>

      <section className="demo-section">
        <h2>Buttons</h2>
        <div className="demo-row">
          <Button variant="primary">Confirm booking</Button>
          <Button variant="secondary">Reschedule</Button>
          <Button variant="ghost">View details</Button>
          <Button variant="critical">Cancel appointment</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className="demo-section">
        <h2>Input</h2>
        <div className="demo-card" style={{ maxWidth: 320 }}>
          <Input id="phone" label="Phone number" type="tel" defaultValue="+1 (555) 019-2231" hint="We'll text your reminders here." />
        </div>
      </section>

      <section className="demo-section">
        <h2>Status badges</h2>
        <div className="demo-row">
          {ALL_STATUSES.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
      </section>

      <section className="demo-section">
        <h2>Credit chip</h2>
        <div className="demo-row">
          <CreditChip amount={18.5} />
        </div>
      </section>

      <section className="demo-section">
        <h2>Appointment card</h2>
        <div style={{ maxWidth: 380 }}>
          <AppointmentCard
            service="Fade & Line-Up"
            provider="David"
            location="Chair 2"
            startLabel="Today, 2:30 PM – 3:00 PM"
            status="booked"
            amountDue={27.5}
          />
        </div>
      </section>

      <section className="demo-section">
        <h2>Slot picker — single choice (FS-1)</h2>
        <div className="demo-card">
          <SlotPicker
            dates={DATES}
            selectedDateId={singleDateId}
            onSelectDate={setSingleDateId}
            slots={SLOTS}
            mode="single"
            selectedSlotIds={singleSlotIds}
            onToggleSlot={toggleSingle}
          />
        </div>
      </section>

      <section className="demo-section">
        <h2>Slot picker — ranked two-choice (FS-2, priority waitlist)</h2>
        <div className="demo-card">
          <SlotPicker
            dates={DATES}
            selectedDateId={rankedDateId}
            onSelectDate={setRankedDateId}
            slots={SLOTS}
            mode="ranked"
            selectedSlotIds={rankedSlotIds}
            onToggleSlot={toggleRanked}
          />
        </div>
      </section>

      <section className="demo-section">
        <h2>Schedule table (interactive — click an action)</h2>
        <div className="demo-card">
          <ScheduleTable
            rows={rows}
            onComplete={(id) => updateStatus(id, 'completed')}
            onMarkLate={(id) => updateStatus(id, 'late_released')}
            onMarkNoShow={(id) => updateStatus(id, 'no_show')}
          />
        </div>
      </section>
    </div>
  );
}

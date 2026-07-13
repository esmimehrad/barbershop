import { SlotPicker, type SlotDate, type TimeSlot } from 'barbershop-design-system';

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

export const SingleChoice = () => (
  <SlotPicker
    dates={DATES}
    selectedDateId="wed"
    onSelectDate={() => {}}
    slots={SLOTS}
    mode="single"
    selectedSlotIds={['4']}
    onToggleSlot={() => {}}
  />
);

export const RankedTwoChoice = () => (
  <SlotPicker
    dates={DATES}
    selectedDateId="wed"
    onSelectDate={() => {}}
    slots={SLOTS}
    mode="ranked"
    selectedSlotIds={['3', '7']}
    onToggleSlot={() => {}}
  />
);

export interface SlotDate {
  id: string;
  /** e.g. "Mon" */
  weekday: string;
  /** e.g. "8" */
  day: string;
  isToday?: boolean;
}

export interface TimeSlot {
  id: string;
  /** Pre-formatted, e.g. "2:30 PM" */
  label: string;
  available: boolean;
}

export type SlotPickerMode = 'single' | 'ranked';

export interface SlotPickerProps {
  dates: SlotDate[];
  selectedDateId: string;
  onSelectDate: (id: string) => void;
  /** Slots for the currently selected date. */
  slots: TimeSlot[];
  /** `ranked` enables FS-2's two-choice priority booking. */
  mode?: SlotPickerMode;
  /** Slot ids in rank order — index 0 is 1st choice, index 1 is 2nd choice (ranked mode only). */
  selectedSlotIds: string[];
  onToggleSlot: (slotId: string) => void;
  className?: string;
}

export function SlotPicker({
  dates,
  selectedDateId,
  onSelectDate,
  slots,
  mode = 'single',
  selectedSlotIds,
  onToggleSlot,
  className,
}: SlotPickerProps) {
  const maxChoices = mode === 'ranked' ? 2 : 1;

  return (
    <div className={['bds-slotpicker', className].filter(Boolean).join(' ')}>
      <div className="bds-slotpicker-dates" role="radiogroup" aria-label="Choose a date">
        {dates.map((d) => {
          const selected = d.id === selectedDateId;
          return (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={['bds-date-chip', selected ? 'bds-date-chip-selected' : ''].filter(Boolean).join(' ')}
              onClick={() => onSelectDate(d.id)}
            >
              <span className="bds-date-weekday">{d.weekday}</span>
              <span className="bds-date-day">{d.day}</span>
              {d.isToday ? <span className="bds-date-today-dot" aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>

      {mode === 'ranked' ? (
        <p className="bds-slotpicker-hint">
          Pick a 1st choice, then a 2nd — if your 1st is taken we&rsquo;ll book the 2nd and waitlist you for the 1st.
        </p>
      ) : null}

      <div className="bds-slotpicker-grid" role="group" aria-label="Available times">
        {slots.map((slot) => {
          const rank = selectedSlotIds.indexOf(slot.id);
          const isSelected = rank !== -1;
          const atMax = !isSelected && selectedSlotIds.length >= maxChoices;
          const isDisabled = !slot.available || atMax;

          return (
            <button
              key={slot.id}
              type="button"
              disabled={isDisabled}
              aria-pressed={isSelected}
              className={[
                'bds-slot',
                rank === 0 ? 'bds-slot-first' : '',
                rank === 1 ? 'bds-slot-second' : '',
                !slot.available ? 'bds-slot-unavailable' : '',
                atMax ? 'bds-slot-maxed' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onToggleSlot(slot.id)}
            >
              {slot.label}
              {mode === 'ranked' && isSelected ? (
                <span className="bds-slot-rank">{rank === 0 ? '1st choice' : '2nd choice'}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

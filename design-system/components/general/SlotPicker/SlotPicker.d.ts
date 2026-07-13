import * as React from 'react';

/**
 * SlotPicker — from barbershop-design-system@0.1.0.
 */
export interface SlotPickerProps {
  dates: SlotDate[];
  selectedDateId: string;
  onSelectDate: (id: string) => void;
  /** Slots for the currently selected date. */
  slots: TimeSlot[];
  /** `ranked` enables FS-2's two-choice priority booking. */
  mode?: "single" | "ranked";
  /** Slot ids in rank order — index 0 is 1st choice, index 1 is 2nd choice (ranked mode only). */
  selectedSlotIds: string[];
  onToggleSlot: (slotId: string) => void;
  className?: string;
}

export declare const SlotPicker: React.ComponentType<SlotPickerProps>;

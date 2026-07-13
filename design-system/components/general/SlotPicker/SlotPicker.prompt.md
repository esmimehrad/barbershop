SlotPicker from barbershop-design-system. Use via `window.BarbershopDesignSystem.SlotPicker` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface SlotPickerProps {
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
```

## Examples

### SingleChoice

```jsx
() => (
  <SlotPicker
    dates={DATES}
    selectedDateId="wed"
    onSelectDate={() => {}}
    slots={SLOTS}
    mode="single"
    selectedSlotIds={['4']}
    onToggleSlot={() => {}}
  />
)
```

### RankedTwoChoice

```jsx
() => (
  <SlotPicker
    dates={DATES}
    selectedDateId="wed"
    onSelectDate={() => {}}
    slots={SLOTS}
    mode="ranked"
    selectedSlotIds={['3', '7']}
    onToggleSlot={() => {}}
  />
)
```

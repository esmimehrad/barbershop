ScheduleTable from barbershop-design-system. Use via `window.BarbershopDesignSystem.ScheduleTable` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface ScheduleTableProps {
  rows: ScheduleRow[];
  /** One-tap actions from FS-4/FS-5 — only rendered while a row is `booked`. */
  onComplete?: (id: string) => void;
  onMarkLate?: (id: string) => void;
  onMarkNoShow?: (id: string) => void;
  className?: string;
}
```

## Examples

### DailyRoster

```jsx
() => <ScheduleTable rows={ROWS} onComplete={() => {}} onMarkLate={() => {}} onMarkNoShow={() => {}} />
```

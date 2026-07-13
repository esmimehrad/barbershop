AppointmentCard from barbershop-design-system. Use via `window.BarbershopDesignSystem.AppointmentCard` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface AppointmentCardProps {
  /** Service or package name, e.g. "Fade & Line-Up". */
  service: string;
  /** Assigned staff member's name. */
  provider: string;
  /** Optional chair/room label, e.g. "Chair 2". */
  location?: string;
  /** Pre-formatted time range, e.g. "Today, 2:30 PM – 3:00 PM". */
  startLabel: string;
  status: "booked" | "completed" | "no_show" | "late_released" | "cancelled" | "waitlisted";
  /** Appointment.amount_due — omit to hide the due-at-visit row. */
  amountDue?: number;
  currency?: string;
  className?: string;
}
```

## Examples

### Booked

```jsx
() => (
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
)
```

### CompletedNoBalance

```jsx
() => (
  <div style={{ maxWidth: 380 }}>
    <AppointmentCard
      service="Lash Fill"
      provider="Ana"
      location="Room 1"
      startLabel="Today, 3:00 PM – 3:45 PM"
      status="completed"
    />
  </div>
)
```

### Waitlisted

```jsx
() => (
  <div style={{ maxWidth: 380 }}>
    <AppointmentCard
      service="Beard Trim (add-on)"
      provider="David"
      startLabel="Tomorrow, 1:00 PM – 1:20 PM"
      status="waitlisted"
      amountDue={12}
    />
  </div>
)
```

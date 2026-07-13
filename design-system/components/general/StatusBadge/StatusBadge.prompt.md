StatusBadge from barbershop-design-system. Use via `window.BarbershopDesignSystem.StatusBadge` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface StatusBadgeProps {
  status: "booked" | "completed" | "no_show" | "late_released" | "cancelled" | "waitlisted";
  /** Override the default label, e.g. "Waitlisted · 1st choice". */
  label?: string;
  className?: string;
}
```

## Examples

### AllStatuses

```jsx
() => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    {ALL_STATUSES.map((s) => (
      <StatusBadge key={s} status={s} />
    ))}
  </div>
)
```

### CustomLabel

```jsx
() => <StatusBadge status="waitlisted" label="Waitlisted · 1st choice" />
```

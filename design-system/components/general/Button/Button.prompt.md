Button from barbershop-design-system. Use via `window.BarbershopDesignSystem.Button` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface ButtonProps {
  /** Visual style. `critical` is for destructive actions (e.g. cancel appointment). */
  variant?: "primary" | "secondary" | "ghost" | "critical";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### Primary

```jsx
() => <Button variant="primary">Confirm booking</Button>
```

### Secondary

```jsx
() => <Button variant="secondary">Reschedule</Button>
```

### Ghost

```jsx
() => <Button variant="ghost">View details</Button>
```

### Critical

```jsx
() => <Button variant="critical">Cancel appointment</Button>
```

### Disabled

```jsx
() => (
  <Button variant="primary" disabled>
    Disabled
  </Button>
)
```

Input from barbershop-design-system. Use via `window.BarbershopDesignSystem.Input` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface InputProps {
  /** Visible label — always required, never a placeholder-only field. */
  label: string;
  /** Helper text shown below the field, e.g. "We'll text your reminders here." */
  hint?: string;
  id: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### WithHint

```jsx
() => (
  <div style={{ maxWidth: 320 }}>
    <Input
      id="phone"
      label="Phone number"
      type="tel"
      defaultValue="+1 (555) 019-2231"
      hint="We'll text your reminders here."
    />
  </div>
)
```

### Empty

```jsx
() => (
  <div style={{ maxWidth: 320 }}>
    <Input id="email" label="Email address" type="email" placeholder="you@example.com" />
  </div>
)
```

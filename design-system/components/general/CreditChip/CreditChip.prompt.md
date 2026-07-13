CreditChip from barbershop-design-system. Use via `window.BarbershopDesignSystem.CreditChip` (bundle loaded from the root `_ds_bundle.js`).

## Props

```ts
interface CreditChipProps {
  /** Client.credit_balance, or the portion being applied at checkout. */
  amount: number;
  currency?: string;
  label?: string;
  className?: string;
}
```

## Examples

### Default

```jsx
() => <CreditChip amount={18.5} />
```

### CustomLabel

```jsx
() => <CreditChip amount={42} label="account credit" />
```

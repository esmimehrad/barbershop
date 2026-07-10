export interface CreditChipProps {
  /** Client.credit_balance, or the portion being applied at checkout. */
  amount: number;
  currency?: string;
  label?: string;
  className?: string;
}

export function CreditChip({ amount, currency = '$', label = 'credit available', className }: CreditChipProps) {
  return (
    <div className={['bds-credit-chip', className].filter(Boolean).join(' ')}>
      <span className="bds-credit-amt">
        {currency}
        {amount.toFixed(2)}
      </span>
      <span className="bds-credit-label">{label}</span>
    </div>
  );
}

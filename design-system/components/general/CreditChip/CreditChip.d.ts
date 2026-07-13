import * as React from 'react';

/**
 * CreditChip — from barbershop-design-system@0.1.0.
 */
export interface CreditChipProps {
  /** Client.credit_balance, or the portion being applied at checkout. */
  amount: number;
  currency?: string;
  label?: string;
  className?: string;
}

export declare const CreditChip: React.ComponentType<CreditChipProps>;

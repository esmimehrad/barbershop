import * as React from 'react';

/**
 * Input — from barbershop-design-system@0.1.0.
 * @replaces input
 */
export interface InputProps {
  /** Visible label — always required, never a placeholder-only field. */
  label: string;
  /** Helper text shown below the field, e.g. "We'll text your reminders here." */
  hint?: string;
  id: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const Input: React.ComponentType<InputProps>;

import * as React from 'react';

/**
 * Button — from barbershop-design-system@0.1.0.
 * @replaces button
 */
export interface ButtonProps {
  /** Visual style. `critical` is for destructive actions (e.g. cancel appointment). */
  variant?: "primary" | "secondary" | "ghost" | "critical";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export declare const Button: React.ComponentType<ButtonProps>;

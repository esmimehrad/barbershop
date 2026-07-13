import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'critical';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `critical` is for destructive actions (e.g. cancel appointment). */
  variant?: ButtonVariant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, ...props }, ref) => (
    <button
      ref={ref}
      className={['bds-btn', `bds-btn-${variant}`, className].filter(Boolean).join(' ')}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

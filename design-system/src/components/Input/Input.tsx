import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible label — always required, never a placeholder-only field. */
  label: string;
  /** Helper text shown below the field, e.g. "We'll text your reminders here." */
  hint?: string;
  id: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, id, className, ...props }, ref) => (
    <div className="bds-field">
      <label htmlFor={id}>{label}</label>
      <input ref={ref} id={id} className={['bds-input', className].filter(Boolean).join(' ')} {...props} />
      {hint ? <span className="bds-field-hint">{hint}</span> : null}
    </div>
  ),
);
Input.displayName = 'Input';

import * as React from 'react';

/**
 * StatusBadge — from barbershop-design-system@0.1.0.
 */
export interface StatusBadgeProps {
  status: "booked" | "completed" | "no_show" | "late_released" | "cancelled" | "waitlisted";
  /** Override the default label, e.g. "Waitlisted · 1st choice". */
  label?: string;
  className?: string;
}

export declare const StatusBadge: React.ComponentType<StatusBadgeProps>;

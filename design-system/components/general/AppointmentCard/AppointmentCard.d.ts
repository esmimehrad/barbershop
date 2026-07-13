import * as React from 'react';

/**
 * AppointmentCard — from barbershop-design-system@0.1.0.
 */
export interface AppointmentCardProps {
  /** Service or package name, e.g. "Fade & Line-Up". */
  service: string;
  /** Assigned staff member's name. */
  provider: string;
  /** Optional chair/room label, e.g. "Chair 2". */
  location?: string;
  /** Pre-formatted time range, e.g. "Today, 2:30 PM – 3:00 PM". */
  startLabel: string;
  status: "booked" | "completed" | "no_show" | "late_released" | "cancelled" | "waitlisted";
  /** Appointment.amount_due — omit to hide the due-at-visit row. */
  amountDue?: number;
  currency?: string;
  className?: string;
}

export declare const AppointmentCard: React.ComponentType<AppointmentCardProps>;

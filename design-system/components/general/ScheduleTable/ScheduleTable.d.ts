import * as React from 'react';

/**
 * ScheduleTable — from barbershop-design-system@0.1.0.
 */
export interface ScheduleTableProps {
  rows: ScheduleRow[];
  /** One-tap actions from FS-4/FS-5 — only rendered while a row is `booked`. */
  onComplete?: (id: string) => void;
  onMarkLate?: (id: string) => void;
  onMarkNoShow?: (id: string) => void;
  className?: string;
}

export declare const ScheduleTable: React.ComponentType<ScheduleTableProps>;

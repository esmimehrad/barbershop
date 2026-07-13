import { StatusBadge, type AppointmentStatus } from '../StatusBadge/StatusBadge';

export interface ScheduleRow {
  id: string;
  /** Pre-formatted time, e.g. "2:30 PM". */
  time: string;
  client: string;
  service: string;
  provider: string;
  status: AppointmentStatus;
}

export interface ScheduleTableProps {
  rows: ScheduleRow[];
  /** One-tap actions from FS-4/FS-5 — only rendered while a row is `booked`. */
  onComplete?: (id: string) => void;
  onMarkLate?: (id: string) => void;
  onMarkNoShow?: (id: string) => void;
  className?: string;
}

export function ScheduleTable({ rows, onComplete, onMarkLate, onMarkNoShow, className }: ScheduleTableProps) {
  return (
    <div className={['bds-table-wrap', className].filter(Boolean).join(' ')}>
      <table className="bds-roster">
        <thead>
          <tr>
            <th>Time</th>
            <th>Client</th>
            <th>Service</th>
            <th>Provider</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="bds-num">{row.time}</td>
              <td>{row.client}</td>
              <td>{row.service}</td>
              <td>{row.provider}</td>
              <td>
                <StatusBadge status={row.status} />
              </td>
              <td>
                {row.status === 'booked' ? (
                  <div className="bds-roster-actions">
                    <button
                      type="button"
                      className="bds-icon-btn bds-icon-btn-complete"
                      onClick={() => onComplete?.(row.id)}
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      className="bds-icon-btn bds-icon-btn-late"
                      onClick={() => onMarkLate?.(row.id)}
                    >
                      Late
                    </button>
                    <button
                      type="button"
                      className="bds-icon-btn bds-icon-btn-noshow"
                      onClick={() => onMarkNoShow?.(row.id)}
                    >
                      No-show
                    </button>
                  </div>
                ) : (
                  <span className="bds-field-hint">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

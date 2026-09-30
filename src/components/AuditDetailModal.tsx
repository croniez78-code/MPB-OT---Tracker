import React from 'react';
import { StaffMember, SimulatedTimeline } from '../types';

interface AuditDetailModalProps {
  staff: StaffMember | null;
  isOpen: boolean;
  onClose: () => void;
  simulatedDay: SimulatedTimeline;
  onSendReminder: (name: string, id: string) => void;
  onForceSubmit: (id: string) => void;
  onUnlockDraft: (id: string) => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  staff,
  isOpen,
  onClose,
  simulatedDay,
  onSendReminder,
  onForceSubmit,
  onUnlockDraft,
}) => {
  if (!isOpen || !staff) return null;

  const totalHours = staff.entries.reduce((acc, curr) => acc + curr.duration, 0);
  const isSubmitted = staff.status === 'Submitted';
  const isOverdue = !isSubmitted && (simulatedDay === '7' || simulatedDay === '9');

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl rounded-xl bg-surface-container-lowest shadow-2xl border border-outline-variant/40 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-surface-container-low flex items-center justify-between border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-base shadow-xs">
              {staff.avatar || staff.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline font-bold text-lg text-on-surface">
                  {staff.name}
                </h3>
                {isSubmitted ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Submitted
                  </span>
                ) : isOverdue ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-xs font-semibold animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-error" />
                    Overdue Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                    Draft In Progress
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {staff.department} • {staff.role} • ID #{staff.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Summary Metric Strip */}
        <div className="px-6 py-3 bg-surface-container-lowest flex items-center justify-between flex-wrap gap-4 border-b border-surface-container-high">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[11px] text-outline uppercase font-semibold">
                Total Verified
              </div>
              <div className="mono-num font-bold text-base text-primary">
                {totalHours.toFixed(1)} hrs
              </div>
            </div>
            <div>
              <div className="text-[11px] text-outline uppercase font-semibold">
                Punch Records
              </div>
              <div className="mono-num font-bold text-base text-on-surface">
                {staff.entries.length} entries
              </div>
            </div>
            <div>
              <div className="text-[11px] text-outline uppercase font-semibold">
                Submission Date
              </div>
              <div className="text-xs font-medium text-on-surface">
                {staff.submittedAt || '— Not finalized (Draft)'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSubmitted ? (
              <>
                <button
                  type="button"
                  onClick={() => onSendReminder(staff.name, staff.id)}
                  className="px-3 py-1.5 rounded-lg bg-tertiary text-on-tertiary text-xs font-semibold hover:bg-tertiary-container transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Send Urgent Reminder
                </button>
                <button
                  type="button"
                  onClick={() => onForceSubmit(staff.id)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors shadow-xs"
                >
                  Admin Force-Lock
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onUnlockDraft(staff.id)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 border border-outline-variant/40"
              >
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                Re-open Draft for Staff
              </button>
            )}
          </div>
        </div>

        {/* Overtime Entries Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <h4 className="text-xs uppercase tracking-wider font-semibold text-outline mb-3">
            Itemized Punch Entries & Operational Justifications
          </h4>
          <div className="rounded-lg overflow-hidden border border-outline-variant/40">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-4 font-semibold">Shift Date</th>
                  <th className="py-2.5 px-4 font-semibold">Time In</th>
                  <th className="py-2.5 px-4 font-semibold">Time Out</th>
                  <th className="py-2.5 px-4 font-semibold text-right">OT Hours</th>
                  <th className="py-2.5 px-4 font-semibold">Project Code / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/60 text-xs">
                {staff.entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant italic">
                      No overtime logged for this cycle yet.
                    </td>
                  </tr>
                ) : (
                  staff.entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-2.5 px-4 mono-num font-medium text-on-surface">
                        {entry.date}
                      </td>
                      <td className="py-2.5 px-4 mono-num text-on-surface-variant">
                        {entry.startTime}
                      </td>
                      <td className="py-2.5 px-4 mono-num text-on-surface-variant">
                        {entry.endTime}
                      </td>
                      <td className="py-2.5 px-4 text-right mono-num font-bold text-primary">
                        {entry.duration.toFixed(1)} hrs
                      </td>
                      <td className="py-2.5 px-4 text-on-surface">
                        <div className="font-semibold text-xs text-on-surface">
                          {entry.project}
                        </div>
                        {entry.notes && (
                          <div className="text-[11px] text-on-surface-variant truncate max-w-xs">
                            {entry.notes}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-container-low flex items-center justify-between border-t border-surface-container-high">
          <span className="text-xs text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
            Verified by Automated Clocking Ingestion Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-lg text-xs font-semibold transition-colors border border-outline-variant/30"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

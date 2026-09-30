import React, { useState } from 'react';
import { SimulatedTimeline } from '../types';

interface StatusStepperProps {
  isSubmitted: boolean;
  submittedDate: string | null;
  simulatedDay: SimulatedTimeline;
  language: 'en' | 'bm';
}

export const StatusStepper: React.FC<StatusStepperProps> = ({
  isSubmitted,
  submittedDate,
  simulatedDay,
  language,
}) => {
  const [activeStepInfo, setActiveStepInfo] = useState<number | null>(null);
  const isBm = language === 'bm';

  const steps = [
    {
      num: 1,
      title: isBm ? '1. Catatan Syif Harian' : '1. Shift Logging',
      status: 'completed',
      date: isBm ? 'Aktif (Setiap Hari)' : 'Active (Daily)',
      desc: isBm
        ? 'Staf memasukkan jam mula, tamat, dan projek tugasan lebih masa secara harian.'
        : 'Daily capture of actual shift punches and project activity references.',
      officer: 'Ahmad Razak (Staf)',
    },
    {
      num: 2,
      title: isBm ? '2. Perakuan Staf (7hb)' : '2. Staff Certification (7th)',
      status: isSubmitted ? 'completed' : simulatedDay === '7' ? 'urgent' : 'pending',
      date: isSubmitted ? submittedDate : isBm ? 'Tarikh Akhir: 7 Okt, 23:59 GMT' : 'Cutoff: 7 Oct, 23:59 GMT',
      desc: isBm
        ? 'Kakitangan menyemak, menurunkan akuan statutori, dan menghantar lejar bulanan.'
        : 'Staff signs statutory declaration and submits monthly verified ledger.',
      officer: isSubmitted ? 'Ahmad Razak (Disahkan)' : isBm ? 'Menunggu Tindakan Staf' : 'Pending Staff Action',
    },
    {
      num: 3,
      title: isBm ? '3. Pengauditan HR' : '3. HR Compliance Audit',
      status: isSubmitted ? 'in-progress' : 'upcoming',
      date: isBm ? '8hb - 14hb Okt' : '8th - 14th Oct',
      desc: isBm
        ? 'Bahagian HR menyemak silang had maksimum 104 jam dan justifikasi projek.'
        : 'HR cross-verifies statutory limits and operational work orders.',
      officer: 'Asward (Lead Auditor)',
    },
    {
      num: 4,
      title: isBm ? '4. Kredit Gaji (25hb)' : '4. Payroll Disbursement (25th)',
      status: 'upcoming',
      date: isBm ? '25 Okt 2024' : '25th Oct 2024',
      desc: isBm
        ? 'Bayaran elaun lebih masa dimasukkan ke dalam slip gaji dan akaun bank kakitangan.'
        : 'Approved overtime allowances credited directly into staff payroll account.',
      officer: 'Core ERP Payroll Engine',
    },
  ];

  return (
    <div className="w-full bg-surface-container-lowest rounded-xl p-4 sm:p-5 shadow-xs border border-outline-variant/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            linear_scale
          </span>
          <span className="font-headline font-bold text-xs uppercase tracking-wider text-on-surface">
            {isBm ? 'Garis Masa Kitaran Kelulusan Tuntutan' : 'Claim Lifecycle & Approval Stepper'}
          </span>
        </div>
        <span className="text-[11px] text-on-surface-variant font-medium">
          {isBm ? 'Klik mana-mana fasa untuk butiran SLA' : 'Click any step for SLA details'}
        </span>
      </div>

      {/* Stepper Bar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isInProgress = step.status === 'in-progress';
          const isUrgent = step.status === 'urgent';
          const isSelected = activeStepInfo === step.num;

          return (
            <div
              key={step.num}
              onClick={() => setActiveStepInfo(isSelected ? null : step.num)}
              className={`p-3 rounded-lg border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 bg-surface-container-low'
                  : isDone
                  ? 'border-secondary/40 bg-secondary-fixed/15 hover:border-secondary'
                  : isUrgent
                  ? 'border-tertiary bg-tertiary-fixed/30 hover:bg-tertiary-fixed/50 animate-pulse'
                  : isInProgress
                  ? 'border-primary/40 bg-primary-fixed/20 hover:border-primary'
                  : 'border-outline-variant/40 bg-surface-container-low/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone
                        ? 'bg-secondary text-on-secondary'
                        : isUrgent
                        ? 'bg-tertiary text-on-tertiary'
                        : isInProgress
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {isDone ? '✓' : step.num}
                  </span>
                  <span className="font-headline font-bold text-xs text-on-surface truncate">
                    {step.title}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-on-surface-variant font-medium truncate">
                {step.date}
              </div>

              <div className="mt-2 text-[10px] font-semibold flex items-center gap-1">
                {isDone ? (
                  <span className="text-secondary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    {isBm ? 'Selesai' : 'Completed'}
                  </span>
                ) : isUrgent ? (
                  <span className="text-tertiary font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">warning</span>
                    {isBm ? 'Tindakan Segera 7hb' : 'Action Due 7th'}
                  </span>
                ) : isInProgress ? (
                  <span className="text-primary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
                    {isBm ? 'Dalam Semakan' : 'In Review'}
                  </span>
                ) : (
                  <span className="text-outline">
                    {isBm ? 'Menunggu Giliran' : 'Queued'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Step Detail Box */}
      {activeStepInfo && (
        <div className="mt-3 p-3.5 rounded-lg bg-surface-container-high/60 border border-outline-variant/40 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold text-primary font-headline">
              {steps[activeStepInfo - 1].title} — {steps[activeStepInfo - 1].officer}
            </span>
            <button
              type="button"
              onClick={() => setActiveStepInfo(null)}
              className="text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <p className="text-on-surface-variant mt-1 leading-relaxed">
            {steps[activeStepInfo - 1].desc}
          </p>
        </div>
      )}
    </div>
  );
};

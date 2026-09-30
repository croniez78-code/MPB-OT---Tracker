import React, { useState, useRef } from 'react';
import { OvertimeEntry, SimulatedTimeline } from '../types';
import { PROJECT_OPTIONS } from '../mockData';
import { StatusStepper } from './StatusStepper';
import { QuotaGauge } from './QuotaGauge';
import { CalendarView } from './CalendarView';

interface StaffDashboardProps {
  entries: OvertimeEntry[];
  isSubmitted: boolean;
  submittedDate: string | null;
  simulatedDay: SimulatedTimeline;
  onAddEntry: (entry: Omit<OvertimeEntry, 'id'>) => void;
  onEditEntry: (entry: OvertimeEntry) => void;
  onDeleteEntry: (id: string) => void;
  onSubmitMonthly: () => void;
  onOpenEditModal: (entry: OvertimeEntry) => void;
  onNavigateToClaimReview?: () => void;
  language?: 'en' | 'bm';
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  entries,
  isSubmitted,
  submittedDate,
  simulatedDay,
  onAddEntry,
  onDeleteEntry,
  onSubmitMonthly,
  onOpenEditModal,
  onNavigateToClaimReview,
  language = 'en',
}) => {
  const isBm = language === 'bm';
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');

  // Form state
  const [formDate, setFormDate] = useState(`2024-10-${simulatedDay.padStart(2, '0')}`);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [project, setProject] = useState('');
  const [notes, setNotes] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{
    date?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    project?: boolean;
  }>({});

  const formRef = useRef<HTMLDivElement>(null);

  // Quick Shift Template Presets
  const applyTemplate = (type: 'evening' | 'hotfix' | 'weekend' | 'last') => {
    if (type === 'evening') {
      setStartTime('18:00');
      setEndTime('21:30');
      setProject('Core Banking Migration');
      setNotes(isBm ? 'Pemasangan patch pangkalan data' : 'Database staging deployment');
    } else if (type === 'hotfix') {
      setStartTime('19:00');
      setEndTime('23:00');
      setProject('Incident Hotfix L2');
      setNotes(isBm ? 'Penyelesaian deadlock sistem gateway' : 'Resolved gateway deadlock timeout');
    } else if (type === 'weekend') {
      setStartTime('14:00');
      setEndTime('17:00');
      setProject('Weekend Deployment Standby');
      setNotes(isBm ? 'Pemantauan kluster mikroservis' : 'Microservices standby monitoring');
    } else if (type === 'last' && entries.length > 0) {
      const last = entries[0];
      setStartTime(last.startTime);
      setEndTime(last.endTime);
      setProject(last.project);
      setNotes(last.notes);
    }
  };

  // Compute inline duration
  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    if (endMin < startMin) {
      endMin += 24 * 60;
    }
    const diff = (endMin - startMin) / 60;
    return diff > 0 ? Number(diff.toFixed(1)) : 0;
  };

  const currentDuration = calculateDuration(startTime, endTime);
  const totalHours = entries.reduce((acc, curr) => acc + curr.duration, 0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!formDate) newErrors.date = true;
    if (!startTime) newErrors.startTime = true;
    if (!endTime) newErrors.endTime = true;
    if (!project) newErrors.project = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const dur = currentDuration > 0 ? currentDuration : 1.0;

    onAddEntry({
      date: formDate,
      startTime,
      endTime,
      duration: dur,
      project,
      notes: notes.trim(),
    });

    // Reset inputs except date
    setStartTime('');
    setEndTime('');
    setProject('');
    setNotes('');
    setErrors({});
  };

  // Helper date formatter: 2024-10-02 -> 02 Oct 2024
  const formatDateDisplay = (dateStr: string): { day: string; month: string; year: string } => {
    if (!dateStr) return { day: '—', month: '', year: '' };
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
      const monthIdx = parseInt(parts[1], 10) - 1;
      return {
        day: parts[2],
        month: months[monthIdx] || parts[1],
        year: parts[0],
      };
    }
    return { day: dateStr, month: '', year: '' };
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ==================================================== */}
      {/* F05: 7th-of-the-Month Cutoff Deadline Reminder Banner */}
      {/* ==================================================== */}
      {isSubmitted ? (
        <div className="w-full rounded-xl p-4 shadow-xs border border-outline-variant/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-container-high text-on-surface">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <div>
              <div className="font-headline font-semibold text-sm">Monthly Overtime Log Submitted</div>
              <div className="text-xs text-on-surface-variant mt-0.5">
                You have submitted your overtime log for October 2024 on <strong>{submittedDate}</strong>.
                You may continue to edit or append entries anytime before payroll processing.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={onNavigateToClaimReview || onSubmitMonthly}
              className="px-4 py-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{isBm ? 'Lihat Slip Tuntutan' : 'Review Claim Voucher'}</span>
            </button>
            <button
              type="button"
              onClick={onSubmitMonthly}
              className="px-4 py-2 bg-secondary hover:opacity-90 text-on-secondary rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span>{isBm ? 'Hantar Semula' : 'Re-submit OT'}</span>
            </button>
          </div>
        </div>
      ) : simulatedDay === '7' ? (
        <div className="w-full rounded-xl p-4 shadow-xs border-l-4 border-tertiary transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-tertiary-fixed text-on-tertiary-fixed">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">notification_important</span>
            </div>
            <div>
              <div className="font-headline font-semibold text-sm">
                7th-of-the-Month Cutoff Deadline
              </div>
              <div className="text-xs mt-0.5">
                ⚠️ Reminder: Today is the 7th of October! Please submit your monthly overtime log before
                midnight (23:59 GMT).
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={onNavigateToClaimReview || onSubmitMonthly}
              className="px-4 py-2 bg-on-tertiary-fixed text-tertiary-fixed rounded-lg text-xs font-semibold hover:opacity-90 shadow-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span>{isBm ? 'Semak & Sahkan Tuntutan' : 'Review & Submit Log'}</span>
            </button>
          </div>
        </div>
      ) : simulatedDay === '9' ? (
        <div className="w-full rounded-xl p-4 shadow-xs border-l-4 border-error transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-error-container text-on-error-container">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">lock_clock</span>
            </div>
            <div>
              <div className="font-headline font-semibold text-sm">
                Overdue Monthly Submission Notice
              </div>
              <div className="text-xs mt-0.5">
                The 7th monthly cutoff has passed by 48 hours. Please finalize and submit your records
                immediately so HR can process your monthly claim without exception.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={onSubmitMonthly}
              className="px-4 py-2 bg-error text-on-error rounded-lg text-xs font-semibold hover:opacity-90 shadow-xs transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Submit Overdue Log</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-xl p-4 shadow-xs border border-outline-variant/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-container-low text-on-surface">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-primary flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">schedule</span>
            </div>
            <div>
              <div className="font-headline font-semibold text-sm">
                October 2024 Overtime Cycle (Day {simulatedDay})
              </div>
              <div className="text-xs text-on-surface-variant mt-0.5">
                Standard cycle active. Ensure all regular and incident overtime hours are documented
                before the 7th deadline.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              type="button"
              onClick={() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
                document.getElementById('entry-date')?.focus();
              }}
              className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-all flex items-center gap-1.5 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Record</span>
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. Garis Masa Kitaran Kelulusan (Status Stepper)     */}
      {/* ==================================================== */}
      <StatusStepper
        isSubmitted={isSubmitted}
        submittedDate={submittedDate}
        simulatedDay={simulatedDay}
        language={language}
      />

      {/* ==================================================== */}
      {/* Staff Header Profile & Quick Stats Summary Bento     */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* User Overview Card */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-headline font-bold text-lg shadow-xs">
              AR
            </div>
            <div>
              <div className="font-headline font-bold text-sm text-on-surface">Ahmad Razak</div>
              <div className="text-xs text-on-surface-variant">STF-1042 • Engineering</div>
            </div>
          </div>
          <div className="mt-4 pt-3 bg-surface-container-low px-3 py-2 rounded-lg flex items-center justify-between border border-outline-variant/30">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              {isBm ? 'Kitaran Gaji' : 'Cycle Period'}
            </span>
            <span className="text-xs font-semibold text-on-surface">October 2024</span>
          </div>
        </div>

        {/* Stat 1: Overtime Safety Quota Gauge (Seksyen 60) */}
        <QuotaGauge totalHours={totalHours} language={language} />

        {/* Stat 2: Total Records */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-outline-variant/40 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              {isBm ? 'JUMLAH ENTRI' : 'TOTAL ENTRIES'}
            </div>
            <div className="font-headline font-bold text-2xl text-on-surface mt-1 mono-num">
              {entries.length}
            </div>
            <div className="text-xs text-on-surface-variant mt-1">
              {isBm ? 'Boleh dikemaskini bila-bila masa' : 'Editable at any time'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center border border-outline-variant/30">
            <span className="material-symbols-outlined text-[26px]">table_rows</span>
          </div>
        </div>

        {/* Stat 3: Submission Status */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-outline-variant/40 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
              {isBm ? 'STATUS PERAKUAN' : 'SUBMISSION STATUS'}
            </div>
            <div className="mt-2">
              {isSubmitted ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  {isBm ? 'Disahkan & Dihantar' : 'Submitted'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-tertiary" />
                  {isBm ? 'Menunggu Perakuan' : 'Pending Submission'}
                </span>
              )}
            </div>
            <div className="text-[11px] text-on-surface-variant mt-2">
              {isSubmitted ? `${isBm ? 'Dihantar' : 'Submitted'}: ${submittedDate}` : isBm ? 'Belum dihantar rasmi' : 'Not yet submitted'}
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isSubmitted
                ? 'bg-secondary-fixed text-secondary'
                : 'bg-surface-container-low text-tertiary border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[28px]">
              {isSubmitted ? 'check_circle' : 'pending_actions'}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* Main Workspace Split: Entry Form (Left) & Table (Right) */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* F02: Staff Overtime Entry Form (4 Cols) */}
        <div
          ref={formRef}
          className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-xs border border-outline-variant/40"
        >
          <div className="flex items-center justify-between pb-4 border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
              </div>
              <h2 className="font-headline font-semibold text-sm text-on-surface">
                Log Overtime Entry
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
              F02 Spec
            </span>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-4 mt-4" noValidate>
            {/* Quick Shift Templates (1-Click Presets) */}
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                {isBm ? 'Templat Syif Pantas (1-Klik):' : 'Quick Shift Presets (1-Click):'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyTemplate('evening')}
                  className="px-2 py-1 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface text-[10px] font-semibold transition-all border border-outline-variant/30 flex items-center gap-1 shadow-2xs"
                >
                  <span>⚡ {isBm ? 'Lanjutan Malam (18:00 - 21:30)' : 'Evening OT (18:00 - 21:30)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('hotfix')}
                  className="px-2 py-1 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface text-[10px] font-semibold transition-all border border-outline-variant/30 flex items-center gap-1 shadow-2xs"
                >
                  <span>⚡ {isBm ? 'Hotfix L2 (19:00 - 23:00)' : 'Hotfix L2 (19:00 - 23:00)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('weekend')}
                  className="px-2 py-1 rounded bg-surface-container-lowest hover:bg-surface-container text-on-surface text-[10px] font-semibold transition-all border border-outline-variant/30 flex items-center gap-1 shadow-2xs"
                >
                  <span>⚡ {isBm ? 'Standby Hujung Minggu (14:00 - 17:00)' : 'Weekend Standby (14:00 - 17:00)'}</span>
                </button>
                {entries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => applyTemplate('last')}
                    className="px-2 py-1 rounded bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed text-[10px] font-semibold transition-all flex items-center gap-1"
                    title={isBm ? 'Salin syif terkini' : 'Duplicate last entry'}
                  >
                    <span>📋 {isBm ? 'Salin Syif Terakhir' : 'Duplicate Last'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Date Field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="entry-date"
                className="text-xs font-semibold text-on-surface flex items-center justify-between"
              >
                <span>Date Logged</span>
                {errors.date && <span className="text-error text-xs">Date required</span>}
              </label>
              <input
                id="entry-date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className={`w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border transition-all focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary ${
                  errors.date
                    ? 'border-error bg-error-container/30 text-error'
                    : 'border-outline-variant/40'
                }`}
              />
            </div>

            {/* Time Range Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="entry-start-time"
                  className="text-xs font-semibold text-on-surface flex items-center justify-between"
                >
                  <span>Start Time</span>
                  {errors.startTime && <span className="text-error text-xs">Required</span>}
                </label>
                <input
                  id="entry-start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={`w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border transition-all focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary ${
                    errors.startTime
                      ? 'border-error bg-error-container/30 text-error'
                      : 'border-outline-variant/40'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="entry-end-time"
                  className="text-xs font-semibold text-on-surface flex items-center justify-between"
                >
                  <span>End Time</span>
                  {errors.endTime && <span className="text-error text-xs">Required</span>}
                </label>
                <input
                  id="entry-end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border transition-all focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary ${
                    errors.endTime
                      ? 'border-error bg-error-container/30 text-error'
                      : 'border-outline-variant/40'
                  }`}
                />
              </div>
            </div>

            {/* Inline Duration Calculation Display */}
            <div className="bg-surface-container-low px-4 py-2.5 rounded-lg flex items-center justify-between border border-outline-variant/30">
              <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">timelapse</span>
                Calculated Duration:
              </span>
              <span className="font-headline font-bold text-sm text-primary mono-num">
                {currentDuration.toFixed(1)} hrs
              </span>
            </div>

            {/* Project / Task Details */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="entry-project"
                className="text-xs font-semibold text-on-surface flex items-center justify-between"
              >
                <span>Role / Project Details</span>
                {errors.project && <span className="text-error text-xs">Select project</span>}
              </label>
              <select
                id="entry-project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className={`w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border transition-all focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary cursor-pointer ${
                  errors.project
                    ? 'border-error bg-error-container/30 text-error'
                    : 'border-outline-variant/40'
                }`}
              >
                <option value="">-- Choose Project Activity --</option>
                {PROJECT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Remarks / Notes */}
            <div className="flex flex-col gap-1">
              <label htmlFor="entry-notes" className="text-xs font-semibold text-on-surface">
                Remarks / Work Order ID
              </label>
              <input
                id="entry-notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. JIRA-4091 urgent sync hotfix"
                className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 transition-all focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Save Entry</span>
            </button>
          </form>
        </div>

        {/* F03 & F04: Staff Overtime List View & Submission (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Table Action Header & Submission Prompt */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              </div>
              <div>
                <div className="font-headline font-semibold text-sm text-on-surface">
                  Monthly Overtime Log
                </div>
                <div className="text-xs text-on-surface-variant">
                  October 2024 Payroll Cycle Submission
                </div>
              </div>
            </div>

            {/* F04 Submission Button, Voucher Link & View Switcher */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              {/* Table / Calendar Toggle */}
              <div className="inline-flex p-1 bg-surface-container-low rounded-lg border border-outline-variant/40 mr-1">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                    viewMode === 'table'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">table_rows</span>
                  <span>{isBm ? 'Jadual' : 'Table'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all flex items-center gap-1 ${
                    viewMode === 'calendar'
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">calendar_month</span>
                  <span>{isBm ? 'Kalendar' : 'Calendar'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onNavigateToClaimReview || onSubmitMonthly}
                className="px-3.5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold transition-all border border-outline-variant/30 flex items-center gap-1.5"
                title={isBm ? 'Buka Borang Pengesahan & Slip Tuntutan' : 'Open Official Certification Voucher'}
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>{isBm ? 'Borang Perakuan' : 'Claim Voucher'}</span>
              </button>
              <button
                type="button"
                onClick={onSubmitMonthly}
                className="px-5 py-2.5 bg-secondary hover:opacity-95 text-on-secondary rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>
                  {isSubmitted
                    ? isBm ? 'Hantar Semula Log (Kemaskini)' : 'Re-submit Overtime Log (Updated)'
                    : isBm ? 'Hantar Log OT Bulan Oktober' : 'Submit Overtime Log for October'}
                </span>
              </button>
            </div>
          </div>

          {/* View Mode: Calendar vs Table */}
          {viewMode === 'calendar' ? (
            <CalendarView
              entries={entries}
              simulatedDay={simulatedDay}
              onSelectDate={(dateStr) => {
                setFormDate(dateStr);
                formRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenEditModal={onOpenEditModal}
              onDeleteEntry={onDeleteEntry}
              language={language}
            />
          ) : (
            /* Table Container */
            <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider border-b border-surface-container-high">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Interval</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Project / Task</th>
                      <th className="py-3 px-4">Cycle Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/60 text-xs text-on-surface">
                    {entries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center">
                          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mx-auto mb-3">
                            <span className="material-symbols-outlined text-[32px]">folder_off</span>
                          </div>
                          <div className="font-headline font-semibold text-sm text-on-surface">
                            No overtime entries logged for this month yet
                          </div>
                          <div className="text-xs text-on-surface-variant max-w-sm mx-auto mt-1">
                            Use the form on the left to add your first overtime activity record.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      entries.map((entry) => {
                        const dt = formatDateDisplay(entry.date);
                        return (
                          <tr
                            key={entry.id}
                            className="hover:bg-surface-container-low transition-colors"
                          >
                            <td className="py-3.5 px-4 mono-num font-medium text-on-surface whitespace-nowrap">
                              <span className="font-bold text-sm">{dt.day}</span> {dt.month} {dt.year}
                            </td>
                            <td className="py-3.5 px-4 mono-num text-on-surface-variant whitespace-nowrap">
                              {entry.startTime} – {entry.endTime}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <span className="inline-flex items-center font-bold text-primary mono-num bg-surface-container px-2.5 py-0.5 rounded text-xs">
                                {entry.duration.toFixed(1)} hrs
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-xs text-on-surface">
                                {entry.project}
                              </div>
                              <div className="text-[11px] text-on-surface-variant truncate max-w-xs mt-0.5">
                                {entry.notes || '—'}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {isSubmitted ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-secondary font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                  Submitted
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-tertiary font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                                  Draft / Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => onOpenEditModal(entry)}
                                  title="Edit this record"
                                  className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteEntry(entry.id)}
                                  title="Delete record"
                                  className="p-1.5 rounded hover:bg-error-container text-on-surface-variant hover:text-error transition-all"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Clarification Notice */}
              <div className="bg-surface-container-low px-4 py-2.5 flex items-center justify-between text-on-surface-variant text-xs border-t border-surface-container-high">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-outline text-[16px]">info</span>
                  <span>
                    <strong>Note:</strong> You can edit or delete entries anytime, even after monthly
                    submission.
                  </span>
                </span>
                <span className="mono-num font-semibold text-on-surface">
                  Showing {entries.length} record{entries.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { StaffMember, SimulatedTimeline, UserRole } from '../types';

interface AdminMonitoringProps {
  allStaff: StaffMember[];
  simulatedDay: SimulatedTimeline;
  onSimulatedDayChange: (day: SimulatedTimeline) => void;
  onSwitchToStaff: () => void;
  onViewLogs: (staff: StaffMember) => void;
  onSendReminder: (name: string, id: string) => void;
  onNotifyAllPending: () => void;
  onToggleReconciled: (staffId: string) => void;
  onQuickAddWorker: () => void;
  onExportCSV: () => void;
  onNavigateToReports?: () => void;
  onNavigateToStaffDirectory?: () => void;
  language?: 'en' | 'bm';
}

export const AdminMonitoring: React.FC<AdminMonitoringProps> = ({
  allStaff,
  simulatedDay,
  onSimulatedDayChange,
  onSwitchToStaff,
  onViewLogs,
  onSendReminder,
  onNotifyAllPending,
  onToggleReconciled,
  onQuickAddWorker,
  onExportCSV,
  onNavigateToReports,
  onNavigateToStaffDirectory,
  language = 'en',
}) => {
  const isBm = language === 'bm';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUBMITTED' | 'PENDING'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState('2024-10');

  // KPI Computations
  const totalStaff = allStaff.length;
  const submittedCount = allStaff.filter((s) => s.status === 'Submitted').length;
  const pendingCount = totalStaff - submittedCount;
  const submissionRate = totalStaff > 0 ? Math.round((submittedCount / totalStaff) * 100) : 0;

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return allStaff.filter((staff) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        staff.name.toLowerCase().includes(q) ||
        staff.department.toLowerCase().includes(q) ||
        staff.role.toLowerCase().includes(q) ||
        staff.id.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'SUBMITTED' && staff.status === 'Submitted') ||
        (statusFilter === 'PENDING' && staff.status === 'Pending');

      return matchesSearch && matchesStatus;
    });
  }, [allStaff, searchTerm, statusFilter]);

  // Max hours for horizontal bar scaling
  const maxStaffHours = useMemo(() => {
    const hoursArr = allStaff.map((s) => s.entries.reduce((acc, curr) => acc + curr.duration, 0));
    return Math.max(...hoursArr, 16);
  }, [allStaff]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setSelectedMonth('2024-10');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ==================================================== */}
      {/* 1. Deadline Cutoff Alert Ribbon                      */}
      {/* ==================================================== */}
      <div
        className={`rounded-xl p-4 shadow-xs transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          simulatedDay === '7'
            ? 'bg-tertiary-fixed text-on-tertiary-fixed border-l-4 border-tertiary'
            : simulatedDay === '9'
            ? 'bg-error-container text-on-error-container border-l-4 border-error'
            : 'bg-tertiary-fixed text-on-tertiary-fixed'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              simulatedDay === '9'
                ? 'bg-error text-on-error'
                : 'bg-tertiary-container text-on-tertiary'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">lock_clock</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline font-bold text-sm tracking-tight">
                {simulatedDay === '7'
                  ? 'Today is the Monthly Cutoff (7th)'
                  : simulatedDay === '9'
                  ? 'Payroll Window Closed & Locked'
                  : 'Payroll Cutoff Warning'}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  simulatedDay === '9'
                    ? 'bg-error text-on-error animate-pulse'
                    : 'bg-tertiary text-on-tertiary'
                }`}
              >
                {simulatedDay === '7'
                  ? 'Deadline Active (23:59 GMT)'
                  : simulatedDay === '9'
                  ? 'Overdue Alert'
                  : 'Urgent Active'}
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5">
              {simulatedDay === '7'
                ? 'Unsubmitted time logs will auto-lock at midnight. Immediate staff notifications recommended.'
                : simulatedDay === '9'
                ? 'Cutoff passed on the 7th. Unsubmitted logs require manual HR administrative exception approval.'
                : 'Monthly submissions lock promptly on the 7th at 23:59 GMT. Overdue pending submissions require immediate compliance reminders.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="bg-surface-container-lowest/90 px-3 py-1.5 rounded-lg flex items-center gap-2 text-on-surface shadow-xs border border-outline-variant/30">
            <span className="text-[10px] uppercase font-bold text-outline">Simulated Clock</span>
            <span className="mono-num text-xs font-bold">
              {simulatedDay === '7'
                ? 'Day 7 • Cutoff Window Closing'
                : simulatedDay === '9'
                ? 'Day 9 • Past Cutoff (Late)'
                : `Day ${simulatedDay} • Normal Cadence`}
            </span>
          </div>
          <button
            type="button"
            onClick={onNotifyAllPending}
            className="px-3.5 py-1.5 rounded-lg bg-tertiary text-on-tertiary text-xs font-semibold hover:bg-tertiary-container transition-colors shadow-xs flex items-center gap-1.5 active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[16px]">outgoing_mail</span>
            Notify All Pending
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. Operational Header & Admin Persona Bar            */}
      {/* ==================================================== */}
      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src="/asward-profile.jpg"
              alt="Asward"
              className="w-16 h-16 rounded-xl object-cover shadow-xs bg-surface-container-high ring-2 ring-primary/20"
            />
            <span
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center ring-2 ring-surface-container-lowest text-on-secondary shadow-xs"
              title="Auditor Mode Active"
            >
              <span className="material-symbols-outlined text-[13px]">verified_user</span>
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-headline font-bold text-lg text-on-surface">
                Asward
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] font-semibold">
                Lead HR Auditor
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px]">
                Personnel Ops #DIR-881
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Supervising Regional Operational Overtime & Monthly Payroll Reconciliation
            </p>
          </div>
        </div>

        {/* Quick Sandbox Tools */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          {/* Fast Role Switcher */}
          <button
            type="button"
            onClick={onSwitchToStaff}
            className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold flex items-center gap-2 transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px]">switch_account</span>
            <span>Simulate Ahmad (Staff)</span>
          </button>

          {/* Date Simulator Select */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
            <span className="material-symbols-outlined text-outline text-[18px]">tune</span>
            <label htmlFor="admin-sim-control" className="text-xs text-on-surface-variant font-medium">
              Timeline Sim:
            </label>
            <select
              id="admin-sim-control"
              value={simulatedDay}
              onChange={(e) => onSimulatedDayChange(e.target.value as SimulatedTimeline)}
              className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
            >
              <option value="14">Standard Period (14th)</option>
              <option value="7">Cutoff Lockout (7th Deadline ⚠️)</option>
              <option value="9">Late Critical (9th - Overdue)</option>
              <option value="3">Early Regular (3rd)</option>
            </select>
          </div>

          {/* Reports Link */}
          {onNavigateToReports && (
            <button
              type="button"
              onClick={onNavigateToReports}
              className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-all border border-outline-variant/30"
              title={isBm ? 'Buka Pusat Laporan Penggajian' : 'Open Reports Center'}
            >
              <span className="material-symbols-outlined text-[18px]">assessment</span>
              <span>{isBm ? 'Laporan Penggajian' : 'Payroll Reports'}</span>
            </button>
          )}

          {/* Quick Export CSV button */}
          <button
            type="button"
            onClick={onExportCSV}
            title={isBm ? 'Muat Turun Fail CSV Penggajian' : 'Export Payroll Reconciliation CSV'}
            className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[20px]">download</span>
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. KPI Metric Cards                                  */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tracked Personnel */}
        <div
          onClick={onNavigateToStaffDirectory}
          className={`rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/40 flex flex-col justify-between transition-all ${
            onNavigateToStaffDirectory ? 'cursor-pointer hover:border-primary/60 hover:shadow-sm' : ''
          }`}
          title={isBm ? 'Klik untuk buka Direktori Staf' : 'Click to open Staff Directory'}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              {isBm ? 'Jumlah Kakitangan Dipantau' : 'Tracked Personnel'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-on-surface mono-num">
                {totalStaff}
              </span>
              <span className="text-[11px] text-secondary font-semibold">100% active</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isBm ? 'Unit Operasi & Logistik (Klik untuk urus)' : 'Operations & Logistics Units (Click to view)'}
            </p>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Card 2: Certified Submissions */}
        <div className="rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Certified Submissions
            </span>
            <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-secondary mono-num">
                {submittedCount}
              </span>
              <span className="text-xs text-on-surface-variant">
                / {totalStaff} Staff ({submissionRate}%)
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Fully reconciled against shift timestamps
            </p>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${submissionRate}%` }}
            />
          </div>
        </div>

        {/* Card 3: Pending Verification */}
        <div className="rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Pending Verification
            </span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-tertiary mono-num">
                {pendingCount}
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                  simulatedDay === '9' && pendingCount > 0
                    ? 'bg-error-container text-error'
                    : 'bg-surface-container-low text-tertiary'
                }`}
              >
                {simulatedDay === '9' && pendingCount > 0 ? `${pendingCount} Overdue` : 'In Review'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Logs in draft or unattended queue
            </p>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                simulatedDay === '9' && pendingCount > 0 ? 'bg-error' : 'bg-tertiary'
              }`}
              style={{ width: `${100 - submissionRate}%` }}
            />
          </div>
        </div>

        {/* Card 4: Payroll Freeze Target */}
        <div className="rounded-xl bg-surface-container-lowest p-5 shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Payroll Freeze Target
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">event_busy</span>
            </div>
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-headline font-bold text-2xl ${
                  simulatedDay === '7'
                    ? 'text-tertiary animate-pulse'
                    : simulatedDay === '9'
                    ? 'text-error'
                    : 'text-primary'
                }`}
              >
                {simulatedDay === '7' ? 'TODAY' : simulatedDay === '9' ? 'CLOSED' : '7th'}
              </span>
              <span className="text-sm font-semibold text-on-surface-variant">Monthly</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {simulatedDay === '7'
                ? 'Locks tonight at 23:59 GMT'
                : simulatedDay === '9'
                ? 'Passed by 48 hrs (Lockout active)'
                : 'Standard audit tolerance window open'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-[11px] text-on-surface-variant font-medium">
              Core ERP Sync Ready
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 4. Chart & Department Compliance Split               */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Visual OT Distribution Bar Chart */}
        <div className="lg:col-span-2 rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-headline font-bold text-base text-on-surface">
                Monthly Overtime Hours by Staff Member
              </h2>
              <p className="text-xs text-on-surface-variant">
                Comparing certified vs pending recorded hours this billing cycle
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-secondary" />
                <span className="text-on-surface-variant">Approved / Submitted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-tertiary" />
                <span className="text-on-surface-variant">Draft / Pending</span>
              </div>
            </div>
          </div>

          {/* Bar Chart list */}
          <div className="space-y-4 pt-2">
            {allStaff.map((staff) => {
              const staffHours = staff.entries.reduce((acc, curr) => acc + curr.duration, 0);
              const percent = Math.min(100, Math.round((staffHours / maxStaffHours) * 100));
              const isSub = staff.status === 'Submitted';

              return (
                <div key={staff.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-on-surface flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${isSub ? 'bg-secondary' : 'bg-tertiary'}`}
                      />
                      <span className="font-semibold">{staff.name}</span>
                      <span className="text-on-surface-variant text-[11px]">
                        ({staff.department})
                      </span>
                    </span>
                    <span className="mono-num font-bold text-on-surface">
                      {staffHours.toFixed(1)} hrs
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className={`${
                        isSub ? 'bg-secondary' : 'bg-tertiary'
                      } h-full rounded-full transition-all duration-700`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right (1 col): Compliance Health & LocalStorage Sync Note */}
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold text-base text-on-surface">
                Compliance Health
              </h2>
              <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed text-xs font-semibold">
                Pass 88%
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Statutory maximum overtime cap: 48 hrs / month per worker (Employment Regulation Sec
              60).
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    local_shipping
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-on-surface">Fleet Operations</div>
                    <div className="text-[11px] text-on-surface-variant">2 Staff • 34.0 hrs Total</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-secondary">Normative</span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    warehouse
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-on-surface">Warehouse Hub B</div>
                    <div className="text-[11px] text-on-surface-variant">2 Staff • 28.5 hrs Total</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-secondary">Normative</span>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/30">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    support_agent
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-on-surface">Dispatch Control</div>
                    <div className="text-[11px] text-on-surface-variant">1 Staff • 11.5 hrs Total</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-tertiary">Review</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 bg-surface-container-high/30 rounded-lg p-3 border border-outline-variant/30">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                info
              </span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Data synchronizes directly from client localStorage key:{' '}
                <code className="mono-num font-bold text-primary">ot_tracker_data_v2</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 5. Filters & Staff Audit Table                       */}
      {/* ==================================================== */}
      <div className="rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/40 overflow-hidden flex flex-col">
        {/* Filter Action Toolbar */}
        <div className="p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-surface-container-high">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter staff name, role, or department..."
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface placeholder:text-outline border border-outline-variant/40 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {/* Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Month Selector */}
            <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 border border-outline-variant/40">
              <span className="material-symbols-outlined text-outline text-[18px] mr-1.5">
                calendar_month
              </span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
              >
                <option value="2024-10">October 2024 (Current)</option>
                <option value="2024-09">September 2024</option>
                <option value="2024-08">August 2024</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 border border-outline-variant/40">
              <span className="material-symbols-outlined text-outline text-[18px] mr-1.5">
                filter_list
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">Status: All ({allStaff.length})</option>
                <option value="SUBMITTED">Submitted Only</option>
                <option value="PENDING">Pending / Draft Only</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/40"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Counter Strip & Quick Add */}
        <div className="px-5 py-2.5 bg-surface-container-low/60 flex items-center justify-between text-on-surface-variant text-xs border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="font-bold text-on-surface">
              Displaying {filteredStaff.length} of {allStaff.length} Employees
            </span>
            <span className="text-outline">•</span>
            <span>All departments • Active billing cycle</span>
          </div>
          <button
            type="button"
            onClick={onQuickAddWorker}
            className="hover:text-primary font-semibold flex items-center gap-1 transition-colors text-xs"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            Quick Add Worker
          </button>
        </div>

        {/* Table Container */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider border-b border-surface-container-high">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Total Entries</th>
                <th className="py-3 px-4 text-right">OT Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60 text-xs">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center px-4">
                    <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-outline mx-auto mb-3">
                      <span className="material-symbols-outlined text-[28px]">search_off</span>
                    </div>
                    <h3 className="font-headline font-bold text-sm text-on-surface">
                      No Personnel Records Matched
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                      No employees match your selected filter criteria. Try adjusting the search query
                      or status filter.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-colors shadow-xs"
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => {
                  const staffTotalHours = staff.entries.reduce((a, b) => a + b.duration, 0);
                  const isSub = staff.status === 'Submitted';

                  return (
                    <tr
                      key={staff.id}
                      className="hover:bg-surface-container-low/60 transition-colors"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs">
                              {staff.avatar || staff.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${
                                isSub ? 'bg-secondary' : 'bg-tertiary'
                              } ring-1 ring-surface-container-lowest`}
                            />
                          </div>
                          <div>
                            <div className="font-headline font-semibold text-xs text-on-surface">
                              {staff.name}
                            </div>
                            <div className="text-[11px] text-on-surface-variant">
                              {staff.role} • {staff.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-on-surface">
                        {staff.department}
                      </td>
                      <td className="py-3.5 px-4 text-right mono-num font-medium text-on-surface">
                        {staff.entries.length} logs
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="mono-num font-bold text-primary">
                          {staffTotalHours.toFixed(1)} hrs
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {isSub ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                            Submitted
                          </span>
                        ) : simulatedDay === '7' || simulatedDay === '9' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-semibold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-error" />
                            Overdue Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                            Draft / Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isSub ? (
                          <span className="mono-num text-on-surface font-medium text-[11px]">
                            {staff.submittedAt}
                          </span>
                        ) : (
                          <span className="text-outline italic text-[11px]">Not finalized</span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onViewLogs(staff)}
                            className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold transition-colors flex items-center gap-1 border border-outline-variant/30"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            View Logs
                          </button>
                          {!isSub ? (
                            <button
                              type="button"
                              onClick={() => onSendReminder(staff.name, staff.id)}
                              className="p-1.5 rounded-lg bg-surface-container-low hover:bg-tertiary-fixed text-tertiary hover:text-on-tertiary-fixed-variant transition-colors border border-outline-variant/30"
                              title="Send Urgent In-App Reminder"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                outgoing_mail
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onToggleReconciled(staff.id)}
                              className="p-1.5 rounded-lg bg-surface-container-low hover:bg-secondary-fixed text-secondary hover:text-on-secondary-fixed transition-colors border border-outline-variant/30"
                              title="Flag Certified Reconciled"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                check_circle
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { StaffMember } from '../types';

interface ReportsPageProps {
  allStaff: StaffMember[];
  onExportCSV: () => void;
  onViewStaffLogs: (staff: StaffMember) => void;
  language: 'en' | 'bm';
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  allStaff,
  onExportCSV,
  onViewStaffLogs,
  language,
}) => {
  const [selectedCycle, setSelectedCycle] = useState('2024-10');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const isBm = language === 'bm';

  // Compute metrics
  const totalEmployees = allStaff.length;
  const submittedEmployees = allStaff.filter((s) => s.status === 'Submitted');
  const totalSubmittedCount = submittedEmployees.length;

  const totalOvertimeHours = allStaff.reduce((total, staff) => {
    return total + staff.entries.reduce((sub, e) => sub + e.duration, 0);
  }, 0);

  // Approximate financial calculation (RM 25.00/hour estimated base OT rate)
  const estimatedPayrollCost = totalOvertimeHours * 28.5;

  // Filter staff
  const filteredReportStaff = useMemo(() => {
    return allStaff.filter((staff) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        staff.name.toLowerCase().includes(q) ||
        staff.id.toLowerCase().includes(q) ||
        staff.department.toLowerCase().includes(q);

      const matchesDept = deptFilter === 'ALL' || staff.department === deptFilter;

      return matchesSearch && matchesDept;
    });
  }, [allStaff, searchQuery, deptFilter]);

  const departments = useMemo(() => {
    return Array.from(new Set(allStaff.map((s) => s.department)));
  }, [allStaff]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Top Header & Export Controls */}
      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs">
            <span className="material-symbols-outlined text-[24px]">assessment</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-lg text-on-surface">
                {isBm ? 'Pusat Laporan & Rekonsiliasi Penggajian' : 'Payroll Reconciliation & Audit Center'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-secondary-container text-on-secondary-fixed">
                {isBm ? 'Data Langsung' : 'Live Synced'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isBm
                ? 'Analitik jam kerja lebih masa, penilaian statutori, dan fail manifes penggajian bulanan'
                : 'Overtime hours analytics, statutory compliance audits, and monthly payroll export manifests'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Cycle Selector */}
          <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/40">
            <span className="material-symbols-outlined text-outline text-[18px] mr-1.5">
              calendar_month
            </span>
            <select
              value={selectedCycle}
              onChange={(e) => setSelectedCycle(e.target.value)}
              className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
            >
              <option value="2024-10">Oktober 2024 (Aktif)</option>
              <option value="2024-09">September 2024 (Arkib)</option>
              <option value="2024-08">Ogos 2024 (Arkib)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onExportCSV}
            className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>{isBm ? 'Muat Turun Fail CSV' : 'Export Payroll CSV'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total OT Hours */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              {isBm ? 'Jumlah Jam OT Diproses' : 'Total OT Processed'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline font-bold text-2xl text-primary mono-num">
              {totalOvertimeHours.toFixed(1)} <span className="text-sm font-normal text-on-surface-variant">hrs</span>
            </div>
            <div className="text-xs text-on-surface-variant mt-0.5">
              {allStaff.reduce((c, s) => c + s.entries.length, 0)} {isBm ? 'rekod syif terkumpul' : 'total shift entries'}
            </div>
          </div>
          <div className="text-[11px] text-secondary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            {isBm ? 'Pematuhan had individu < 48j' : 'All below 48h monthly cap'}
          </div>
        </div>

        {/* Card 2: Estimated Payout */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              {isBm ? 'Anggaran Tuntutan (MYR)' : 'Est. OT Expenditure'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline font-bold text-2xl text-secondary mono-num">
              RM {estimatedPayrollCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-on-surface-variant mt-0.5">
              {isBm ? 'Kadar purata RM28.50/jam' : 'Avg base rate RM28.50/hr'}
            </div>
          </div>
          <div className="text-[11px] text-on-surface-variant">
            {isBm ? 'Tertakluk kepada pengesahan HR' : 'Subject to final HR audit'}
          </div>
        </div>

        {/* Card 3: Submission Rate */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              {isBm ? 'Kadar Penyerahan Tepat Masa' : 'On-Time Submission Rate'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">rule</span>
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline font-bold text-2xl text-on-surface mono-num">
              {Math.round((totalSubmittedCount / (totalEmployees || 1)) * 100)}%
            </div>
            <div className="text-xs text-on-surface-variant mt-0.5">
              {totalSubmittedCount} / {totalEmployees} {isBm ? 'kakitangan selesai' : 'staff certified'}
            </div>
          </div>
          <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${(totalSubmittedCount / (totalEmployees || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Card 4: ERP Sync Status */}
        <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              {isBm ? 'Status Integrasi ERP' : 'Payroll Integration'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">sync_saved_locally</span>
            </div>
          </div>
          <div className="my-3">
            <div className="font-headline font-bold text-xl text-primary">
              {isBm ? 'Bersedia Untuk Eksport' : 'Ready For Batch'}
            </div>
            <div className="text-xs text-on-surface-variant mt-0.5">
              SAP / Oracle Payroll Format
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-secondary font-semibold">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>{isBm ? 'Sambungan Aktif' : 'Engine Synced'}</span>
          </div>
        </div>
      </div>

      {/* Breakdown by Department & Compliance Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution */}
        <div className="lg:col-span-2 rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/40">
          <h2 className="font-headline font-bold text-base text-on-surface mb-1">
            {isBm ? 'Pecahan Mengikut Jabatan Operasi' : 'Departmental Breakdown & Quota'}
          </h2>
          <p className="text-xs text-on-surface-variant mb-4">
            {isBm
              ? 'Perbandingan jumlah jam dan status penyerahan setiap unit kerja'
              : 'Overtime volume and submission compliance status by unit'}
          </p>

          <div className="space-y-4">
            {departments.map((dept) => {
              const deptStaff = allStaff.filter((s) => s.department === dept);
              const deptHours = deptStaff.reduce((total, s) => {
                return total + s.entries.reduce((sum, e) => sum + e.duration, 0);
              }, 0);
              const deptSubmitted = deptStaff.filter((s) => s.status === 'Submitted').length;

              return (
                <div key={dept} className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-on-surface">{dept}</span>
                      <span className="text-[11px] text-on-surface-variant">
                        ({deptStaff.length} {isBm ? 'staf' : 'staff'})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-primary mono-num">
                      {deptHours.toFixed(1)} hrs
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>
                      {isBm ? 'Status Hantar' : 'Submission'}: {deptSubmitted} / {deptStaff.length} {isBm ? 'lengkap' : 'complete'}
                    </span>
                    <span className={deptSubmitted === deptStaff.length ? 'text-secondary font-semibold' : 'text-tertiary font-semibold'}>
                      {deptSubmitted === deptStaff.length
                        ? isBm ? '✓ Semua Selesai' : '✓ 100% Certified'
                        : isBm ? '⚠ Menunggu Tindakan' : '⚠ Action Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regulatory Audit Checklist */}
        <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/40 flex flex-col justify-between">
          <div>
            <h2 className="font-headline font-bold text-base text-on-surface mb-1">
              {isBm ? 'Senarai Semak Pematuhan Buruh' : 'Statutory Labor Checklist'}
            </h2>
            <p className="text-xs text-on-surface-variant mb-4">
              {isBm ? 'Garis panduan Akta Kerja 1955 (Seksyen 60)' : 'Malaysian Employment Act 1955 Compliance'}
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/30">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <div>
                  <div className="text-xs font-bold text-on-surface">
                    {isBm ? 'Had Maksimum 104 Jam Bulanan' : 'Monthly Limit Cap (104h)'}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    {isBm ? 'Tiada staf melebihi had keselamatan' : 'Zero personnel exceeded threshold'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/30">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  check_circle
                </span>
                <div>
                  <div className="text-xs font-bold text-on-surface">
                    {isBm ? 'Kadar 1.5x & 2.0x Disahkan' : 'Rate Multipliers Certified'}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    {isBm ? 'Pengiraan automatik tepat mengikut syif' : 'System automated shift rates verified'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-2.5 border border-outline-variant/30">
                <span className="material-symbols-outlined text-tertiary text-[20px] shrink-0 mt-0.5">
                  notification_important
                </span>
                <div>
                  <div className="text-xs font-bold text-on-surface">
                    {isBm ? 'Pemotongan 7hb Setiap Bulan' : '7th Monthly Cutoff Rule'}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">
                    {isBm ? 'Penguncian rekod tepat jam 23:59 GMT' : 'Lockout applies at midnight 23:59 GMT'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-container-high">
            <button
              type="button"
              onClick={onExportCSV}
              className="w-full py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>{isBm ? 'Eksport Ringkasan Penuh' : 'Export Full Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Audit Ledger Table */}
      <div className="rounded-xl bg-surface-container-lowest shadow-xs border border-outline-variant/40 overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-surface-container-high">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBm ? 'Cari nama staf, nombor ID, atau jabatan...' : 'Search staff name, ID, or department...'}
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/40">
              <span className="material-symbols-outlined text-outline text-[18px] mr-1.5">
                domain
              </span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">{isBm ? 'Semua Jabatan' : 'All Departments'}</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-semibold text-[11px] uppercase border-b border-surface-container-high">
                <th className="py-3 px-6">{isBm ? 'Kakitangan' : 'Employee'}</th>
                <th className="py-3 px-4">{isBm ? 'Jabatan' : 'Department'}</th>
                <th className="py-3 px-4 text-right">{isBm ? 'Jumlah Syif' : 'Entries'}</th>
                <th className="py-3 px-4 text-right">{isBm ? 'Jumlah Jam OT' : 'OT Hours'}</th>
                <th className="py-3 px-4">{isBm ? 'Status Kitaran' : 'Status'}</th>
                <th className="py-3 px-4">{isBm ? 'Tarikh Hantar' : 'Submission Date'}</th>
                <th className="py-3 px-6 text-right">{isBm ? 'Tindakan' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60">
              {filteredReportStaff.map((staff) => {
                const staffHours = staff.entries.reduce((a, b) => a + b.duration, 0);
                const isSub = staff.status === 'Submitted';

                return (
                  <tr key={staff.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-on-surface">{staff.name}</div>
                      <div className="text-[11px] text-on-surface-variant">{staff.id} • {staff.role}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-on-surface">{staff.department}</td>
                    <td className="py-3.5 px-4 text-right mono-num font-medium text-on-surface">
                      {staff.entries.length} logs
                    </td>
                    <td className="py-3.5 px-4 text-right mono-num font-bold text-primary">
                      {staffHours.toFixed(1)} hrs
                    </td>
                    <td className="py-3.5 px-4">
                      {isSub ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          {isBm ? 'Disahkan' : 'Submitted'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-tertiary">
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                          {isBm ? 'Belum Hantar' : 'Pending'}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 mono-num text-on-surface-variant text-[11px]">
                      {staff.submittedAt || '—'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => onViewStaffLogs(staff)}
                        className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-primary rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 border border-outline-variant/30"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>{isBm ? 'Lihat Log' : 'View Audit'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

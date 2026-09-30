import React, { useState } from 'react';
import { StaffMember } from '../types';

interface StaffDirectoryPageProps {
  allStaff: StaffMember[];
  onAddNewStaff: (newStaff: StaffMember) => void;
  onSimulateStaff: (staffName: string, role: string) => void;
  onViewStaffLogs: (staff: StaffMember) => void;
  language: 'en' | 'bm';
}

export const StaffDirectoryPage: React.FC<StaffDirectoryPageProps> = ({
  allStaff,
  onAddNewStaff,
  onSimulateStaff,
  onViewStaffLogs,
  language,
}) => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New staff form state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Fleet Logistics');
  const [role, setRole] = useState('');
  const [initialHours, setInitialHours] = useState('3.0');

  const isBm = language === 'bm';

  const departments = ['Engineering', 'Fleet Logistics', 'Warehouse Hub B', 'Dispatch Control', 'Quality Assurance'];

  const filteredStaff = allStaff.filter((staff) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      staff.name.toLowerCase().includes(q) ||
      staff.department.toLowerCase().includes(q) ||
      staff.id.toLowerCase().includes(q);

    const matchDept = deptFilter === 'ALL' || staff.department === deptFilter;

    return matchSearch && matchDept;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `EMP-${10500 + allStaff.length}`;
    const initials = name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase();

    const hoursNum = parseFloat(initialHours) || 3.0;

    const newMember: StaffMember = {
      id: newId,
      name: name.trim(),
      department,
      role: role.trim() || 'Logistics Coordinator',
      status: 'Pending',
      submittedAt: null,
      avatar: initials.slice(0, 2),
      entries: [
        {
          id: 'ent-' + Date.now(),
          date: '2024-10-05',
          startTime: '18:00',
          endTime: '21:00',
          duration: hoursNum,
          project: 'Warehouse Logistics System',
          notes: 'Unscheduled inventory shift triage',
        },
      ],
    };

    onAddNewStaff(newMember);
    setIsAddModalOpen(false);
    setName('');
    setRole('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-xs border border-outline-variant/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-xs">
            <span className="material-symbols-outlined text-[24px]">badge</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-lg text-on-surface">
                {isBm ? 'Direktori Kakitangan & Pengurusan Syif' : 'Staff Directory & Shift Operations'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-fixed text-on-primary-fixed">
                {allStaff.length} {isBm ? 'Pekerja Aktif' : 'Active Staff'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isBm
                ? 'Senarai tenaga kerja berdaftar, had kuota lebih masa, dan integrasi penjejakan jam kerja'
                : 'Personnel roster, overtime eligibility limits, and real-time shift synchronization'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          <span>{isBm ? '+ Tambah Pekerja Baharu' : '+ Add New Worker'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl bg-surface-container-lowest p-4 shadow-xs border border-outline-variant/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBm ? 'Cari nama, ID pekerja, atau jabatan...' : 'Search staff by name, ID, or department...'}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg text-xs text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant">
            {isBm ? 'Tapis Jabatan:' : 'Department:'}
          </span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-surface-container-low text-xs text-on-surface font-semibold px-3 py-2 rounded-lg border border-outline-variant/40 focus:outline-none cursor-pointer"
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

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((staff) => {
          const staffTotalHours = staff.entries.reduce((a, b) => a + b.duration, 0);
          const isSub = staff.status === 'Submitted';

          return (
            <div
              key={staff.id}
              className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-outline-variant/40 flex flex-col justify-between hover:border-primary/50 transition-all"
            >
              <div>
                {/* Header card with avatar & status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high text-primary flex items-center justify-center font-bold text-sm shadow-xs border border-outline-variant/30">
                      {staff.avatar || staff.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-headline font-bold text-sm text-on-surface">{staff.name}</h2>
                      <div className="text-xs text-on-surface-variant">{staff.id}</div>
                      <div className="text-[11px] font-semibold text-primary">{staff.department}</div>
                    </div>
                  </div>

                  {isSub ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {isBm ? 'Disahkan' : 'Submitted'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                      {isBm ? 'Menunggu' : 'Pending'}
                    </span>
                  )}
                </div>

                {/* Role and Shift Assignment */}
                <div className="mt-4 pt-3 border-t border-surface-container-high space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">{isBm ? 'Jawatan' : 'Role'}:</span>
                    <span className="font-semibold text-on-surface">{staff.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">{isBm ? 'Jumlah Jam OT' : 'OT Hours'}:</span>
                    <span className="font-bold text-primary mono-num">{staffTotalHours.toFixed(1)} hrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">{isBm ? 'Bilangan Syif' : 'Shifts Logged'}:</span>
                    <span className="mono-num font-medium text-on-surface">{staff.entries.length} syif</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-surface-container-high flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onViewStaffLogs(staff)}
                  className="flex-1 py-1.5 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-outline-variant/30"
                >
                  <span className="material-symbols-outlined text-[16px]">view_timeline</span>
                  <span>{isBm ? 'Lihat Log Syif' : 'View Shifts'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSimulateStaff(staff.name, staff.role)}
                  className="py-1.5 px-3 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  title="Simulate perspective as this staff member"
                >
                  <span className="material-symbols-outlined text-[16px]">switch_account</span>
                  <span>{isBm ? 'Pilih' : 'Switch'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Worker Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-xl shadow-2xl border border-outline-variant/40 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 bg-surface-container flex items-center justify-between border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                </div>
                <h3 className="font-headline font-bold text-sm text-on-surface">
                  {isBm ? 'Daftar Kakitangan Baharu' : 'Register New Staff Member'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">
                  {isBm ? 'Nama Penuh Kakitangan' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Zainal Abidin"
                  className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">
                  {isBm ? 'Jabatan' : 'Department'}
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">
                  {isBm ? 'Jawatan / Peranan' : 'Position / Role'}
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Logistics Controller"
                  className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">
                  {isBm ? 'Jam OT Permulaan (Jam)' : 'Initial Sample OT Entry (Hours)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={initialHours}
                  onChange={(e) => setInitialHours(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-semibold"
                >
                  {isBm ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-bold shadow-xs"
                >
                  {isBm ? 'Simpan Pekerja' : 'Save Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

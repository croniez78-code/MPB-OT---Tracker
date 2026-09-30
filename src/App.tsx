import React, { useState, useEffect } from 'react';
import {
  UserRole,
  SimulatedTimeline,
  OvertimeEntry,
  StaffMember,
  ToastMessage,
  ActiveView,
  AppLanguage,
} from './types';
import { INITIAL_AHMAD_ENTRIES, INITIAL_OTHER_STAFF } from './mockData';
import { Header } from './components/Header';
import { SimulationBar } from './components/SimulationBar';
import { StaffDashboard } from './components/StaffDashboard';
import { AdminMonitoring } from './components/AdminMonitoring';
import { ClaimReviewPage } from './components/ClaimReviewPage';
import { ReportsPage } from './components/ReportsPage';
import { StaffDirectoryPage } from './components/StaffDirectoryPage';
import { LoginPage } from './components/LoginPage';
import { EditEntryModal } from './components/EditEntryModal';
import { AuditDetailModal } from './components/AuditDetailModal';
import { Toast } from './components/Toast';

const STORAGE_KEY = 'ot_tracker_data_v2';

export default function App() {
  // App Navigation & Language State
  const [activeView, setActiveView] = useState<ActiveView>('staff-dashboard');
  const [language, setLanguage] = useState<AppLanguage>('bm');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Role & Simulation State
  const [currentRole, setCurrentRole] = useState<UserRole>('staff');
  const [simulatedDay, setSimulatedDay] = useState<SimulatedTimeline>('7');
  const [ahmadEntries, setAhmadEntries] = useState<OvertimeEntry[]>(INITIAL_AHMAD_ENTRIES);
  const [ahmadSubmission, setAhmadSubmission] = useState<{
    isSubmitted: boolean;
    submittedDate: string | null;
  }>({
    isSubmitted: false,
    submittedDate: null,
  });
  const [otherStaff, setOtherStaff] = useState<StaffMember[]>(INITIAL_OTHER_STAFF);

  // Modals
  const [editingEntry, setEditingEntry] = useState<OvertimeEntry | null>(null);
  const [auditStaffId, setAuditStaffId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.ahmadEntries) setAhmadEntries(parsed.ahmadEntries);
        if (parsed.ahmadSubmission) setAhmadSubmission(parsed.ahmadSubmission);
        if (parsed.otherStaff) setOtherStaff(parsed.otherStaff);
        if (parsed.currentRole) setCurrentRole(parsed.currentRole);
        if (parsed.simulatedDay) setSimulatedDay(parsed.simulatedDay);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.isDarkMode !== undefined) setIsDarkMode(parsed.isDarkMode);
      }
      const savedDark = localStorage.getItem('ot_tracker_dark_mode');
      if (savedDark !== null) {
        setIsDarkMode(savedDark === 'true');
      }
    } catch (e) {
      console.error('Failed to load stored overtime state:', e);
    }
  }, []);

  // Sync dark mode class on html tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('ot_tracker_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Save to localStorage whenever critical state updates
  useEffect(() => {
    try {
      const stateToStore = {
        ahmadEntries,
        ahmadSubmission,
        otherStaff,
        currentRole,
        simulatedDay,
        language,
        isDarkMode,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } catch (e) {
      console.error('Failed to save overtime state:', e);
    }
  }, [ahmadEntries, ahmadSubmission, otherStaff, currentRole, simulatedDay, language, isDarkMode]);

  // Toast Helper
  const showToast = (
    message: string,
    type: 'success' | 'warning' | 'info' | 'error' = 'info',
    icon?: string
  ) => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Staff Actions
  const handleAddEntry = (entryData: Omit<OvertimeEntry, 'id'>) => {
    const newEntry: OvertimeEntry = {
      ...entryData,
      id: 'ot-' + Date.now(),
    };
    setAhmadEntries((prev) => [newEntry, ...prev]);
    showToast(
      language === 'bm' ? 'Entri masa lebih masa berjaya disimpan!' : 'Overtime entry saved successfully!',
      'success',
      'check_circle'
    );
  };

  const handleEditEntry = (updated: OvertimeEntry) => {
    setAhmadEntries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    showToast(
      language === 'bm' ? 'Perubahan rekod berjaya dikemaskini!' : 'Record changes updated successfully!',
      'success',
      'save'
    );
  };

  const handleDeleteEntry = (id: string) => {
    setAhmadEntries((prev) => prev.filter((item) => item.id !== id));
    showToast(
      language === 'bm' ? 'Rekod dikeluarkan daripada lembaran' : 'Entry removed from timesheet',
      'info',
      'delete'
    );
  };

  const handleSubmitMonthly = () => {
    if (ahmadEntries.length === 0) {
      showToast(
        language === 'bm'
          ? 'Tidak boleh menghantar log kosong. Sila tambah entri terlebih dahulu.'
          : 'Cannot submit an empty overtime log. Please add an entry first.',
        'error',
        'error'
      );
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} GMT`;
    const formattedDate = `${String(simulatedDay).padStart(2, '0')} Oct 2024, ${timeStr}`;

    setAhmadSubmission({
      isSubmitted: true,
      submittedDate: formattedDate,
    });

    showToast(
      language === 'bm'
        ? `Tuntutan OT Oktober berjaya disahkan & dihantar (${formattedDate})!`
        : `Monthly OT Log submitted for October (${formattedDate})!`,
      'success',
      'send'
    );
  };

  // Synchronized Ahmad as a staff member in Admin view
  const ahmadAsStaff: StaffMember = {
    id: 'STF-1042',
    name: 'Ahmad Razak',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    status: ahmadSubmission.isSubmitted ? 'Submitted' : 'Pending',
    submittedAt: ahmadSubmission.submittedDate,
    avatar: 'AR',
    entries: ahmadEntries,
  };

  const allStaff: StaffMember[] = [ahmadAsStaff, ...otherStaff];

  // Admin Actions
  const handleSendReminder = (name: string, id: string) => {
    showToast(
      language === 'bm'
        ? `Peringatan pematuhan dihantar ke ${name} (${id})`
        : `Compliance reminder dispatched to ${name} (${id})`,
      'info',
      'outgoing_mail'
    );
  };

  const handleNotifyAllPending = () => {
    const pendingStaff = allStaff.filter((s) => s.status !== 'Submitted');
    if (pendingStaff.length === 0) {
      showToast(
        language === 'bm'
          ? 'Semua kakitangan telah menghantar log masa lebih masa!'
          : 'All personnel have already submitted their overtime logs!',
        'success',
        'task_alt'
      );
      return;
    }
    showToast(
      language === 'bm'
        ? `Notifikasi amaran dihantar ke ${pendingStaff.length} orang kakitangan yang masih belum selesai!`
        : `Dispatched urgent submission reminders to ${pendingStaff.length} pending staff members!`,
      'warning',
      'outgoing_mail'
    );
  };

  const handleToggleReconciled = (staffId: string) => {
    const member = allStaff.find((s) => s.id === staffId);
    showToast(
      language === 'bm'
        ? `Pengauditan disahkan untuk ${member?.name || 'Kakitangan'}. Bersedia untuk penggajian.`
        : `Audit certification verified for ${member?.name || 'Staff'}. Ready for Payroll sync.`,
      'success',
      'verified'
    );
  };

  const handleForceSubmit = (staffId: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')} GMT`;
    const formattedDate = `${String(simulatedDay).padStart(2, '0')} Oct 2024, ${timeStr}`;

    if (staffId === 'STF-1042') {
      setAhmadSubmission({
        isSubmitted: true,
        submittedDate: formattedDate,
      });
    } else {
      setOtherStaff((prev) =>
        prev.map((s) =>
          s.id === staffId ? { ...s, status: 'Submitted', submittedAt: formattedDate } : s
        )
      );
    }
    showToast(
      language === 'bm'
        ? `Rekod masa kakitangan dikunci secara pentadbiran untuk gaji.`
        : `Time log for employee force-locked for payroll processing.`,
      'success',
      'lock'
    );
  };

  const handleUnlockDraft = (staffId: string) => {
    if (staffId === 'STF-1042') {
      setAhmadSubmission({
        isSubmitted: false,
        submittedDate: null,
      });
    } else {
      setOtherStaff((prev) =>
        prev.map((s) =>
          s.id === staffId ? { ...s, status: 'Pending', submittedAt: null } : s
        )
      );
    }
    showToast(
      language === 'bm'
        ? `Rekod masa dibuka semula kepada status Draf untuk kemaskini.`
        : `Time record unlocked back to Draft state.`,
      'info',
      'lock_open'
    );
  };

  const handleExportCSV = () => {
    const headers = [
      'Staff Name',
      'Employee ID',
      'Department',
      'Role',
      'Status',
      'Date Submitted',
      'Shift Date',
      'Time In',
      'Time Out',
      'OT Hours',
      'Project',
      'Remarks',
    ];

    const rows: string[][] = [];

    allStaff.forEach((s) => {
      if (s.entries.length === 0) {
        rows.push([
          s.name,
          s.id,
          s.department,
          s.role,
          s.status,
          s.submittedAt || 'Not Submitted',
          '—',
          '—',
          '—',
          '0.0',
          '—',
          '—',
        ]);
      } else {
        s.entries.forEach((e) => {
          rows.push([
            s.name,
            s.id,
            s.department,
            s.role,
            s.status,
            s.submittedAt || 'Not Submitted',
            e.date,
            e.startTime,
            e.endTime,
            e.duration.toFixed(1),
            `"${e.project.replace(/"/g, '""')}"`,
            `"${(e.notes || '').replace(/"/g, '""')}"`,
          ]);
        });
      }
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payroll_overtime_reconciliation_october_2024.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(
      language === 'bm'
        ? 'Fail CSV Penggajian Berjaya Dimuat Turun!'
        : 'Exported Payroll Reconciliation CSV successfully!',
      'success',
      'download'
    );
  };

  const handleResetData = () => {
    setAhmadEntries(INITIAL_AHMAD_ENTRIES);
    setAhmadSubmission({ isSubmitted: false, submittedDate: null });
    setOtherStaff(INITIAL_OTHER_STAFF);
    setSimulatedDay('7');
    setCurrentRole('staff');
    setActiveView('staff-dashboard');
    localStorage.removeItem(STORAGE_KEY);
    showToast(
      language === 'bm'
        ? 'Set data demo dipulihkan ke asal'
        : 'Synthetic dataset restored to default state',
      'info',
      'restart_alt'
    );
  };

  const handleAddNewStaff = (newStaff: StaffMember) => {
    setOtherStaff((prev) => [...prev, newStaff]);
    showToast(
      language === 'bm'
        ? `Kakitangan ${newStaff.name} (${newStaff.id}) berjaya didaftarkan!`
        : `Added ${newStaff.name} (${newStaff.id}) to directory`,
      'success',
      'person_add'
    );
  };

  const handleSimulateStaff = (name: string) => {
    setCurrentRole('staff');
    setActiveView('staff-dashboard');
    showToast(
      language === 'bm'
        ? `Pandangan beralih kepada kakitangan ${name}`
        : `Switched perspective to ${name}`,
      'info',
      'switch_account'
    );
  };

  const handleLogin = (role: UserRole, userName: string) => {
    setCurrentRole(role);
    setActiveView(role === 'staff' ? 'staff-dashboard' : 'admin-monitoring');
    showToast(
      language === 'bm'
        ? `Log masuk berjaya sebagai ${userName} (${role === 'staff' ? 'Staf' : 'Admin'})`
        : `Successfully logged in as ${userName} (${role})`,
      'success',
      'verified_user'
    );
  };

  const activeAuditStaff = auditStaffId
    ? allStaff.find((s) => s.id === auditStaffId) || null
    : null;

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between">
      {/* Top Shell Navigation with Multi-Page Tabs & Language Toggle */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          setActiveView(role === 'staff' ? 'staff-dashboard' : 'admin-monitoring');
        }}
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        simulatedDay={simulatedDay}
        onSimulatedDayChange={(day) => {
          setSimulatedDay(day);
          showToast(
            language === 'bm'
              ? `Tarikh simulasi diubah ke ${day}hb Okt`
              : `Simulation date adjusted to Oct ${day}`,
            'info',
            'calendar_month'
          );
        }}
        language={language}
        onLanguageToggle={() => {
          const nextLang = language === 'bm' ? 'en' : 'bm';
          setLanguage(nextLang);
          showToast(
            nextLang === 'bm' ? 'Bahasa ditukar ke Bahasa Melayu 🇲🇾' : 'Language set to English 🇬🇧',
            'info',
            'translate'
          );
        }}
        onOpenLogin={() => setActiveView('login')}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => {
          const next = !isDarkMode;
          setIsDarkMode(next);
          showToast(
            next
              ? language === 'bm' ? 'Mod Gelap Korporat Diaktifkan 🌙' : 'Corporate Dark Mode Enabled 🌙'
              : language === 'bm' ? 'Mod Cerah Diaktifkan ☀️' : 'Light Mode Enabled ☀️',
            'info',
            next ? 'dark_mode' : 'light_mode'
          );
        }}
      />

      {/* Main Body Canvas */}
      <main className="w-full pt-32 pb-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
          {/* Interactive Environment & Role Simulation Bar */}
          <SimulationBar
            currentRole={currentRole}
            onRoleChange={(role) => {
              setCurrentRole(role);
              setActiveView(role === 'staff' ? 'staff-dashboard' : 'admin-monitoring');
            }}
            simulatedDay={simulatedDay}
            onSimulatedDayChange={(day) => {
              setSimulatedDay(day);
              showToast(
                language === 'bm'
                  ? `Tarikh simulasi diubah ke ${day}hb Okt`
                  : `Simulation date adjusted to Oct ${day}`,
                'info',
                'calendar_month'
              );
            }}
            onResetData={handleResetData}
          />

          {/* Conditional Multi-Page Rendering */}
          {activeView === 'login' ? (
            <LoginPage
              currentRole={currentRole}
              onLogin={handleLogin}
              onCancel={() => setActiveView(currentRole === 'staff' ? 'staff-dashboard' : 'admin-monitoring')}
              language={language}
            />
          ) : activeView === 'claim-review' ? (
            <ClaimReviewPage
              entries={ahmadEntries}
              isSubmitted={ahmadSubmission.isSubmitted}
              submittedDate={ahmadSubmission.submittedDate}
              simulatedDay={simulatedDay}
              onSubmitMonthly={handleSubmitMonthly}
              onBackToDashboard={() => setActiveView('staff-dashboard')}
              language={language}
            />
          ) : activeView === 'reports' ? (
            <ReportsPage
              allStaff={allStaff}
              onExportCSV={handleExportCSV}
              onViewStaffLogs={(staff) => setAuditStaffId(staff.id)}
              language={language}
            />
          ) : activeView === 'staff-directory' ? (
            <StaffDirectoryPage
              allStaff={allStaff}
              onAddNewStaff={handleAddNewStaff}
              onSimulateStaff={handleSimulateStaff}
              onViewStaffLogs={(staff) => setAuditStaffId(staff.id)}
              language={language}
            />
          ) : activeView === 'admin-monitoring' || currentRole === 'admin' ? (
            <AdminMonitoring
              allStaff={allStaff}
              simulatedDay={simulatedDay}
              onSimulatedDayChange={(day) => {
                setSimulatedDay(day);
                showToast(
                  language === 'bm'
                    ? `Tarikh simulasi diubah ke ${day}hb Okt`
                    : `Simulation date adjusted to Oct ${day}`,
                  'info',
                  'calendar_month'
                );
              }}
              onSwitchToStaff={() => {
                setCurrentRole('staff');
                setActiveView('staff-dashboard');
                showToast('Beralih ke Papan Pemuka Staf (Ahmad Razak)', 'info', 'switch_account');
              }}
              onViewLogs={(staff) => setAuditStaffId(staff.id)}
              onSendReminder={handleSendReminder}
              onNotifyAllPending={handleNotifyAllPending}
              onToggleReconciled={handleToggleReconciled}
              onQuickAddWorker={() => setActiveView('staff-directory')}
              onExportCSV={handleExportCSV}
              onNavigateToReports={() => setActiveView('reports')}
              onNavigateToStaffDirectory={() => setActiveView('staff-directory')}
              language={language}
            />
          ) : (
            <StaffDashboard
              entries={ahmadEntries}
              isSubmitted={ahmadSubmission.isSubmitted}
              submittedDate={ahmadSubmission.submittedDate}
              simulatedDay={simulatedDay}
              onAddEntry={handleAddEntry}
              onEditEntry={handleEditEntry}
              onDeleteEntry={handleDeleteEntry}
              onSubmitMonthly={handleSubmitMonthly}
              onOpenEditModal={(entry) => setEditingEntry(entry)}
              onNavigateToClaimReview={() => setActiveView('claim-review')}
              language={language}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-xs">
          <span>
            {language === 'bm'
              ? '© 2025 Media Prima Berhad. Pematuhan Buruh & Operasi Personel.'
              : '© 2025 Media Prima Berhad. Compliance & Personnel Operations.'}
          </span>
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="text-secondary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              {language === 'bm' ? 'Penyegerakan Gaji Aktif' : 'Payroll Sync Active'}
            </span>
            <span>Support Ref: #OPS-TIME-2025</span>
          </div>
        </div>
      </footer>

      {/* Edit Entry Modal for Staff */}
      <EditEntryModal
        isOpen={Boolean(editingEntry)}
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={handleEditEntry}
      />

      {/* Audit Detail Modal for Admin */}
      <AuditDetailModal
        isOpen={Boolean(auditStaffId)}
        staff={activeAuditStaff}
        onClose={() => setAuditStaffId(null)}
        simulatedDay={simulatedDay}
        onSendReminder={handleSendReminder}
        onForceSubmit={(id) => {
          handleForceSubmit(id);
          setAuditStaffId(null);
        }}
        onUnlockDraft={(id) => {
          handleUnlockDraft(id);
          setAuditStaffId(null);
        }}
      />

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

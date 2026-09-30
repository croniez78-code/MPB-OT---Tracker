import React from 'react';
import { UserRole, SimulatedTimeline, ActiveView, AppLanguage } from '../types';
import { MediaPrimaLogo } from './MediaPrimaLogo';
import { useFirebase } from '../context/FirebaseContext';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  simulatedDay: SimulatedTimeline;
  onSimulatedDayChange: (day: SimulatedTimeline) => void;
  language: AppLanguage;
  onLanguageToggle: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  loggedInStaffName?: string;
  loggedInStaffRole?: string;
  loggedInStaffDept?: string;
  isDarkMode?: boolean;
  onDarkModeToggle?: () => void;
  onOpenDatabaseStatus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeView,
  onViewChange,
  simulatedDay,
  onSimulatedDayChange,
  language,
  onLanguageToggle,
  onOpenLogin,
  onLogout,
  isLoggedIn,
  loggedInStaffName,
  loggedInStaffRole,
  loggedInStaffDept,
  isDarkMode = false,
  onDarkModeToggle,
  onOpenDatabaseStatus,
}) => {
  const { user, isAdmin, firestoreReady } = useFirebase();
  const isBm = language === 'bm';

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-surface-container-lowest border-b border-outline-variant/60 shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
      <div
        className={`${
          isLoggedIn ? 'h-28' : 'h-16'
        } max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-between transition-all duration-200`}
      >
        {/* Top Header Row */}
        <div className="h-16 flex items-center justify-between gap-4 border-b border-surface-container-high/60">
          {/* Logo & Portal Title: Media Prima Berhad */}
          <div
            onClick={() => {
              if (isLoggedIn) {
                onViewChange(currentRole === 'staff' ? 'staff-dashboard' : 'admin-monitoring');
              } else {
                onOpenLogin();
              }
            }}
            className="flex items-center cursor-pointer group"
            title="Media Prima Berhad - Employee Overtime Portal"
          >
            <MediaPrimaLogo variant="header" language={language} />
          </div>

          {/* Quick Controls in Top Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Controls only shown when logged in */}
            {isLoggedIn && (
              <>
                {/* Quick Role Switcher */}
                <div className="hidden md:flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/50">
                  <button
                    type="button"
                    onClick={() => {
                      onRoleChange('staff');
                      onViewChange('staff-dashboard');
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      currentRole === 'staff' &&
                      activeView !== 'admin-monitoring' &&
                      activeView !== 'reports' &&
                      activeView !== 'staff-directory'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {isBm ? 'Mod Staf' : 'Staff Mode'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRoleChange('admin');
                      onViewChange('admin-monitoring');
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                      currentRole === 'admin' ||
                      activeView === 'admin-monitoring' ||
                      activeView === 'reports' ||
                      activeView === 'staff-directory'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-semibold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {isBm ? 'Mod Admin' : 'Admin Mode'}
                  </button>
                </div>

                {/* Quick Simulate Date Select */}
                <div className="hidden lg:flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-lg border border-outline-variant/50">
                  <span className="material-symbols-outlined text-outline text-[16px]">
                    event_repeat
                  </span>
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    {isBm ? 'Simulasi Tarikh:' : 'Simulate Date:'}
                  </span>
                  <select
                    value={simulatedDay}
                    onChange={(e) => onSimulatedDayChange(e.target.value as SimulatedTimeline)}
                    className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
                    aria-label="Simulate Date"
                  >
                    <option value="14">{isBm ? 'Hari 14 (Biasa)' : 'Today (14th)'}</option>
                    <option value="7">{isBm ? '7hb (Tarikh Akhir ⚠️)' : '7th of Month (Cutoff Deadline ⚠️)'}</option>
                    <option value="9">{isBm ? '9hb (Lewat / Kunci)' : '9th of Month (Overdue / Locked)'}</option>
                    <option value="3">{isBm ? '3hb (Awal Kitaran)' : '3rd of Month (Early Regular)'}</option>
                  </select>
                </div>
              </>
            )}

            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={onLanguageToggle}
              title="Tukar Bahasa (EN / BM)"
              className="px-2 py-1 bg-surface-container-low hover:bg-surface-container rounded-lg border border-outline-variant/40 text-[11px] font-bold text-on-surface transition-colors cursor-pointer"
            >
              {language === 'bm' ? 'BM 🇲🇾' : 'EN 🇬🇧'}
            </button>

            {/* Dark Mode Toggle Button */}
            {onDarkModeToggle && (
              <button
                type="button"
                onClick={onDarkModeToggle}
                title={
                  isDarkMode
                    ? isBm ? 'Tukar ke Mod Cerah' : 'Switch to Light Mode'
                    : isBm ? 'Tukar ke Mod Gelap Korporat' : 'Switch to Dark Mode'
                }
                className="p-1.5 bg-surface-container-low hover:bg-surface-container rounded-lg border border-outline-variant/40 text-on-surface transition-colors flex items-center justify-center shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isDarkMode ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            )}

            {/* Firebase Cloud Interactive Status Button */}
            <button
              type="button"
              onClick={onOpenDatabaseStatus}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low hover:bg-surface-container rounded-lg border border-outline-variant/50 text-[11px] font-medium text-on-surface transition-all cursor-pointer shadow-2xs hover:border-primary/50"
              title={
                isBm
                  ? 'Pangkalan Data Cloud Firestore (asia-southeast1). Klik untuk maklumat sambungan.'
                  : 'Cloud Firestore Database (asia-southeast1). Click for connection details.'
              }
            >
              <span className={`w-2 h-2 rounded-full ${firestoreReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-mono text-[10px] hidden sm:inline">
                {firestoreReady ? (isBm ? 'Pangkalan Data: Aktif' : 'Database: Live') : 'Connecting DB'}
              </span>
            </button>

            {/* Auth Actions: Logged In Profile & Log Out (hidden when logged out) */}
            {isLoggedIn && (
              <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/50">
                {/* Staff Profile Avatar & Info */}
                <div
                  onClick={onOpenLogin}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity"
                  title={isBm ? 'Klik untuk tukar profil' : 'Click to switch profile'}
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={loggedInStaffName || 'User'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40 shadow-xs"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs shadow-xs">
                      {(loggedInStaffName || user?.displayName || 'ST').substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="hidden sm:flex flex-col text-left max-w-[130px]">
                    <span className="text-xs font-semibold text-on-surface leading-none truncate">
                      {loggedInStaffName || (currentRole === 'admin' ? 'Asward' : 'Ahmad Razak')}
                    </span>
                    <span className="text-[10px] text-primary font-bold leading-tight mt-0.5 flex items-center gap-1 truncate">
                      <span>{loggedInStaffRole || (currentRole === 'admin' ? 'Pentadbir' : 'Kakitangan')}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    </span>
                  </div>
                </div>

                {/* DISTINCT STAFF LOGOUT BUTTON */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer ml-1 active:scale-95"
                  title={isBm ? 'Log keluar daripada sistem portal staf' : 'Log out of staff portal session'}
                >
                  <span className="material-symbols-outlined text-[17px] text-red-600 dark:text-red-400">
                    logout
                  </span>
                  <span className="inline text-xs font-bold">{isBm ? 'Log Keluar' : 'Logout'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Multi-Page Navigation Bar (Only Rendered When Logged In) */}
        {isLoggedIn && (
          <div className="h-12 flex items-center justify-between overflow-x-auto">
            <nav className="flex items-center gap-6 h-full shrink-0">
              {/* 1. Staff Dashboard */}
              <button
                type="button"
                onClick={() => {
                  onRoleChange('staff');
                  onViewChange('staff-dashboard');
                }}
                className={`h-full flex items-center text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  activeView === 'staff-dashboard'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isBm ? 'Papan Pemuka Staf' : 'Staff Dashboard'}
              </button>

              {/* 2. Monthly Claim Review Voucher */}
              <button
                type="button"
                onClick={() => onViewChange('claim-review')}
                className={`h-full flex items-center text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap gap-1.5 cursor-pointer ${
                  activeView === 'claim-review'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{isBm ? 'Borang Tuntutan & Perakuan' : 'Claim Voucher & Review'}</span>
                <span className="w-2 h-2 rounded-full bg-secondary" />
              </button>

              {/* 3. Admin Monitoring */}
              <button
                type="button"
                onClick={() => {
                  onRoleChange('admin');
                  onViewChange('admin-monitoring');
                }}
                className={`h-full flex items-center text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  activeView === 'admin-monitoring'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isBm ? 'Pemantauan Admin' : 'Admin Monitoring'}
              </button>

              {/* 4. Payroll Reports */}
              <button
                type="button"
                onClick={() => onViewChange('reports')}
                className={`h-full flex items-center text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  activeView === 'reports'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isBm ? 'Laporan & Penggajian' : 'Reports & Payroll'}
              </button>

              {/* 5. Staff Directory */}
              <button
                type="button"
                onClick={() => onViewChange('staff-directory')}
                className={`h-full flex items-center text-xs sm:text-sm font-semibold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
                  activeView === 'staff-directory'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isBm ? 'Direktori Staf' : 'Staff Directory'}
              </button>
            </nav>

            <div className="hidden sm:flex items-center gap-1.5 text-on-surface-variant text-xs shrink-0 pl-4">
              <span className="material-symbols-outlined text-outline text-[16px]">lock_clock</span>
              <span className="font-medium">
                {isBm ? 'Tarikh Tutup Bulanan: 7hb, 23:59 GMT' : 'Monthly Cutoff: 7th day, 23:59 GMT'}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

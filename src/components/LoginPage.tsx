import React, { useState } from 'react';
import { UserRole } from '../types';
import { MediaPrimaLogo } from './MediaPrimaLogo';
import { useFirebase } from '../context/FirebaseContext';

interface LoginPageProps {
  currentRole: UserRole;
  onLogin: (role: UserRole, userName: string, department?: string, email?: string) => void;
  onCancel?: () => void;
  language: 'en' | 'bm';
  isMandatory?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentRole,
  onLogin,
  onCancel,
  language,
  isMandatory = false,
}) => {
  const { user, userProfile, isAdmin, signInWithGoogle, signOut, loading: fbLoading, firestoreReady } =
    useFirebase();
  const [activeTab, setActiveTab] = useState<'firebase' | 'demo' | 'credentials'>('firebase');
  
  // Custom Staff Credentials Form State
  const [staffName, setStaffName] = useState('Ahmad Razak');
  const [staffIdOrEmail, setStaffIdOrEmail] = useState('STF-1042');
  const [staffDepartment, setStaffDepartment] = useState('Kejuruteraan & IT');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [showPassword, setShowPassword] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isBm = language === 'bm';

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      const loggedUser = await signInWithGoogle();
      const roleToSet: UserRole =
        loggedUser.email === 'croniez78@gmail.com' || isAdmin ? 'admin' : 'staff';
      const name = loggedUser.displayName || loggedUser.email?.split('@')[0] || 'Staff Member';
      onLogin(roleToSet, name, userProfile?.department || 'Engineering', loggedUser.email || undefined);
    } catch (err: unknown) {
      console.error('Google Sign-In Error:', err);
      setAuthError(
        err instanceof Error ? err.message : isBm ? 'Gagal log masuk Google' : 'Google sign-in failed'
      );
    } finally {
      setSigningIn(false);
    }
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = staffName.trim() || (selectedRole === 'staff' ? 'Ahmad Razak' : 'Asward');
    const finalEmail = staffIdOrEmail.includes('@')
      ? staffIdOrEmail
      : `${staffIdOrEmail.toLowerCase().replace(/[^a-z0-9]/g, '')}@mediaprima.com.my`;
    onLogin(selectedRole, finalName, staffDepartment, finalEmail);
  };

  const handleQuickSelect = (role: UserRole, name: string, dept: string, email: string) => {
    onLogin(role, name, dept, email);
  };

  return (
    <div className="max-w-xl mx-auto w-full flex flex-col gap-6 py-4 animate-in fade-in duration-200">
      {/* Top Banner Media Prima Branding */}
      <MediaPrimaLogo variant="hero" language={language} className="mb-1" />

      {/* Mandatory Login Notice Banner */}
      {isMandatory && (
        <div className="w-full bg-primary/10 border border-primary/30 rounded-xl p-4 text-xs flex items-center gap-3.5 text-on-surface shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
          <div>
            <div className="font-bold text-primary text-sm">
              {isBm ? 'Akses Dilindungi • Log Masuk Kakitangan Diperlukan' : 'Protected Access • Staff Login Required'}
            </div>
            <div className="text-xs text-on-surface-variant mt-0.5 leading-snug">
              {isBm
                ? 'Untuk menggunakan aplikasi ini, kakitangan (Staff) atau pentadbir HR mesti log masuk terlebih dahulu untuk mengakses rekod masa lebih masa dan pematuhan.'
                : 'To use this portal, staff members and administrators must sign in first to access overtime logging, reviews, and compliance records.'}
            </div>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-b border-surface-container-high bg-surface-container-low text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('firebase')}
            className={`flex-1 py-3 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'firebase'
                ? 'border-primary text-primary bg-surface-container-lowest font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
            <span>{isBm ? 'Google / Firebase' : 'Google / Firebase'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Cloud Active" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-3 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'demo'
                ? 'border-primary text-primary bg-surface-container-lowest font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>{isBm ? 'Pilih Staf (1-Klik)' : 'Quick Staff Login'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-3 px-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'credentials'
                ? 'border-primary text-primary bg-surface-container-lowest font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            <span>{isBm ? 'Staff ID / Masuk' : 'Staff ID / Login'}</span>
          </button>
        </div>

        <div className="p-6">
          {/* TAB 1: Firebase Google Auth */}
          {activeTab === 'firebase' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">database</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                      <span>Firebase Cloud Firestore</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {firestoreReady ? 'Live & Connected' : 'Connecting...'}
                      </span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      Region: <span className="font-mono font-medium">asia-southeast1</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-outline">Media Prima Cloud</span>
                </div>
              </div>

              {user ? (
                // Already Authenticated via Firebase
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-12 h-12 rounded-full ring-2 ring-primary/40 object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-base shadow-xs">
                        {(user.displayName || user.email || 'MP').substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="font-headline font-bold text-sm text-on-surface truncate">
                        {user.displayName || 'Media Prima Personnel'}
                      </div>
                      <div className="text-xs text-on-surface-variant truncate font-mono">
                        {user.email}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isAdmin
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                              : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                          }`}
                        >
                          {isAdmin
                            ? isBm
                              ? '👑 Pentadbir HR (Admin)'
                              : '👑 HR Administrator'
                            : isBm
                            ? '💼 Kakitangan (Staff)'
                            : '💼 Staff Member'}
                        </span>
                        {userProfile?.department && (
                          <span className="text-[10px] text-on-surface-variant">
                            • {userProfile.department}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => {
                        const targetRole: UserRole = isAdmin ? 'admin' : 'staff';
                        onLogin(targetRole, user.displayName || user.email?.split('@')[0] || 'Staff Member', userProfile?.department || 'Engineering', user.email || undefined);
                      }}
                      className="flex-1 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">dashboard</span>
                      <span>
                        {isBm ? 'Masuk ke Papan Pemuka Staf' : 'Enter Staff Dashboard'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="px-3 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-semibold transition-all border border-red-200 dark:border-red-900 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      <span>{isBm ? 'Log Keluar' : 'Logout'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Not authenticated yet
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {isBm
                      ? 'Log masuk dengan akaun Google anda untuk menyegerakkan tuntutan lebih masa (OT) terus ke pangkalan data cloud Firebase Media Prima.'
                      : 'Sign in with your Google account to automatically synchronize your overtime logs with the Media Prima cloud database.'}
                  </p>

                  {authError && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
                      <span className="flex-1">{authError}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={signingIn || fbLoading}
                    onClick={handleGoogleSignIn}
                    className="w-full py-3.5 px-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-3 group disabled:opacity-50 cursor-pointer"
                  >
                    {signingIn ? (
                      <>
                        <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>{isBm ? 'Menyambung ke Google...' : 'Connecting to Google...'}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.41 7.34 24 12 24z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                          />
                        </svg>
                        <span>{isBm ? 'Log Masuk dengan Akaun Google (Firebase)' : 'Sign In with Google Account (Firebase)'}</span>
                      </>
                    )}
                  </button>

                  <div className="p-3 rounded-lg bg-surface-container-low text-[11px] text-on-surface-variant flex items-start gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">
                      info
                    </span>
                    <span>
                      {isBm
                        ? 'Pengguna berdaftar seperti croniez78@gmail.com akan diberikan mandat Pentadbir HR (Admin) secara automatik.'
                        : 'Designated administrators (such as croniez78@gmail.com) receive elevated HR Admin credentials.'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Quick Staff Personas (1-Click) */}
          {activeTab === 'demo' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-on-surface-variant">
                {isBm
                  ? 'Pilih mana-mana akaun staf di bawah untuk log masuk secara serta-merta:'
                  : 'Select any personnel profile below for 1-click instant login:'}
              </p>

              {/* Persona 1: Ahmad Razak (Staff) */}
              <button
                type="button"
                onClick={() => handleQuickSelect('staff', 'Ahmad Razak', 'Kejuruteraan & IT', 'ahmad.razak@mediaprima.com.my')}
                className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-xs shadow-xs">
                    AR
                  </div>
                  <div>
                    <div className="font-headline font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>Ahmad Razak</span>
                      <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 rounded text-[10px] font-bold">Staf</span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      STF-1042 • Jurutera Perisian Kanan (Kejuruteraan & IT)
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-transform group-hover:translate-x-1">
                  login
                </span>
              </button>

              {/* Persona 2: Elena Rostova (Staff Lead) */}
              <button
                type="button"
                onClick={() => handleQuickSelect('staff', 'Elena Rostova', 'Pengurusan Gudang Hub B', 'elena@mediaprima.com.my')}
                className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high text-primary flex items-center justify-center font-bold text-xs">
                    ER
                  </div>
                  <div>
                    <div className="font-headline font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>Elena Rostova</span>
                      <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 rounded text-[10px] font-bold">Staf</span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      EMP-10493 • Inventory Lead (Pengurusan Gudang Hub B)
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-transform group-hover:translate-x-1">
                  login
                </span>
              </button>

              {/* Persona 3: Siti Nurhaliza (Staff News Production) */}
              <button
                type="button"
                onClick={() => handleQuickSelect('staff', 'Siti Nurhaliza', 'Penyiaran & Berita TV3', 'siti.nurhaliza@mediaprima.com.my')}
                className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                    SN
                  </div>
                  <div>
                    <div className="font-headline font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>Siti Nurhaliza</span>
                      <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 rounded text-[10px] font-bold">Staf</span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      STF-3012 • Penerbit Berita TV3 (Penyiaran & Berita)
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-transform group-hover:translate-x-1">
                  login
                </span>
              </button>

              {/* Persona 4: Asward (Admin) */}
              <button
                type="button"
                onClick={() => handleQuickSelect('admin', 'Asward', 'HR & Operasi Personel', 'asward@mediaprima.com.my')}
                className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="/asward-profile.jpg"
                      alt="Asward"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/20 shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-[8px]">
                      ✓
                    </span>
                  </div>
                  <div>
                    <div className="font-headline font-bold text-xs sm:text-sm text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                      <span>Asward</span>
                      <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 rounded text-[10px] font-bold">Admin</span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      DIR-881 • Ketua Pengaudit HR (HR & Operasi Personel)
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-transform group-hover:translate-x-1">
                  login
                </span>
              </button>
            </div>
          )}

          {/* TAB 3: Custom Staff Credentials Login */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">
                    {isBm ? 'Nama Kakitangan' : 'Staff Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="cth: Ahmad Razak"
                    className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">
                    {isBm ? 'No. ID Staf / Emel' : 'Staff ID or Email'}
                  </label>
                  <input
                    type="text"
                    required
                    value={staffIdOrEmail}
                    onChange={(e) => setStaffIdOrEmail(e.target.value)}
                    placeholder="cth: STF-1042"
                    className="w-full h-9 px-3 bg-surface-container-low text-on-surface text-xs rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">
                    {isBm ? 'Jabatan / Bahagian' : 'Department'}
                  </label>
                  <select
                    value={staffDepartment}
                    onChange={(e) => setStaffDepartment(e.target.value)}
                    className="w-full h-9 px-2 bg-surface-container-low text-on-surface text-xs rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Kejuruteraan & IT">{isBm ? 'Kejuruteraan & IT' : 'Engineering & IT'}</option>
                    <option value="Penyiaran & Berita TV3">{isBm ? 'Penyiaran & Berita TV3' : 'Broadcast & News (TV3)'}</option>
                    <option value="Pengurusan Gudang Hub B">{isBm ? 'Pengurusan Gudang Hub B' : 'Warehouse Logistics Hub B'}</option>
                    <option value="Operasi Media Luar (Big Tree)">{isBm ? 'Operasi Media Luar (Big Tree)' : 'Out-of-Home Media Ops'}</option>
                    <option value="Pemasaran & Jualan Digital">{isBm ? 'Pemasaran & Jualan Digital' : 'Marketing & Digital Sales'}</option>
                    <option value="HR & Operasi Personel">{isBm ? 'HR & Operasi Personel' : 'HR & Operations'}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-semibold text-on-surface">
                    {isBm ? 'Kata Laluan / PIN Staf' : 'Password / Staff PIN'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-9 px-3 pr-8 bg-surface-container-low text-on-surface text-xs rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Radio Picker */}
              <div className="flex flex-col gap-1 pt-1">
                <label className="font-semibold text-on-surface">
                  {isBm ? 'Pilih Peranan Akses' : 'Access Role'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${selectedRole === 'staff' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/40 bg-surface-container-low text-on-surface'}`}>
                    <input
                      type="radio"
                      name="userRole"
                      checked={selectedRole === 'staff'}
                      onChange={() => setSelectedRole('staff')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="font-semibold">
                      {isBm ? 'Kakitangan (Staff)' : 'Staff Member'}
                    </span>
                  </label>

                  <label className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${selectedRole === 'admin' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/40 bg-surface-container-low text-on-surface'}`}>
                    <input
                      type="radio"
                      name="userRole"
                      checked={selectedRole === 'admin'}
                      onChange={() => setSelectedRole('admin')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="font-semibold">
                      {isBm ? 'Pentadbir HR (Admin)' : 'HR Administrator'}
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>{isBm ? 'Log Masuk Sebagai Staf' : 'Sign In As Staff'}</span>
              </button>
            </form>
          )}

          {/* Return button if just viewing login modal while already authenticated */}
          {!isMandatory && onCancel && (
            <div className="mt-5 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={onCancel}
                className="text-on-surface-variant hover:text-on-surface font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>{isBm ? 'Kembali ke Papan Pemuka' : 'Return to Dashboard'}</span>
              </button>

              <span className="text-[11px] text-outline font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Firebase v12 • asia-southeast1
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Compliance / Security Footnote */}
      <div className="text-center text-[11px] text-on-surface-variant leading-relaxed">
        {isBm
          ? 'Sistem ini disegerakkan dengan pangkalan data selamat Media Prima Berhad berpandukan Akta Perlindungan Data Peribadi 2010 (PDPA) & Akta Kerja 1955.'
          : 'Secured with enterprise Firestore cloud database complying with Malaysian Employment Act 1955 & PDPA standards.'}
      </div>
    </div>
  );
};

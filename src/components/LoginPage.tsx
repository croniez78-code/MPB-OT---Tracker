import React, { useState } from 'react';
import { UserRole } from '../types';
import { MediaPrimaLogo } from './MediaPrimaLogo';

interface LoginPageProps {
  currentRole: UserRole;
  onLogin: (role: UserRole, userName: string) => void;
  onCancel: () => void;
  language: 'en' | 'bm';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentRole,
  onLogin,
  onCancel,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'credentials'>('demo');
  const [username, setUsername] = useState('ahmad.razak@mediaprima.com.my');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [showPassword, setShowPassword] = useState(false);

  const isBm = language === 'bm';

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = selectedRole === 'staff' ? 'Ahmad Razak' : 'Asward';
    onLogin(selectedRole, name);
  };

  const handleQuickSelect = (role: UserRole, name: string) => {
    onLogin(role, name);
  };

  return (
    <div className="max-w-xl mx-auto w-full flex flex-col gap-6 py-4">
      {/* Top Banner Media Prima Branding */}
      <MediaPrimaLogo variant="hero" language={language} className="mb-1" />

      {/* Main Login Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/40 overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-b border-surface-container-high bg-surface-container-low text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'demo'
                ? 'border-primary text-primary bg-surface-container-lowest font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>{isBm ? 'Akses Pantas Demo (1-Klik)' : 'Quick Demo Personas'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-3 px-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'border-primary text-primary bg-surface-container-lowest font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>{isBm ? 'Log Masuk Kata Laluan' : 'Credentials Login'}</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'demo' ? (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-on-surface-variant">
                {isBm
                  ? 'Pilih mana-mana akaun kakitangan atau pentadbir di bawah untuk menguji sistem dengan data sebenar:'
                  : 'Select any synthetic staff or administrator account below for instant evaluation:'}
              </p>

              {/* Persona 1: Ahmad Razak (Staff) */}
              <button
                type="button"
                onClick={() => handleQuickSelect('staff', 'Ahmad Razak')}
                className="p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high/60 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-xs">
                    AR
                  </div>
                  <div>
                    <div className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                      Ahmad Razak
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      STF-1042 • Jurutera Perisian Kanan
                    </div>
                    <div className="text-[11px] text-primary font-semibold mt-0.5">
                      {isBm ? 'Peranan: Kakitangan (Log & Hantar OT)' : 'Role: Staff Member (Log OT)'}
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>

              {/* Persona 2: Asward (Admin) */}
              <button
                type="button"
                onClick={() => handleQuickSelect('admin', 'Asward')}
                className="p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high/60 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="/asward-profile.jpg"
                      alt="Asward"
                      className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/20 shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-on-secondary text-[10px]">
                      ✓
                    </span>
                  </div>
                  <div>
                    <div className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                      Asward
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      DIR-881 • Ketua Pengaudit HR
                    </div>
                    <div className="text-[11px] text-secondary font-semibold mt-0.5">
                      {isBm ? 'Peranan: Pentadbir (Audit & Penggajian)' : 'Role: Administrator (Auditor)'}
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>

              {/* Persona 3: Elena Rostova (Staff Lead) */}
              <button
                type="button"
                onClick={() => handleQuickSelect('staff', 'Elena Rostova')}
                className="p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container-high/60 text-left transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-high text-primary flex items-center justify-center font-bold text-sm">
                    ER
                  </div>
                  <div>
                    <div className="font-headline font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                      Elena Rostova
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      EMP-10493 • Inventory Lead (Hub B)
                    </div>
                    <div className="text-[11px] text-secondary font-semibold mt-0.5">
                      {isBm ? 'Status: Telah Disahkan (12.0 Jam)' : 'Status: Submitted (12.0h)'}
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">
                  {isBm ? 'Emel / ID Kakitangan' : 'Email or Staff ID'}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">
                  {isBm ? 'Kata Laluan' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 px-3 pr-10 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Role Radio Picker */}
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="font-semibold text-on-surface">
                  {isBm ? 'Pilih Akses Peranan Sistem' : 'Target Role Access'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-outline-variant/40 bg-surface-container-low cursor-pointer">
                    <input
                      type="radio"
                      name="userRole"
                      checked={selectedRole === 'staff'}
                      onChange={() => setSelectedRole('staff')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-on-surface">
                      {isBm ? 'Kakitangan (Staff)' : 'Staff Member'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-outline-variant/40 bg-surface-container-low cursor-pointer">
                    <input
                      type="radio"
                      name="userRole"
                      checked={selectedRole === 'admin'}
                      onChange={() => setSelectedRole('admin')}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="font-semibold text-on-surface">
                      {isBm ? 'Pentadbir (Admin)' : 'HR Administrator'}
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>{isBm ? 'Log Masuk Sekarang' : 'Sign In To Dashboard'}</span>
              </button>
            </form>
          )}

          {/* Return button if just viewing login */}
          <div className="mt-5 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onCancel}
              className="text-on-surface-variant hover:text-on-surface font-semibold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>{isBm ? 'Kembali Tanpa Tukar' : 'Return to Current Session'}</span>
            </button>

            <span className="text-[11px] text-outline">v1.2.0 • ISO 27001 Certified</span>
          </div>
        </div>
      </div>

      {/* Compliance / Security Footnote */}
      <div className="text-center text-[11px] text-on-surface-variant leading-relaxed">
        {isBm
          ? 'Sistem ini mematuhi Akta Perlindungan Data Peribadi 2010 (PDPA) & Peraturan Kerja (Pekerjaan) Malaysia. Akses dipantau sepenuhnya oleh Bahagian Operasi Personel.'
          : 'Secured with enterprise single-sign on protocols. Authorized compliance operations only.'}
      </div>
    </div>
  );
};

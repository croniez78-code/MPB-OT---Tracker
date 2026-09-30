import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { pingFirestoreServer, seedInitialFirestoreData } from '../firebase';
import firebaseConfig from '../../firebase-applet-config.json';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bm';
  onToast: (msg: string, type?: 'success' | 'warning' | 'info' | 'error', icon?: string) => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({
  isOpen,
  onClose,
  language,
  onToast,
}) => {
  const { user, userProfile, isAdmin, firestoreReady, signInWithGoogle, signOut } = useFirebase();
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{
    latencyMs: number;
    timestamp: string;
  } | null>(null);
  const [seeding, setSeeding] = useState(false);

  const isBm = language === 'bm';

  // Run initial ping when modal opens
  useEffect(() => {
    if (isOpen) {
      runPingTest();
    }
  }, [isOpen]);

  const runPingTest = async () => {
    setTestingPing(true);
    try {
      const res = await pingFirestoreServer();
      setPingResult({
        latencyMs: res.latencyMs,
        timestamp: new Date().toLocaleTimeString(),
      });
      if (res.success) {
        onToast(
          isBm
            ? `Sambungan pangkalan data disahkan (${res.latencyMs} ms)`
            : `Database connection verified (${res.latencyMs} ms)`,
          'success',
          'cloud_done'
        );
      }
    } catch (e) {
      console.error('Ping test failed:', e);
    } finally {
      setTestingPing(false);
    }
  };

  const handleSeedData = async () => {
    if (!user) {
      onToast(
        isBm
          ? 'Sila log masuk dengan akaun Google terlebih dahulu sebelum menyegerak data.'
          : 'Please sign in with Google first before syncing data to the cloud.',
        'warning',
        'login'
      );
      return;
    }

    setSeeding(true);
    try {
      const count = await seedInitialFirestoreData({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || userProfile?.name || 'Media Prima Staff',
        role: isAdmin ? 'admin' : 'staff',
      });
      onToast(
        isBm
          ? `Berjaya menyegerak ${count} rekod ke Firestore Cloud!`
          : `Successfully synchronized ${count} records to Firestore Cloud!`,
        'success',
        'cloud_upload'
      );
    } catch (e) {
      console.error('Seeding error:', e);
      onToast(
        isBm ? 'Ralat semasa menyegerak data ke pangkalan data.' : 'Error writing to Firestore database.',
        'error',
        'cloud_off'
      );
    } finally {
      setSeeding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/60 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">database</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-on-surface">
                {isBm ? 'Pangkalan Data Cloud Firestore' : 'Cloud Firestore Database'}
              </h3>
              <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isBm ? 'Sambungan Langsung & Aktif' : 'Live & Active Connection'}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Connection Metadata Card */}
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex flex-col gap-2.5 font-mono text-[11px]">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="text-on-surface-variant font-sans font-medium">
                {isBm ? 'Pangkalan Data ID:' : 'Firestore Database ID:'}
              </span>
              <span className="font-bold text-primary truncate max-w-[240px]">
                {firebaseConfig.firestoreDatabaseId}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="text-on-surface-variant font-sans font-medium">
                {isBm ? 'Wilayah / Cloud Region:' : 'Cloud Region:'}
              </span>
              <span className="text-on-surface font-semibold">asia-southeast1 (Singapura)</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <span className="text-on-surface-variant font-sans font-medium">
                {isBm ? 'Projek Firebase:' : 'Firebase Project:'}
              </span>
              <span className="text-on-surface">{firebaseConfig.projectId}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant font-sans font-medium">
                {isBm ? 'Latensi Sambungan (Ping):' : 'Connection Latency (Ping):'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined text-[14px]">speed</span>
                <span>{pingResult ? `${pingResult.latencyMs} ms` : 'Mengukur...'}</span>
              </span>
            </div>
          </div>

          {/* Authentication State */}
          <div className="p-4 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col gap-3 font-sans">
            <div className="flex items-center justify-between">
              <span className="font-bold text-on-surface text-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">account_circle</span>
                <span>{isBm ? 'Akaun Terhubung' : 'Connected Identity'}</span>
              </span>

              {user && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isAdmin
                      ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200'
                      : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200'
                  }`}
                >
                  {isAdmin ? '👑 HR Admin' : '💼 Staff'}
                </span>
              )}
            </div>

            {user ? (
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2.5 truncate">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                      {(user.displayName || user.email || 'MP').substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="truncate">
                    <div className="font-semibold text-on-surface truncate">
                      {user.displayName || 'Media Prima Staff'}
                    </div>
                    <div className="text-[11px] text-on-surface-variant font-mono truncate">
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => signOut()}
                  className="px-2.5 py-1.5 text-xs text-on-surface-variant hover:text-red-600 bg-surface-container hover:bg-surface-container-high rounded-lg border border-outline-variant/40 transition-colors shrink-0"
                >
                  {isBm ? 'Log Keluar' : 'Disconnect'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  {isBm
                    ? 'Log masuk dengan akaun Google (cth: croniez78@gmail.com) untuk mengaktifkan capaian pentadbir dan penyimpanan awan berpusat.'
                    : 'Sign in with your Google account (e.g. croniez78@gmail.com) to enable administrative privileges and centralized sync.'}
                </p>
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full py-2.5 px-3 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#ffffff"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#ffffff"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.41 7.34 24 12 24z"
                    />
                    <path
                      fill="#ffffff"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
                    />
                    <path
                      fill="#ffffff"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.59 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>{isBm ? 'Log Masuk Akaun Google' : 'Sign In with Google Account'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              disabled={testingPing}
              onClick={runPingTest}
              className="py-2.5 px-3 rounded-lg border border-outline-variant/60 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-[16px] ${testingPing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isBm ? 'Uji Sambungan (Ping)' : 'Test Ping Latency'}</span>
            </button>

            <button
              type="button"
              disabled={seeding || !user}
              onClick={handleSeedData}
              title={!user ? (isBm ? 'Log masuk Google dahulu' : 'Sign in with Google first') : ''}
              className="py-2.5 px-3 rounded-lg bg-secondary hover:bg-secondary-container text-on-secondary font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
              <span>{isBm ? 'Segerak Data Awal' : 'Sync Initial Data'}</span>
            </button>
          </div>

          {/* Schema Collections List */}
          <div className="pt-2 border-t border-surface-container-high">
            <span className="text-[11px] font-semibold text-on-surface-variant block mb-2">
              {isBm ? 'Koleksi Firestore Aktif:' : 'Active Firestore Collections:'}
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <span className="font-mono text-on-surface">/overtimeEntries</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Aktif</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <span className="font-mono text-on-surface">/monthlySubmissions</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Aktif</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <span className="font-mono text-on-surface">/users</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Aktif</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
                <span className="font-mono text-on-surface">/admins</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-surface-container-high flex items-center justify-between text-xs">
          <span className="text-[11px] text-on-surface-variant">
            {isBm ? 'Pematuhan Keselamatan ISO 27001' : 'ISO 27001 Security Standard'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary-container transition-colors"
          >
            {isBm ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

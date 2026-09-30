import React, { useState } from 'react';
import { OvertimeEntry, SimulatedTimeline } from '../types';
import { StatusStepper } from './StatusStepper';
import { MediaPrimaLogo } from './MediaPrimaLogo';

interface ClaimReviewPageProps {
  entries: OvertimeEntry[];
  isSubmitted: boolean;
  submittedDate: string | null;
  simulatedDay: SimulatedTimeline;
  onSubmitMonthly: () => void;
  onBackToDashboard: () => void;
  language: 'en' | 'bm';
}

export const ClaimReviewPage: React.FC<ClaimReviewPageProps> = ({
  entries,
  isSubmitted,
  submittedDate,
  simulatedDay,
  onSubmitMonthly,
  onBackToDashboard,
  language,
}) => {
  const [agreedToDeclaration, setAgreedToDeclaration] = useState(isSubmitted);
  const [declarationError, setDeclarationError] = useState(false);

  const totalHours = entries.reduce((acc, curr) => acc + curr.duration, 0);

  // Group into normal workday vs weekend standby
  const normalHours = entries
    .filter((e) => !e.project.toLowerCase().includes('weekend'))
    .reduce((acc, curr) => acc + curr.duration, 0);
  const weekendHours = entries
    .filter((e) => e.project.toLowerCase().includes('weekend'))
    .reduce((acc, curr) => acc + curr.duration, 0);

  const isBm = language === 'bm';

  const handleCertifyAndSubmit = () => {
    if (!agreedToDeclaration && !isSubmitted) {
      setDeclarationError(true);
      return;
    }
    setDeclarationError(false);
    onSubmitMonthly();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-container transition-colors bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/40"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{isBm ? 'Kembali ke Papan Pemuka' : 'Back to Staff Dashboard'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>{isBm ? 'Cetak Slip Tuntutan' : 'Print Claim Slip'}</span>
          </button>
        </div>
      </div>

      {/* Lifecycle Status Stepper */}
      <StatusStepper
        isSubmitted={isSubmitted}
        submittedDate={submittedDate}
        simulatedDay={simulatedDay}
        language={language}
      />

      {/* Main Review Card (Voucher style) */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-6 bg-surface-container border-b border-surface-container-high flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <MediaPrimaLogo variant="compact" language={language} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline font-bold text-lg text-on-surface">
                  {isBm ? 'Borang Perakuan Tuntutan Masa Lebih Masa' : 'Monthly Overtime Certification Voucher'}
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary-fixed text-on-primary-fixed">
                  OT-CLM-2024-1042
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {isBm
                  ? 'Media Prima Berhad • Kitaran Penggajian Oktober 2024 • Pematuhan Seksyen 60 Akta Kerja'
                  : 'Media Prima Berhad • October 2024 Payroll Cycle • Statutory Employment Compliance'}
              </p>
            </div>
          </div>

          <div>
            {isSubmitted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                {isBm ? 'Telah Dihantar & Disahkan' : 'Submitted & Certified'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                {isBm ? 'Menunggu Perakuan Staf' : 'Pending Staff Certification'}
              </span>
            )}
          </div>
        </div>

        {/* Personnel & Cycle Info Strip */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-surface-container-low/50 border-b border-surface-container-high text-xs">
          <div>
            <div className="text-outline uppercase text-[10px] font-bold">
              {isBm ? 'Nama Kakitangan' : 'Staff Member'}
            </div>
            <div className="font-bold text-sm text-on-surface mt-0.5">Ahmad Razak</div>
            <div className="text-on-surface-variant text-[11px]">STF-1042 • Kejuruteraan</div>
          </div>

          <div>
            <div className="text-outline uppercase text-[10px] font-bold">
              {isBm ? 'Kitaran Tuntutan' : 'Claim Period'}
            </div>
            <div className="font-semibold text-sm text-on-surface mt-0.5">Oktober 2024</div>
            <div className="text-on-surface-variant text-[11px]">
              {isBm ? 'Tarikh Akhir: 7hb, 23:59 GMT' : 'Cutoff: 7th day, 23:59 GMT'}
            </div>
          </div>

          <div>
            <div className="text-outline uppercase text-[10px] font-bold">
              {isBm ? 'Pengurus / Pengaudit HR' : 'Supervising HR Auditor'}
            </div>
            <div className="font-semibold text-sm text-on-surface mt-0.5">Asward</div>
            <div className="text-on-surface-variant text-[11px]">Personnel Ops #DIR-881</div>
          </div>

          <div>
            <div className="text-outline uppercase text-[10px] font-bold">
              {isBm ? 'Tarikh Perakuan' : 'Certification Timestamp'}
            </div>
            <div className="font-semibold text-sm text-on-surface mt-0.5 mono-num">
              {isSubmitted ? submittedDate : isBm ? 'Belum Dihantar' : 'Not Yet Submitted'}
            </div>
            <div className="text-on-surface-variant text-[11px]">
              Simulated: Day {simulatedDay} Oct
            </div>
          </div>
        </div>

        {/* Hours & Rates Multiplier Breakdown */}
        <div className="p-6 border-b border-surface-container-high">
          <h2 className="text-xs uppercase font-bold text-outline tracking-wider mb-3">
            {isBm ? 'Pecahan Pengiraan Jam & Kadar Statutori' : 'Statutory Hours & Rate Multipliers'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                  {isBm ? 'Hari Bekerja Biasa (1.5x)' : 'Standard Workday (1.5x)'}
                </span>
                <div className="font-headline font-bold text-xl text-primary mt-1 mono-num">
                  {normalHours.toFixed(1)} hrs
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  {entries.length - (weekendHours > 0 ? 1 : 0)} {isBm ? 'syif direkod' : 'shifts logged'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                  {isBm ? 'Hari Rehat / Siap Sedia (2.0x)' : 'Rest Day / Standby (2.0x)'}
                </span>
                <div className="font-headline font-bold text-xl text-secondary mt-1 mono-num">
                  {weekendHours.toFixed(1)} hrs
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  {weekendHours > 0 ? '1' : '0'} {isBm ? 'tuntutan hujung minggu' : 'weekend claim'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">weekend</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                  {isBm ? 'Jumlah Jam Layak Dituntut' : 'Total Claimable OT'}
                </span>
                <div className="font-headline font-bold text-2xl text-on-surface mt-1 mono-num">
                  {totalHours.toFixed(1)} hrs
                </div>
                <div className="text-[11px] text-secondary font-semibold mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  {isBm ? 'Pematuhan Had < 104 jam' : 'Within < 104h limit'}
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest text-primary shadow-xs flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">calculate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Entries Table */}
        <div className="p-6 border-b border-surface-container-high">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase font-bold text-outline tracking-wider">
              {isBm ? 'Jadual Perincian Syif Masa Lebih Masa' : 'Itemized Overtime Shift Ledger'}
            </h2>
            <span className="text-xs text-on-surface-variant mono-num">
              {entries.length} {isBm ? 'rekod' : 'records'}
            </span>
          </div>

          <div className="rounded-lg overflow-hidden border border-outline-variant/40">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-semibold text-[11px] uppercase border-b border-surface-container-high">
                  <th className="py-2.5 px-4">{isBm ? 'Tarikh' : 'Date'}</th>
                  <th className="py-2.5 px-4">{isBm ? 'Masa Mula - Tamat' : 'Interval'}</th>
                  <th className="py-2.5 px-4">{isBm ? 'Aktiviti / Projek' : 'Project Activity'}</th>
                  <th className="py-2.5 px-4">{isBm ? 'Keterangan Kerja / Tiket' : 'Remarks / Order ID'}</th>
                  <th className="py-2.5 px-4 text-right">{isBm ? 'Jam Tuntutan' : 'Duration'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/60">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="py-3 px-4 mono-num font-medium text-on-surface">{entry.date}</td>
                    <td className="py-3 px-4 mono-num text-on-surface-variant">
                      {entry.startTime} – {entry.endTime}
                    </td>
                    <td className="py-3 px-4 font-semibold text-on-surface">{entry.project}</td>
                    <td className="py-3 px-4 text-on-surface-variant">{entry.notes || '—'}</td>
                    <td className="py-3 px-4 text-right mono-num font-bold text-primary">
                      {entry.duration.toFixed(1)} hrs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statutory Employee Declaration & Signature Box */}
        <div className="p-6 bg-surface-container-low/40 flex flex-col gap-4">
          <div className="rounded-xl p-4 bg-surface-container-lowest border border-outline-variant/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">
              {isBm ? 'Akuan Statutori Kakitangan' : 'Employee Statutory Declaration'}
            </h3>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToDeclaration}
                onChange={(e) => {
                  setAgreedToDeclaration(e.target.checked);
                  if (e.target.checked) setDeclarationError(false);
                }}
                disabled={isSubmitted}
                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-xs text-on-surface leading-relaxed">
                {isBm
                  ? 'Dengan ini saya mengesahkan bahawa segala butiran masa lebih masa yang disenaraikan di atas adalah tepat, sah, dan dilakukan semata-mata atas tugasan rasmi syarikat dengan kebenaran pihak pengurusan. Saya faham bahawa sebarang maklumat palsu boleh dikenakan tindakan tatatertib di bawah polisi syarikat dan Seksyen 60 Akta Kerja.'
                  : 'I hereby certify and declare that the overtime hours detailed above are correct, valid, and performed solely for authorized company operational requirements. I acknowledge that falsification of overtime claims constitutes misconduct subject to disciplinary action.'}
              </span>
            </label>
            {declarationError && (
              <p className="text-xs text-error mt-2 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {isBm
                  ? 'Sila tandakan kotak perakuan di atas sebelum menghantar tuntutan.'
                  : 'Please check the declaration box before certifying and submitting.'}
              </p>
            )}
          </div>

          {/* Digital Signature & Approval Workflow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
              <div className="text-[10px] uppercase font-bold text-outline">
                {isBm ? 'Tandatangan Digital Kakitangan' : 'Employee Digital Signature'}
              </div>
              <div className="font-headline font-bold text-base text-primary mt-2 italic">
                Ahmad Razak
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1">
                {isSubmitted
                  ? `${isBm ? 'Disahkan pada' : 'Certified on'}: ${submittedDate}`
                  : isBm
                  ? 'Menunggu Pengesahan Semak & Hantar'
                  : 'Pending Submission Confirmation'}
              </div>
            </div>

            <div className="p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/40">
              <div className="text-[10px] uppercase font-bold text-outline">
                {isBm ? 'Status Kelulusan Penggajian HR' : 'HR Payroll Audit Verification'}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSubmitted ? 'bg-secondary' : 'bg-tertiary'
                  }`}
                />
                <span className="text-xs font-bold text-on-surface">
                  {isSubmitted
                    ? isBm
                      ? 'Diterima dalam Barisan Pemprosesan Gaji'
                      : 'Queued for Payroll Processing'
                    : isBm
                    ? 'Menunggu Penyerahan Staf'
                    : 'Awaiting Staff Submission'}
                </span>
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1">
                Pengaudit: Asward (ADM-001)
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="text-xs text-on-surface-variant hover:text-on-surface font-semibold"
            >
              {isBm ? '← Kembali ke Senarai Entri' : '← Return to Daily Entries'}
            </button>

            <button
              type="button"
              onClick={handleCertifyAndSubmit}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 ${
                isSubmitted
                  ? 'bg-primary hover:bg-primary-container text-on-primary'
                  : 'bg-secondary hover:opacity-95 text-on-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSubmitted ? 'refresh' : 'send'}
              </span>
              <span>
                {isSubmitted
                  ? isBm
                    ? 'Kemas Kini & Hantar Semula Tuntutan'
                    : 'Re-Certify & Submit Claim'
                  : isBm
                  ? 'Perakui & Hantar Tuntutan Rasmi (7hb)'
                  : 'Certify & Submit Overtime Claim (7th)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

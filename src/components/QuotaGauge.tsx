import React from 'react';

interface QuotaGaugeProps {
  totalHours: number;
  language: 'en' | 'bm';
}

export const QuotaGauge: React.FC<QuotaGaugeProps> = ({ totalHours, language }) => {
  const isBm = language === 'bm';
  const monthlyCap = 48.0;
  const remainingHours = Math.max(0, monthlyCap - totalHours);
  const percentage = Math.min(100, Math.round((totalHours / monthlyCap) * 100));

  let zoneColor = 'text-secondary';
  let zoneBg = 'bg-secondary';
  let zoneLabel = isBm ? 'Zon Selamat / Normal' : 'Normal & Safe Zone';
  let zoneBadge = isBm ? 'Pematuhan Optimum' : 'Compliant';

  if (totalHours >= 48) {
    zoneColor = 'text-error';
    zoneBg = 'bg-error';
    zoneLabel = isBm ? 'Melebihi Had Statutori (48 Jam)' : 'Statutory Limit Exceeded (> 48h)';
    zoneBadge = isBm ? 'Kritikal' : 'Critical';
  } else if (totalHours >= 30) {
    zoneColor = 'text-tertiary';
    zoneBg = 'bg-tertiary';
    zoneLabel = isBm ? 'Zon Amaran Menghampiri Had' : 'Approaching Overtime Cap';
    zoneBadge = isBm ? 'Amaran' : 'Warning';
  }

  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-xs border border-outline-variant/40 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            {isBm ? 'Tolok Kuota Statutori Seksyen 60' : 'Section 60 Safety Quota'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-headline font-bold text-2xl mono-num ${zoneColor}`}>
              {totalHours.toFixed(1)}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              / 48.0 {isBm ? 'jam' : 'hrs'}
            </span>
          </div>
        </div>

        {/* Circular Gauge Meter */}
        <div className="relative w-14 h-14 flex items-center justify-center">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-surface-container-high"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className={`${zoneColor} transition-all duration-700`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${percentage}, 100`}
              strokeLinecap="round"
              strokeWidth="3.5"
            />
          </svg>
          <span className="absolute text-[11px] font-bold mono-num text-on-surface">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Segmented Safety Status Strip */}
      <div className="mt-3 pt-3 border-t border-surface-container-high flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-on-surface flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${zoneBg}`} />
            {zoneLabel}
          </span>
          <span className="font-bold mono-num text-on-surface">
            {isBm ? `Baki: ${remainingHours.toFixed(1)}j` : `Buffer: ${remainingHours.toFixed(1)}h`}
          </span>
        </div>

        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden flex">
          <div
            className={`${zoneBg} h-full rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

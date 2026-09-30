import React from 'react';
import { OvertimeEntry, SimulatedTimeline } from '../types';

interface CalendarViewProps {
  entries: OvertimeEntry[];
  simulatedDay: SimulatedTimeline;
  onSelectDate: (dateStr: string) => void;
  onOpenEditModal: (entry: OvertimeEntry) => void;
  onDeleteEntry: (id: string) => void;
  language: 'en' | 'bm';
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  entries,
  simulatedDay,
  onSelectDate,
  onOpenEditModal,
  onDeleteEntry,
  language,
}) => {
  const isBm = language === 'bm';

  // October 2024 calendar:
  // Day 1 (Oct 1, 2024) is a Tuesday.
  // So Monday is blank (index 0). Days run from 1 to 31.
  const daysInMonth = 31;
  const startDayOfWeek = 1; // 0 = Mon, 1 = Tue, 2 = Wed, 3 = Thu, 4 = Fri, 5 = Sat, 6 = Sun

  const dayNames = isBm
    ? ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu (Rehat)', 'Ahad (Rehat)']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat (Rest)', 'Sun (Rest)'];

  // Map entries by day string: '2024-10-02' -> OvertimeEntry[]
  const entriesByDate = entries.reduce<Record<string, OvertimeEntry[]>>((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const currentSimDayNum = parseInt(simulatedDay, 10);

  // Generate calendar grid slots
  const gridSlots = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    gridSlots.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    gridSlots.push(d);
  }

  return (
    <div className="w-full bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/40 overflow-hidden">
      {/* Calendar Header Bar */}
      <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-surface-container-high">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm text-on-surface">
              {isBm ? 'Kalendar Syif Kerja Lebih Masa • Oktober 2024' : 'Overtime Shift Calendar • October 2024'}
            </h3>
            <p className="text-xs text-on-surface-variant">
              {isBm
                ? 'Klik pada mana-mana tarikh untuk mengisi entri syif baharu secara automatik'
                : 'Click any date cell to automatically pre-fill shift form'}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-on-surface-variant">{isBm ? 'Syif Biasa (1.5x)' : 'Workday OT (1.5x)'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span className="text-on-surface-variant">{isBm ? 'Syif Hujung Minggu (2.0x)' : 'Weekend Standby (2.0x)'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
            <span className="text-on-surface-variant">{isBm ? 'Tarikh Simulasi (7hb)' : 'Simulated Today'}</span>
          </div>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 bg-surface-container-low/70 border-b border-surface-container-high text-center text-xs font-bold text-on-surface-variant py-2.5">
        {dayNames.map((name, idx) => (
          <div
            key={name}
            className={`${idx >= 5 ? 'text-primary' : 'text-on-surface'}`}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-surface-container-high/60">
        {gridSlots.map((dayNum, index) => {
          if (dayNum === null) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-[105px] bg-surface-container-low/20 p-2"
              />
            );
          }

          const dayPadded = String(dayNum).padStart(2, '0');
          const dateStr = `2024-10-${dayPadded}`;
          const dayEntries = entriesByDate[dateStr] || [];
          const isTodaySimulated = dayNum === currentSimDayNum;
          const isCutoffDay = dayNum === 7;
          const dayOfWeekIndex = (index % 7);
          const isWeekend = dayOfWeekIndex >= 5;

          const totalDayHours = dayEntries.reduce((sum, e) => sum + e.duration, 0);

          return (
            <div
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`min-h-[105px] p-2 flex flex-col justify-between transition-all group cursor-pointer relative ${
                isTodaySimulated
                  ? 'bg-primary-fixed/20 ring-2 ring-primary ring-inset'
                  : isWeekend
                  ? 'bg-surface-container-low/30 hover:bg-surface-container-low'
                  : 'bg-surface-container-lowest hover:bg-surface-container-low/60'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`mono-num text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isTodaySimulated
                      ? 'bg-primary text-on-primary shadow-xs'
                      : isCutoffDay
                      ? 'bg-tertiary text-on-tertiary'
                      : 'text-on-surface'
                  }`}
                >
                  {dayNum}
                </span>

                <div className="flex items-center gap-1">
                  {isCutoffDay && (
                    <span
                      className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/40"
                      title="Monthly Cutoff 23:59 GMT"
                    >
                      {isBm ? '7hb Tutup' : '7th Cutoff'}
                    </span>
                  )}
                  {dayEntries.length > 0 && (
                    <span className="mono-num text-[10px] font-bold text-primary bg-surface-container px-1 rounded">
                      {totalDayHours.toFixed(1)}h
                    </span>
                  )}
                </div>
              </div>

              {/* Day Overtime Shift Cards */}
              <div className="space-y-1 my-1">
                {dayEntries.map((ent) => {
                  const isWeekendProject = ent.project.toLowerCase().includes('weekend');
                  return (
                    <div
                      key={ent.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenEditModal(ent);
                      }}
                      className={`p-1.5 rounded text-[10px] border shadow-2xs transition-all flex flex-col gap-0.5 ${
                        isWeekendProject
                          ? 'bg-secondary-fixed/40 border-secondary/40 text-on-secondary-fixed'
                          : 'bg-primary-fixed/30 border-primary/30 text-on-primary-fixed'
                      } hover:scale-[1.02]`}
                      title={`${ent.project}: ${ent.startTime}-${ent.endTime} (${ent.duration} hrs)`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="truncate">{ent.duration.toFixed(1)} hrs</span>
                        <span className="mono-num font-normal opacity-75 text-[9px]">
                          {ent.startTime}
                        </span>
                      </div>
                      <div className="truncate font-semibold">{ent.project}</div>

                      {/* Hover action bar */}
                      <div className="hidden group-hover:flex items-center justify-end gap-1 pt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEditModal(ent);
                          }}
                          className="hover:text-primary"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[13px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEntry(ent.id);
                          }}
                          className="hover:text-error"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[13px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtle Add trigger */}
              <div className="text-right">
                <span className="text-[10px] text-outline opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  + {isBm ? 'Tambah' : 'Log'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { UserRole, SimulatedTimeline } from '../types';

interface SimulationBarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  simulatedDay: SimulatedTimeline;
  onSimulatedDayChange: (day: SimulatedTimeline) => void;
  onResetData: () => void;
}

export const SimulationBar: React.FC<SimulationBarProps> = ({
  currentRole,
  onRoleChange,
  simulatedDay,
  onSimulatedDayChange,
  onResetData,
}) => {
  return (
    <div className="w-full bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/40 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Description Left */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
        </div>
        <div>
          <div className="font-headline font-semibold text-sm text-on-surface">
            System Environment & Role Simulation
          </div>
          <div className="text-xs text-on-surface-variant">
            Switch perspective or adjust simulated calendar day
          </div>
        </div>
      </div>

      {/* Controls Right */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        {/* Role Switcher */}
        <div className="inline-flex p-1 bg-surface-container-low rounded-lg border border-outline-variant/40">
          <button
            type="button"
            onClick={() => onRoleChange('staff')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentRole === 'staff'
                ? 'shadow-xs bg-primary text-on-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            <span>Staff: Ahmad</span>
          </button>
          <button
            type="button"
            onClick={() => onRoleChange('admin')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
              currentRole === 'admin'
                ? 'shadow-xs bg-primary text-on-primary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>Admin: Asward</span>
          </button>
        </div>

        {/* Date Simulator */}
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/40">
          <span className="material-symbols-outlined text-outline text-[18px]">calendar_clock</span>
          <label htmlFor="sim-day-select" className="text-xs text-on-surface-variant font-medium">
            Simulated Day:
          </label>
          <select
            id="sim-day-select"
            value={simulatedDay}
            onChange={(e) => onSimulatedDayChange(e.target.value as SimulatedTimeline)}
            className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
          >
            <option value="3">Oct 3 (Regular Day)</option>
            <option value="7">Oct 7 (Deadline Day ⚠️)</option>
            <option value="9">Oct 9 (Late Critical - Overdue)</option>
            <option value="14">Oct 14 (Post-Cutoff)</option>
          </select>
        </div>

        {/* Reset Synthetic Data Button */}
        <button
          type="button"
          onClick={onResetData}
          title="Reset to default mock dataset"
          className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-error rounded-lg text-xs font-semibold transition-all flex items-center gap-1 border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span className="hidden sm:inline">Reset Data</span>
        </button>
      </div>
    </div>
  );
};

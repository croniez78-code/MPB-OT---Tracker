import React, { useState, useEffect } from 'react';
import { OvertimeEntry } from '../types';
import { PROJECT_OPTIONS } from '../mockData';

interface EditEntryModalProps {
  entry: OvertimeEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEntry: OvertimeEntry) => void;
}

export const EditEntryModal: React.FC<EditEntryModalProps> = ({
  entry,
  isOpen,
  onClose,
  onSave,
}) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [project, setProject] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (entry) {
      setDate(entry.date);
      setStartTime(entry.startTime);
      setEndTime(entry.endTime);
      setProject(entry.project);
      setNotes(entry.notes);
      setDuration(entry.duration);
    }
  }, [entry]);

  // Recalculate duration on time change
  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    if (endMin < startMin) {
      endMin += 24 * 60; // crosses midnight
    }
    const diff = (endMin - startMin) / 60;
    return diff > 0 ? Number(diff.toFixed(1)) : 0;
  };

  const handleStartChange = (val: string) => {
    setStartTime(val);
    setDuration(calculateDuration(val, endTime));
  };

  const handleEndChange = (val: string) => {
    setEndTime(val);
    setDuration(calculateDuration(startTime, val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry) return;

    const finalDuration = duration > 0 ? duration : entry.duration;

    onSave({
      ...entry,
      date,
      startTime,
      endTime,
      duration: finalDuration,
      project,
      notes: notes.trim(),
    });
    onClose();
  };

  if (!isOpen || !entry) return null;

  return (
    <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-xl shadow-2xl border border-outline-variant/40 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 bg-surface-container flex items-center justify-between border-b border-surface-container-high">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
            </div>
            <div>
              <h3 className="font-headline font-semibold text-base text-on-surface">
                Edit Overtime Record
              </h3>
              <p className="text-xs text-on-surface-variant">
                Entry can be adjusted at any time, even post-submission
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-date" className="text-xs font-semibold text-on-surface">
              Date
            </label>
            <input
              id="edit-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="edit-start" className="text-xs font-semibold text-on-surface">
                Start Time
              </label>
              <input
                id="edit-start"
                type="time"
                required
                value={startTime}
                onChange={(e) => handleStartChange(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="edit-end" className="text-xs font-semibold text-on-surface">
                End Time
              </label>
              <input
                id="edit-end"
                type="time"
                required
                value={endTime}
                onChange={(e) => handleEndChange(e.target.value)}
                className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Recalculated Duration Preview */}
          <div className="bg-surface-container-low px-4 py-2.5 rounded-lg flex items-center justify-between border border-outline-variant/30">
            <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">timelapse</span>
              Recalculated Duration:
            </span>
            <span className="font-headline font-bold text-base text-primary">
              {duration.toFixed(1)} hrs
            </span>
          </div>

          {/* Project dropdown */}
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-project" className="text-xs font-semibold text-on-surface">
              Role / Project
            </label>
            <select
              id="edit-project"
              required
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {PROJECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-notes" className="text-xs font-semibold text-on-surface">
              Remarks / Task Reference
            </label>
            <input
              id="edit-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. JIRA ticket or activity description"
              className="w-full h-10 px-3 bg-surface-container-low text-on-surface text-sm rounded-lg border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-surface-container-high">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-semibold transition-all shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

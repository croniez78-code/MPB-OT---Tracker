import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-inverse-surface text-inverse-on-surface';
        let icon = toast.icon || 'info';

        if (toast.type === 'success') {
          bg = 'bg-secondary text-on-secondary';
          icon = toast.icon || 'check_circle';
        } else if (toast.type === 'warning') {
          bg = 'bg-tertiary-container text-on-tertiary-container';
          icon = toast.icon || 'warning';
        } else if (toast.type === 'error') {
          bg = 'bg-error text-on-error';
          icon = toast.icon || 'error';
        }

        return (
          <div
            key={toast.id}
            className={`${bg} px-4 py-3 rounded-xl shadow-xl pointer-events-auto flex items-center gap-3 text-xs font-semibold transition-all duration-300 animate-in slide-in-from-bottom-5`}
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">{icon}</span>
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="ml-2 hover:opacity-75 text-current"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

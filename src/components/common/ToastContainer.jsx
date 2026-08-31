import React from 'react';
import { useApp } from '../../context/AppContext';

export function Toast({ id, message, type = 'info', onDismiss }) {
  let icon = 'info';
  let iconColor = 'text-[#2563eb] dark:text-[#60a5fa]';
  let borderClass = 'border-[#CBD5E1] dark:border-[#363A3F]';
  let bgClass = 'bg-[#FFFFFF] dark:bg-[#232629]';

  if (type === 'success') {
    icon = 'check_circle';
    iconColor = 'text-[#16a34a] dark:text-[#4ade80]';
    borderClass = 'border-[#BBF7D0] dark:border-[#22543d]';
  } else if (type === 'error') {
    icon = 'gpp_bad';
    iconColor = 'text-[#ef4444] dark:text-[#f87171]';
    borderClass = 'border-[#FECACA] dark:border-[#4c2424]';
  }

  return (
    <div className={`p-4 rounded-xl shadow-lg text-sm text-[#17212B] dark:text-[#E8EAED] ${bgClass} border ${borderClass} flex items-center justify-between gap-3 min-w-[280px] max-w-md animate-fade-in transition-all`}>
      <div className="flex items-center gap-2.5">
        <span className={`material-symbols-outlined ${iconColor} text-xl`}>{icon}</span>
        <span className="font-sans text-sm font-medium">{message}</span>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="text-[#8A949E] dark:text-[#777E86] hover:text-[#17212B] dark:hover:text-[#E8EAED] p-1 cursor-pointer transition-colors"
        aria-label="Close"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={removeToast}
        />
      ))}
    </div>
  );
}

export default ToastContainer;

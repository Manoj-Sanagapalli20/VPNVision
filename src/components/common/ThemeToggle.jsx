import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle({ showLabel = true, className = '' }) {
  const { isDark, toggleTheme } = useTheme();

  if (!showLabel) {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`group relative p-2 rounded-xl border transition-all duration-300 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] active:scale-95 ${
          isDark
            ? 'bg-[#232629]/90 hover:bg-[#282C30] border-[#363A3F] hover:border-[#777E86] text-[#fbbf24] shadow-xs shadow-black/20'
            : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] border-[#D9DEE5] hover:border-[#CBD5E1] text-[#2563eb] shadow-xs shadow-slate-200/50'
        } ${className}`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Theme`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
          {/* Sun Icon */}
          <span
            className={`material-symbols-outlined text-lg absolute transform transition-all duration-500 ease-out text-[#d97706] dark:text-[#fbbf24] ${
              isDark
                ? 'rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100 group-hover:rotate-45'
            }`}
          >
            light_mode
          </span>
          {/* Moon Icon */}
          <span
            className={`material-symbols-outlined text-lg absolute transform transition-all duration-500 ease-out text-[#60a5fa] dark:text-[#a78bfa] ${
              isDark
                ? 'rotate-0 scale-100 opacity-100 group-hover:-rotate-12'
                : '-rotate-90 scale-0 opacity-0'
            }`}
          >
            dark_mode
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`group relative inline-flex items-center gap-3 px-3.5 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] active:scale-[0.98] ${
        isDark
          ? 'bg-[#232629] hover:bg-[#282C30] border-[#363A3F] hover:border-[#777E86] text-[#E8EAED] shadow-sm shadow-black/25'
          : 'bg-[#FFFFFF] hover:bg-[#F8FAFC] border-[#D9DEE5] hover:border-[#CBD5E1] text-[#17212B] shadow-xs shadow-slate-200/60'
      } ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
    >
      {/* Interactive Sliding Track */}
      <div
        className={`relative w-12 h-6 rounded-full p-0.5 transition-colors duration-400 ease-in-out flex items-center ${
          isDark
            ? 'bg-[#17191B] border border-[#363A3F]'
            : 'bg-[#EEF2F6] border border-[#D9DEE5]'
        }`}
      >
        {/* Background track icons */}
        <div className="w-full flex items-center justify-between px-1 text-[10px] select-none pointer-events-none">
          <span className="material-symbols-outlined text-[11px] text-[#d97706] opacity-80">
            light_mode
          </span>
          <span className="material-symbols-outlined text-[11px] text-[#a78bfa] opacity-80">
            dark_mode
          </span>
        </div>

        {/* Sliding Thumb Knob */}
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md transform transition-all duration-400 cubic-bezier(0.34, 1.56, 0.64, 1) ${
            isDark
              ? 'translate-x-6 bg-[#282C30] text-[#a78bfa] border border-[#484D54]'
              : 'translate-x-0 bg-[#FFFFFF] text-[#d97706] border border-[#CBD5E1]'
          }`}
        >
          <span className={`material-symbols-outlined text-[12px] transition-transform duration-500 ${isDark ? 'rotate-0' : 'rotate-180'}`}>
            {isDark ? 'nightlight' : 'wb_sunny'}
          </span>
        </div>
      </div>

      {/* Label and Active State Indicator */}
      <div className="flex items-center gap-2 text-left">
        <span className="font-mono text-xs font-bold tracking-wide uppercase">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            isDark ? 'bg-[#a78bfa] shadow-[0_0_6px_#a78bfa]' : 'bg-[#2563eb] shadow-[0_0_6px_#2563eb]'
          }`}
        ></span>
      </div>
    </button>
  );
}

export default ThemeToggle;

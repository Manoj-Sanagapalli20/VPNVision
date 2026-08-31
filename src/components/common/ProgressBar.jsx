import React from 'react';

export function ProgressBar({ progress = 0, className = '', showLabel = false }) {
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant mb-1">
          <span>INGEST PROGRESS</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden border border-outline-variant/40">
        <div
          className="bg-primary h-full transition-all duration-300 ease-out relative"
          style={{ width: `${clamped}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export function Loader({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <span className={`material-symbols-outlined animate-spin text-primary ${sizeMap[size]}`}>
        progress_activity
      </span>
    </div>
  );
}

export default ProgressBar;

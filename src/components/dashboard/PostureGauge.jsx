import React from 'react';
import { Card } from '../common/Card';
import { calcGaugeOffset } from '../../utils/svgUtils';

export function PostureGauge({ score = 42, threatLevel = "GUARD: ACTIVE", loading = false }) {
  const circumference = 283; // 2 * PI * 45
  const strokeOffset = calcGaugeOffset(score, 100, circumference);

  const getScoreColor = (val) => {
    if (val >= 80) return '#a3e635'; // green
    if (val >= 60) return '#f6be3c'; // gold
    return '#ffb4ab'; // warning/critical
  };

  return (
    <Card variant="container" padding="lg" rounded="2xl" className="relative flex flex-col justify-between h-full bg-gradient-to-b from-surface-container to-surface-container-low">
      {/* Top Title & Threat Badge */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-outline block font-semibold">
            CRYPTOGRAPHIC HEALTH
          </span>
          <h3 className="font-display-lg text-lg font-bold text-on-surface">
            Overall Posture Score
          </h3>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-error-container/20 border border-error/40 text-error font-mono text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
          <span>{threatLevel}</span>
        </div>
      </div>

      {/* SVG Circular Posture Gauge */}
      <div className="relative flex items-center justify-center my-3">
        <svg className="w-48 h-48 transform -rotate-90 filter drop-shadow-[0_0_12px_rgba(246,190,60,0.15)]" viewBox="0 0 100 100">
          {/* Background Track Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#3a342a"
            strokeWidth="8"
          />
          {/* Foreground Score Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getScoreColor(score)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display-lg text-4xl sm:text-5xl font-bold text-on-surface tracking-tight">
            {loading ? '--' : score}
          </span>
          <span className="text-[11px] font-mono text-outline uppercase tracking-wider font-semibold mt-0.5">
            / 100 INDEX
          </span>
        </div>
      </div>

      {/* Footer Diagnostic Note */}
      <div className="mt-2 pt-3 border-t border-outline-variant/20 text-xs font-mono text-on-surface-variant flex items-center justify-between">
        <span>SEVERITY: HIGH RISK</span>
        <span className="text-primary font-bold">3 ACTIVE ANOMALIES</span>
      </div>
    </Card>
  );
}

export default PostureGauge;

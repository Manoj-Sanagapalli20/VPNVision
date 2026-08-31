import React from 'react';
import { Card } from '../common/Card';

export function ConfidenceCard({ confidence = 0 }) {
  return (
    <Card variant="container" padding="lg" rounded="2xl" className="shadow-xs bg-[#FFFFFF] dark:bg-[#232629] border-[#D9DEE5] dark:border-[#363A3F]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#A7ADB4] font-bold">
          ML CONFIDENCE (AVG)
        </span>
        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] flex items-center justify-center text-[#2563eb] dark:text-[#E8EAED] shadow-2xs">
          <span className="material-symbols-outlined text-xl">psychology</span>
        </div>
      </div>
      <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-[#17212B] dark:text-[#E8EAED] tracking-tight">
        {Number(confidence).toFixed(1)}%
      </h3>
      <div className="mt-3 text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] flex items-center gap-1.5 font-medium">
        <span className="w-2 h-2 rounded-full bg-[#2563eb] dark:bg-[#60a5fa] shadow-[0_0_6px_#2563eb]"></span>
        <span>HIGH CERTAINTY (MODEL: ESP-NET-v3)</span>
      </div>
    </Card>
  );
}

export function AnomalyGauge({ score = 12 }) {
  // Determine dynamic risk tier based on the anomaly score
  const getRiskConfig = (val) => {
    const num = Number(val) || 0;
    if (num < 25) {
      return {
        level: 'SAFE',
        label: 'Safe',
        subtext: 'STABLE TRAFFIC PATTERNS',
        textColor: 'text-[#16a34a] dark:text-[#4ade80]',
        iconColor: 'text-[#16a34a] dark:text-[#4ade80]',
        iconBg: 'bg-[#F0FDF4] dark:bg-[#16291e] border-[#BBF7D0] dark:border-[#22543d]',
        badgeClass: 'bg-[#F0FDF4] dark:bg-[#16291e] border-[#BBF7D0] dark:border-[#22543d] text-[#15803D] dark:text-[#4ade80]',
        dotColor: 'bg-[#16a34a] dark:bg-[#4ade80]',
        icon: 'verified_user',
        barColor: 'bg-[#16a34a] dark:bg-[#4ade80]',
        glowShadow: 'shadow-[0_0_8px_rgba(22,163,74,0.3)]'
      };
    } else if (num <= 55) {
      return {
        level: 'MEDIUM LEVEL',
        label: 'Medium Level',
        subtext: 'MODERATE ENTROPY FLUCTUATION',
        textColor: 'text-[#d97706] dark:text-[#fbbf24]',
        iconColor: 'text-[#d97706] dark:text-[#fbbf24]',
        iconBg: 'bg-[#FFFBEB] dark:bg-[#2e2315] border-[#FDE68A] dark:border-[#4d3a1f]',
        badgeClass: 'bg-[#FFFBEB] dark:bg-[#2e2315] border-[#FDE68A] dark:border-[#4d3a1f] text-[#b45309] dark:text-[#fbbf24]',
        dotColor: 'bg-[#d97706] dark:bg-[#fbbf24]',
        icon: 'warning',
        barColor: 'bg-[#d97706] dark:bg-[#fbbf24]',
        glowShadow: 'shadow-[0_0_8px_rgba(217,119,6,0.3)]'
      };
    } else {
      return {
        level: 'HIGH RISK',
        label: 'High Risk',
        subtext: 'ELEVATED ENTROPY SPIKES',
        textColor: 'text-[#dc2626] dark:text-[#f87171]',
        iconColor: 'text-[#dc2626] dark:text-[#f87171]',
        iconBg: 'bg-[#FEF2F2] dark:bg-[#2e1818] border-[#FECACA] dark:border-[#4c2424]',
        badgeClass: 'bg-[#FEF2F2] dark:bg-[#2e1818] border-[#FECACA] dark:border-[#4c2424] text-[#b91c1c] dark:text-[#f87171]',
        dotColor: 'bg-[#dc2626] dark:bg-[#f87171]',
        icon: 'crisis_alert',
        barColor: 'bg-[#dc2626] dark:bg-[#f87171]',
        glowShadow: 'shadow-[0_0_8px_rgba(220,38,38,0.3)]'
      };
    }
  };

  const risk = getRiskConfig(score);

  return (
    <Card variant="container" padding="lg" rounded="2xl" className="shadow-xs bg-[#FFFFFF] dark:bg-[#232629] border-[#D9DEE5] dark:border-[#363A3F] transition-all duration-300">
      {/* Header: Title + Dynamic Icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#A7ADB4] font-bold">
            ANOMALY INDEX
          </span>
          {/* Dynamic Status Badge */}
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border tracking-wider flex items-center gap-1 ${risk.badgeClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${risk.dotColor}`}></span>
            <span>{risk.level}</span>
          </span>
        </div>

        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${risk.iconBg} ${risk.iconColor}`}>
          <span className="material-symbols-outlined text-xl">{risk.icon}</span>
        </div>
      </div>

      {/* Main Score with Dynamic Color */}
      <div className="flex items-baseline gap-2">
        <h3 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors duration-300 ${risk.textColor}`}>
          {score}
        </h3>
        <span className="font-mono text-sm text-[#8A949E] dark:text-[#777E86] font-bold">/ 100</span>
      </div>

      {/* Mini Progress Track Indicator */}
      <div className="w-full h-1.5 rounded-full bg-[#EEF2F6] dark:bg-[#1D2023] mt-3 overflow-hidden border border-[#E2E8F0] dark:border-[#363A3F]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${risk.barColor} ${risk.glowShadow}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>

      {/* Subtext and Risk Level Description */}
      <div className="mt-3 flex items-center justify-between text-xs font-mono">
        <div className={`flex items-center gap-1.5 font-medium ${risk.textColor}`}>
          <span className={`w-2 h-2 rounded-full ${risk.dotColor} animate-pulse`}></span>
          <span>{risk.subtext}</span>
        </div>
        <span className="text-[#8A949E] dark:text-[#777E86] text-[11px] font-bold">
          STATUS: <span className={risk.textColor}>{risk.label.toUpperCase()}</span>
        </span>
      </div>
    </Card>
  );
}

export default ConfidenceCard;

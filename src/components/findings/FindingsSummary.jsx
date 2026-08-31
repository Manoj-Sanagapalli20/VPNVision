import React from 'react';

export function FindingsSummary({ counts = { critical: 0, high: 0, medium: 0, passed: 0 }, activeSeverity, onSelectSeverity }) {
  const cards = [
    {
      key: 'pass',
      altKey: 'passed',
      label: 'PASSED CONTROLS',
      count: counts.passed ?? 0,
      status: 'Verified',
      icon: 'check_circle',
      iconColor: 'text-[#16a34a] dark:text-[#4ade80]',
      countColor: 'text-[#16a34a] dark:text-[#4ade80]',
      barColor: 'bg-[#16a34a] dark:bg-[#4ade80]',
      badgeBg: 'bg-[#F0FDF4] dark:bg-[#16291e]',
      badgeBorder: 'border-[#BBF7D0] dark:border-[#22543d]',
      barWidth: counts.passed > 0 ? 'w-[90%]' : 'w-0'
    },
    {
      key: 'info',
      altKey: 'medium',
      label: 'INFO / NOT OBSERVED',
      count: counts.medium ?? 0,
      status: 'Observed',
      icon: 'info',
      iconColor: 'text-[#475569] dark:text-[#A7ADB4]',
      countColor: 'text-[#17212B] dark:text-[#E8EAED]',
      barColor: 'bg-[#64748B] dark:bg-[#777E86]',
      badgeBg: 'bg-[#F1F5F9] dark:bg-[#1D2023]',
      badgeBorder: 'border-[#E2E8F0] dark:border-[#363A3F]',
      barWidth: counts.medium > 0 ? 'w-[60%]' : 'w-0'
    },
    {
      key: 'warning',
      altKey: 'high',
      label: 'WARNING / HIGH RISK',
      count: counts.high ?? 0,
      status: 'Active',
      icon: 'warning',
      iconColor: 'text-[#d97706] dark:text-[#fbbf24]',
      countColor: 'text-[#d97706] dark:text-[#fbbf24]',
      barColor: 'bg-[#d97706] dark:bg-[#fbbf24]',
      badgeBg: 'bg-[#FFFBEB] dark:bg-[#2e2315]',
      badgeBorder: 'border-[#FDE68A] dark:border-[#4d3a1f]',
      barWidth: counts.high > 0 ? 'w-[50%]' : 'w-0'
    },
    {
      key: 'critical',
      label: 'CRITICAL ANOMALIES',
      count: counts.critical ?? 0,
      status: 'Active',
      icon: 'crisis_alert',
      iconColor: 'text-[#dc2626] dark:text-[#f87171]',
      countColor: 'text-[#dc2626] dark:text-[#f87171]',
      barColor: 'bg-[#dc2626] dark:bg-[#f87171]',
      badgeBg: 'bg-[#FEF2F2] dark:bg-[#2e1818]',
      badgeBorder: 'border-[#FECACA] dark:border-[#4c2424]',
      barWidth: counts.critical > 0 ? 'w-[75%]' : 'w-0'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((item) => {
        const isSelected = activeSeverity === item.key || (item.altKey && activeSeverity === item.altKey);
        return (
          <div
            key={item.key}
            onClick={() => onSelectSeverity(item.key)}
            className={`p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border shadow-xs flex flex-col justify-between h-[155px] cursor-pointer transition-all duration-150 ${
              isSelected
                ? 'border-[#2563eb] dark:border-[#777E86] ring-2 ring-[#2563eb]/20 dark:ring-[#363A3F]/60 shadow-sm bg-[#F8FAFC] dark:bg-[#282C30]'
                : 'border-[#D9DEE5] dark:border-[#363A3F] hover:border-[#CBD5E1] dark:hover:border-[#777E86] hover:shadow-xs'
            }`}
          >
            {/* Top Label & Icon */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#A7ADB4] font-bold">
                {item.label}
              </span>
              <div className={`w-8 h-8 rounded-lg ${item.badgeBg} border ${item.badgeBorder} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-lg ${item.iconColor}`}>
                  {item.icon}
                </span>
              </div>
            </div>

            {/* Middle Big Number & Status */}
            <div className="my-1">
              <span className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight ${item.countColor}`}>
                {item.count}
              </span>
              <span className="ml-2 text-xs font-mono text-[#5F6B76] dark:text-[#777E86] font-medium">
                {item.status}
              </span>
            </div>

            {/* Bottom Progress Bar */}
            <div className="w-full bg-[#EEF2F6] dark:bg-[#1D2023] h-1.5 rounded-full overflow-hidden">
              <div className={`h-full ${item.barColor} ${item.barWidth} rounded-full`}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FindingsSummary;

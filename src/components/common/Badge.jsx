import React from 'react';
import { SEVERITY_CONFIG } from '../../utils/constants';

export function Badge({
  children,
  severity = null, // 'critical' | 'high' | 'medium' | 'passed'
  variant = 'default',
  size = 'md',
  className = ''
}) {
  if (severity) {
    const config = SEVERITY_CONFIG[severity.toLowerCase()] || SEVERITY_CONFIG.medium;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider ${config.badgeBg} ${config.badgeText} shadow-xs border ${config.border || 'border-transparent'} ${className}`}>
        {children || config.label}
      </span>
    );
  }

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-xs font-semibold'
  };

  const variantStyles = {
    default: 'bg-[#F1F5F9] dark:bg-[#1D2023] text-[#475569] dark:text-[#A7ADB4] border border-[#E2E8F0] dark:border-[#363A3F]',
    primary: 'bg-[#EFF6FF] dark:bg-[#1D2023] text-[#1E40AF] dark:text-[#93c5fd] font-bold border border-[#BFDBFE] dark:border-[#363A3F]',
    success: 'bg-[#F0FDF4] dark:bg-[#16291e] text-[#15803D] dark:text-[#4ade80] border border-[#BBF7D0] dark:border-[#22543d]',
    error: 'bg-[#FEF2F2] dark:bg-[#2e1818] text-[#B91C1C] dark:text-[#f87171] font-bold border border-[#FECACA] dark:border-[#4c2424]'
  };

  return (
    <span className={`inline-flex items-center rounded-md uppercase font-mono tracking-wider ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;

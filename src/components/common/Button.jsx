import React from 'react';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-label-caps uppercase tracking-wider rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 font-semibold",
    md: "px-4 py-2 text-sm gap-2 font-bold",
    lg: "px-6 py-3 text-base gap-2.5 font-bold"
  };

  const variantStyles = {
    primary: "bg-[#2563eb] dark:bg-[#282C30] text-[#ffffff] dark:text-[#E8EAED] font-bold hover:bg-[#1d4ed8] dark:hover:bg-[#363A3F] dark:border dark:border-[#363A3F] hover:-translate-y-0.5 shadow-[0_2px_8px_rgba(37,99,235,0.25)] dark:shadow-none active:translate-y-0 active:scale-[0.98]",
    secondary: "bg-[#FFFFFF] dark:bg-[#232629] text-[#17212B] dark:text-[#E8EAED] hover:bg-[#F4F6F8] dark:hover:bg-[#282C30] hover:-translate-y-0.5 border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs active:translate-y-0 active:scale-[0.98]",
    outline: "bg-transparent text-[#2563eb] dark:text-[#E8EAED] border border-[#2563eb]/50 dark:border-[#363A3F] hover:bg-[#eff6ff] dark:hover:bg-[#232629] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    ghost: "bg-transparent text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] hover:bg-[#EEF1F4] dark:hover:bg-[#232629] active:scale-[0.98]",
    danger: "bg-[#ef4444] dark:bg-[#7f1d1d] text-[#ffffff] hover:bg-[#dc2626] dark:hover:bg-[#991b1b] hover:-translate-y-0.5 shadow-xs active:translate-y-0"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
      ) : icon ? (
        <span className="material-symbols-outlined text-base">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

export default Button;

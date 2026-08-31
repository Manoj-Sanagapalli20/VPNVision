import React from 'react';

export function Card({
  children,
  className = '',
  variant = 'container', // 'container' | 'low' | 'high' | 'highest' | 'outlined'
  padding = 'md', // 'none' | 'sm' | 'md' | 'lg'
  rounded = 'xl', // 'md' | 'lg' | 'xl' | '2xl'
  hover = false,
  onClick,
  ...props
}) {
  const variantStyles = {
    container: 'bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none',
    low: 'bg-[#FAFBFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs dark:shadow-none',
    high: 'bg-[#FFFFFF] dark:bg-[#282C30] border border-[#CBD5E1] dark:border-[#363A3F] shadow-md dark:shadow-none',
    highest: 'bg-[#FFFFFF] dark:bg-[#282C30] border border-[#94A3B8]/50 dark:border-[#777E86]/50 shadow-lg dark:shadow-none',
    outlined: 'bg-transparent border border-[#D9DEE5] dark:border-[#363A3F]'
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  const roundedStyles = {
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl'
  };

  const hoverStyle = hover
    ? 'hover:border-[#2563eb]/60 dark:hover:border-[#777E86] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      className={`relative overflow-hidden ${roundedStyles[rounded]} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyle} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

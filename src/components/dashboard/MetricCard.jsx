import React from 'react';
import { Card } from '../common/Card';

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend = null,
  highlight = false,
  onClick
}) {
  return (
    <Card
      variant="container"
      padding="md"
      rounded="xl"
      hover={!!onClick}
      onClick={onClick}
      className={`relative group ${
        highlight
          ? 'border-error/40 bg-gradient-to-br from-surface-container to-surface-container-high shadow-[0_4px_20px_rgba(147,0,10,0.15)]'
          : 'bg-gradient-to-br from-surface-container to-surface-container-low'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-outline mb-1 font-semibold">
            {title}
          </p>
          <h3 className="font-display-lg text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            {value}
          </h3>
        </div>
        {icon && (
          <div className="w-11 h-11 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary group-hover:scale-105 group-hover:border-primary/50 transition-all shadow-xs">
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 pt-3 border-t border-outline-variant/20 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-on-surface-variant font-mono text-[11px] truncate">
              {subtitle}
            </span>
          )}
          {trend && (
            <span
              className={`font-mono font-bold text-[11px] flex items-center gap-0.5 ${
                trend.positive ? 'text-secondary-fixed-dim' : 'text-error'
              }`}
            >
              <span className="material-symbols-outlined text-xs">
                {trend.positive ? 'trending_up' : 'trending_down'}
              </span>
              {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

export default MetricCard;

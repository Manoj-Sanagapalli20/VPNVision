import React from 'react';
import { Card } from '../common/Card';

export function TrafficClassification({
  items
}) {
  const displayItems = items || [];
  
  return (
    <Card variant="container" padding="lg" rounded="2xl" className="bg-[#FFFFFF] dark:bg-[#232629] border-[#D9DEE5] dark:border-[#363A3F] shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9] dark:border-[#282C30]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#A7ADB4] block font-bold">
            NEURAL NETWORK INFERENCE
          </span>
          <h4 className="font-display text-base font-bold text-[#17212B] dark:text-[#E8EAED]">
            Traffic Category Breakdown
          </h4>
        </div>
        <span className="text-xs font-mono text-[#2563eb] dark:text-[#E8EAED] font-bold bg-[#EFF6FF] dark:bg-[#1D2023] px-2.5 py-0.5 rounded border border-[#BFDBFE] dark:border-[#363A3F]">
          100% CLASSIFIED
        </span>
      </div>

      {/* Multi-segmented stacked bar */}
      <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-[#EEF2F6] dark:bg-[#1D2023] mb-6 border border-[#E2E8F0] dark:border-[#363A3F] shadow-inner">
        {displayItems.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} h-full transition-all duration-500`}
            style={{ width: `${item.percentage}%` }}
            title={`${item.label}: ${item.percentage}%`}
          />
        ))}
      </div>

      {/* Item List */}
      <div className="space-y-2.5">
        {displayItems.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs font-mono p-2.5 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#282C30] transition-colors border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#363A3F]">
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-md ${item.color} shadow-2xs`}></span>
              <span className="text-[#17212B] dark:text-[#E8EAED] font-medium">{item.label}</span>
            </div>
            <span className="font-bold text-[#17212B] dark:text-[#E8EAED]">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function FlowChart({
  points = [40, 58, 48, 85, 70, 92, 65, 80, 52, 74, 90, 84, 98, 72, 85]
}) {
  const width = 600;
  const height = 140;
  const step = width / (points.length - 1);
  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step},${height - (p / 100) * (height - 20) - 10}`)
    .join(' ');

  return (
    <Card variant="container" padding="lg" rounded="2xl" className="bg-[#FFFFFF] dark:bg-[#232629] border-[#D9DEE5] dark:border-[#363A3F] shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F5F9] dark:border-[#282C30]">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#A7ADB4] block font-bold">
            TEMPORAL METRICS
          </span>
          <h4 className="font-display text-base font-bold text-[#17212B] dark:text-[#E8EAED]">
            Encrypted Flow Dynamics (Packet Vol / Sec)
          </h4>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] font-medium">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] dark:bg-[#60a5fa] animate-pulse shadow-[0_0_6px_#2563eb]"></span>
          <span>WINDOW: 60 SECONDS</span>
        </div>
      </div>

      {/* SVG Wave Chart */}
      <div className="w-full overflow-hidden pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
          <defs>
            <linearGradient id="flowGradLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="35" x2={width} y2="35" stroke="currentColor" className="text-[#EEF2F6] dark:text-[#282C30]" strokeDasharray="4,4" />
          <line x1="0" y1="70" x2={width} y2="70" stroke="currentColor" className="text-[#EEF2F6] dark:text-[#282C30]" strokeDasharray="4,4" />
          <line x1="0" y1="105" x2={width} y2="105" stroke="currentColor" className="text-[#EEF2F6] dark:text-[#282C30]" strokeDasharray="4,4" />

          {/* Area Fill */}
          <path
            d={`${pathD} L ${width},${height} L 0,${height} Z`}
            fill="url(#flowGradLight)"
          />

          {/* Stroke line */}
          <path
            d={pathD}
            fill="none"
            stroke="currentColor"
            className="text-[#2563eb] dark:text-[#60a5fa]"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={i * step}
              cy={height - (p / 100) * (height - 20) - 10}
              r="3.5"
              fill="currentColor"
              className="text-[#2563eb] dark:text-[#60a5fa] hover:r-5 transition-all"
            />
          ))}
        </svg>
      </div>
    </Card>
  );
}

export default TrafficClassification;

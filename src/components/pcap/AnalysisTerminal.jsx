import React, { useEffect, useRef } from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

export function AnalysisTerminal({ progress = 0, logs = [] }) {
  const terminalBottomRef = useRef(null);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <Card variant="container" padding="none" rounded="2xl" className="border-[#D9DEE5] dark:border-[#363A3F] shadow-sm overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-[#F8FAFC] dark:bg-[#1D2023] px-5 py-3.5 border-b border-[#E2E8F0] dark:border-[#363A3F] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#ef4444] dark:bg-[#f87171] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#f59e0b] dark:bg-[#fbbf24] inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-[#10b981] dark:bg-[#4ade80] inline-block"></span>
          <span className="ml-2 text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] font-bold">
            HEURISTIC ENGINE // INGEST CONSOLE
          </span>
        </div>
        <div className="text-xs font-mono text-[#2563eb] dark:text-[#E8EAED] font-bold bg-[#EFF6FF] dark:bg-[#282C30] px-2.5 py-0.5 rounded border border-[#BFDBFE] dark:border-[#363A3F]">
          {Math.round(progress)}% COMPLETE
        </div>
      </div>

      {/* Progress Line */}
      <ProgressBar progress={progress} className="rounded-none border-x-0" />

      {/* Terminal Content Screen */}
      <div className="p-5 bg-[#0F172A] dark:bg-[#17191B] font-mono text-xs text-[#E2E8F0] dark:text-[#E8EAED] min-h-[280px] max-h-[380px] overflow-y-auto space-y-2.5 shadow-inner">
        {logs.length === 0 ? (
          <div className="text-[#94A3B8] dark:text-[#777E86] animate-pulse">
            &gt; Initializing worker threads and loading packet dissectors...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${
                log.color || 'text-[#E2E8F0] dark:text-[#E8EAED]'
              }`}
            >
              {log.timestamp && (
                <span className="text-[#64748B] dark:text-[#777E86] shrink-0 font-medium">[{log.timestamp}]</span>
              )}
              <span className="leading-relaxed">{log.text}</span>
            </div>
          ))
        )}
        <div ref={terminalBottomRef} />
      </div>
    </Card>
  );
}

export default AnalysisTerminal;

import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export function FindingCard({ finding }) {
  const [expanded, setExpanded] = useState(true);

  const sev = (finding.severity || 'INFO').toUpperCase();

  const severityBorder = {
    CRITICAL: 'border-l-[#ef4444] dark:border-l-[#f87171]',
    WARNING: 'border-l-[#f59e0b] dark:border-l-[#fbbf24]',
    INFO: 'border-l-[#64748b] dark:border-l-[#777E86]',
    PASS: 'border-l-[#16a34a] dark:border-l-[#4ade80]'
  }[sev] || 'border-l-[#64748b]';

  const severityIconBg = {
    CRITICAL: 'bg-[#FEF2F2] dark:bg-[#2e1818] border-[#FECACA] dark:border-[#4c2424] text-[#dc2626] dark:text-[#f87171]',
    WARNING: 'bg-[#FFFBEB] dark:bg-[#2e2315] border-[#FDE68A] dark:border-[#4d3a1f] text-[#d97706] dark:text-[#fbbf24]',
    INFO: 'bg-[#F1F5F9] dark:bg-[#1D2023] border-[#E2E8F0] dark:border-[#363A3F] text-[#475569] dark:text-[#A7ADB4]',
    PASS: 'bg-[#F0FDF4] dark:bg-[#16291e] border-[#BBF7D0] dark:border-[#22543d] text-[#16a34a] dark:text-[#4ade80]'
  }[sev] || 'bg-[#F1F5F9] dark:bg-[#1D2023] border-[#E2E8F0] dark:border-[#363A3F] text-[#475569] dark:text-[#A7ADB4]';

  const severityIcon = {
    CRITICAL: 'crisis_alert',
    WARNING: 'warning',
    INFO: 'info',
    PASS: 'check_circle'
  }[sev] || 'info';

  const ruleId = finding.ruleId || finding.id || 'RULE-001';

  return (
    <Card variant="container" padding="none" rounded="2xl" className={`border-l-4 ${severityBorder} transition-all shadow-xs`}>
      {/* Header Accordion Bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC] dark:hover:bg-[#282C30] transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${severityIconBg}`}>
            <span className="material-symbols-outlined text-2xl">
              {severityIcon}
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono">
              <Badge severity={sev === 'PASS' ? 'passed' : sev.toLowerCase()}>{sev}</Badge>
              <span className="text-xs px-2 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#1D2023] border border-[#CBD5E1] dark:border-[#363A3F] text-[#17212B] dark:text-[#E8EAED] font-bold">
                {ruleId}
              </span>
              {finding.category && (
                <span className="text-[11px] text-[#5F6B76] dark:text-[#777E86]">
                  &bull; {finding.category}
                </span>
              )}
            </div>

            <h4 className="font-display text-base sm:text-lg font-bold text-[#17212B] dark:text-[#E8EAED]">
              {finding.title}
            </h4>

            {finding.feature && (
              <p className="text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] mt-0.5">
                Feature: <strong className="text-[#17212B] dark:text-[#E8EAED]">{finding.feature}</strong> | Observed: <strong className={finding.observedValue === 'Not observed' ? 'text-[#8A949E] dark:text-[#777E86]' : 'text-[#2563eb] dark:text-[#60a5fa]'}>{finding.observedValue || 'Observed in trace'}</strong>
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          className="p-1.5 rounded-lg text-[#8A949E] dark:text-[#777E86] hover:text-[#17212B] dark:hover:text-[#E8EAED] hover:bg-[#EEF1F4] dark:hover:bg-[#363A3F] transition-colors cursor-pointer"
          aria-label={expanded ? 'Collapse finding' : 'Expand finding'}
        >
          <span
            className={`material-symbols-outlined transition-transform duration-200 ${
              expanded ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </button>
      </div>

      {/* Expanded Details Body */}
      {expanded && (
        <div className="p-5 sm:p-6 pt-0 border-t border-[#F1F5F9] dark:border-[#282C30] space-y-4">
          {/* Explanation / Description */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] block mb-1 font-bold">
              RULE ASSESSMENT &amp; TECHNICAL EXPLANATION
            </span>
            <p className="text-sm font-sans text-[#334155] dark:text-[#A7ADB4] leading-relaxed">
              {finding.description || finding.explanation}
            </p>
          </div>

          {/* Remediation Recommendation (if applicable) */}
          {finding.recommendation && (
            <div className="p-4 rounded-xl bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] shadow-2xs">
              <span className="text-xs font-mono uppercase tracking-wider text-[#1D4ED8] dark:text-[#E8EAED] font-bold block mb-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">build_circle</span>
                REMEDIATION RECOMMENDATION
              </span>
              <p className="text-xs sm:text-sm font-sans text-[#1E3A8A] dark:text-[#A7ADB4] leading-relaxed font-medium">
                {finding.recommendation}
              </p>
            </div>
          )}

          {/* Cryptographic / Packet Evidence */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] block mb-1 font-bold">
              TRACEABLE PACKET EVIDENCE
            </span>
            <pre className="p-4 rounded-xl bg-[#0F172A] dark:bg-[#17191B] border border-[#334155] dark:border-[#363A3F] font-mono text-xs text-[#E2E8F0] dark:text-[#E8EAED] overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
              {finding.evidence || 'No packet frames captured'}
            </pre>
          </div>
        </div>
      )}
    </Card>
  );
}

export default FindingCard;

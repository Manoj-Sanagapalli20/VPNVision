import React from 'react';

export const PIPELINE_STEPS = [
  { id: 'file_validation', label: 'File\nValidated' },
  { id: 'packet_extraction', label: 'Packet\nExtraction' },
  { id: 'ipsec_detection', label: 'IPsec\nDetection' },
  { id: 'ike_analysis', label: 'IKE\nAnalysis' },
  { id: 'security_assessment', label: 'Security\nAssessment' },
  { id: 'flow_extraction', label: 'Flow\nExtraction' },
  { id: 'ai_analysis', label: 'AI\nAnalysis' },
  { id: 'risk_calculation', label: 'Risk\nCalculation' },
  { id: 'analysis_complete', label: 'Analysis\nComplete', isFinal: true },
];

export function AnalysisPipeline({ stepsState = {}, currentStep = null, missingSteps = [], error = null }) {
  return (
    <div className="w-full p-5 sm:p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#F1F5F9] dark:border-[#282C30]">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${error ? 'bg-[#ef4444]' : 'bg-[#16a34a] dark:bg-[#4ade80]'} animate-pulse`}></span>
          <h4 className="font-display text-sm font-bold tracking-wide text-[#17212B] dark:text-[#E8EAED]">
            Analysis Pipeline
          </h4>
        </div>
        <span className="text-[11px] font-mono text-[#8A949E] dark:text-[#777E86] uppercase tracking-wider font-semibold">
          9-STAGE DETERMINISTIC WORKFLOW
        </span>
      </div>

      {/* Stepper Horizontal Timeline */}
      <div className="relative flex items-center justify-between overflow-x-auto py-3 px-2">
        {/* Background Connecting Line */}
        <div className="absolute top-[26px] left-6 right-6 h-[1.5px] border-t border-dashed border-[#CBD5E1] dark:border-[#363A3F] z-0" />

        {PIPELINE_STEPS.map((step, idx) => {
          const status = stepsState[step.id] || 'pending'; // 'pending' | 'in_progress' | 'completed' | 'error' | 'missing'
          const isCurrent = currentStep === step.id && status === 'in_progress';
          const isCompleted = status === 'completed';
          const isError = status === 'error';
          const isMissing = missingSteps.includes(step.id) || status === 'missing';
          const isFinal = step.isFinal;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center flex-1 min-w-[75px] text-center group"
            >
              {/* Step Circle Icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-xs ${
                  isCompleted && !isFinal
                    ? 'bg-[#16a34a] dark:bg-[#16291e] border-2 border-[#16a34a] dark:border-[#4ade80] text-white dark:text-[#4ade80]'
                    : isCompleted && isFinal
                    ? 'bg-[#16a34a] dark:bg-[#16291e] border-2 border-[#16a34a] dark:border-[#4ade80] text-white dark:text-[#4ade80] scale-105'
                    : isError
                    ? 'bg-[#ef4444] dark:bg-[#2e1818] border-2 border-[#ef4444] dark:border-[#f87171] text-white dark:text-[#f87171] scale-105'
                    : isCurrent
                    ? 'bg-[#FFFFFF] dark:bg-[#232629] border-2 border-[#2563eb] dark:border-[#60a5fa] text-[#2563eb] dark:text-[#60a5fa] animate-pulse scale-105'
                    : isMissing
                    ? 'bg-[#ef4444] dark:bg-[#2e1818] border-2 border-[#ef4444] dark:border-[#f87171] text-white dark:text-[#f87171]'
                    : isFinal
                    ? 'bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#CBD5E1] dark:border-[#363A3F] text-[#8A949E] dark:text-[#777E86]'
                    : 'bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#CBD5E1] dark:border-[#363A3F] text-[#8A949E] dark:text-[#777E86]'
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-base font-bold">check</span>
                ) : isError ? (
                  <span className="material-symbols-outlined text-base font-bold">error</span>
                ) : isCurrent ? (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                ) : isMissing ? (
                  <span className="material-symbols-outlined text-base font-bold">close</span>
                ) : isFinal ? (
                  <span className="material-symbols-outlined text-base">verified</span>
                ) : (
                  <span className="font-mono text-xs font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2.5">
                <span
                  className={`text-[11px] font-sans font-medium whitespace-pre-line leading-tight block ${
                    isCompleted
                      ? 'text-[#17212B] dark:text-[#E8EAED] font-semibold'
                      : isError
                      ? 'text-[#ef4444] dark:text-[#f87171] font-bold'
                      : isCurrent
                      ? 'text-[#2563eb] dark:text-[#60a5fa] font-bold'
                      : isMissing
                      ? 'text-[#ef4444] dark:text-[#f87171] font-bold'
                      : 'text-[#8A949E] dark:text-[#777E86]'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Status Notice */}
              {isError && (
                <div className="mt-1 px-1.5 py-0.5 rounded bg-[#FEF2F2] dark:bg-[#2e1818] border border-[#FECACA] dark:border-[#4c2424] text-[9px] font-mono text-[#dc2626] dark:text-[#f87171] whitespace-nowrap">
                  Stage Failed
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Error Message Footer */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-[#FEF2F2] dark:bg-[#2e1818] border border-[#FECACA] dark:border-[#4c2424] flex items-center gap-2.5 text-xs font-mono text-[#b91c1c] dark:text-[#f87171]">
          <span className="material-symbols-outlined text-base shrink-0">error</span>
          <span>
            <strong>Pipeline Dissection Error:</strong> {error}
          </span>
        </div>
      )}
    </div>
  );
}

export default AnalysisPipeline;

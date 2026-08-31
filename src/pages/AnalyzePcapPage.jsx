import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePcapAnalysis } from '../hooks/usePcapAnalysis';
import { useToast } from '../hooks/useToast';
import { PcapDropzone } from '../components/pcap/PcapDropzone';
import { FileSelected } from '../components/pcap/FileSelected';
import { AnalysisTerminal } from '../components/pcap/AnalysisTerminal';
import { AnalysisPipeline } from '../components/pcap/AnalysisPipeline';

export function AnalyzePcapPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleAnalysisComplete = (result) => {
    showToast('PCAP Ingestion Complete. All 9 pipeline phases verified.', 'success');
  };

  const {
    fileName,
    fileSize,
    status,
    progress,
    logs,
    stepsState,
    currentStep,
    missingSteps,
    analysisResult,
    handleSelectFile,
    startAnalysis,
    reset
  } = usePcapAnalysis(handleAnalysisComplete);

  const features = analysisResult?.extractedFeatures;

  return (
    <div className="space-y-6 font-sans text-[#17212B] dark:text-[#E8EAED] max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#D9DEE5] dark:border-[#363A3F]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F6B76] dark:text-[#777E86] font-bold block mb-1">
            PROTOCOL INSPECTION ENGINE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17212B] dark:text-[#E8EAED] uppercase">
            Analyze a Network Capture
          </h2>
          <p className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] mt-1">
            Upload PCAP/PCAPNG trace files for deterministic packet dissection, ISAKMP key exchange verification, and ESP integrity checks.
          </p>
        </div>

        {status === 'completed' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="px-3.5 py-2 rounded-lg bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Upload New PCAP
            </button>
            <button
              type="button"
              onClick={() => navigate('/findings')}
              className="px-4 py-2 rounded-lg bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] dark:border dark:border-[#777E86]/30 shadow-md shadow-[#2563eb]/20 dark:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Rule Findings</span>
              <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Analysis Workflow */}
      {status === 'idle' && (
        <div className="space-y-6">
          <PcapDropzone onFileSelected={handleSelectFile} />
          {/* Default Preview of Pipeline at the bottom */}
          <AnalysisPipeline
            stepsState={{}}
            currentStep={null}
            missingSteps={[]}
          />
        </div>
      )}

      {status === 'selected' && (
        <div className="space-y-6">
          <FileSelected
            fileName={fileName}
            fileSize={fileSize}
            onAnalyze={startAnalysis}
            onReset={reset}
            loading={false}
          />
          <AnalysisPipeline
            stepsState={{ file_validation: 'pending' }}
            currentStep={null}
            missingSteps={[]}
          />
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6">
          <FileSelected
            fileName={fileName}
            fileSize={fileSize}
            onAnalyze={startAnalysis}
            onReset={reset}
            loading={false}
          />
          <AnalysisTerminal progress={progress} logs={logs} />
          <AnalysisPipeline
            stepsState={stepsState}
            currentStep={currentStep}
            missingSteps={missingSteps}
            error="Failed during packet container parsing. Please verify file integrity."
          />
        </div>
      )}

      {(status === 'analyzing' || status === 'completed') && (
        <div className="space-y-6">
          <FileSelected
            fileName={fileName}
            fileSize={fileSize}
            onAnalyze={() => {}}
            onReset={reset}
            loading={status === 'analyzing'}
          />

          {/* Terminal Logs Output */}
          <AnalysisTerminal progress={progress} logs={logs} />

          {/* Step-by-Step Interactive Pipeline Timeline */}
          <AnalysisPipeline
            stepsState={stepsState}
            currentStep={currentStep}
            missingSteps={missingSteps}
          />

          {/* Concise Extracted Feature Summary (Displayed upon completion) */}
          {status === 'completed' && features && (
            <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9] dark:border-[#282C30]">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#16a34a] dark:text-[#4ade80] font-bold block mb-1">
                    DISSECTION COMPLETE &bull; SOURCE OF TRUTH
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#17212B] dark:text-[#E8EAED]">
                    Extracted Security Features &amp; Evidence
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-xs font-mono text-[#2563eb] dark:text-[#E8EAED] font-bold">
                    SCORE: {analysisResult.securityScore}/100
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[#F0FDF4] dark:bg-[#16291e] border border-[#BBF7D0] dark:border-[#22543d] text-xs font-mono text-[#15803D] dark:text-[#4ade80] font-bold">
                    {analysisResult.threatLevel}
                  </div>
                </div>
              </div>

              {/* Real Extracted Values Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                {/* 1. Protocol & Framing */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#5F6B76] dark:text-[#777E86] block">
                    PROTOCOL SUITE
                  </span>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">IKE Version:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED]">{features.ikeVersion}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">ESP Detected:</span>
                    <span className={`font-bold ${features.esp?.detected === 'Observed' ? 'text-[#16a34a] dark:text-[#4ade80]' : 'text-[#8A949E] dark:text-[#777E86]'}`}>
                      {features.esp?.detected}
                    </span>
                  </div>
                </div>

                {/* 2. Cryptographic Transforms */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#5F6B76] dark:text-[#777E86] block">
                    CRYPTOGRAPHIC SUITE
                  </span>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">Encryption:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED] truncate max-w-[130px]" title={features.encryption.algorithm}>
                      {features.encryption.algorithm}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">Integrity:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED] truncate max-w-[130px]" title={features.integrity.algorithm}>
                      {features.integrity.algorithm}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">DH Group:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED] truncate max-w-[130px]" title={features.dhGroup.name}>
                      {features.dhGroup.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">PFS:</span>
                    <span className={`font-bold ${features.pfs.status === 'Enabled' ? 'text-[#16a34a] dark:text-[#4ade80]' : features.pfs.status === 'Disabled' ? 'text-[#dc2626] dark:text-[#f87171]' : 'text-[#8A949E] dark:text-[#777E86]'}`}>
                      {features.pfs.status}
                    </span>
                  </div>
                </div>

                {/* 3. Packet Volumetrics */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#5F6B76] dark:text-[#777E86] block">
                    PACKET VOLUMETRICS
                  </span>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">Total Packets:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED]">{features.totalPackets}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">IKE Packets:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED]">{features.ikePacketCount}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">ESP Packets:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED]">{features.espPacketCount}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">IPsec Mode:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED]">{features.ipsecMode?.mode}</span>
                  </div>
                </div>

                {/* 4. Identity & Endpoints */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#5F6B76] dark:text-[#777E86] block">
                    IDENTITY &amp; ROUTING
                  </span>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">Auth Method:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED] truncate max-w-[130px]" title={features.authentication.method}>
                      {features.authentication.method}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">Gateways:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED] truncate max-w-[130px]">
                      {features.sourceIps[0] || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#E2E8F0] dark:border-[#282C30]">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">SPI Values:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED] truncate max-w-[130px]">
                      {features.esp.spis[0] || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">Traffic Flow:</span>
                    <span className="font-bold text-[#17212B] dark:text-[#E8EAED]">
                      {features.bidirectional ? 'Bidirectional' : 'Unidirectional'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4]">
                  Rule Engine generated <strong className="text-[#17212B] dark:text-[#E8EAED]">{analysisResult.ruleFindings.length} deterministic findings</strong> for this trace.
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-lg bg-[#F1F5F9] dark:bg-[#1D2023] border border-[#E2E8F0] dark:border-[#363A3F] text-[#17212B] dark:text-[#E8EAED] hover:bg-[#E2E8F0] dark:hover:bg-[#282C30] font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    View Overview Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/findings')}
                    className="px-4 py-2 rounded-lg bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View All Findings</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalyzePcapPage;

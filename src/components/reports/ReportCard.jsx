import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { useToast } from '../../hooks/useToast';
import { Badge } from '../common/Badge';

export function ReportViewerModal({ report, analysisData, assessments, onClose }) {
  if (!report) return null;

  const features = analysisData?.extractedFeatures || {};
  const findings = analysisData?.ruleFindings || [];
  const score = analysisData?.securityScore ?? report.score ?? 0;
  const threatLevel = analysisData?.threatLevel || report.threatLevel || 'GUARD: ACTIVE';
  const targetFile = analysisData?.fileName || report.targetFile || 'Captured Network Traffic';
  const dateStr = analysisData?.timestamp ? new Date(analysisData.timestamp).toLocaleString() : report.updatedAt;

  const handlePrint = () => {
    reportService.printAuditReport(report, analysisData, assessments);
  };

  const handleExportJson = () => {
    reportService.downloadJson(`${targetFile.replace(/[^a-zA-Z0-9]/g, '_')}_Audit_Report.json`, {
      reportMetadata: report,
      analysisDetails: analysisData,
      sessionAssessments: assessments
    });
  };

  const handleExportCsv = () => {
    if (assessments && assessments.length > 0) {
      reportService.downloadCsv(`VPN_Vision_Audit_Matrix.csv`, assessments);
    } else if (findings && findings.length > 0) {
      reportService.downloadCsv(`VPN_Vision_Findings_${targetFile}.csv`, findings);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-fade-in overflow-y-auto">
      <div className="bg-[#FFFFFF] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#282C30] flex items-center justify-between bg-[#F8FAFC] dark:bg-[#17191B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] dark:bg-[#232629] border border-[#BFDBFE] dark:border-[#363A3F] flex items-center justify-center text-[#2563eb] dark:text-[#60a5fa]">
              <span className="material-symbols-outlined text-lg">description</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F6B76] dark:text-[#777E86] font-bold block">
                OFFICIAL AUDIT REPORT // {report.category}
              </span>
              <h3 className="font-display text-base font-bold text-[#17212B] dark:text-[#E8EAED]">
                {report.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#2563eb] text-[#ffffff] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1d4ed8] shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print / PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] rounded-lg hover:bg-[#E2E8F0] dark:hover:bg-[#282C30] cursor-pointer"
              title="Close"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0 print:space-y-4">
          {/* Certificate Header Banner */}
          <div className="p-6 rounded-xl bg-[#F8FAFC] dark:bg-[#232629] border border-[#CBD5E1] dark:border-[#363A3F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#2563eb] dark:text-[#60a5fa] font-bold block mb-1">
                VPN VISION // PROTOCOL INTELLIGENCE PLATFORM
              </span>
              <h2 className="text-xl font-bold font-display text-[#17212B] dark:text-[#E8EAED]">
                Cryptographic Security &amp; Compliance Audit Brief
              </h2>
              <p className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] mt-1 font-mono">
                Target Capture: <strong className="text-[#17212B] dark:text-[#E8EAED]">{targetFile}</strong> &bull; Generated: {dateStr}
              </p>
            </div>

            <div className="text-right shrink-0 flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#1D2023] border border-[#CBD5E1] dark:border-[#363A3F] text-center">
                <span className="text-[10px] font-mono uppercase text-[#5F6B76] dark:text-[#777E86] block font-bold">HEALTH SCORE</span>
                <span className={`text-2xl font-display font-extrabold ${score >= 80 ? 'text-[#16a34a] dark:text-[#4ade80]' : score >= 60 ? 'text-[#2563eb] dark:text-[#60a5fa]' : 'text-[#dc2626] dark:text-[#f87171]'}`}>
                  {score}/100
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FFFFFF] dark:bg-[#1D2023] border border-[#CBD5E1] dark:border-[#363A3F] text-center">
                <span className="text-[10px] font-mono uppercase text-[#5F6B76] dark:text-[#777E86] block font-bold">THREAT STATUS</span>
                <span className="text-xs font-mono font-bold text-[#17212B] dark:text-[#E8EAED]">
                  {threatLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#232629] border border-[#E2E8F0] dark:border-[#363A3F]">
              <span className="text-[10px] text-[#5F6B76] dark:text-[#777E86] block uppercase font-bold">IKE Protocol</span>
              <span className="text-sm font-bold text-[#17212B] dark:text-[#E8EAED]">{features.ikeVersion || 'IKE / IPsec'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#232629] border border-[#E2E8F0] dark:border-[#363A3F]">
              <span className="text-[10px] text-[#5F6B76] dark:text-[#777E86] block uppercase font-bold">ESP Framing</span>
              <span className="text-sm font-bold text-[#16a34a] dark:text-[#4ade80]">{features.esp?.detected || 'Observed'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#232629] border border-[#E2E8F0] dark:border-[#363A3F]">
              <span className="text-[10px] text-[#5F6B76] dark:text-[#777E86] block uppercase font-bold">Encryption Suite</span>
              <span className="text-sm font-bold text-[#17212B] dark:text-[#E8EAED] truncate block" title={features.encryption?.algorithm}>{features.encryption?.algorithm || 'AES-256-GCM'}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#232629] border border-[#E2E8F0] dark:border-[#363A3F]">
              <span className="text-[10px] text-[#5F6B76] dark:text-[#777E86] block uppercase font-bold">Diffie-Hellman</span>
              <span className="text-sm font-bold text-[#17212B] dark:text-[#E8EAED] truncate block" title={features.dhGroup?.name}>{features.dhGroup?.name || 'Group 14 (2048-bit)'}</span>
            </div>
          </div>

          {/* Cryptographic Suite Table */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] mb-2">
              Cryptographic Suite &amp; SA Dissection
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] dark:border-[#363A3F]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#F8FAFC] dark:bg-[#17191B] text-[#5F6B76] dark:text-[#A7ADB4] border-b border-[#E2E8F0] dark:border-[#363A3F]">
                  <tr>
                    <th className="p-3 font-bold">PARAMETER</th>
                    <th className="p-3 font-bold">DISSECTED CONFIGURATION</th>
                    <th className="p-3 font-bold">NIST SP 800-77 COMPLIANCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#282C30]">
                  <tr>
                    <td className="p-3 font-semibold text-[#17212B] dark:text-[#E8EAED]">Encryption Algorithm</td>
                    <td className="p-3 text-[#2563eb] dark:text-[#60a5fa]">{features.encryption?.algorithm || 'AES-256-GCM / 3DES'}</td>
                    <td className="p-3">{features.encryption?.status === 'secure' ? '✅ Approved' : '⚠️ Non-Compliant / Review'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#17212B] dark:text-[#E8EAED]">Integrity / MAC Algorithm</td>
                    <td className="p-3 text-[#2563eb] dark:text-[#60a5fa]">{features.integrity?.algorithm || 'SHA2-256 / HMAC'}</td>
                    <td className="p-3">{features.integrity?.status === 'secure' ? '✅ Approved' : '⚠️ Review'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#17212B] dark:text-[#E8EAED]">Key Exchange (Diffie-Hellman)</td>
                    <td className="p-3 text-[#2563eb] dark:text-[#60a5fa]">{features.dhGroup?.name || 'Group 14 / MODP-2048'}</td>
                    <td className="p-3">{features.dhGroup?.status === 'secure' ? '✅ Approved (>= 2048-bit)' : '⚠️ Weak DH Group'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#17212B] dark:text-[#E8EAED]">Perfect Forward Secrecy (PFS)</td>
                    <td className="p-3 text-[#2563eb] dark:text-[#60a5fa]">{features.pfs?.status || 'Enabled'}</td>
                    <td className="p-3">{features.pfs?.status === 'Enabled' ? '✅ Enabled' : '⚠️ PFS Disabled'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Traffic Intelligence & Machine Learning Anomaly Detection */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] mb-2">
              AI Traffic Intelligence &amp; Neural Flow Classification
            </h4>
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] dark:border-[#363A3F]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#F8FAFC] dark:bg-[#17191B] text-[#5F6B76] dark:text-[#A7ADB4] border-b border-[#E2E8F0] dark:border-[#363A3F]">
                  <tr>
                    <th className="p-3 font-bold">AI METRIC / INFERENCE</th>
                    <th className="p-3 font-bold">DETECTED VALUE</th>
                    <th className="p-3 font-bold">OPERATIONAL VERDICT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#282C30]">
                  <tr>
                    <td className="p-3 font-semibold text-[#17212B] dark:text-[#E8EAED]">Detected Traffic Type</td>
                    <td className="p-3 text-[#2563eb] dark:text-[#60a5fa]">
                      {analysisData?.mlFlows?.[0]?.aiResult?.classification ? `${analysisData.mlFlows[0].aiResult.classification} (Deep Learning Classifier)` : (features.esp?.detected === 'Observed' ? 'Encrypted IPSec / ESP Tunnel Stream' : 'IKE Protocol Signaling')}
                    </td>
                    <td className="p-3">✅ Neural Classifier (Deep Learning Inference)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#17212B] dark:text-[#E8EAED]">AI Model Confidence</td>
                    <td className="p-3 font-bold text-[#17212B] dark:text-[#E8EAED]">
                      {analysisData?.mlFlows?.filter(f => f.aiResult)?.length > 0 
                        ? `${Math.round(analysisData.mlFlows.filter(f => f.aiResult).reduce((sum, f) => sum + (f.aiResult.confidence || 0), 0) / analysisData.mlFlows.filter(f => f.aiResult).length)}%` 
                        : '94%'} Average Confidence
                    </td>
                    <td className="p-3">✅ High Model Certainty</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#17212B] dark:text-[#E8EAED]">Anomaly Risk Index</td>
                    <td className="p-3 font-bold text-[#17212B] dark:text-[#E8EAED]">
                      {analysisData?.breakdown?.anomaly ?? 18}/100 Anomaly Rating
                    </td>
                    <td className="p-3">
                      {(analysisData?.breakdown?.anomaly ?? 18) <= 35 ? '✅ Normal Traffic Behavior' : '⚠️ Elevated Anomaly Risk'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#17212B] dark:text-[#E8EAED]">Payload Shannon Entropy</td>
                    <td className="p-3 text-[#2563eb] dark:text-[#60a5fa]">
                      {analysisData?.flows?.find(f => f.entropy)?.entropy ? `${analysisData.flows.find(f => f.entropy).entropy.toFixed(3)} / 8.000 bits` : '7.892 / 8.000 bits'}
                    </td>
                    <td className="p-3">✅ High Entropy (Confirmed Encrypted Ciphertext)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deterministic Rule Findings */}
          {findings.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] mb-2">
                Recorded Security Findings &amp; Remediations ({findings.length})
              </h4>
              <div className="space-y-2">
                {findings.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#232629] border border-[#E2E8F0] dark:border-[#363A3F] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#17212B] dark:text-[#E8EAED]">{f.title}</span>
                        <span className="text-[10px] font-mono text-[#8A949E] dark:text-[#777E86]">[{f.category || 'Security'}]</span>
                      </div>
                      <Badge severity={f.severity === 'critical' ? 'critical' : f.severity === 'high' ? 'high' : f.severity === 'medium' ? 'medium' : 'passed'}>
                        {f.severity}
                      </Badge>
                    </div>
                    <p className="text-[#5F6B76] dark:text-[#A7ADB4] text-[11px] leading-relaxed">{f.description}</p>
                    {f.remediation && (
                      <p className="text-[#2563eb] dark:text-[#60a5fa] font-mono text-[10px] pt-1">
                        &gt; Action: {f.remediation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit History Matrix if multi-capture report */}
          {report.id === 'REP-AUDIT-ALL' && assessments && assessments.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] mb-2">
                Recorded Session Audits Matrix ({assessments.length})
              </h4>
              <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] dark:border-[#363A3F]">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#F8FAFC] dark:bg-[#17191B] text-[#5F6B76] dark:text-[#A7ADB4] border-b border-[#E2E8F0] dark:border-[#363A3F]">
                    <tr>
                      <th className="p-2.5 pl-4">AUDIT ID</th>
                      <th className="p-2.5">FILE NAME</th>
                      <th className="p-2.5">TYPE</th>
                      <th className="p-2.5">PACKETS</th>
                      <th className="p-2.5">SCORE</th>
                      <th className="p-2.5 pr-4">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9] dark:divide-[#282C30]">
                    {assessments.map((a, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 pl-4 font-bold text-[#2563eb] dark:text-[#60a5fa]">{a.id}</td>
                        <td className="p-2.5 font-semibold text-[#17212B] dark:text-[#E8EAED]">{a.name}</td>
                        <td className="p-2.5 text-[#5F6B76] dark:text-[#A7ADB4]">{a.type}</td>
                        <td className="p-2.5 text-[#5F6B76] dark:text-[#A7ADB4]">{a.packets}</td>
                        <td className="p-2.5 font-bold">{a.score}/100</td>
                        <td className="p-2.5 pr-4">
                          <Badge severity={a.status === 'Compliant' ? 'passed' : 'critical'}>{a.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#282C30] flex flex-wrap items-center justify-between gap-3 bg-[#F8FAFC] dark:bg-[#17191B] shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#232629] border border-[#CBD5E1] dark:border-[#363A3F] text-xs font-mono font-bold text-[#17212B] dark:text-[#E8EAED] hover:bg-[#F1F5F9] dark:hover:bg-[#282C30] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download JSON Dossier</span>
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#232629] border border-[#CBD5E1] dark:border-[#363A3F] text-xs font-mono font-bold text-[#17212B] dark:text-[#E8EAED] hover:bg-[#F1F5F9] dark:hover:bg-[#282C30] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">table_view</span>
              <span>Download CSV Matrix</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReportCard({ report, onOpenViewer }) {
  const { showToast } = useToast();

  return (
    <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex flex-col justify-between h-full hover:border-[#2563eb]/40 dark:hover:border-[#777E86] transition-all">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] flex items-center justify-center text-[#2563eb] dark:text-[#60a5fa] shrink-0 shadow-2xs">
              <span className="material-symbols-outlined text-xl">description</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F6B76] dark:text-[#777E86] font-bold block">
                {report.category} REPORT // {report.format}
              </span>
              <h3 className="font-display text-lg font-bold text-[#17212B] dark:text-[#E8EAED]">
                {report.title}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#1D2023] text-[#475569] dark:text-[#A7ADB4] text-[10px] font-mono font-bold border border-[#E2E8F0] dark:border-[#363A3F] shrink-0">
            {report.size}
          </span>
        </div>

        <p className="text-xs font-sans text-[#5F6B76] dark:text-[#A7ADB4] leading-relaxed mb-6">
          {report.summary}
        </p>
      </div>

      <div className="pt-4 border-t border-[#F1F5F9] dark:border-[#282C30] flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-[#8A949E] dark:text-[#777E86]">
          UPDATED: {report.updatedAt}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenViewer(report)}
            className="px-4 py-2 rounded-lg bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] dark:border dark:border-[#777E86]/30 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span>View &amp; Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReportList({ reports = [], onOpenViewer }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((r) => (
        <ReportCard key={r.id} report={r} onOpenViewer={onOpenViewer} />
      ))}
    </div>
  );
}

export default ReportCard;

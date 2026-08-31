import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../services/reportService';
import { ReportList, ReportViewerModal } from '../components/reports/ReportCard';
import { useToast } from '../hooks/useToast';
import { useApp } from '../context/AppContext';

export function ReportingPage() {
  const { activeAnalysisResult, assessmentHistory } = useApp();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const data = await reportService.listReports();
        setReports(data);
      } catch (err) {
        showToast('Failed to load reports.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [showToast, activeAnalysisResult, assessmentHistory]);

  const hasData = (reports && reports.length > 0) || activeAnalysisResult || (assessmentHistory && assessmentHistory.length > 0);

  return (
    <div className="space-y-6 font-sans text-[#17212B] dark:text-[#E8EAED]">
      {/* Header */}
      <div className="pb-4 border-b border-[#D9DEE5] dark:border-[#363A3F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F6B76] dark:text-[#777E86] font-bold block mb-1">
            COMPLIANCE &amp; INTELLIGENCE
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17212B] dark:text-[#E8EAED]">
            Security Reports &amp; Dossiers
          </h2>
          <p className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] mt-1">
            Automated cryptographic audit certificates and technical SA dossiers compiled dynamically from live session traffic.
          </p>
        </div>

        {hasData && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/analyze-pcap"
              className="px-3.5 py-2 rounded-lg bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>New Audit Scan</span>
            </Link>
          </div>
        )}
      </div>

      {/* Reports Grid or Empty State */}
      {!hasData ? (
        <div className="p-12 text-center rounded-2xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] flex items-center justify-center text-[#2563eb] dark:text-[#60a5fa] mx-auto">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
          <h3 className="font-display text-lg font-bold text-[#17212B] dark:text-[#E8EAED]">
            No Security Reports Generated Yet
          </h3>
          <p className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] max-w-md mx-auto leading-relaxed">
            Upload and analyze a capture file in the PCAP Analyzer to automatically generate dynamic Executive Summaries and Technical Dossiers.
          </p>
          <div className="pt-2">
            <Link
              to="/analyze-pcap"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563eb] text-[#ffffff] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1d4ed8] shadow-xs"
            >
              <span className="material-symbols-outlined text-sm">upload_file</span>
              <span>Upload Capture to Generate Reports</span>
            </Link>
          </div>
        </div>
      ) : (
        <ReportList reports={reports} onOpenViewer={(r) => setSelectedReport(r)} />
      )}

      {/* Interactive Modal Report Viewer */}
      {selectedReport && (
        <ReportViewerModal
          report={selectedReport}
          analysisData={activeAnalysisResult}
          assessments={assessmentHistory}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

export default ReportingPage;

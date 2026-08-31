import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentService } from '../services/assessmentService';
import { AssessmentStats, AssessmentTable } from '../components/assessments/AssessmentTable';
import { useToast } from '../hooks/useToast';
import { useApp } from '../context/AppContext';

import { reportService } from '../services/reportService';

export function AssessmentsPage() {
  const { assessmentHistory, activeAnalysisResult } = useApp();
  const [serverAssessments, setServerAssessments] = useState([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadAssessments() {
      try {
        const data = await assessmentService.getAssessments();
        if (Array.isArray(data)) {
          setServerAssessments(data);
        }
      } catch (err) {
        showToast('Failed to load assessment history.', 'error');
      }
    }
    loadAssessments();
  }, [showToast]);

  const allAssessments = useMemo(() => {
    const map = new Map();
    // 1. Add records from server
    (serverAssessments || []).forEach(item => map.set(item.id, item));
    // 2. Add records from AppContext assessmentHistory
    (assessmentHistory || []).forEach(item => map.set(item.id, item));
    
    // Sort in reverse chronological order (newest first)
    return Array.from(map.values()).sort((a, b) => {
      const timeA = new Date(a.timestamp || a.date).getTime() || 0;
      const timeB = new Date(b.timestamp || b.date).getTime() || 0;
      return timeB - timeA;
    });
  }, [serverAssessments, assessmentHistory]);

  const handlePrintAudit = (audit) => {
    reportService.printAuditReport(
      {
        id: `REP-${audit.id}`,
        auditId: audit.id,
        title: `${audit.name} — Cryptographic Audit Report`,
        targetFile: audit.name,
        score: audit.score,
        threatLevel: audit.score >= 80 ? 'GUARD: ACTIVE' : 'ELEVATED RISK',
        updatedAt: audit.date
      },
      activeAnalysisResult?.fileName === audit.name ? activeAnalysisResult : null,
      allAssessments
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#17212B] dark:text-[#E8EAED]">
      {/* Header */}
      <div className="pb-4 border-b border-[#D9DEE5] dark:border-[#363A3F]">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F6B76] dark:text-[#777E86] font-bold block mb-1">
          CRYPTOGRAPHIC COMPLIANCE
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17212B] dark:text-[#E8EAED]">
          Security Assessments
        </h2>
        <p className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] mt-1">
          Comprehensive compliance benchmarks against NIST SP 800-77, PCI-DSS, and cryptographic health records.
        </p>
      </div>

      {/* Summary Stats */}
      <AssessmentStats assessments={allAssessments} />

      {/* History Table */}
      <AssessmentTable
        assessments={allAssessments}
        onRunNewScan={(audit) => {
          if (audit && audit.id) {
            handlePrintAudit(audit);
          } else {
            navigate('/analyze-pcap');
          }
        }}
      />
    </div>
  );
}

export default AssessmentsPage;

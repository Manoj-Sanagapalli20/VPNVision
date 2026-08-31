import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { pcapService } from '../services/pcapService';

export function DashboardPage() {
  const { telemetry, activeAnalysisResult, setActiveAnalysisResult } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('2 minutes ago');

  useEffect(() => {
    // If no analysis is loaded into memory yet, fetch the latest from server
    if (!activeAnalysisResult) {
      pcapService.getLatestResult().then((data) => {
        if (data && data.extractedFeatures) {
          setActiveAnalysisResult(data);
        }
      }).catch((err) => {
        console.warn('Could not fetch latest analysis:', err.message);
      });
    }
  }, [activeAnalysisResult, setActiveAnalysisResult]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await pcapService.getLatestResult();
      if (data && data.extractedFeatures) {
        setActiveAnalysisResult(data);
      }
      setLastUpdated('Just now');
    } catch (e) {
      console.warn('Refresh error:', e);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 400);
    }
  };

  const features = activeAnalysisResult?.extractedFeatures;
  const score = activeAnalysisResult ? activeAnalysisResult.securityScore : 0;
  const cryptoScore = activeAnalysisResult?.breakdown?.crypto ?? 0;
  const complianceScore = activeAnalysisResult?.breakdown?.compliance ?? 0;
  const anomalyScore = activeAnalysisResult?.breakdown?.anomaly ?? 0;

  const totalRules = (activeAnalysisResult?.counts?.passed || 0) +
    (activeAnalysisResult?.counts?.high || 0) +
    (activeAnalysisResult?.counts?.critical || 0) +
    (activeAnalysisResult?.counts?.medium || 0);

  const riskPct = totalRules > 0
    ? Math.round(((activeAnalysisResult.counts.critical || 0) / totalRules) * 100)
    : 8;
  const reviewPct = totalRules > 0
    ? Math.round(((activeAnalysisResult.counts.high || 0) / totalRules) * 100)
    : 17;
  const securePct = totalRules > 0
    ? Math.max(0, 100 - (riskPct + reviewPct))
    : 75;

  const topFindings = activeAnalysisResult?.ruleFindings && activeAnalysisResult.ruleFindings.length > 0
    ? activeAnalysisResult.ruleFindings.slice(0, 5)
    : [];

  const scoreCircumference = 251.3;
  const scoreOffset = scoreCircumference - (score / 100) * scoreCircumference;

  const cryptoCircumference = 238.7;
  const cryptoOffset = cryptoCircumference - (cryptoScore / 100) * cryptoCircumference;

  const complianceCircumference = 238.7;
  const complianceOffset = complianceCircumference - (complianceScore / 100) * complianceCircumference;

  const anomalyCircumference = 238.7;
  const anomalyOffset = anomalyCircumference - (anomalyScore / 100) * anomalyCircumference;

  const mlFlows = activeAnalysisResult?.mlFlows || [];
  
  const aggregatedStats = useMemo(() => {
    if (mlFlows.length === 0) return null;
    const counts = {};
    mlFlows.forEach(f => {
      if (f.aiResult) {
        let cls = f.aiResult.classification;
        if (f.aiResult.anomalyScore >= 95) {
          cls = "UNKNOWN (Anomaly)";
        }
        counts[cls] = (counts[cls] || 0) + 1;
      }
    });
    const validCount = mlFlows.filter(f => f.aiResult).length;
    if (validCount === 0) return null;
    
    const colors = [
      { stroke: "#8b5cf6", darkStroke: "dark:stroke-[#a78bfa]", bg: "bg-[#8b5cf6]", darkBg: "dark:bg-[#a78bfa]" },
      { stroke: "#2563eb", darkStroke: "dark:stroke-[#60a5fa]", bg: "bg-[#2563eb]", darkBg: "dark:bg-[#60a5fa]" },
      { stroke: "#0284c7", darkStroke: "dark:stroke-[#38bdf8]", bg: "bg-[#0284c7]", darkBg: "dark:bg-[#38bdf8]" },
      { stroke: "#94a3b8", darkStroke: "dark:stroke-[#64748b]", bg: "bg-[#94a3b8]", darkBg: "dark:bg-[#64748b]" },
      { stroke: "#f59e0b", darkStroke: "dark:stroke-[#fbbf24]", bg: "bg-[#f59e0b]", darkBg: "dark:bg-[#fbbf24]" }
    ];
    
    let currentOffset = 0;
    const items = Object.entries(counts)
      .map(([cls, count], idx) => {
        const pct = Math.round((count / validCount) * 100);
        return { label: cls, pct, count, color: colors[idx % colors.length] };
      })
      .sort((a, b) => b.pct - a.pct);
      
    const slices = items.map(item => {
      const dash = (item.pct / 100) * 251.3;
      const slice = { ...item, dash, offset: -currentOffset };
      currentOffset += dash;
      return slice;
    });
      
    return { slices };
  }, [mlFlows]);

  return (
    <div className="space-y-6 font-sans text-[#17212B] dark:text-[#E8EAED] max-w-[1600px] mx-auto pb-8 transition-colors duration-200">
      {/* ============================================================ */}
      {/* 1. TOP HEADER WITH THEME SWITCH                              */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17212B] dark:text-[#E8EAED] tracking-tight flex items-center gap-2">
            <span>Good evening, Analyst</span>
            <span className="inline-block animate-wave text-2xl">👋</span>
          </h1>
          <p className="text-sm text-[#5F6B76] dark:text-[#A7ADB4] font-normal mt-0.5">
            {activeAnalysisResult?.fileName ? (
              <span>Auditing analyzed PCAP: <strong className="text-[#17212B] dark:text-[#E8EAED]">{activeAnalysisResult.fileName}</strong> ({features?.totalPackets || 0} packets &bull; Cryptographic Score: <strong className="text-[#16a34a] dark:text-[#4ade80]">{cryptoScore}/100</strong>)</span>
            ) : (
              <span>Here's what's happening with your VPN security today.</span>
            )}
          </p>
        </div>

        {/* Right Status Control */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Last Analysis Refresh Pill */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] bg-[#FFFFFF] dark:bg-[#232629] px-3.5 py-1.5 rounded-lg border border-[#D9DEE5] dark:border-[#363A3F] shadow-2xs">
            <span>Last analysis: <strong className="text-[#17212B] dark:text-[#E8EAED]">{lastUpdated}</strong></span>
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh Analysis Data"
              className="p-0.5 text-[#8A949E] dark:text-[#777E86] hover:text-[#2563eb] dark:hover:text-[#E8EAED] transition-colors cursor-pointer"
            >
              <span className={`material-symbols-outlined text-base ${isRefreshing ? 'animate-spin text-[#2563eb] dark:text-[#60a5fa]' : ''}`}>
                refresh
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TOP 4 STATISTICS CARDS                                   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: VPNs / Frames Analyzed */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex items-center gap-4 hover:border-[#2563eb]/50 dark:hover:border-[#777E86] hover:shadow-sm transition-all">
          <div className="w-13 h-13 rounded-xl bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-[#2563eb] dark:text-[#60a5fa] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">monitor_heart</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-[#5F6B76] dark:text-[#A7ADB4] block truncate">
              {features?.totalPackets ? 'Captured Packets' : 'VPNs Analyzed'}
            </span>
            <span className="text-3xl font-extrabold text-[#17212B] dark:text-[#E8EAED] tracking-tight block">
              {features?.totalPackets || activeAnalysisResult?.telemetry?.pcapCount || '0'}
            </span>
            <span className="text-xs font-mono text-[#16a34a] dark:text-[#4ade80] font-semibold flex items-center gap-1 mt-0.5">
              <span>↑ Live audit active</span>
            </span>
          </div>
        </div>

        {/* Card 2: Secure / Passed Rules */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex items-center gap-4 hover:border-[#16a34a]/50 dark:hover:border-[#4ade80]/50 hover:shadow-sm transition-all">
          <div className="w-13 h-13 rounded-xl bg-[#F0FDF4] dark:bg-[#16291e] border border-[#BBF7D0] dark:border-[#22543d] text-[#16a34a] dark:text-[#4ade80] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-[#5F6B76] dark:text-[#A7ADB4] block truncate">
              Passed Checks
            </span>
            <span className="text-3xl font-extrabold text-[#17212B] dark:text-[#E8EAED] tracking-tight block">
              {activeAnalysisResult?.counts?.passed ?? 0}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] font-bold">
                {securePct}%
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-[#EEF2F6] dark:bg-[#1D2023] overflow-hidden">
                <div className="h-full bg-[#16a34a] dark:bg-[#4ade80] rounded-full" style={{ width: `${securePct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Needs Review / Warnings */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex items-center gap-4 hover:border-[#d97706]/50 dark:hover:border-[#fbbf24]/50 hover:shadow-sm transition-all">
          <div className="w-13 h-13 rounded-xl bg-[#FFFBEB] dark:bg-[#2e2315] border border-[#FDE68A] dark:border-[#4d3a1f] text-[#d97706] dark:text-[#fbbf24] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">assignment_late</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-[#5F6B76] dark:text-[#A7ADB4] block truncate">
              Warnings
            </span>
            <span className="text-3xl font-extrabold text-[#17212B] dark:text-[#E8EAED] tracking-tight block">
              {activeAnalysisResult?.counts?.high ?? 0}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] font-bold">{reviewPct}%</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#EEF2F6] dark:bg-[#1D2023] overflow-hidden">
                <div className="h-full bg-[#d97706] dark:bg-[#fbbf24] rounded-full" style={{ width: `${reviewPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: High Risk / Criticals */}
        <div className="p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex items-center gap-4 hover:border-[#dc2626]/50 dark:hover:border-[#f87171]/50 hover:shadow-sm transition-all">
          <div className="w-13 h-13 rounded-xl bg-[#FEF2F2] dark:bg-[#2e1818] border border-[#FECACA] dark:border-[#4c2424] text-[#dc2626] dark:text-[#f87171] flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-2xl">crisis_alert</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-[#5F6B76] dark:text-[#A7ADB4] block truncate">
              Critical Findings
            </span>
            <span className="text-3xl font-extrabold text-[#17212B] dark:text-[#E8EAED] tracking-tight block">
              {activeAnalysisResult?.counts?.critical ?? 0}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] font-bold">{riskPct}%</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#EEF2F6] dark:bg-[#1D2023] overflow-hidden">
                <div className="h-full bg-[#dc2626] dark:bg-[#f87171] rounded-full" style={{ width: `${riskPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. MIDDLE SECTION (3 Columns Grid)                          */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Middle Col 1: Overall Security Score (3 cols) */}
        <div className="lg:col-span-3 p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex flex-col items-center justify-between text-center min-h-[340px]">
          <h3 className="text-sm font-semibold text-[#17212B] dark:text-[#E8EAED] self-start">
            Overall Security Score
          </h3>

          {/* Large Circular Ring Indicator */}
          <div className="relative w-44 h-44 my-2 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-[#EEF2F6] dark:text-[#1D2023]"
              />
              {/* Score Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="251.3"
                strokeDashoffset={scoreOffset}
                strokeLinecap="round"
                className={`${score >= 80 ? 'text-[#16a34a] dark:text-[#4ade80]' : score >= 60 ? 'text-[#d97706] dark:text-[#fbbf24]' : 'text-[#dc2626] dark:text-[#f87171]'} transition-all duration-1000 ease-out`}
              />
            </svg>

            {/* Score in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-[#17212B] dark:text-[#E8EAED] tracking-tight">
                {score}
              </span>
              <span className="text-xs font-mono text-[#8A949E] dark:text-[#777E86] font-bold mt-0.5">
                /100
              </span>
            </div>
          </div>

          {/* Status Badge & Note */}
          <div className="space-y-1.5">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${score >= 80 ? 'bg-[#F0FDF4] dark:bg-[#16291e] border-[#BBF7D0] dark:border-[#22543d] text-[#15803D] dark:text-[#4ade80]' : score >= 60 ? 'bg-[#FFFBEB] dark:bg-[#2e2315] border-[#FDE68A] dark:border-[#4d3a1f] text-[#d97706] dark:text-[#fbbf24]' : 'bg-[#FEF2F2] dark:bg-[#2e1818] border-[#FECACA] dark:border-[#4c2424] text-[#dc2626] dark:text-[#f87171]'} border font-mono text-xs font-bold tracking-wide shadow-2xs`}>
              <span className="material-symbols-outlined text-sm font-bold">
                {score >= 80 ? 'verified' : score >= 60 ? 'warning' : 'crisis_alert'}
              </span>
              <span>{activeAnalysisResult?.threatLevel || (score >= 80 ? 'LOW RISK' : score >= 60 ? 'MEDIUM RISK' : 'HIGH RISK')}</span>
            </div>
            <p className="text-xs text-[#5F6B76] dark:text-[#A7ADB4]">
              {score >= 80 ? 'Your VPN security posture is good.' : 'Review recommended for flagged cryptographic controls.'}
            </p>
          </div>
        </div>

        {/* Middle Col 2: Security Breakdown & Risk Distribution (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex flex-col justify-between space-y-6">
          {/* Top Half: Security Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#17212B] dark:text-[#E8EAED]">
                Security Breakdown
              </h3>
              {activeAnalysisResult?.fileName && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-[#2563eb] dark:text-[#60a5fa] font-bold">
                  FROM PCAP ENGINE
                </span>
              )}
            </div>

            {/* 3 Circular Metrics Side by Side */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              {/* Metric 1: Cryptographic Security (From PCAP Rule Engine) */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#EEF2F6] dark:text-[#1D2023]" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="238.7"
                      strokeDashoffset={cryptoOffset}
                      strokeLinecap="round"
                      className={`${cryptoScore >= 80 ? 'text-[#16a34a] dark:text-[#4ade80]' : cryptoScore >= 60 ? 'text-[#d97706] dark:text-[#fbbf24]' : 'text-[#dc2626] dark:text-[#f87171]'} transition-all duration-1000 ease-out`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-[#17212B] dark:text-[#E8EAED]">{cryptoScore}</span>
                    <span className="text-[9px] font-mono text-[#8A949E] dark:text-[#777E86]">/100</span>
                  </div>
                </div>
                <span className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] font-medium leading-tight">
                  Cryptographic<br />Security
                </span>
              </div>

              {/* Metric 2: Configuration Compliance */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#EEF2F6] dark:text-[#1D2023]" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="238.7"
                      strokeDashoffset={complianceOffset}
                      strokeLinecap="round"
                      className="text-[#2563eb] dark:text-[#60a5fa] transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-[#17212B] dark:text-[#E8EAED]">{complianceScore}</span>
                    <span className="text-[9px] font-mono text-[#8A949E] dark:text-[#777E86]">/100</span>
                  </div>
                </div>
                <span className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] font-medium leading-tight">
                  Configuration<br />Compliance
                </span>
              </div>

              {/* Metric 3: Traffic Anomaly */}
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#EEF2F6] dark:text-[#1D2023]" />
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray="238.7"
                      strokeDashoffset={anomalyOffset}
                      strokeLinecap="round"
                      className={`${anomalyScore > 50 ? 'text-[#dc2626] dark:text-[#f87171]' : anomalyScore > 25 ? 'text-[#d97706] dark:text-[#fbbf24]' : 'text-[#8b5cf6] dark:text-[#a78bfa]'} transition-all duration-1000 ease-out`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-[#17212B] dark:text-[#E8EAED]">{anomalyScore}%</span>
                  </div>
                </div>
                <span className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] font-medium leading-tight">
                  Traffic<br />Anomaly
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Half: Risk Distribution */}
          <div className="pt-3 border-t border-[#EEF2F6] dark:border-[#282C30]">
            <h4 className="text-xs font-semibold text-[#17212B] dark:text-[#E8EAED] mb-2.5">
              Risk Distribution
            </h4>

            {/* Horizontal Multi-Segment Stacked Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#EEF2F6] dark:bg-[#1D2023] mb-3">
              <div className="h-full bg-[#16a34a] dark:bg-[#4ade80] transition-all duration-700" style={{ width: `${securePct}%` }} title={`Secure: ${securePct}%`} />
              <div className="h-full bg-[#d97706] dark:bg-[#fbbf24] transition-all duration-700" style={{ width: `${reviewPct}%` }} title={`Needs Review: ${reviewPct}%`} />
              <div className="h-full bg-[#dc2626] dark:bg-[#f87171] transition-all duration-700" style={{ width: `${riskPct}%` }} title={`High Risk: ${riskPct}%`} />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#4ade80]"></span>
                <span>{securePct}% Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d97706] dark:bg-[#fbbf24]"></span>
                <span>{reviewPct}% Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#dc2626] dark:bg-[#f87171]"></span>
                <span>{riskPct}% High Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Col 3: VPN Identification (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-[#17212B] dark:text-[#E8EAED] mb-4">
            VPN Identification
          </h3>

          <div className="space-y-3 font-sans text-xs flex-1 flex flex-col justify-around">
            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9] dark:border-[#282C30]">
              <span className="text-[#5F6B76] dark:text-[#A7ADB4]">Protocol</span>
              <span className="font-semibold text-[#17212B] dark:text-[#E8EAED]">
                {features ? (features.ikeVersion !== 'Not observed' || features.esp?.detected === 'Observed' ? 'IPsec' : 'Unknown') : 'IPsec'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9] dark:border-[#282C30]">
              <span className="text-[#5F6B76] dark:text-[#A7ADB4]">IKE Version</span>
              <span className="font-semibold text-[#17212B] dark:text-[#E8EAED]">
                {features?.ikeVersion || 'IKEv2'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9] dark:border-[#282C30]">
              <span className="text-[#5F6B76] dark:text-[#A7ADB4]">Mode</span>
              <span className="font-semibold text-[#17212B] dark:text-[#E8EAED]">
                {features?.ipsecMode?.mode || 'Tunnel'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9] dark:border-[#282C30]">
              <span className="text-[#5F6B76] dark:text-[#A7ADB4]">IP Version</span>
              <span className="font-semibold text-[#17212B] dark:text-[#E8EAED]">IPv4</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#F1F5F9] dark:border-[#282C30]">
              <span className="text-[#5F6B76] dark:text-[#A7ADB4]">ESP</span>
              <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                (features?.esp?.detected === 'Observed' || !features)
                  ? 'bg-[#F0FDF4] dark:bg-[#16291e] border border-[#BBF7D0] dark:border-[#22543d] text-[#15803D] dark:text-[#4ade80]'
                  : 'bg-[#F1F5F9] dark:bg-[#1D2023] border border-[#CBD5E1] dark:border-[#363A3F] text-[#64748B] dark:text-[#777E86]'
              }`}>
                {features ? (features.esp?.detected === 'Observed' ? 'Detected' : 'Not Detected') : 'Detected'}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#5F6B76] dark:text-[#A7ADB4]">AH</span>
              <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                features?.ah?.detected === 'Observed'
                  ? 'bg-[#F0FDF4] dark:bg-[#16291e] border border-[#BBF7D0] dark:border-[#22543d] text-[#15803D] dark:text-[#4ade80]'
                  : 'bg-[#F1F5F9] dark:bg-[#1D2023] border border-[#CBD5E1] dark:border-[#363A3F] text-[#64748B] dark:text-[#777E86]'
              }`}>
                {features ? (features.ah?.detected === 'Observed' ? 'Detected' : 'Not Detected') : 'Not Detected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. BOTTOM SECTION (3 Columns Grid)                          */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bottom Col 1: AI Traffic Classification (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-[#17212B] dark:text-[#E8EAED] mb-4">
            AI Traffic Classification
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 flex-1">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              {aggregatedStats ? (
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {aggregatedStats.slices.map((slice, i) => (
                    <circle
                      key={i}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={slice.color.stroke}
                      strokeWidth="16"
                      strokeDasharray={`${slice.dash} 251.3`}
                      strokeDashoffset={slice.offset}
                      className={slice.color.darkStroke}
                    />
                  ))}
                </svg>
              ) : (
                <div className="text-[#8A949E] dark:text-[#777E86] text-xs text-center font-mono p-4 border border-dashed border-[#D9DEE5] dark:border-[#363A3F] rounded-full w-24 h-24 flex items-center justify-center">
                  NO DATA
                </div>
              )}
            </div>

            {/* Legend & Percentages */}
            <div className="space-y-2.5 w-full font-mono text-xs">
              {aggregatedStats ? aggregatedStats.slices.slice(0,4).map((slice, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-sm ${slice.color.bg} ${slice.color.darkBg}`}></span>
                    <span className="text-[#17212B] dark:text-[#E8EAED] truncate max-w-[100px]" title={slice.label}>{slice.label}</span>
                  </div>
                  <span className="font-bold text-[#17212B] dark:text-[#E8EAED]">{slice.pct}%</span>
                </div>
              )) : (
                <div className="text-[#8A949E] dark:text-[#777E86]">Awaiting classification...</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Col 2: Traffic Anomaly (Timeline) (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex flex-col justify-between">
          {/* Header & Current Score Badge */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-[#17212B] dark:text-[#E8EAED]">
                Traffic Anomaly (Timeline)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#8A949E] dark:text-[#777E86] block">Current Score</span>
              <div className="flex items-baseline justify-end gap-1.5">
                <span className={`text-lg font-bold ${anomalyScore > 50 ? 'text-[#dc2626] dark:text-[#f87171]' : anomalyScore > 25 ? 'text-[#d97706] dark:text-[#fbbf24]' : 'text-[#16a34a] dark:text-[#4ade80]'}`}>
                  {anomalyScore}%
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase ${anomalyScore > 50 ? 'text-[#dc2626] dark:text-[#f87171]' : anomalyScore > 25 ? 'text-[#d97706] dark:text-[#fbbf24]' : 'text-[#16a34a] dark:text-[#4ade80]'}`}>
                  {anomalyScore > 50 ? 'CRITICAL' : anomalyScore > 25 ? 'ELEVATED' : 'NORMAL'}
                </span>
              </div>
            </div>
          </div>

          {/* SVG Waveform Chart with Grid & Threshold Line */}
          <div className="w-full pt-2">
            <svg viewBox="0 0 450 140" className="w-full h-36">
              <defs>
                <linearGradient id="anomalyWaveGradLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Axis Grid Lines */}
              <line x1="35" y1="15" x2="445" y2="15" stroke="currentColor" className="text-[#EEF2F6] dark:text-[#282C30]" strokeDasharray="3 3" />
              <text x="5" y="18" fill="currentColor" className="text-[#8A949E] dark:text-[#777E86]" fontSize="9" fontFamily="monospace">100%</text>

              {/* 75% Critical Threshold Line in Red */}
              <line x1="35" y1="42" x2="445" y2="42" stroke="currentColor" className="text-[#ef4444] dark:text-[#f87171]" strokeDasharray="3 3" strokeOpacity="0.7" />
              <text x="10" y="45" fill="currentColor" className="text-[#ef4444] dark:text-[#f87171]" fontSize="9" fontFamily="monospace">75%</text>

              <line x1="35" y1="70" x2="445" y2="70" stroke="currentColor" className="text-[#EEF2F6] dark:text-[#282C30]" strokeDasharray="3 3" />
              <text x="10" y="73" fill="currentColor" className="text-[#8A949E] dark:text-[#777E86]" fontSize="9" fontFamily="monospace">50%</text>

              <line x1="35" y1="98" x2="445" y2="98" stroke="currentColor" className="text-[#EEF2F6] dark:text-[#282C30]" strokeDasharray="3 3" />
              <text x="10" y="101" fill="currentColor" className="text-[#8A949E] dark:text-[#777E86]" fontSize="9" fontFamily="monospace">25%</text>

              <line x1="35" y1="125" x2="445" y2="125" stroke="currentColor" className="text-[#E2E8F0] dark:text-[#363A3F]" />
              <text x="15" y="128" fill="currentColor" className="text-[#8A949E] dark:text-[#777E86]" fontSize="9" fontFamily="monospace">0%</text>

              {/* Waveform Area Fill */}
              <path
                d="M 35,103 L 69,87 L 103,96 L 138,76 L 172,91 L 206,47 L 241,83 L 275,70 L 309,80 L 343,99 L 378,89 L 412,71 L 445,103 L 445,125 L 35,125 Z"
                fill="url(#anomalyWaveGradLight)"
              />

              {/* Cyan/Blue Waveform Stroke */}
              <path
                d="M 35,103 L 69,87 L 103,96 L 138,76 L 172,91 L 206,47 L 241,83 L 275,70 L 309,80 L 343,99 L 378,89 L 412,71 L 445,103"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#0284c7] dark:text-[#38bdf8]"
              />

              {/* Data Point Circles */}
              {[
                { cx: 35, cy: 103 },
                { cx: 69, cy: 87 },
                { cx: 103, cy: 96 },
                { cx: 138, cy: 76 },
                { cx: 172, cy: 91 },
                { cx: 206, cy: 47 },
                { cx: 241, cy: 83 },
                { cx: 275, cy: 70 },
                { cx: 309, cy: 80 },
                { cx: 343, cy: 99 },
                { cx: 378, cy: 89 },
                { cx: 412, cy: 71 },
                { cx: 445, cy: 103 }
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="2.5"
                  fill="currentColor"
                  className="text-[#0284c7] dark:text-[#38bdf8] hover:r-4 transition-all"
                />
              ))}
            </svg>

            {/* X-Axis Time Markers */}
            <div className="flex justify-between pl-8 pr-1 text-[9px] font-mono text-[#8A949E] dark:text-[#777E86] pt-1">
              <span>10:00</span>
              <span>10:15</span>
              <span>10:30</span>
              <span>10:45</span>
              <span>11:00</span>
            </div>
          </div>
        </div>

        {/* Bottom Col 3: Top Findings (3 cols) */}
        <div className="lg:col-span-3 p-6 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#17212B] dark:text-[#E8EAED]">
              Top Findings
            </h3>
            <Link
              to="/findings"
              className="text-xs font-semibold text-[#2563eb] dark:text-[#60a5fa] hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Findings List */}
          <div className="space-y-2.5 flex-1 flex flex-col justify-between font-sans text-xs">
            {topFindings.map((finding, idx) => {
              const sev = (finding.severity || 'INFO').toUpperCase();
              const isCrit = sev === 'CRITICAL';
              const isWarn = sev === 'WARNING' || sev === 'HIGH';
              const isPass = sev === 'PASS' || sev === 'PASSED';

              const dotColor = isCrit
                ? 'bg-[#ef4444] dark:bg-[#f87171]'
                : isWarn
                ? 'bg-[#f59e0b] dark:bg-[#fbbf24]'
                : isPass
                ? 'bg-[#16a34a] dark:bg-[#4ade80]'
                : 'bg-[#64748b] dark:bg-[#777E86]';

              const badgeColor = isCrit
                ? 'bg-[#FEF2F2] dark:bg-[#2e1818] border-[#FECACA] dark:border-[#4c2424] text-[#dc2626] dark:text-[#f87171]'
                : isWarn
                ? 'bg-[#FFFBEB] dark:bg-[#2e2315] border-[#FDE68A] dark:border-[#4d3a1f] text-[#d97706] dark:text-[#fbbf24]'
                : isPass
                ? 'bg-[#F0FDF4] dark:bg-[#16291e] border-[#BBF7D0] dark:border-[#22543d] text-[#15803D] dark:text-[#4ade80]'
                : 'bg-[#F1F5F9] dark:bg-[#1D2023] border-[#CBD5E1] dark:border-[#363A3F] text-[#475569] dark:text-[#A7ADB4]';

              return (
                <div key={idx} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></span>
                    <span className="text-[#17212B] dark:text-[#E8EAED] truncate" title={finding.title}>
                      {finding.title}
                    </span>
                  </div>
                  <span className={`w-5 h-5 rounded-md border font-mono text-xs font-bold flex items-center justify-center shrink-0 ${badgeColor}`}>
                    1
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

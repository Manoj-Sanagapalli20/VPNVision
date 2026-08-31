import React, { useState, useEffect, useMemo } from 'react';
import { findingsService } from '../services/findingsService';
import { FindingsSummary } from '../components/findings/FindingsSummary';
import { FindingsToolbar } from '../components/findings/FindingsToolbar';
import { FindingCard } from '../components/findings/FindingCard';
import { useToast } from '../hooks/useToast';
import { useApp } from '../context/AppContext';
import { DEFAULT_FINDINGS } from '../utils/constants';

export function FindingsPage() {
  const { activeAnalysisResult } = useApp();
  const [serverFindings, setServerFindings] = useState([]);
  const [activeSeverity, setActiveSeverity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Severity');
  const { showToast } = useToast();

  useEffect(() => {
    async function loadFindings() {
      try {
        const data = await findingsService.getFindings();
        if (data && Array.isArray(data) && data.length > 0) {
          setServerFindings(data);
        }
      } catch (err) {
        console.warn('Using default findings fallback:', err.message);
      }
    }
    loadFindings();
  }, []);

  // Source of truth: if analysis has run, activeAnalysisResult.ruleFindings is used.
  const activeFindings = useMemo(() => {
    if (activeAnalysisResult && activeAnalysisResult.ruleFindings && activeAnalysisResult.ruleFindings.length > 0) {
      return activeAnalysisResult.ruleFindings;
    }
    if (serverFindings && serverFindings.length > 0) {
      return serverFindings;
    }
    return DEFAULT_FINDINGS;
  }, [activeAnalysisResult, serverFindings]);

  const handleSelectSeverity = (severityKey) => {
    if (activeSeverity === severityKey) {
      setActiveSeverity(null);
    } else {
      setActiveSeverity(severityKey);
    }
  };

  // Filtered and sorted findings
  const filteredFindings = useMemo(() => {
    const list = activeFindings.filter((item) => {
      const sev = (item.severity || 'INFO').toLowerCase();
      let matchesSeverity = true;
      if (activeSeverity) {
        const act = activeSeverity.toLowerCase();
        if (act === 'warning' || act === 'high') {
          matchesSeverity = sev === 'warning' || sev === 'high';
        } else if (act === 'pass' || act === 'passed') {
          matchesSeverity = sev === 'pass' || sev === 'passed';
        } else if (act === 'info' || act === 'medium') {
          matchesSeverity = sev === 'info' || sev === 'medium';
        } else {
          matchesSeverity = sev === act;
        }
      }

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.ruleId && item.ruleId.toLowerCase().includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q)) ||
        (item.feature && item.feature.toLowerCase().includes(q)) ||
        (item.observedValue && item.observedValue.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.explanation && item.explanation.toLowerCase().includes(q)) ||
        (item.evidence && item.evidence.toLowerCase().includes(q));

      return matchesSeverity && matchesSearch;
    });

    return list.sort((a, b) => {
      if (sortBy === 'Severity') {
        const order = { CRITICAL: 1, WARNING: 2, HIGH: 2, INFO: 3, MEDIUM: 3, PASS: 4, PASSED: 4 };
        const sevA = order[(a.severity || 'INFO').toUpperCase()] || 5;
        const sevB = order[(b.severity || 'INFO').toUpperCase()] || 5;
        return sevA - sevB;
      } else if (sortBy === 'ID') {
        const idA = a.ruleId || a.id || '';
        const idB = b.ruleId || b.id || '';
        return idA.localeCompare(idB);
      } else if (sortBy === 'Protocol') {
        const catA = a.category || a.feature || '';
        const catB = b.category || b.feature || '';
        return catA.localeCompare(catB);
      }
      return 0;
    });
  }, [activeFindings, activeSeverity, searchQuery, sortBy]);

  const counts = useMemo(() => {
    return {
      critical: activeFindings.filter((f) => (f.severity || '').toLowerCase() === 'critical').length,
      high: activeFindings.filter((f) => {
        const s = (f.severity || '').toLowerCase();
        return s === 'warning' || s === 'high';
      }).length,
      medium: activeFindings.filter((f) => {
        const s = (f.severity || '').toLowerCase();
        return s === 'info' || s === 'medium';
      }).length,
      passed: activeFindings.filter((f) => {
        const s = (f.severity || '').toLowerCase();
        return s === 'pass' || s === 'passed';
      }).length
    };
  }, [activeFindings]);

  return (
    <div className="space-y-6 font-sans text-[#17212B] dark:text-[#E8EAED] max-w-[1600px] mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D9DEE5] dark:border-[#363A3F]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F6B76] dark:text-[#777E86] font-bold block">
              DETERMINISTIC RULE ENGINE
            </span>
            {activeAnalysisResult?.fileName && (
              <span className="px-2 py-0.5 rounded bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-[10px] font-mono text-[#2563eb] dark:text-[#E8EAED] font-bold">
                TRACE: {activeAnalysisResult.fileName}
              </span>
            )}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17212B] dark:text-[#E8EAED]">
            Security Rule Findings
          </h2>
          <p className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] mt-1">
            Auditable security rule findings generated directly from extracted packet evidence without guessing or fabrication.
          </p>
        </div>

        {activeAnalysisResult && (
          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
            <div className="px-3.5 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-2xs">
              <span>POSTURE SCORE: <strong className="text-[#2563eb] dark:text-[#60a5fa]">{activeAnalysisResult.securityScore}/100</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Four Summary Cards in a Horizontal Row */}
      <FindingsSummary
        counts={counts}
        activeSeverity={activeSeverity}
        onSelectSeverity={handleSelectSeverity}
      />

      {/* Toolbar */}
      <FindingsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeSeverity={activeSeverity}
        onClearFilter={() => setActiveSeverity(null)}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFFFF] dark:bg-[#232629] rounded-xl border border-[#D9DEE5] dark:border-[#363A3F] text-[#8A949E] dark:text-[#777E86] font-mono text-xs shadow-xs">
            No security findings matching active query ("{searchQuery || activeSeverity}").
          </div>
        ) : (
          filteredFindings.map((finding, idx) => (
            <FindingCard key={finding.ruleId ? `${finding.ruleId}_${idx}` : finding.id || idx} finding={finding} />
          ))
        )}
      </div>
    </div>
  );
}

export default FindingsPage;

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { telemetryService } from '../services/telemetryService';
import { DEFAULT_TELEMETRY } from '../utils/constants';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [telemetry, setTelemetry] = useState(DEFAULT_TELEMETRY);
  const [telemetryLoading, setTelemetryLoading] = useState(false);
  const [activeAnalysisResult, setActiveAnalysisResultState] = useState(() => {
    try {
      const saved = localStorage.getItem('vpn_vision_latest_analysis');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [assessmentHistory, setAssessmentHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('vpn_vision_all_assessments');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const recordAssessment = useCallback((result) => {
    if (!result) return;
    const rawId = result.id || `AUD_${Date.now()}`;
    const auditId = rawId.startsWith('AUD-') ? rawId : `AUD-${rawId.slice(-6).toUpperCase()}`;
    
    const record = {
      id: auditId,
      name: result.fileName || 'Uploaded Capture Audit',
      type: `${result.extractedFeatures?.ikeVersion || 'IPsec'} Protocol Audit`,
      packets: `${result.extractedFeatures?.totalPackets || 0} packets`,
      date: result.timestamp ? new Date(result.timestamp).toLocaleString() : new Date().toLocaleString(),
      score: result.securityScore ?? 0,
      status: (result.securityScore ?? 0) >= 80 ? 'Compliant' : 'Action Required',
      criticalCount: result.counts?.critical || 0,
      highCount: result.counts?.high || 0,
      mediumCount: result.counts?.medium || 0,
      timestamp: result.timestamp || new Date().toISOString()
    };

    setAssessmentHistory((prev) => {
      const exists = prev.some(a => a.id === record.id || (a.name === record.name && Math.abs(new Date(a.timestamp || 0) - new Date(record.timestamp)) < 2000));
      const updated = exists ? prev.map(a => a.id === record.id ? record : a) : [record, ...prev];
      try {
        localStorage.setItem('vpn_vision_all_assessments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    // Also sync to backend
    fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).catch(() => {});
  }, []);

  const setActiveAnalysisResult = useCallback((result) => {
    setActiveAnalysisResultState(result);
    try {
      if (result) {
        localStorage.setItem('vpn_vision_latest_analysis', JSON.stringify(result));
        if (result.telemetry) {
          setTelemetry(result.telemetry);
        }
        recordAssessment(result);
      } else {
        localStorage.removeItem('vpn_vision_latest_analysis');
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [recordAssessment]);

  // Sync assessments from server on mount
  useEffect(() => {
    fetch('/api/assessments')
      .then(res => res.ok ? res.json() : [])
      .then(serverAssessments => {
        if (Array.isArray(serverAssessments) && serverAssessments.length > 0) {
          setAssessmentHistory(prev => {
            const map = new Map();
            // Put server records
            serverAssessments.forEach(item => map.set(item.id, item));
            // Put local records
            prev.forEach(item => {
              if (!map.has(item.id)) map.set(item.id, item);
            });
            const merged = Array.from(map.values()).sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
            try {
              localStorage.setItem('vpn_vision_all_assessments', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(() => {});
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshTelemetry = useCallback(async () => {
    try {
      setTelemetryLoading(true);
      const data = await telemetryService.getTelemetry();
      if (data) {
        setTelemetry(data);
      }
    } catch (err) {
      console.warn('Telemetry fetch error:', err.message);
    } finally {
      setTelemetryLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTelemetry();
  }, [refreshTelemetry]);

  return (
    <AppContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        isSyncing,
        setIsSyncing,
        telemetry,
        telemetryLoading,
        refreshTelemetry,
        activeAnalysisResult,
        setActiveAnalysisResult,
        assessmentHistory,
        recordAssessment
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;

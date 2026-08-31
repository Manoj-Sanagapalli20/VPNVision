import React, { useState, useEffect, useMemo } from 'react';
import { trafficService } from '../services/trafficService';
import { ConfidenceCard, AnomalyGauge } from '../components/traffic/ConfidenceCard';
import { TrafficClassification, FlowChart } from '../components/traffic/TrafficClassification';
import { PayloadLog } from '../components/traffic/PayloadLog';
import { useToast } from '../hooks/useToast';
import { useApp } from '../context/AppContext';

export function TrafficAIPage() {
  const { activeAnalysisResult } = useApp();
  const [trafficData, setTrafficData] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await trafficService.getTrafficData();
        setTrafficData(data);
      } catch (err) {
        showToast('Failed to fetch traffic intelligence data.', 'error');
      }
    }
    loadData();
  }, [showToast]);

  const anomalyScore = activeAnalysisResult?.breakdown?.anomaly ?? trafficData?.anomalyScore ?? 18;

  // Real payload logs from active capture flows if available
  const payloadLogs = useMemo(() => {
    if (activeAnalysisResult && activeAnalysisResult.mlFlows && activeAnalysisResult.mlFlows.length > 0) {
      return activeAnalysisResult.mlFlows.slice(0, 10).map((f, idx) => {
        const ai = f.aiResult;
        let verdict = 'Unknown';
        if (ai) {
          if (ai.anomalyScore >= 95) {
            verdict = `UNKNOWN / ANOMALOUS`;
          } else {
            verdict = `${ai.classification} (${ai.confidence}%)`;
          }
        }
        return {
          id: `FLOW-${idx + 1}`,
          time: new Date().toLocaleTimeString(),
          src: f.metadata.srcIp,
          dst: f.metadata.dstIp,
          proto: f.metadata.protocol,
          size: `${f.metadata.packetCount} pkts`,
          entropy: ai ? (ai.anomalyStatus === 'ANOMALY' ? `Anom: ${ai.anomalyScore}` : `Norm: ${ai.anomalyScore}`) : 'N/A',
          verdict: verdict
        };
      });
    } else if (activeAnalysisResult && activeAnalysisResult.flows && activeAnalysisResult.flows.length > 0) {
      return activeAnalysisResult.flows.slice(0, 5).map((f, idx) => ({
        id: `PKT-${9901 + idx}`,
        time: new Date().toLocaleTimeString(),
        src: f.src,
        dst: f.dst,
        proto: f.protocol === 'ESP' ? `ESP (50)` : f.protocol === 'ISAKMP' ? `UDP/500` : f.protocol,
        size: `${Math.round(f.bytes / f.packetCount)} B`,
        entropy: f.entropy ? f.entropy.toFixed(3) : 'N/A',
        verdict: f.protocol.includes('ESP') ? 'Normal ESP' : f.protocol.includes('ISAKMP') ? 'IKE Signaling' : 'Data Flow'
      }));
    }
    return trafficData?.payloadLogs;
  }, [activeAnalysisResult, trafficData]);

  const mlFlows = activeAnalysisResult?.mlFlows || [];
  
  const aggregatedStats = useMemo(() => {
    if (mlFlows.length === 0) return null;
    
    let totalConf = 0;
    const counts = {};
    mlFlows.forEach(f => {
      if (f.aiResult) {
        totalConf += f.aiResult.confidence;
        let cls = f.aiResult.classification;
        if (f.aiResult.anomalyScore >= 95) {
          cls = "UNKNOWN (Anomaly)";
        }
        counts[cls] = (counts[cls] || 0) + 1;
      }
    });
    
    const validCount = mlFlows.filter(f => f.aiResult).length;
    if (validCount === 0) return null;
    
    const avgConfidence = totalConf / validCount;
    
    const colors = [
      "bg-[#8b5cf6] dark:bg-[#a78bfa]",
      "bg-[#2563eb] dark:bg-[#60a5fa]",
      "bg-[#0284c7] dark:bg-[#38bdf8]",
      "bg-[#f59e0b] dark:bg-[#fbbf24]",
      "bg-[#ef4444] dark:bg-[#f87171]"
    ];
    
    const items = Object.entries(counts)
      .map(([cls, count], idx) => ({
        label: cls + " (ML Classification)",
        percentage: Math.round((count / validCount) * 100),
        color: colors[idx % colors.length]
      }))
      .sort((a, b) => b.percentage - a.percentage);
      
    return { items, avgConfidence };
  }, [mlFlows]);

  return (
    <div className="space-y-6 font-sans text-[#17212B] dark:text-[#E8EAED]">
      {/* Header */}
      <div className="pb-4 border-b border-[#D9DEE5] dark:border-[#363A3F]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F6B76] dark:text-[#777E86] font-bold block">
            NEURAL NETWORK CLASSIFIER
          </span>
          {activeAnalysisResult?.fileName && (
            <span className="px-2 py-0.5 rounded bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-[10px] font-mono text-[#2563eb] dark:text-[#E8EAED] font-bold">
              CAPTURE: {activeAnalysisResult.fileName}
            </span>
          )}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17212B] dark:text-[#E8EAED]">
          Traffic Intelligence
        </h2>
        <p className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] mt-1">
          Shannon entropy profiling and deep learning inference on encrypted ESP tunnel streams.
        </p>
      </div>

      {/* Top AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConfidenceCard confidence={aggregatedStats?.avgConfidence ?? trafficData?.confidence ?? 0} />
        <AnomalyGauge score={anomalyScore} />
      </div>

      {/* Flow Dynamics & Classification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrafficClassification items={aggregatedStats?.items} />
        <FlowChart points={trafficData?.flowDynamics} />
      </div>

      {/* Live Payload Stream Log */}
      <PayloadLog logs={payloadLogs} />
    </div>
  );
}

export default TrafficAIPage;

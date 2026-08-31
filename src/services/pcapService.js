import { request } from './api';
import { parsePcapBuffer, extractSecurityFeatures } from '../utils/pcapEngine';
import { evaluateSecurityRules } from '../utils/securityRules';

export const pcapService = {
  async uploadAndAnalyze(file) {
    const formData = new FormData();
    formData.append('pcap', file);

    return request('/api/upload', {
      method: 'POST',
      body: formData
    });
  },

  async getStatus(taskId) {
    return request(`/api/analysis/status/${taskId}`);
  },

  async getLatestResult() {
    return request('/api/analysis/result');
  },

  async analyzeClientBuffer(file) {
    const arrayBuffer = await file.arrayBuffer();
    const packets = parsePcapBuffer(new Uint8Array(arrayBuffer));
    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const features = extractSecurityFeatures(packets, file.name, fileSizeMb);
    const evaluation = evaluateSecurityRules(features);

    return {
      id: `local_${Date.now()}`,
      fileName: file.name,
      fileSize: fileSizeMb,
      timestamp: new Date().toISOString(),
      extractedFeatures: features,
      ruleFindings: evaluation.findings,
      securityScore: evaluation.score,
      threatLevel: evaluation.threatLevel,
      breakdown: evaluation.breakdown,
      counts: evaluation.counts,
      flows: features.flows,
      telemetry: {
        score: evaluation.score,
        threatLevel: evaluation.threatLevel,
        pcapCount: 1,
        secureCount: evaluation.score >= 80 ? 1 : 0,
        reviewCount: evaluation.score >= 60 && evaluation.score < 80 ? 1 : 0,
        riskCount: evaluation.score < 60 ? 1 : 0,
        classification: {
          video: 72,
          web: 18,
          voip: 7,
          other: 3
        }
      }
    };
  }
};

export default pcapService;

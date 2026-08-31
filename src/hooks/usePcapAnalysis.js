import { useState, useRef, useEffect, useCallback } from 'react';
import { pcapService } from '../services/pcapService';
import { formatBytes } from '../utils/formatters';
import { useToast } from './useToast';
import { useApp } from '../context/AppContext';

export function usePcapAnalysis(onComplete) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'selected' | 'analyzing' | 'completed' | 'error'
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [stepsState, setStepsState] = useState({});
  const [currentStep, setCurrentStep] = useState(null);
  const [missingSteps, setMissingSteps] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const pollIntervalRef = useRef(null);

  const { showToast } = useToast();
  const { refreshTelemetry, setActiveAnalysisResult } = useApp();

  const handleSelectFile = useCallback((file) => {
    if (!file) return;
    setSelectedFile(file);
    setFileName(file.name);
    setFileSize(formatBytes(file.size));
    setStatus('selected');
    setStepsState({});
    setCurrentStep(null);
    setMissingSteps([]);
    setAnalysisResult(null);
  }, []);

  const reset = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setSelectedFile(null);
    setFileName('');
    setFileSize('');
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    setTaskId(null);
    setStepsState({});
    setCurrentStep(null);
    setMissingSteps([]);
    setAnalysisResult(null);
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!selectedFile) return;

    setStatus('analyzing');
    setProgress(0);
    setLogs([
      {
        text: `> INGEST: Queued ${selectedFile.name} (${formatBytes(selectedFile.size)}) for binary dissection`,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setStepsState({
      file_validation: 'in_progress'
    });
    setCurrentStep('file_validation');
    setMissingSteps([]);

    try {
      const data = await pcapService.uploadAndAnalyze(selectedFile);
      if (data && data.taskId) {
        setTaskId(data.taskId);
      } else {
        // Fallback to in-browser local parsing engine if server doesn't provide taskId
        const localResult = await pcapService.analyzeClientBuffer(selectedFile);
        setAnalysisResult(localResult);
        setActiveAnalysisResult(localResult);
        setStatus('completed');
        setProgress(100);
        setStepsState({
          file_validation: 'completed',
          packet_extraction: 'completed',
          ipsec_detection: 'completed',
          ike_analysis: 'completed',
          security_assessment: 'completed',
          flow_extraction: 'completed',
          ai_analysis: 'completed',
          risk_calculation: 'completed',
          analysis_complete: 'completed'
        });
        setCurrentStep('analysis_complete');
        if (onComplete) onComplete(localResult);
      }
    } catch (err) {
      // If server upload failed, attempt client-side binary parse
      try {
        const localResult = await pcapService.analyzeClientBuffer(selectedFile);
        setAnalysisResult(localResult);
        setActiveAnalysisResult(localResult);
        setStatus('completed');
        setProgress(100);
        setStepsState({
          file_validation: 'completed',
          packet_extraction: 'completed',
          ipsec_detection: 'completed',
          ike_analysis: 'completed',
          security_assessment: 'completed',
          flow_extraction: 'completed',
          ai_analysis: 'completed',
          risk_calculation: 'completed',
          analysis_complete: 'completed'
        });
        setCurrentStep('analysis_complete');
        setLogs(prev => [
          ...prev,
          { text: `> CLIENT PARSER: Successfully analyzed ${localResult.extractedFeatures.totalPackets} packets`, timestamp: new Date().toLocaleTimeString() }
        ]);
        if (onComplete) onComplete(localResult);
      } catch (clientErr) {
        showToast('Capture file validation error: ' + (err.message || clientErr.message), 'error');
        setStatus('error');
        setStepsState({
          file_validation: 'error'
        });
        setLogs(prev => [
          ...prev,
          { text: `[!] ERROR: ${clientErr.message || err.message}`, color: 'text-[#ef4444]', timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    }
  }, [selectedFile, showToast, setActiveAnalysisResult, onComplete]);

  // Polling effect for server step-by-step pipeline updates
  useEffect(() => {
    if (!taskId || status !== 'analyzing') return;

    let renderedLogsCount = 0;

    pollIntervalRef.current = setInterval(async () => {
      try {
        const task = await pcapService.getStatus(taskId);
        if (!task) return;

        if (task.error) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setStatus('error');
          showToast(`Pipeline Error: ${task.error}`, 'error');
          if (task.stepsState) {
            setStepsState({ ...task.stepsState });
          }
          if (task.logs) {
            setLogs([...task.logs]);
          }
          return;
        }

        setProgress(task.progress || 0);

        if (task.stepsState) {
          setStepsState({ ...task.stepsState });
        }

        if (task.currentStep) {
          setCurrentStep(task.currentStep);
        }

        if (task.missingSteps && task.missingSteps.length > 0) {
          setMissingSteps([...task.missingSteps]);
        }

        if (task.logs && task.logs.length > renderedLogsCount) {
          setLogs([...task.logs]);
          renderedLogsCount = task.logs.length;
        }

        if (task.completed) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
          setStatus('completed');
          
          if (task.analysisResult) {
            setAnalysisResult(task.analysisResult);
            setActiveAnalysisResult(task.analysisResult);
          }

          refreshTelemetry();

          if (onComplete) {
            onComplete(task.analysisResult);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 300);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [taskId, status, onComplete, refreshTelemetry, setActiveAnalysisResult, showToast]);

  return {
    selectedFile,
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
  };
}

export default usePcapAnalysis;

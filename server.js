import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { parsePcapBuffer, extractSecurityFeatures } from './src/utils/pcapEngine.js';
import { evaluateSecurityRules } from './src/utils/securityRules.js';
import { extractFlowFeatures } from './src/utils/flowFeatureExtractor.js';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Setup upload middleware for PCAP uploads (store in memory for instant processing)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve built React assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory session store & analysis state
const sessionStore = {
  activeSession: null
};

const analysisTasks = {};
let latestAnalysisResult = null;
const completedAssessments = [];

// =========================================================
// API ENDPOINTS
// =========================================================

// 1. Auth Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  const username = email.split('@')[0];
  const user = {
    email,
    username: username.charAt(0).toUpperCase() + username.slice(1),
    role: 'Level 4 Operator',
    token: `token_${Date.now()}`
  };
  sessionStore.activeSession = user;
  
  res.json({ message: 'Login successful', user });
});

// 2. Auth Register / Create Account
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, org } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  
  const user = {
    email,
    username: name || email.split('@')[0],
    organization: org || 'Command Center',
    role: 'Level 4 Operator',
    token: `token_${Date.now()}`
  };
  sessionStore.activeSession = user;
  
  res.json({ message: 'Account created successfully', user });
});

// 3. Telemetry Stats
app.get('/api/telemetry', (req, res) => {
  if (latestAnalysisResult && latestAnalysisResult.telemetry) {
    res.json(latestAnalysisResult.telemetry);
  } else {
    res.json({
      score: 0,
      threatLevel: "AWAITING PCAP",
      pcapCount: 0,
      secureCount: 0,
      reviewCount: 0,
      riskCount: 0
    });
  }
});

// 4. File Upload (PCAP Step-by-Step Analysis Ingestion)
app.post('/api/upload', upload.single('pcap'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PCAP file uploaded.' });
  }

  const taskId = `task_${Date.now()}`;
  const fileName = req.file.originalname;
  const fileSizeMb = (req.file.size / (1024 * 1024)).toFixed(2) + ' MB';

  // Initialize analysis task state in-memory
  analysisTasks[taskId] = {
    progress: 0,
    currentStep: 'file_validation',
    stepsState: {
      file_validation: 'in_progress',
      packet_extraction: 'pending',
      ipsec_detection: 'pending',
      ike_analysis: 'pending',
      security_assessment: 'pending',
      flow_extraction: 'pending',
      ai_analysis: 'pending',
      risk_calculation: 'pending',
      analysis_complete: 'pending'
    },
    missingSteps: [],
    logs: [],
    completed: false,
    error: null,
    fileName,
    fileSize: fileSizeMb,
    analysisResult: null
  };

  // Attempt real packet parsing immediately in worker routine
  let packets = [];
  let parseError = null;

  try {
    packets = parsePcapBuffer(req.file.buffer);
  } catch (err) {
    parseError = err.message;
  }

  // Step by step pipeline sequence execution
  const task = analysisTasks[taskId];

  // Pipeline Step Timings
  const stepDelays = {
    file_validation: 300,
    packet_extraction: 800,
    ipsec_detection: 1300,
    ike_analysis: 1800,
    security_assessment: 2300,
    flow_extraction: 2800,
    ai_analysis: 3300,
    risk_calculation: 3800,
    analysis_complete: 4300
  };

  // Step 1: File Validated
  setTimeout(() => {
    if (parseError) {
      task.stepsState.file_validation = 'error';
      task.error = parseError;
      task.logs.push({
        text: `[!] ERROR: PCAP Container Validation Failed - ${parseError}`,
        color: 'text-[#ef4444]',
        timestamp: new Date().toLocaleTimeString()
      });
      return;
    }

    task.progress = 12;
    task.stepsState.file_validation = 'completed';
    task.stepsState.packet_extraction = 'in_progress';
    task.currentStep = 'packet_extraction';
    task.logs.push({
      text: `> STEP 1/9: File Validated - Magic header intact, format: ${req.file.size} bytes`,
      color: null,
      timestamp: new Date().toLocaleTimeString()
    });
  }, stepDelays.file_validation);

  // Step 2: Packet Extraction
  setTimeout(() => {
    if (task.error) return;

    task.progress = 24;
    task.stepsState.packet_extraction = 'completed';
    task.stepsState.ipsec_detection = 'in_progress';
    task.currentStep = 'ipsec_detection';
    task.logs.push({
      text: `> STEP 2/9: Packet Extraction - Dissected ${packets.length} link-layer frames`,
      color: null,
      timestamp: new Date().toLocaleTimeString()
    });
  }, stepDelays.packet_extraction);

  // Step 3: IPsec Detection
  setTimeout(() => {
    if (task.error) return;

    const espCount = packets.filter(p => p.protocol === 'ESP' || p.protocol === 'ESP-UDP' || p.esp).length;
    const ahCount = packets.filter(p => p.protocol === 'AH' || p.ah).length;
    const ikeCount = packets.filter(p => p.ike || p.protocol === 'ISAKMP').length;

    task.progress = 36;
    task.stepsState.ipsec_detection = 'completed';
    task.stepsState.ike_analysis = 'in_progress';
    task.currentStep = 'ike_analysis';
    task.logs.push({
      text: `> STEP 3/9: IPsec Detection - ESP: ${espCount} frames, AH: ${ahCount} frames, IKE: ${ikeCount} frames`,
      color: null,
      timestamp: new Date().toLocaleTimeString()
    });
  }, stepDelays.ipsec_detection);

  // Step 4: IKE Analysis
  setTimeout(() => {
    if (task.error) return;

    const features = extractSecurityFeatures(packets, fileName, fileSizeMb);

    task.progress = 48;
    task.stepsState.ike_analysis = 'completed';
    task.stepsState.security_assessment = 'in_progress';
    task.currentStep = 'security_assessment';
    task.logs.push({
      text: `> STEP 4/9: IKE Analysis - Version: ${features.ikeVersion}, Transforms: ${features.encryption.algorithm}, DH: ${features.dhGroup.name}`,
      color: 'text-primary',
      timestamp: new Date().toLocaleTimeString()
    });
  }, stepDelays.ike_analysis);

  // Step 5: Security Assessment
  setTimeout(() => {
    if (task.error) return;

    const features = extractSecurityFeatures(packets, fileName, fileSizeMb);
    const evaluation = evaluateSecurityRules(features);

    task.progress = 60;
    task.stepsState.security_assessment = 'completed';
    task.stepsState.flow_extraction = 'in_progress';
    task.currentStep = 'flow_extraction';
    task.logs.push({
      text: `> STEP 5/9: Security Assessment - Evaluated ${evaluation.findings.length} deterministic security rules`,
      color: null,
      timestamp: new Date().toLocaleTimeString()
    });
  }, stepDelays.security_assessment);

  // Step 6: Flow Extraction
  setTimeout(() => {
    if (task.error) return;

    const features = extractSecurityFeatures(packets, fileName, fileSizeMb);
    const evaluation = evaluateSecurityRules(features);
    
    const flowFeaturesList = extractFlowFeatures(packets);
    
    task.progress = 72;
    task.stepsState.flow_extraction = 'completed';
    task.stepsState.ai_analysis = 'in_progress';
    task.currentStep = 'ai_analysis';
    
    task.logs.push({
      text: `> STEP 6/9: Flow Extraction - Extracted ${flowFeaturesList.length} bidirectional flows.`,
      color: null,
      timestamp: new Date().toLocaleTimeString()
    });

    const venvPython = path.join(__dirname, 'Flow_engine', 'venv', 'Scripts', 'python.exe');
    const pythonExe = fs.existsSync(venvPython) ? venvPython : 'python';

    let pythonProcess;
    try {
      pythonProcess = spawn(pythonExe, [
        path.join(__dirname, 'Flow_engine', 'inference.py')
      ]);
    } catch (spawnErr) {
      task.stepsState.ai_analysis = 'error';
      task.error = `Failed to spawn Python inference process: ${spawnErr.message}`;
      return;
    }

    let resultData = '';
    let errorData = '';

    pythonProcess.stdin.on('error', (err) => {
      console.warn('Python stdin stream error handled:', err.message);
    });

    pythonProcess.on('error', (err) => {
      console.error('Python spawn error:', err);
      task.stepsState.ai_analysis = 'error';
      task.error = `Python inference process error: ${err.message}`;
    });

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        task.stepsState.ai_analysis = 'error';
        task.error = `AI Inference failed: ${errorData || resultData || ('Exit code ' + code)}`;
        return;
      }

      try {
        const aiResults = JSON.parse(resultData);
        
        flowFeaturesList.forEach((flow, idx) => {
          if (aiResults[idx]) {
            flow.aiResult = aiResults[idx];
          }
        });

        let sumAnomaly = 0;
        let validAnomalyCount = 0;
        let anomalyCount = 0;
        aiResults.forEach(r => {
          if (r.anomalyScore >= 0) {
            sumAnomaly += r.anomalyScore;
            validAnomalyCount++;
          }
          if (r.anomalyStatus === 'ANOMALY') anomalyCount++;
        });

        let avgAnomaly = validAnomalyCount > 0 ? (sumAnomaly / validAnomalyCount) : 0;
        let finalAnomalyScore = Math.round(avgAnomaly);

        task.progress = 85;
        task.stepsState.ai_analysis = 'completed';
        task.stepsState.risk_calculation = 'in_progress';
        task.currentStep = 'risk_calculation';
        
        task.logs.push({
          text: `> STEP 7/9: AI Analysis - Inference complete. Avg anomaly score: ${finalAnomalyScore.toFixed(2)}`,
          color: 'text-[#2563eb]',
          timestamp: new Date().toLocaleTimeString()
        });

        setTimeout(() => {
          task.progress = 100;
          task.stepsState.risk_calculation = 'completed';
          task.stepsState.analysis_complete = 'completed';
          task.currentStep = 'analysis_complete';
          task.completed = true;

          const finalThreatLevel = finalAnomalyScore > 75 ? 'CRITICAL RISK' : (finalAnomalyScore > 40 ? 'ELEVATED RISK' : 'GUARD: ACTIVE');
          const finalSecurityScore = Math.max(0, Math.min(100, Math.round((evaluation.breakdown.crypto * 0.45) + (evaluation.breakdown.compliance * 0.35) + ((100 - finalAnomalyScore) * 0.20))));

          const dynamicTelemetry = {
            score: finalSecurityScore,
            threatLevel: finalThreatLevel,
            pcapCount: 1,
            secureCount: evaluation.counts.passed || 0,
            reviewCount: evaluation.counts.high || 0,
            riskCount: evaluation.counts.critical || 0
          };

          const result = {
            id: taskId,
            fileName,
            fileSize: fileSizeMb,
            timestamp: new Date().toISOString(),
            extractedFeatures: features,
            ruleFindings: evaluation.findings,
            securityScore: finalSecurityScore,
            threatLevel: finalThreatLevel,
            breakdown: { ...evaluation.breakdown, anomaly: finalAnomalyScore },
            counts: { ...evaluation.counts, anomalies: anomalyCount },
            flows: features.flows,
            mlFlows: flowFeaturesList,
            telemetry: dynamicTelemetry
          };

          latestAnalysisResult = result;
          task.analysisResult = result;

          const auditId = `AUD-${taskId.slice(-6).toUpperCase()}`;
          const assessmentRecord = {
            id: auditId,
            name: fileName,
            type: `${features.ikeVersion || 'IPsec'} Protocol Audit`,
            packets: `${features.totalPackets || 0} packets`,
            date: new Date().toLocaleString(),
            score: finalSecurityScore,
            status: finalSecurityScore >= 80 ? 'Compliant' : 'Action Required',
            criticalCount: evaluation.counts.critical || 0,
            highCount: evaluation.counts.high || 0,
            mediumCount: evaluation.counts.medium || 0,
            timestamp: new Date().toISOString()
          };
          if (!completedAssessments.some(a => a.id === auditId)) {
            completedAssessments.unshift(assessmentRecord);
          }
          
          task.logs.push({
            text: `> STEP 9/9: Analysis Complete - Threat Level: ${finalThreatLevel}`,
            color: finalAnomalyScore > 75 ? 'text-[#ef4444]' : 'text-[#16a34a]',
            timestamp: new Date().toLocaleTimeString()
          });
          
        }, 500);

      } catch (e) {
        task.stepsState.ai_analysis = 'error';
        task.error = `Failed to parse AI output: ${e.message}\n${resultData}`;
      }
    });

    try {
      pythonProcess.stdin.write(JSON.stringify(flowFeaturesList));
      pythonProcess.stdin.end();
    } catch (stdinErr) {
      console.warn('Could not write to python stdin:', stdinErr.message);
    }
  }, stepDelays.flow_extraction);

  res.json({ message: 'Upload complete. Analysis scheduled.', taskId });
});

// 5. Get Analysis Status
app.get('/api/analysis/status/:taskId', (req, res) => {
  const { taskId } = req.params;
  const task = analysisTasks[taskId];
  if (!task) {
    return res.status(404).json({ error: 'Analysis task not found.' });
  }
  res.json(task);
});

// 6. Get Latest Analysis Result
app.get('/api/analysis/result', (req, res) => {
  if (!latestAnalysisResult) {
    return res.json({ message: 'No analysis run yet', result: null });
  }
  res.json(latestAnalysisResult);
});

// 7. Get Findings list (Derived ONLY from deterministic rule engine)
app.get('/api/findings', (req, res) => {
  if (latestAnalysisResult && latestAnalysisResult.ruleFindings) {
    return res.json(latestAnalysisResult.ruleFindings);
  }
  res.json([]);
});

// 8. Get & Save Real Historical Assessments
app.get('/api/assessments', (req, res) => {
  res.json(completedAssessments);
});

app.post('/api/assessments', (req, res) => {
  const assessment = req.body;
  if (assessment && assessment.id) {
    if (!completedAssessments.some(a => a.id === assessment.id)) {
      completedAssessments.unshift(assessment);
    }
  }
  res.json({ message: 'Assessment recorded', count: completedAssessments.length });
});

// 9. Dynamic Reports API (Generated strictly from real analyzed captures)
app.get('/api/reports', (req, res) => {
  if (!latestAnalysisResult && completedAssessments.length === 0) {
    return res.json([]);
  }

  const reports = [];

  // 1. Create a dedicated report for each completed scan
  completedAssessments.forEach(audit => {
    reports.push({
      id: `REP-${audit.id}`,
      auditId: audit.id,
      title: `${audit.name} — Cryptographic Audit Report`,
      category: 'Audit Report',
      format: 'PDF / HTML',
      size: audit.packets || 'N/A',
      updatedAt: audit.date || new Date().toLocaleString(),
      targetFile: audit.name,
      score: audit.score,
      status: audit.status,
      threatLevel: audit.score >= 80 ? 'GUARD: ACTIVE' : (audit.score >= 60 ? 'ELEVATED RISK' : 'CRITICAL RISK'),
      summary: `Cryptographic compliance audit for capture file ${audit.name}. Posture Score: ${audit.score}/100 (${audit.status}). Analyzed ${audit.packets} against NIST SP 800-77 & PCI-DSS standards.`
    });
  });

  // If latestAnalysisResult exists and isn't already covered in completedAssessments
  if (latestAnalysisResult && !completedAssessments.some(a => a.name === latestAnalysisResult.fileName)) {
    const rawId = latestAnalysisResult.id || 'LIVE';
    const auditId = `AUD-${rawId.slice(-6).toUpperCase()}`;
    reports.unshift({
      id: `REP-${auditId}`,
      auditId: auditId,
      title: `${latestAnalysisResult.fileName} — Cryptographic Audit Report`,
      category: 'Audit Report',
      format: 'PDF / HTML',
      size: `${latestAnalysisResult.extractedFeatures?.totalPackets || 0} packets`,
      updatedAt: new Date(latestAnalysisResult.timestamp).toLocaleString(),
      targetFile: latestAnalysisResult.fileName,
      score: latestAnalysisResult.securityScore,
      status: latestAnalysisResult.securityScore >= 80 ? 'Compliant' : 'Action Required',
      threatLevel: latestAnalysisResult.threatLevel || 'GUARD: ACTIVE',
      summary: `Live cryptographic compliance assessment for capture ${latestAnalysisResult.fileName}. Health score: ${latestAnalysisResult.securityScore}/100.`
    });
  }

  // 2. If multiple scans exist, add consolidated session matrix
  if (completedAssessments.length > 1) {
    const avgScore = Math.round(completedAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / completedAssessments.length);
    reports.push({
      id: "REP-SESSION-MATRIX",
      title: `Multi-Capture Session Audit Matrix (${completedAssessments.length} Files)`,
      category: "Consolidated Matrix",
      format: "CSV / PDF",
      size: `${completedAssessments.length} Scans Logged`,
      updatedAt: new Date().toLocaleDateString(),
      targetFile: `${completedAssessments.length} Session Files`,
      score: avgScore,
      status: avgScore >= 80 ? 'Compliant' : 'Action Required',
      threatLevel: avgScore >= 80 ? 'GUARD: ACTIVE' : 'ELEVATED RISK',
      summary: `Consolidated enterprise security audit benchmark aggregating all ${completedAssessments.length} capture analyses in the current session.`
    });
  }

  res.json(reports);
});

app.get('/api/reports/detail', (req, res) => {
  if (!latestAnalysisResult) {
    return res.status(404).json({ error: 'No active analysis report available.' });
  }
  res.json(latestAnalysisResult);
});

// SPA Fallback: Serve index.html for all non-API GET requests
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    return res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>VPN Vision API Server</title></head>
        <body style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; text-align: center;">
          <h2>VPN Vision Backend Server is Running (Port ${PORT})</h2>
          <p>For the live frontend UI development server, open: <a href="http://localhost:5173" style="color: #38bdf8;">http://localhost:5173</a></p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`VPN Vision Server running on http://localhost:${PORT}`);
});

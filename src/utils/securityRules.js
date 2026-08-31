/**
 * VPN VISION - Deterministic Rule-Based Security Engine
 * 
 * Takes the normalized extracted security features from a PCAP trace
 * and applies strict deterministic audit rules without guessing or fabricating data.
 */

export function evaluateSecurityRules(features) {
  if (!features) {
    return { findings: [], score: 0, threatLevel: 'INSUFFICIENT DATA' };
  }

  const findings = [];

  // =========================================================================
  // 1. IKE VERSION & PROTOCOL AUDITING (IKE-001, IKE-002, IKE-003)
  // =========================================================================
  if (features.ikeVersion === 'IKEv2') {
    findings.push({
      ruleId: 'IKE-001',
      category: 'Key Exchange & Protocol',
      feature: 'IKE Version',
      observedValue: 'IKEv2 (RFC 7296)',
      severity: 'PASS',
      title: 'Modern IKEv2 Protocol Active',
      description: 'The capture demonstrates standard IKEv2 negotiation. IKEv2 provides enhanced reliability, built-in NAT-T support, multi-homing (MOBIKE), and resilient DoS protection compared to legacy IKEv1.',
      evidence: features.ikeEvidence?.frames?.length > 0
        ? `Observed in Frame(s): #${features.ikeEvidence.frames.slice(0, 5).join(', #')}`
        : 'IKEv2 Security Association negotiation frames observed in trace'
    });
  } else if (features.ikeVersion === 'IKEv1') {
    findings.push({
      ruleId: 'IKE-002',
      category: 'Key Exchange & Protocol',
      feature: 'IKE Version',
      observedValue: 'IKEv1 (Legacy RFC 2409)',
      severity: 'WARNING',
      title: 'Legacy IKEv1 Protocol Detected',
      description: 'The endpoint negotiated Phase 1 using IKEv1. IKEv1 is deprecated due to structural weaknesses in Main/Aggressive mode identity protection and lack of modern cryptographic agility.',
      evidence: features.ikeEvidence?.frames?.length > 0
        ? `Observed in Frame(s): #${features.ikeEvidence.frames.slice(0, 5).join(', #')}`
        : 'IKEv1 header version 1.0 detected in ISAKMP proposals'
    });
  } else {
    findings.push({
      ruleId: 'IKE-003',
      category: 'Key Exchange & Protocol',
      feature: 'IKE Version',
      observedValue: 'Not observed',
      severity: 'INFO',
      title: 'IKE Protocol Handshake Not Observed',
      description: 'No UDP port 500 or port 4500 ISAKMP key exchange frames were present in this capture file. The trace may only contain established data-plane ESP flows.',
      evidence: 'No UDP port 500/4500 packets found in trace'
    });
  }

  // =========================================================================
  // 2. ESP ENCAPSULATION AUDITING (ESP-001, ESP-002)
  // =========================================================================
  if (features.esp?.detected === 'Observed') {
    const spis = features.esp.spis?.join(', ') || 'N/A';
    findings.push({
      ruleId: 'ESP-001',
      category: 'Encrypted Data Plane',
      feature: 'ESP Protocol',
      observedValue: `Observed (${features.esp.packetCount} packets)`,
      severity: 'PASS',
      title: 'ESP Encrypted Payload Flow Observed',
      description: `IPsec Encapsulating Security Payload (ESP) active. Identified ${features.esp.packetCount} encrypted tunnel packet(s) carrying authenticated and encrypted payload data.`,
      evidence: `SPI(s): ${spis} | Frames: #${features.esp.frames?.slice(0, 4).join(', #') || 'N/A'}`
    });
  } else {
    findings.push({
      ruleId: 'ESP-002',
      category: 'Encrypted Data Plane',
      feature: 'ESP Protocol',
      observedValue: 'Not observed',
      severity: 'WARNING',
      title: 'ESP Traffic Not Observed in Trace',
      description: 'No IP protocol 50 (ESP) or UDP/4500 encapsulated ESP frames were captured. Only signaling or unrelated traffic was present.',
      evidence: '0 ESP packets identified in capture stream'
    });
  }

  // =========================================================================
  // 3. AH PROTOCOL AUDITING (AH-001, AH-002)
  // =========================================================================
  if (features.ah?.detected === 'Observed') {
    findings.push({
      ruleId: 'AH-001',
      category: 'Encrypted Data Plane',
      feature: 'AH Protocol',
      observedValue: `Observed (${features.ah.packetCount} packets)`,
      severity: 'INFO',
      title: 'Authentication Header (AH) Active',
      description: 'IP protocol 51 (AH) observed in capture. Note that AH provides integrity but does NOT encrypt packet payloads.',
      evidence: `AH Frames: #${features.ah.frames?.slice(0, 4).join(', #') || 'N/A'}`
    });
  } else {
    findings.push({
      ruleId: 'AH-002',
      category: 'Encrypted Data Plane',
      feature: 'AH Protocol',
      observedValue: 'Not observed',
      severity: 'INFO',
      title: 'AH Protocol Not Observed',
      description: 'Authentication Header (AH) protocol 51 was not observed. Modern IPsec deployments favor ESP with AEAD ciphers over standalone AH.',
      evidence: '0 AH packets in capture'
    });
  }

  // =========================================================================
  // 4. ENCRYPTION CIPHER AUDITING (ENC-001, ENC-002, ENC-003)
  // =========================================================================
  if (features.encryption?.observed) {
    const encName = features.encryption.algorithm;
    const isWeak = features.encryption.weak;

    if (isWeak) {
      findings.push({
        ruleId: 'ENC-002',
        category: 'Cryptographic Security',
        feature: 'Encryption Algorithm',
        observedValue: encName,
        severity: 'CRITICAL',
        title: `Weak / Deprecated Cipher Suite Detected (${encName})`,
        description: `The SA negotiation accepted ${encName}. Legacy 64-bit block ciphers (such as 3DES or DES) are vulnerable to collision attacks (Sweet32, CVE-2016-2183) and must be migrated immediately to AES-GCM or ChaCha20.`,
        evidence: features.encryption.evidence?.join('\n') || `Observed transform: ${encName}`
      });
    } else {
      findings.push({
        ruleId: 'ENC-001',
        category: 'Cryptographic Security',
        feature: 'Encryption Algorithm',
        observedValue: encName,
        severity: 'PASS',
        title: `Strong Encryption Suite Observed (${encName})`,
        description: `Approved modern cryptographic cipher (${encName}) negotiated in Security Association proposal. Complies with NIST SP 800-77 Rev 1 enterprise security guidelines.`,
        evidence: features.encryption.evidence?.join('\n') || `Observed transform: ${encName}`
      });
    }
  } else {
    findings.push({
      ruleId: 'ENC-003',
      category: 'Cryptographic Security',
      feature: 'Encryption Algorithm',
      observedValue: 'Not observed',
      severity: 'INFO',
      title: 'Encryption Algorithm Not Observed in Capture',
      description: 'The initial Security Association transform negotiation was not captured in this trace. Encryption suite could not be inspected.',
      evidence: 'No SA proposal transform payload observed in capture frames'
    });
  }

  // =========================================================================
  // 5. INTEGRITY ALGORITHM AUDITING (INT-001, INT-002, INT-003, INT-004)
  // =========================================================================
  if (features.integrity?.observed) {
    const intName = features.integrity.algorithm;
    if (intName.includes('MD5') || intName.includes('NONE')) {
      findings.push({
        ruleId: 'INT-003',
        category: 'Cryptographic Security',
        feature: 'Integrity Algorithm',
        observedValue: intName,
        severity: 'CRITICAL',
        title: `Broken Integrity Algorithm Detected (${intName})`,
        description: `MD5 or NULL integrity was selected. MD5 is cryptographically broken and vulnerable to practical collision attacks.`,
        evidence: features.integrity.evidence?.join('\n') || `Observed transform: ${intName}`
      });
    } else if (intName.includes('SHA1') || intName.includes('SHA-1')) {
      findings.push({
        ruleId: 'INT-002',
        category: 'Cryptographic Security',
        feature: 'Integrity Algorithm',
        observedValue: intName,
        severity: 'WARNING',
        title: 'Deprecated SHA-1 Integrity Algorithm Detected',
        description: 'SHA-1 was negotiated for packet authentication. SHA-1 is deprecated by NIST; upgrade to HMAC-SHA2-256 or AEAD suites.',
        evidence: features.integrity.evidence?.join('\n') || `Observed transform: ${intName}`
      });
    } else {
      findings.push({
        ruleId: 'INT-001',
        category: 'Cryptographic Security',
        feature: 'Integrity Algorithm',
        observedValue: intName,
        severity: 'PASS',
        title: `Approved Integrity Algorithm (${intName})`,
        description: `High-assurance cryptographic authentication algorithm (${intName}) verified in proposal negotiation.`,
        evidence: features.integrity.evidence?.join('\n') || `Observed transform: ${intName}`
      });
    }
  } else {
    findings.push({
      ruleId: 'INT-004',
      category: 'Cryptographic Security',
      feature: 'Integrity Algorithm',
      observedValue: 'Not observed',
      severity: 'INFO',
      title: 'Integrity Algorithm Not Observed in Capture',
      description: 'Integrity algorithm transform payload was not present in this packet stream.',
      evidence: 'No integrity transform proposals captured'
    });
  }

  // =========================================================================
  // 6. DIFFIE-HELLMAN GROUP AUDITING (DH-001, DH-002, DH-003)
  // =========================================================================
  if (features.dhGroup?.observed) {
    const dhName = features.dhGroup.name;
    const isWeak = features.dhGroup.weak;

    if (isWeak) {
      findings.push({
        ruleId: 'DH-002',
        category: 'Key Exchange & Protocol',
        feature: 'Diffie-Hellman Group',
        observedValue: dhName,
        severity: 'CRITICAL',
        title: `Weak Diffie-Hellman Group Detected (${dhName})`,
        description: `MODP groups below 2048-bit (such as Group 1, 2, or 5) are vulnerable to precomputation Logjam attacks. Upgrade to DH Group 14 (2048-bit MODP) or Elliptic Curve Group 19/20/21 (NIST P-256/P-384).`,
        evidence: features.dhGroup.evidence?.join('\n') || `Observed DH Group: ${dhName}`
      });
    } else {
      findings.push({
        ruleId: 'DH-001',
        category: 'Key Exchange & Protocol',
        feature: 'Diffie-Hellman Group',
        observedValue: dhName,
        severity: 'PASS',
        title: `Adequate Diffie-Hellman Group (${dhName})`,
        description: `The key exchange provides sufficient cryptographic work factor and forward secrecy protection.`,
        evidence: features.dhGroup.evidence?.join('\n') || `Observed DH Group: ${dhName}`
      });
    }
  } else {
    findings.push({
      ruleId: 'DH-003',
      category: 'Key Exchange & Protocol',
      feature: 'Diffie-Hellman Group',
      observedValue: 'Not observed',
      severity: 'INFO',
      title: 'Diffie-Hellman Group Not Observed',
      description: 'Key Exchange (KE) payload and DH transform proposals were not present in the capture file.',
      evidence: 'No DH transform or Key Exchange payload identified'
    });
  }

  // =========================================================================
  // 7. PERFECT FORWARD SECRECY (PFS) AUDITING (PFS-001, PFS-002, PFS-003)
  // =========================================================================
  if (features.pfs?.status === 'Enabled') {
    findings.push({
      ruleId: 'PFS-001',
      category: 'Key Exchange & Protocol',
      feature: 'Perfect Forward Secrecy (PFS)',
      observedValue: 'Enabled',
      severity: 'PASS',
      title: 'Perfect Forward Secrecy (PFS) Active',
      description: 'Conclusive packet evidence observed showing independent ephemeral Diffie-Hellman key exchange during Child SA rekeying.',
      evidence: features.pfs.evidence?.join('\n') || 'Explicit KE payload confirmed in CREATE_CHILD_SA frame'
    });
  } else if (features.pfs?.status === 'Disabled') {
    findings.push({
      ruleId: 'PFS-002',
      category: 'Key Exchange & Protocol',
      feature: 'Perfect Forward Secrecy (PFS)',
      observedValue: 'Disabled',
      severity: 'WARNING',
      title: 'Perfect Forward Secrecy (PFS) Disabled in Child SA',
      description: 'Child SA was negotiated without an independent Diffie-Hellman key exchange payload. Compromise of long-term IKE keys may expose past Child SA session traffic.',
      evidence: features.pfs.evidence?.join('\n') || 'Child SA negotiation lacks KE payload'
    });
  } else {
    findings.push({
      ruleId: 'PFS-003',
      category: 'Key Exchange & Protocol',
      feature: 'Perfect Forward Secrecy (PFS)',
      observedValue: 'Not observed',
      severity: 'INFO',
      title: 'PFS Not Observed in Capture',
      description: 'The capture trace does not contain Child SA rekeying or exchange evidence necessary to conclusively verify PFS status.',
      evidence: 'No CREATE_CHILD_SA exchange observed in trace'
    });
  }

  // =========================================================================
  // 8. IPSEC MODE AUDITING (MODE-001, MODE-002, MODE-003)
  // =========================================================================
  if (features.ipsecMode?.mode === 'Tunnel') {
    findings.push({
      ruleId: 'MODE-002',
      category: 'Encrypted Data Plane',
      feature: 'IPsec Mode',
      observedValue: 'Tunnel Mode',
      severity: 'PASS',
      title: 'IPsec Tunnel Mode Identified',
      description: 'Full packet encapsulation protects both inner payload headers and gateway addressing.',
      evidence: features.ipsecMode.evidence?.join('\n') || 'Outer IP header encapsulation verified'
    });
  } else if (features.ipsecMode?.mode === 'Transport') {
    findings.push({
      ruleId: 'MODE-001',
      category: 'Encrypted Data Plane',
      feature: 'IPsec Mode',
      observedValue: 'Transport Mode',
      severity: 'INFO',
      title: 'IPsec Transport Mode Identified',
      description: 'Transport mode active between direct host endpoints. IP header is not encapsulated.',
      evidence: features.ipsecMode.evidence?.join('\n') || 'Direct transport header verified'
    });
  } else {
    findings.push({
      ruleId: 'MODE-003',
      category: 'Encrypted Data Plane',
      feature: 'IPsec Mode',
      observedValue: 'Not observed',
      severity: 'INFO',
      title: 'IPsec Mode Not Observable',
      description: 'Insufficient encapsulation evidence to confirm Tunnel vs Transport mode.',
      evidence: 'No ESP framing headers available for mode verification'
    });
  }

  // =========================================================================
  // 9. AUTHENTICATION METHOD AUDITING (AUTH-001, AUTH-002)
  // =========================================================================
  if (features.authentication?.observed) {
    findings.push({
      ruleId: 'AUTH-001',
      category: 'Identity & Authentication',
      feature: 'Authentication Method',
      observedValue: features.authentication.method,
      severity: 'PASS',
      title: `Peer Authentication: ${features.authentication.method}`,
      description: `Peer identity verification method extracted from authentication payload proposal (${features.authentication.method}).`,
      evidence: features.authentication.evidence?.join('\n') || `Observed Auth Payload: ${features.authentication.method}`
    });
  } else {
    findings.push({
      ruleId: 'AUTH-002',
      category: 'Identity & Authentication',
      feature: 'Authentication Method',
      observedValue: 'Not observed',
      severity: 'INFO',
      title: 'Authentication Method Not Observed',
      description: 'IKE_AUTH or Phase 1 authentication payloads were not captured in this trace.',
      evidence: 'No AUTH payload observed in trace frames'
    });
  }

  // =========================================================================
  // 10. NAT TRAVERSAL AUDITING (NATT-001, NATT-002)
  // =========================================================================
  if (features.natt?.detected === 'Detected') {
    findings.push({
      ruleId: 'NATT-001',
      category: 'Encrypted Data Plane',
      feature: 'NAT Traversal (NAT-T)',
      observedValue: 'Detected (UDP/4500)',
      severity: 'PASS',
      title: 'NAT Traversal (UDP/4500) Active',
      description: 'IPsec traffic successfully encapsulates ESP/IKE across intermediate NAT gateways using UDP port 4500.',
      evidence: 'UDP port 4500 packets observed with Non-ESP marker / encapsulated SPI'
    });
  } else {
    findings.push({
      ruleId: 'NATT-002',
      category: 'Encrypted Data Plane',
      feature: 'NAT Traversal (NAT-T)',
      observedValue: 'Not observed',
      severity: 'INFO',
      title: 'NAT-T Not Observed',
      description: 'No UDP port 4500 NAT traversal frames were observed in this capture.',
      evidence: '0 UDP/4500 packets found'
    });
  }

  // =========================================================================
  // DETERMINISTIC SECURITY HEALTH SCORE CALCULATION
  // =========================================================================
  if (features.totalPackets === 0) {
    return {
      findings,
      score: 0,
      threatLevel: 'INSUFFICIENT EVIDENCE',
      breakdown: { crypto: 0, compliance: 0, anomaly: 0 }
    };
  }

  let criticalCount = 0;
  let warningCount = 0;
  let passCount = 0;
  let infoCount = 0;

  findings.forEach(f => {
    if (f.severity === 'CRITICAL') {
      criticalCount++;
    } else if (f.severity === 'WARNING') {
      warningCount++;
    } else if (f.severity === 'PASS') {
      passCount++;
    } else {
      infoCount++;
    }
  });

  // 1. Granular Cryptographic Security Score (0 - 100)
  // Derived directly from Encryption, Integrity, DH Group, and PFS findings
  let cryptoScore = 0;

  // Encryption component (up to 35 pts)
  if (findings.some(f => f.ruleId === 'ENC-001')) {
    cryptoScore += 35;
  } else if (findings.some(f => f.ruleId === 'ENC-002')) {
    cryptoScore += 0; // Critical vulnerability (3DES/DES/NULL)
  } else {
    cryptoScore += 20; // Unobserved proposal
  }

  // Integrity component (up to 25 pts)
  if (findings.some(f => f.ruleId === 'INT-001')) {
    cryptoScore += 25;
  } else if (findings.some(f => f.ruleId === 'INT-002')) {
    cryptoScore += 10; // Warning (SHA-1)
  } else if (findings.some(f => f.ruleId === 'INT-003')) {
    cryptoScore += 0; // Critical (MD5/NULL)
  } else {
    cryptoScore += 15;
  }

  // Diffie-Hellman Group component (up to 25 pts)
  if (findings.some(f => f.ruleId === 'DH-001')) {
    cryptoScore += 25;
  } else if (findings.some(f => f.ruleId === 'DH-002')) {
    cryptoScore += 0; // Critical (Group 1, 2, 5)
  } else {
    cryptoScore += 15;
  }

  // PFS component (up to 15 pts)
  if (findings.some(f => f.ruleId === 'PFS-001')) {
    cryptoScore += 15;
  } else if (findings.some(f => f.ruleId === 'PFS-002')) {
    cryptoScore += 0; // Disabled
  } else {
    cryptoScore += 10; // Not observed
  }

  cryptoScore = Math.max(0, Math.min(100, cryptoScore));

  // 2. Configuration Compliance Score (0 - 100)
  // Derived from protocol version, ESP encapsulation, Mode, Auth, and NAT-T
  let complianceScore = 0;

  // IKE Version (up to 30 pts)
  if (findings.some(f => f.ruleId === 'IKE-001')) {
    complianceScore += 30;
  } else if (findings.some(f => f.ruleId === 'IKE-002')) {
    complianceScore += 12; // Deprecated IKEv1
  } else {
    complianceScore += 20;
  }

  // ESP Encapsulation (up to 35 pts)
  if (findings.some(f => f.ruleId === 'ESP-001')) {
    complianceScore += 35;
  } else {
    complianceScore += 0;
  }

  // Mode & Framing (up to 20 pts)
  if (findings.some(f => f.ruleId === 'MODE-001' || f.ruleId === 'MODE-002')) {
    complianceScore += 20;
  } else {
    complianceScore += 10;
  }

  // Auth & NAT-T (up to 15 pts)
  if (findings.some(f => f.ruleId === 'AUTH-001')) complianceScore += 8;
  else complianceScore += 5;
  if (findings.some(f => f.ruleId === 'NATT-001')) complianceScore += 7;
  else complianceScore += 5;

  complianceScore = Math.max(0, Math.min(100, complianceScore));

  // 3. Traffic Anomaly Index (0 - 100%)
  const baseAnomaly = 12;
  const anomalyScore = Math.min(100, Math.max(0, Math.round(baseAnomaly + (criticalCount * 22) + (warningCount * 8))));

  // 4. Overall Deterministic Security Score (Weighted Composite)
  const score = Math.max(0, Math.min(100, Math.round((cryptoScore * 0.45) + (complianceScore * 0.35) + ((100 - anomalyScore) * 0.20))));

  let threatLevel = 'GUARD: ACTIVE (LOW RISK)';
  if (score < 60 || criticalCount > 0) {
    threatLevel = 'ACTION REQUIRED (HIGH RISK)';
  } else if (score < 80 || warningCount > 0) {
    threatLevel = 'EVALUATION RECOMMENDED (MEDIUM RISK)';
  }

  return {
    findings,
    score,
    threatLevel,
    counts: {
      critical: criticalCount,
      high: warningCount,
      medium: infoCount,
      passed: passCount
    },
    breakdown: {
      crypto: cryptoScore,
      compliance: complianceScore,
      anomaly: anomalyScore
    }
  };
}


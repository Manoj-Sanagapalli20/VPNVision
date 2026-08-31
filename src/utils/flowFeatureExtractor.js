/**
 * VPN Vision - Flow Feature Extractor
 * 
 * Extracts 23 canonical features from raw packets.
 * Time Unit: Microseconds (µs). All packet timestamps are converted from ms to µs.
 * Idle Threshold: 1,000,000 µs (1 second), determined from the dataset where
 * flows with max_flowiat > 1,000,000 have active/idle periods.
 * Undefined values for active/idle use `null` so they can be properly imputed
 * by the Python backend as NaNs.
 */

export function extractFlowFeatures(packets) {
  // Group packets into flows
  const completedFlows = [];
  const activeFlows = new Map();
  const FLOW_TIMEOUT = 120000000; // 120 seconds in microseconds (Idle Timeout)
  const ACTIVE_TIMEOUT = 60000000; // 60 seconds in microseconds (Active Timeout)

  for (const pkt of packets) {
    if (!pkt.srcIp || !pkt.dstIp) continue;
    
    // Normalize IP addresses and ports to determine bidirectional flow direction consistently
    // Note: SPI is intentionally omitted because initiator and responder use different SPIs, 
    // and we cannot easily pair them without IKE SA negotiation payloads.
    const fwdKey = `${pkt.srcIp}:${pkt.srcPort || 0}-${pkt.dstIp}:${pkt.dstPort || 0}-${pkt.protocol}`;
    const revKey = `${pkt.dstIp}:${pkt.dstPort || 0}-${pkt.srcIp}:${pkt.srcPort || 0}-${pkt.protocol}`;
    
    const timestampUs = pkt.timestampMs * 1000;
    
    let flow;
    let isForward = true;

    if (activeFlows.has(fwdKey)) {
      flow = activeFlows.get(fwdKey);
      isForward = true;
    } else if (activeFlows.has(revKey)) {
      flow = activeFlows.get(revKey);
      isForward = false;
    }

    // Flow Timeout Logic: If idle for > 120s, or active for > 60s, terminate and start a new flow session
    if (flow) {
      const isIdleTimeout = (timestampUs - flow.lastTimestamp > FLOW_TIMEOUT);
      const isActiveTimeout = (timestampUs - flow.firstTimestamp > ACTIVE_TIMEOUT);
      
      if (isIdleTimeout || isActiveTimeout) {
        completedFlows.push(flow);
        activeFlows.delete(flow.id);
        flow = null;
      }
    }

    if (!flow) {
      flow = {
        id: fwdKey,
        srcIp: pkt.srcIp,
        dstIp: pkt.dstIp,
        srcPort: pkt.srcPort || 0,
        dstPort: pkt.dstPort || 0,
        protocol: pkt.protocol,
        packets: [],
        firstTimestamp: timestampUs,
        lastTimestamp: timestampUs
      };
      activeFlows.set(fwdKey, flow);
      isForward = true; // The first packet to initiate the new session becomes 'Forward'
    }
    
    flow.lastTimestamp = timestampUs;
    flow.packets.push({
      timestamp: timestampUs,
      length: pkt.length,
      isForward: isForward
    });
  }

  for (const flow of activeFlows.values()) {
    completedFlows.push(flow);
  }

  const results = [];

  for (const flow of completedFlows) {
    // Sort packets by timestamp just in case
    flow.packets.sort((a, b) => a.timestamp - b.timestamp);
    
    const features = calculateFeatures(flow.packets);
    if (features) {
      if (!validateFeatures(features)) {
        console.error("Feature validation failed for flow", flow.id, features);
        continue;
      }
      // Attach metadata for the UI (not ML)
      results.push({
        metadata: {
          srcIp: flow.srcIp,
          dstIp: flow.dstIp,
          srcPort: flow.srcPort,
          dstPort: flow.dstPort,
          protocol: flow.protocol,
          packetCount: flow.packets.length
        },
        features: features
      });
    }
  }

  return results;
}

function calculateFeatures(packets) {
  if (packets.length === 0) return null;

  const firstTime = packets[0].timestamp;
  const lastTime = packets[packets.length - 1].timestamp;
  const duration = lastTime - firstTime;

  let totalBytes = 0;
  
  let fwdLastTime = null;
  let bwdLastTime = null;
  
  const fiats = [];
  const biats = [];
  const flowiats = [];
  
  for (let i = 0; i < packets.length; i++) {
    const pkt = packets[i];
    totalBytes += pkt.length;
    
    // Flow IAT
    if (i > 0) {
      const iat = pkt.timestamp - packets[i - 1].timestamp;
      flowiats.push(iat);
    }

    // Forward/Backward IAT
    if (pkt.isForward) {
      if (fwdLastTime !== null) {
        fiats.push(pkt.timestamp - fwdLastTime);
      }
      fwdLastTime = pkt.timestamp;
    } else {
      if (bwdLastTime !== null) {
        biats.push(pkt.timestamp - bwdLastTime);
      }
      bwdLastTime = pkt.timestamp;
    }
  }

  // Active / Idle Periods calculation
  // Threshold is 1,000,000 µs (1 second) based on dataset
  const IDLE_THRESHOLD = 1000000;
  
  const activePeriods = [];
  const idlePeriods = [];
  
  let currentActiveStart = firstTime;
  let currentActiveEnd = firstTime;

  for (let i = 1; i < packets.length; i++) {
    const pkt = packets[i];
    const iat = pkt.timestamp - packets[i - 1].timestamp;
    
    if (iat > IDLE_THRESHOLD) {
      // End of an active period, start of idle period
      activePeriods.push(currentActiveEnd - currentActiveStart);
      idlePeriods.push(iat);
      // New active period starts with current packet
      currentActiveStart = pkt.timestamp;
    }
    currentActiveEnd = pkt.timestamp;
  }
  
  // Push the final active period
  if (currentActiveEnd >= currentActiveStart) {
      activePeriods.push(currentActiveEnd - currentActiveStart);
  }

  // Calculate statistics
  const total_fiat = fiats.reduce((a, b) => a + b, 0);
  const total_biat = biats.reduce((a, b) => a + b, 0);
  
  // flow rates
  // duration is in microsec, meaning packets per sec is:
  const durationSec = duration / 1000000.0;
  const flowPktsPerSecond = durationSec > 0 ? packets.length / durationSec : 0;
  const flowBytesPerSecond = durationSec > 0 ? totalBytes / durationSec : 0;

  const getStats = (arr) => {
    if (!arr || arr.length === 0) return { min: null, max: null, mean: null, std: null };
    let sum = 0;
    let min = arr[0];
    let max = arr[0];
    for (const val of arr) {
      sum += val;
      if (val < min) min = val;
      if (val > max) max = val;
    }
    const mean = sum / arr.length;
    let varSum = 0;
    for (const val of arr) {
      varSum += Math.pow(val - mean, 2);
    }
    // Using sample standard deviation (N-1) as is standard in many ML extractors
    // We will use population std if length == 1 since varSum will be 0.
    const std = arr.length > 1 ? Math.sqrt(varSum / (arr.length - 1)) : 0;
    return { min, max, mean, std };
  };

  const fiatStats = getStats(fiats);
  const biatStats = getStats(biats);
  const flowiatStats = getStats(flowiats);
  
  // Note: if there are no idle periods (or no active periods beyond the single block),
  // the dataset uses -1 for min/max and 0 for mean/std
  const hasIdle = idlePeriods.length > 0;
  
  // If there are no idle periods, it implies there's only 1 continuous active period.
  // Wait, in the dataset, when max_flowiat <= 1,000,000, active and idle are ALL -1 and 0.
  // So we ONLY compute stats if hasIdle is true OR if we have to follow exactly.
  // Actually, in CICFlowMeter, if there are no idle periods, active metrics are sometimes 0,
  // but looking at row 3 of the CSV, min_active is -1.0. So we return -1 and 0 for both if no idle.
  const activeStats = hasIdle ? getStats(activePeriods) : { min: null, max: null, mean: null, std: null };
  const idleStats = hasIdle ? getStats(idlePeriods) : { min: null, max: null, mean: null, std: null };

  const featureVector = {
    duration: duration,
    total_fiat: total_fiat,
    total_biat: total_biat,
    min_fiat: fiatStats.min,
    min_biat: biatStats.min,
    max_fiat: fiatStats.max,
    max_biat: biatStats.max,
    mean_fiat: fiatStats.mean,
    mean_biat: biatStats.mean,
    flowPktsPerSecond: flowPktsPerSecond,
    flowBytesPerSecond: flowBytesPerSecond,
    min_flowiat: flowiatStats.min,
    max_flowiat: flowiatStats.max,
    mean_flowiat: flowiatStats.mean,
    std_flowiat: flowiatStats.std,
    min_active: activeStats.min,
    mean_active: activeStats.mean,
    max_active: activeStats.max,
    std_active: activeStats.std,
    min_idle: idleStats.min,
    mean_idle: idleStats.mean,
    max_idle: idleStats.max,
    std_idle: idleStats.std
  };

  return featureVector;
}

export function validateFeatures(featureVector) {
  const expectedKeys = [
    "duration", "total_fiat", "total_biat", "min_fiat", "min_biat", 
    "max_fiat", "max_biat", "mean_fiat", "mean_biat", "flowPktsPerSecond", 
    "flowBytesPerSecond", "min_flowiat", "max_flowiat", "mean_flowiat", 
    "std_flowiat", "min_active", "mean_active", "max_active", "std_active", 
    "min_idle", "mean_idle", "max_idle", "std_idle"
  ];

  const keys = Object.keys(featureVector);
  
  if (keys.length !== 23) return false;
  
  for (let i = 0; i < 23; i++) {
    if (keys[i] !== expectedKeys[i]) return false;
    
    const val = featureVector[keys[i]];
    if (val !== null && typeof val !== 'number') return false;
    if (val !== null && (isNaN(val) || !isFinite(val))) return false;
  }
  
  return true;
}

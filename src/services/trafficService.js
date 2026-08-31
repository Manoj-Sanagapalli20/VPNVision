export const trafficService = {
  async getTrafficData() {
    return {
      confidence: 94.8,
      anomalyScore: 82,
      classification: [
        { label: "Encrypted Video Stream (H.264/QUIC)", percentage: 68, color: "#f6be3c" },
        { label: "Standard Web / HTTPS Browsing", percentage: 18, color: "#d6a21e" },
        { label: "VoIP / Real-Time Media (SRTP)", percentage: 8, color: "#9b8f7a" },
        { label: "P2P / Torrenting Tunnel Signature", percentage: 4, color: "#ffb4ab" },
        { label: "Unknown Encrypted Payload / Anomaly", percentage: 2, color: "#93000a" }
      ],
      flowDynamics: [40, 58, 48, 85, 70, 92, 65, 80, 52, 74, 90, 84, 98, 72, 85],
      payloadLogs: [
        { id: "PKT-9901", time: "14:28:01.092", src: "192.168.1.104", dst: "198.51.100.22", proto: "ESP (50)", size: "1420 B", entropy: "7.989", verdict: "Normal ESP" },
        { id: "PKT-9902", time: "14:28:01.104", src: "192.168.1.104", dst: "198.51.100.22", proto: "ESP (50)", size: "1420 B", entropy: "7.991", verdict: "Normal ESP" },
        { id: "PKT-9903", time: "14:28:01.120", src: "192.168.1.189", dst: "203.0.113.88", proto: "UDP/500", size: "448 B", entropy: "6.210", verdict: "IKEv1 Aggressive" },
        { id: "PKT-9904", time: "14:28:01.145", src: "192.168.1.205", dst: "198.51.100.4", proto: "ESP (50)", size: "84 B", entropy: "7.840", verdict: "Keepalive / DPD" },
        { id: "PKT-9905", time: "14:28:01.198", src: "10.0.4.12", dst: "198.51.100.99", proto: "ESP (50)", size: "1500 B", entropy: "7.999", verdict: "3DES Signature" }
      ]
    };
  }
};

export default trafficService;

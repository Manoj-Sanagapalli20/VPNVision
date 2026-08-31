export const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Overview',
    icon: 'grid_view',
    badge: null
  },
  {
    path: '/analyze-pcap',
    label: 'Analyze PCAP',
    icon: 'note_add',
    badge: null
  },
  {
    path: '/traffic-ai',
    label: 'Traffic AI',
    icon: 'query_stats',
    badge: 'AI'
  },
  {
    path: '/findings',
    label: 'Findings',
    icon: 'find_in_page',
    badge: null
  },
  {
    path: '/assessments',
    label: 'Assessments',
    icon: 'shield',
    badge: null
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: 'contact_page',
    badge: null
  },
  {
    path: '/reporting',
    label: 'Reporting',
    icon: 'description',
    badge: null
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'settings',
    badge: null
  }
];

export const SEVERITY_CONFIG = {
  critical: {
    label: 'CRITICAL',
    bg: 'bg-rose-50 dark:bg-[#2e1818]',
    border: 'border-rose-200 dark:border-[#4c2424]',
    text: 'text-rose-700 dark:text-[#f87171]',
    badgeBg: 'bg-rose-50 dark:bg-[#2e1818] border border-rose-200 dark:border-[#4c2424]',
    badgeText: 'text-rose-700 dark:text-[#f87171]'
  },
  high: {
    label: 'HIGH',
    bg: 'bg-amber-50 dark:bg-[#2e2315]',
    border: 'border-amber-200 dark:border-[#4d3a1f]',
    text: 'text-amber-700 dark:text-[#fbbf24]',
    badgeBg: 'bg-amber-50 dark:bg-[#2e2315] border border-amber-200 dark:border-[#4d3a1f]',
    badgeText: 'text-amber-700 dark:text-[#fbbf24]'
  },
  medium: {
    label: 'MEDIUM',
    bg: 'bg-slate-100 dark:bg-[#1D2023]',
    border: 'border-slate-300 dark:border-[#363A3F]',
    text: 'text-slate-700 dark:text-[#A7ADB4]',
    badgeBg: 'bg-slate-100 dark:bg-[#1D2023] border border-slate-300 dark:border-[#363A3F]',
    badgeText: 'text-slate-700 dark:text-[#A7ADB4]'
  },
  passed: {
    label: 'PASSED',
    bg: 'bg-emerald-50 dark:bg-[#16291e]',
    border: 'border-emerald-200 dark:border-[#22543d]',
    text: 'text-emerald-700 dark:text-[#4ade80]',
    badgeBg: 'bg-emerald-50 dark:bg-[#16291e] border border-emerald-200 dark:border-[#22543d]',
    badgeText: 'text-emerald-700 dark:text-[#4ade80]'
  }
};

export const DEFAULT_FINDINGS = [
  {
    id: "FND-2023-08-991",
    severity: "Critical",
    title: "Diffie-Hellman Group Deprecated (Group 2)",
    explanation: "The Phase 1 IKE negotiation utilized Diffie-Hellman Group 2 (1024-bit MODP). This group is cryptographically weak and susceptible to Logjam attacks. It does not provide sufficient forward secrecy for modern enterprise deployments.",
    recommendation: "Upgrade immediately to a minimum of DH Group 14 (2048-bit) or preferably Group 19, 20, or 21 (Elliptic Curve Cryptography) to ensure adequate cryptographic strength.",
    evidence: "IKEv1 Phase 1 Proposal\nEncryption Algorithm: AES-CBC\nKey Length: 256\nHash Algorithm: SHA2-256\nAuthentication Method: Pre-Shared Key\nDiffie-Hellman Group: Group 2 (1024-bit) [!] WARNING"
  },
  {
    id: "FND-2023-08-944",
    severity: "Critical",
    title: "IKEv1 Aggressive Mode Enabled",
    explanation: "The gateway is responding to IKEv1 Aggressive Mode requests. Aggressive mode transmits the responder's identity hash in cleartext, making offline dictionary attacks against the Pre-Shared Key (PSK) trivial if a weak PSK is used.",
    recommendation: "Disable IKEv1 Aggressive Mode on the gateway. If possible, migrate entirely to IKEv2, which inherently protects identities and mitigates this attack vector.",
    evidence: "IKEv1 Exchange Type: Aggressive Mode (4)\nInitiator SPI: 0x8a92f08a9c8e83b1\nResponder SPI: 0x92b9f874c7e8e192"
  },
  {
    id: "FND-2023-08-912",
    severity: "Critical",
    title: "Weak Encryption Suite (3DES) Allowed",
    explanation: "Triple-DES (3DES) was detected in Phase 2 transform negotiations. 3DES utilizes a 64-bit block size and is susceptible to Sweet32 collision attacks when transferring large amounts of data over a single SA.",
    recommendation: "Remove 3DES from all VPN policies. Standardize on AES-GCM (128-bit or 256-bit) to provide both confidentiality and authenticated data integrity.",
    evidence: "Transform Payload: 3DES-CBC\nKey Length: 168 bits\nBlock Size: 64 bits [!] SWEET32 VULNERABLE"
  }
];

export const DEFAULT_TELEMETRY = {
  score: 87,
  threatLevel: "GUARD: ACTIVE",
  pcapCount: 24,
  secureCount: 18,
  reviewCount: 4,
  riskCount: 2,
  classification: {
    video: 72,
    web: 18,
    voip: 7,
    other: 3
  }
};

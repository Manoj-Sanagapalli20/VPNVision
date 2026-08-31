import React from 'react';

export const TIMELINE_STAGES = [
  {
    number: '01',
    category: 'INPUT',
    title: 'UPLOAD PCAP',
    description: 'Start with a captured .pcap or .pcapng network trace.',
    row: 1,
    col: 1
  },
  {
    number: '02',
    category: 'PACKET ANALYSIS',
    title: 'PARSE PACKETS',
    description: 'Reconstruct packets and communication streams from the capture.',
    row: 1,
    col: 2
  },
  {
    number: '03',
    category: 'VPN DETECTION',
    title: 'IDENTIFY IPSEC / IKE',
    description: 'Detect IPsec traffic, identify IKE versions and determine VPN operating characteristics.',
    row: 1,
    col: 3
  },
  {
    number: '04',
    category: 'SECURITY ANALYSIS',
    title: 'SECURITY RULE ENGINE',
    description: 'Evaluate cryptographic strength, configuration, replay protection, PFS and security policy.',
    row: 2,
    col: 3 // visual right in row 2
  },
  {
    number: '05',
    category: 'FEATURE ENGINEERING',
    title: 'EXTRACT FEATURES',
    description: 'Extract VPN, packet-level and flow-level characteristics for security and behavioural analysis.',
    row: 2,
    col: 2 // visual center in row 2
  },
  {
    number: '06',
    category: 'AI ANALYSIS',
    title: 'AI TRAFFIC ANALYSIS',
    description: 'Analyze encrypted traffic behaviour, classify traffic patterns and identify anomalous sessions.',
    row: 2,
    col: 1 // visual left in row 2
  },
  {
    number: '07',
    category: 'RISK ASSESSMENT',
    title: 'RISK ENGINE',
    description: 'Combine security findings and AI insights to prioritize the overall security risk.',
    row: 3,
    col: 1
  },
  {
    number: '08',
    category: 'SECURITY POSTURE',
    title: 'SECURITY POSTURE',
    description: 'Convert the assessment into a clear security posture.',
    row: 3,
    col: 2
  },
  {
    number: '09',
    category: 'FINAL OUTPUT',
    title: 'FINAL SECURITY SCORE',
    description: 'Produce the final risk score, findings and recommendations.',
    row: 3,
    col: 3,
    isFinal: true,
    score: '92 / 100',
    verdict: 'LOW RISK'
  }
];

export function SerpentineTimeline() {
  const row1Stages = [TIMELINE_STAGES[0], TIMELINE_STAGES[1], TIMELINE_STAGES[2]];
  const row2VisualStages = [TIMELINE_STAGES[5], TIMELINE_STAGES[4], TIMELINE_STAGES[3]]; // 06, 05, 04
  const row3Stages = [TIMELINE_STAGES[6], TIMELINE_STAGES[7], TIMELINE_STAGES[8]];

  return (
    <section id="capabilities" className="w-full py-16 sm:py-24 relative overflow-hidden">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-[11px] font-mono text-[#1D4ED8] dark:text-[#E8EAED] tracking-widest uppercase mb-4 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] dark:bg-[#60a5fa] animate-ping"></span>
          <span className="font-bold">HOW VPN VISION WORKS</span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17212B] dark:text-[#E8EAED] tracking-tight mb-4 uppercase">
          From PCAP to Security Posture.
        </h2>

        <p className="font-sans text-sm sm:text-base text-[#5F6B76] dark:text-[#A7ADB4] max-w-2xl mx-auto leading-relaxed">
          Every captured network trace moves through a structured analysis pipeline before VPN Vision produces a clear security assessment.
        </p>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP & TABLET SERPENTINE TIMELINE (Hidden on Mobile) */}
      {/* ============================================================ */}
      <div className="hidden md:block max-w-6xl mx-auto px-6 relative">
        {/* Continuous SVG Serpentine Pathway */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 680" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bluePathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>

              {/* Animated Travelling Signal Filter */}
              <filter id="signalGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Subtle background track */}
            <path
              d="M 166 110 L 834 110 Q 890 110 890 166 L 890 274 Q 890 330 834 330 L 166 330 Q 110 330 110 386 L 110 494 Q 110 550 166 550 L 834 550"
              stroke="currentColor"
              className="text-[#CBD5E1] dark:text-[#363A3F]"
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Primary Continuous Serpentine Path */}
            <path
              id="serpentine-path"
              d="M 166 110 L 834 110 Q 890 110 890 166 L 890 274 Q 890 330 834 330 L 166 330 Q 110 330 110 386 L 110 494 Q 110 550 166 550 L 834 550"
              stroke="currentColor"
              className="text-[#2563eb] dark:text-[#60a5fa] opacity-90"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Active Moving Signal Traveling along Path */}
            <circle r="4.5" fill="currentColor" className="text-[#2563eb] dark:text-[#60a5fa]" filter="url(#signalGlow)">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                path="M 166 110 L 834 110 Q 890 110 890 166 L 890 274 Q 890 330 834 330 L 166 330 Q 110 330 110 386 L 110 494 Q 110 550 166 550 L 834 550"
              />
            </circle>

            {/* Arrow indicators along path turns */}
            <path d="M 886 215 L 890 225 L 894 215" stroke="currentColor" className="text-[#2563eb] dark:text-[#60a5fa]" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 106 435 L 110 445 L 114 435" stroke="currentColor" className="text-[#2563eb] dark:text-[#60a5fa]" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Stages Grid (3 Rows) */}
        <div className="relative z-10 space-y-16">
          {/* ROW 1: 01 -> 02 -> 03 (Left to Right) */}
          <div className="grid grid-cols-3 gap-8">
            {row1Stages.map((stage, idx) => (
              <StageCard key={stage.number} stage={stage} delay={idx * 100} />
            ))}
          </div>

          {/* ROW 2: 06 <- 05 <- 04 (Visual layout 06 | 05 | 04, path flows 04 to 05 to 06) */}
          <div className="grid grid-cols-3 gap-8">
            {row2VisualStages.map((stage, idx) => (
              <StageCard key={stage.number} stage={stage} delay={(3 + (2 - idx)) * 100} />
            ))}
          </div>

          {/* ROW 3: 07 -> 08 -> 09 (Left to Right) */}
          <div className="grid grid-cols-3 gap-8">
            {row3Stages.map((stage, idx) => (
              <StageCard key={stage.number} stage={stage} delay={(6 + idx) * 100} />
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE VERTICAL JOURNEY: 01 -> 02 -> ... -> 09 */}
      {/* ============================================================ */}
      <div className="md:hidden max-w-md mx-auto px-5 relative">
        {/* Continuous Left Vertical Path */}
        <div className="absolute left-[33px] top-6 bottom-6 w-[2.5px] bg-[#2563eb] dark:bg-[#363A3F] z-0 rounded-full" />
        
        {/* Animated Moving Dot for Mobile */}
        <div className="absolute left-[30px] top-6 w-3 h-3 rounded-full bg-[#2563eb] dark:bg-[#60a5fa] shadow-[0_0_10px_#2563eb] animate-bounce z-10" />

        <div className="relative z-10 space-y-6">
          {TIMELINE_STAGES.map((stage) => (
            <div key={stage.number} className="flex items-start gap-4">
              {/* Timeline Node */}
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] dark:bg-[#232629] border-2 border-[#2563eb] dark:border-[#363A3F] text-[#2563eb] dark:text-[#E8EAED] flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-3 shadow-sm z-10">
                {stage.number}
              </div>

              {/* Stage Card */}
              <div className="flex-1">
                <StageCardContent stage={stage} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StageCard({ stage, delay = 0 }) {
  return (
    <div
      className="flex flex-col items-center group transition-all duration-300 hover:-translate-y-1 reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Timeline Node on Path */}
      <div className="w-6 h-6 rounded-full bg-[#FFFFFF] dark:bg-[#232629] border-2 border-[#2563eb] dark:border-[#363A3F] flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 group-hover:bg-[#2563eb] dark:group-hover:bg-[#363A3F] transition-all">
        <span className="w-2 h-2 rounded-full bg-[#2563eb] dark:bg-[#60a5fa] group-hover:bg-[#FFFFFF]"></span>
      </div>

      {/* Content Card */}
      <StageCardContent stage={stage} />
    </div>
  );
}

function StageCardContent({ stage }) {
  const isFinal = stage.isFinal;

  return (
    <div
      className={`w-full p-5 rounded-xl bg-[#FFFFFF] dark:bg-[#232629] border transition-all duration-200 shadow-xs relative ${
        isFinal
          ? 'border-[#2563eb] dark:border-[#363A3F] ring-2 ring-[#2563eb]/20 dark:ring-[#363A3F]/50 shadow-[0_8px_24px_rgba(0,0,0,0.1)]'
          : 'border-[#D9DEE5] dark:border-[#363A3F] hover:border-[#2563eb]/60 dark:hover:border-[#777E86] hover:shadow-md'
      }`}
    >
      {/* Card Header: Number + Category */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs font-bold text-[#2563eb] dark:text-[#60a5fa]">
          {stage.number}
        </span>
        <span className="font-mono text-[10px] font-bold text-[#5F6B76] dark:text-[#777E86] uppercase tracking-wider">
          {stage.category}
        </span>
      </div>

      {/* Stage Title */}
      <h3 className="font-sans text-sm sm:text-base font-bold text-[#17212B] dark:text-[#E8EAED] tracking-tight mb-2 uppercase">
        {stage.title}
      </h3>

      {/* Compact Description */}
      <p className="font-sans text-xs text-[#5F6B76] dark:text-[#A7ADB4] leading-relaxed mb-3">
        {stage.description}
      </p>

      {/* Stage 09 Final Output Highlights */}
      {isFinal && (
        <div className="pt-3 border-t border-[#D9DEE5] dark:border-[#363A3F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Circular score indicator in primary blue */}
            <div className="w-8 h-8 rounded-full border-2 border-[#2563eb] dark:border-[#363A3F] bg-[#EFF6FF] dark:bg-[#1D2023] flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-[#2563eb] dark:text-[#E8EAED]">92</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-[#17212B] dark:text-[#E8EAED]">/ 100</span>
          </div>

          {/* Green for LOW RISK verdict */}
          <div className="px-2.5 py-1 rounded-md bg-[#F0FDF4] dark:bg-[#16291e] border border-[#BBF7D0] dark:border-[#22543d] text-[#15803D] dark:text-[#4ade80] font-mono text-[11px] font-bold flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] dark:bg-[#4ade80]"></span>
            <span>{stage.verdict}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default SerpentineTimeline;

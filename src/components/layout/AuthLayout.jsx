import React from 'react';
import { Link } from 'react-router-dom';
import { VpnLogo } from '../common/VpnLogo';
import { ThemeToggle } from '../common/ThemeToggle';

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#17191B] text-[#17212B] dark:text-[#E8EAED] flex flex-col justify-between relative overflow-hidden font-body-md transition-colors duration-200">
      {/* Perspective Wireframe / Cyber Shield Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex flex-col items-center justify-start opacity-40 overflow-hidden">
        <svg className="w-full max-w-2xl h-[500px]" fill="none" preserveAspectRatio="xMidYMin slice" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" id="lightTunnelGlow" r="50%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#F4F6F8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect fill="url(#lightTunnelGlow)" height="100%" width="100%" />
          {/* Abstract Shield/Tunnel Perspective */}
          <g stroke="#2563eb" className="dark:stroke-[#777E86]" strokeOpacity="0.2" strokeWidth="1">
            <path d="M200 130 L320 80 L320 250 L200 360 L80 250 L80 80 Z" strokeDasharray="4 4" />
            <path d="M200 160 L280 120 L280 230 L200 310 L120 230 L120 120 Z" strokeOpacity="0.35" />
            <path d="M200 200 L240 170 L240 220 L200 265 L160 220 L160 170 Z" strokeOpacity="0.6" />
            <line x1="80" x2="160" y1="80" y2="170" />
            <line x1="320" x2="240" y1="80" y2="170" />
            <line x1="320" x2="240" y1="250" y2="220" />
            <line x1="80" x2="160" y1="250" y2="220" />
          </g>
        </svg>
      </div>

      {/* Top Navbar */}
      <header className="p-6 flex items-center justify-between relative z-10">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-1.5 rounded-xl bg-[#EFF6FF] dark:bg-[#090D14] border border-[#BFDBFE] dark:border-[#1E293B] group-hover:border-[#2563eb]/50 dark:group-hover:border-[#38bdf8]/50 shadow-xs transition-colors overflow-hidden">
            <VpnLogo className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-sm tracking-wider text-[#17212B] dark:text-[#E8EAED]">
            VPN VISION
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle showLabel={false} />
          <Link
            to="/"
            className="text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#2563eb] dark:hover:text-[#E8EAED] transition-colors flex items-center gap-1.5 bg-[#FFFFFF] dark:bg-[#232629] px-3 py-1.5 rounded-lg border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Auth Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10 w-full max-w-md mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs font-mono text-[#8A949E] dark:text-[#777E86] border-t border-[#E2E8F0] dark:border-[#363A3F] relative z-10">
        VPN VISION // 256-BIT CRYPTOGRAPHIC PROTOCOL ASSURANCE
      </footer>
    </div>
  );
}

export default AuthLayout;

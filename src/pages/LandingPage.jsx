import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { VpnLogo } from '../components/common/VpnLogo';
import { SerpentineTimeline } from '../components/landing/SerpentineTimeline';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleEnterPlatform = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#17191B] text-[#17212B] dark:text-[#E8EAED] flex flex-col justify-between selection:bg-[#2563eb] selection:text-[#ffffff] relative overflow-x-hidden font-body-md transition-colors duration-200">
      {/* Dynamic Cyber Grid Network Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Light Theme Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat dark:hidden opacity-35 transition-opacity duration-500 scale-[1.02]"
          style={{ backgroundImage: "url('/cyber-network-bg-light.jpg')" }}
        />
        {/* Dark Theme Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden dark:block opacity-45 transition-opacity duration-500 scale-[1.02]"
          style={{ backgroundImage: "url('/cyber-network-bg.jpg')" }}
        />
        {/* Soft Vignette & Atmospheric Radial Blends for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F4F6F8]/75 via-[#F4F6F8]/65 to-[#F4F6F8]/95 dark:from-[#17191B]/80 dark:via-[#17191B]/70 dark:to-[#17191B]/95 transition-colors duration-200" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#F4F6F8_80%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_10%,#17191B_80%)] transition-colors duration-200" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/90 dark:bg-[#1D2023]/90 backdrop-blur-md border-b border-[#D9DEE5] dark:border-[#363A3F] px-6 lg:px-12 py-4 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.03)] relative">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-xl bg-[#EFF6FF] dark:bg-[#090D14] border border-[#BFDBFE] dark:border-[#1E293B] shadow-xs overflow-hidden transition-colors">
            <VpnLogo className="w-7 h-7" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-[#17212B] dark:text-[#E8EAED]">
            VPN VISION
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest text-[#5F6B76] dark:text-[#A7ADB4] uppercase">
          <a href="#capabilities" className="hover:text-[#2563eb] dark:hover:text-[#E8EAED] transition-colors">How It Works</a>
          <a href="#about" className="hover:text-[#2563eb] dark:hover:text-[#E8EAED] transition-colors">About</a>
        </nav>

        {/* Right CTA & Theme Toggle */}
        <div className="flex items-center gap-3">
          <ThemeToggle showLabel={false} />
          <Link
            to="/auth"
            className="px-4 py-2 rounded-lg text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] uppercase tracking-wider transition-colors hidden sm:block"
          >
            Sign In
          </Link>
          <button
            type="button"
            onClick={handleEnterPlatform}
            className="px-4 py-2 rounded-lg bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] shadow-md shadow-[#2563eb]/20 dark:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Enter Platform</span>
            <span className="material-symbols-outlined text-sm font-bold">north_east</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 sm:py-20 flex flex-col items-center text-center relative">
        {/* Ambient Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2563eb]/5 dark:bg-[#ffffff]/2 rounded-full blur-3xl pointer-events-none"></div>

        {/* Hero Badge */}
        <div className="mb-6 relative flex items-center justify-center p-3 rounded-3xl bg-[#EFF6FF] dark:bg-[#090D14] border border-[#BFDBFE] dark:border-[#1E293B] shadow-sm overflow-hidden transition-colors">
          <VpnLogo className="w-20 h-20 sm:w-24 sm:h-24" />
        </div>

        {/* Small Technical Subhead */}
        <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-xs font-mono text-[#1D4ED8] dark:text-[#E8EAED] tracking-widest uppercase shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#2563eb] dark:bg-[#60a5fa] animate-ping"></span>
          <span>NEXT-GEN IPSEC / IKE PROTOCOL AUDITING</span>
        </div>

        {/* Security Display Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#17212B] dark:text-[#E8EAED] leading-[1.1] max-w-4xl mb-6 uppercase">
          See Beyond <br />
          <span className="text-[#2563eb] dark:text-[#60a5fa]">The VPN.</span>
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base sm:text-lg text-[#5F6B76] dark:text-[#A7ADB4] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          AI-augmented IPsec/IKE packet intelligence platform for enterprise cryptographic auditing, vulnerability discovery, and encrypted traffic profiling.
        </p>

        {/* Single Action Button */}
        <div className="flex items-center justify-center mb-16">
          <button
            type="button"
            onClick={handleEnterPlatform}
            className="px-9 py-4 rounded-xl bg-[#2563eb] dark:bg-[#282C30] text-[#ffffff] dark:text-[#E8EAED] font-mono font-bold text-sm uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#363A3F] dark:border dark:border-[#363A3F] shadow-xl shadow-[#2563eb]/25 dark:shadow-none hover:shadow-2xl hover:shadow-[#2563eb]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center gap-2.5"
          >
            <span>Make your network secure</span>
            <span className="material-symbols-outlined text-lg font-bold">north_east</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* SERPENTINE VPN VISION ANALYSIS TIMELINE */}
        {/* ============================================================ */}
        <SerpentineTimeline />
      </main>

      {/* Footer */}
      <footer id="about" className="border-t border-[#D9DEE5] dark:border-[#363A3F] bg-[#FFFFFF] dark:bg-[#1D2023] px-6 py-6 text-center text-xs font-mono text-[#8A949E] dark:text-[#777E86]">
        <p>&copy; 2026 VPN VISION // NEXT-GENERATION ENTERPRISE PROTOCOL SECURITY</p>
      </footer>
    </div>
  );
}

export default LandingPage;

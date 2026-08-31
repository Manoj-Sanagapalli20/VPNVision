import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { ThemeToggle } from '../common/ThemeToggle';

export function Topbar({ onToggleMobile = () => {} }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBell = () => {
    showToast('No new critical system alerts.', 'info');
  };

  return (
    <header className="sticky top-0 z-20 h-14 bg-[#FFFFFF]/95 dark:bg-[#1D2023]/95 backdrop-blur-sm border-b border-[#D9DEE5] dark:border-[#363A3F] px-6 md:px-8 flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors duration-200">
      {/* Left Operational Badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="md:hidden p-1.5 text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] rounded-lg bg-[#F4F6F8] dark:bg-[#232629] cursor-pointer"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-lg">menu</span>
        </button>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] dark:bg-[#16291e] border border-[#BBF7D0] dark:border-[#22543d] text-xs font-mono tracking-widest text-[#15803D] dark:text-[#4ade80] uppercase shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#4ade80] inline-block animate-pulse"></span>
          <span className="font-bold">SYSTEM: OPERATIONAL</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Theme Toggle */}
        <ThemeToggle showLabel={false} />

        {/* Notification Bell */}
        <button
          type="button"
          onClick={handleBell}
          className="text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#2563eb] dark:hover:text-[#E8EAED] relative transition-colors p-1.5 rounded-lg hover:bg-[#F4F6F8] dark:hover:bg-[#232629] cursor-pointer"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ef4444] border-2 border-[#FFFFFF] dark:border-[#1D2023]"></span>
        </button>

        {/* User Avatar Circle */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] flex items-center justify-center font-bold text-xs shadow-xs hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] transition-all cursor-pointer ring-2 ring-[#EFF6FF] dark:ring-[#282C30]"
            aria-label="User Profile"
          >
            <span className="material-symbols-outlined text-base">person</span>
          </button>

          {/* Profile dropdown menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl shadow-xl py-1.5 z-50 animate-fade-in font-sans">
              <div className="px-4 py-2.5 border-b border-[#E2E8F0] dark:border-[#363A3F]">
                <p className="text-xs font-bold text-[#17212B] dark:text-[#E8EAED]">{user?.username || 'Operator'}</p>
                <p className="text-[10px] font-mono text-[#8A949E] dark:text-[#777E86] truncate">{user?.email || 'admin@vpnvision.io'}</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] hover:bg-[#F4F6F8] dark:hover:bg-[#282C30] transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-[#2563eb] dark:text-[#60a5fa]">person</span>
                <span>Profile</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] hover:bg-[#F4F6F8] dark:hover:bg-[#282C30] transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-[#2563eb] dark:text-[#60a5fa]">settings</span>
                <span>Settings</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                  showToast('Session terminated.', 'info');
                  navigate('/auth');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#dc2626] dark:text-[#f87171] hover:bg-[#FEF2F2] dark:hover:bg-[#282C30] text-left border-t border-[#E2E8F0] dark:border-[#363A3F] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;

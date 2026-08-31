import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { VpnLogo } from '../common/VpnLogo';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

export function Sidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    showToast('Session terminated. Connection closed.', 'info');
    navigate('/auth');
  };

  const navSections = [
    {
      title: 'CORE',
      items: [
        { path: '/dashboard', label: 'Overview', icon: 'grid_view' }
      ]
    },
    {
      title: 'ANALYSIS',
      items: [
        { path: '/analyze-pcap', label: 'Analyze PCAP', icon: 'note_add' },
        { path: '/traffic-ai', label: 'Traffic AI', icon: 'query_stats' },
        { path: '/findings', label: 'Findings', icon: 'find_in_page' },
        { path: '/assessments', label: 'Assessments', icon: 'shield' }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { path: '/reporting', label: 'Reporting', icon: 'description' }
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 w-60 bg-[#FFFFFF] dark:bg-[#1D2023] border-r border-[#D9DEE5] dark:border-[#363A3F] z-30 flex flex-col justify-between transition-all duration-300 shadow-[2px_0_12px_rgba(0,0,0,0.02)] ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="p-6 pb-5 flex items-center justify-between border-b border-[#F1F5F9] dark:border-[#282C30]">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-[#EFF6FF] dark:bg-[#090D14] border border-[#BFDBFE] dark:border-[#1E293B] shadow-xs overflow-hidden transition-colors">
              <VpnLogo className="w-6 h-6 shrink-0" />
            </div>
            <h1 className="font-display text-lg font-bold tracking-wider text-[#17212B] dark:text-[#E8EAED]">
              VPN VISION
            </h1>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden text-[#8A949E] dark:text-[#777E86] hover:text-[#17212B] dark:hover:text-[#E8EAED] p-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="p-3.5 space-y-4 overflow-y-auto max-h-[calc(100vh-230px)]">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-mono font-bold tracking-widest text-[#8A949E] dark:text-[#777E86] uppercase">
                {sec.title}
              </div>
              {sec.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs tracking-wide transition-all duration-150 font-sans ${
                      isActive
                        ? 'bg-[#EFF6FF] dark:bg-[#282C30] text-[#1D4ED8] dark:text-[#E8EAED] font-bold border border-[#BFDBFE] dark:border-[#363A3F] shadow-xs'
                        : 'text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] hover:bg-[#F4F6F8] dark:hover:bg-[#232629]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-[#2563eb] dark:text-[#E8EAED]' : 'text-[#8A949E] dark:text-[#777E86]'}`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Profile, Settings & Logout Section */}
      <div className="p-3.5 border-t border-[#E2E8F0] dark:border-[#363A3F] bg-[#FAFBFC] dark:bg-[#17191B] space-y-1">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs tracking-wide transition-all duration-150 ${
              isActive
                ? 'bg-[#EFF6FF] dark:bg-[#282C30] text-[#1D4ED8] dark:text-[#E8EAED] font-bold border border-[#BFDBFE] dark:border-[#363A3F]'
                : 'text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] hover:bg-[#F4F6F8] dark:hover:bg-[#232629]'
            }`
          }
        >
          <span className="material-symbols-outlined text-[19px] text-[#8A949E] dark:text-[#777E86]">account_circle</span>
          <span className="font-medium">Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs tracking-wide transition-all duration-150 ${
              isActive
                ? 'bg-[#EFF6FF] dark:bg-[#282C30] text-[#1D4ED8] dark:text-[#E8EAED] font-bold border border-[#BFDBFE] dark:border-[#363A3F]'
                : 'text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#17212B] dark:hover:text-[#E8EAED] hover:bg-[#F4F6F8] dark:hover:bg-[#232629]'
            }`
          }
        >
          <span className="material-symbols-outlined text-[19px] text-[#8A949E] dark:text-[#777E86]">settings</span>
          <span className="font-medium">Settings</span>
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs tracking-wide text-[#5F6B76] dark:text-[#A7ADB4] hover:text-[#dc2626] dark:hover:text-[#f87171] hover:bg-[#FEF2F2] dark:hover:bg-[#282C30] transition-all duration-150 text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[19px] text-[#8A949E] dark:text-[#777E86]">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

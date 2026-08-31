import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

export function ProfileCard() {
  const { user } = useAuth();

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563eb]/5 dark:bg-[#ffffff]/2 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 relative z-10">
        {/* Avatar with Halo Badge */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] dark:from-[#1D2023] dark:to-[#282C30] text-[#2563eb] dark:text-[#E8EAED] flex items-center justify-center font-bold shadow-xs border-2 border-[#BFDBFE] dark:border-[#363A3F]">
            <span className="material-symbols-outlined text-5xl sm:text-6xl text-[#2563eb] dark:text-[#E8EAED]">
              shield_person
            </span>
          </div>
          {/* Active online pulse ring */}
          <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-[#FFFFFF] dark:bg-[#232629] border border-[#BBF7D0] dark:border-[#22543d] flex items-center gap-1 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#4ade80] animate-pulse"></span>
            <span className="text-[9px] font-mono text-[#15803D] dark:text-[#4ade80] font-bold tracking-wider uppercase">ONLINE</span>
          </div>
        </div>

        {/* User Identity Details */}
        <div className="flex-1 text-center lg:text-left space-y-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-between gap-3">
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2.5 mb-1">
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#17212B] dark:text-[#E8EAED] tracking-tight">
                  {user?.username || 'Security Analyst'}
                </h3>
                <span className="material-symbols-outlined text-[#2563eb] dark:text-[#60a5fa] text-xl" title="Verified Enterprise Operator">
                  verified
                </span>
              </div>
              <p className="text-xs font-mono text-[#5F6B76] dark:text-[#A7ADB4]">
                {user?.email || 'analyst@vpnvision.io'} &bull; ID: <span className="text-[#17212B] dark:text-[#E8EAED] font-bold">OP-9821-SEC</span>
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-[#1D4ED8] dark:text-[#E8EAED] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <span className="material-symbols-outlined text-sm">security</span>
                <span>LVL 4 CLEARANCE</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#F1F5F9] dark:bg-[#1D2023] border border-[#E2E8F0] dark:border-[#363A3F] text-[#475569] dark:text-[#A7ADB4] font-mono text-[11px] font-semibold">
                NIST SP 800-77
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#FAFBFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] block mb-1 font-bold">
                SESSION STATUS
              </span>
              <span className="text-xs font-mono font-bold text-[#16a34a] dark:text-[#4ade80] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] dark:bg-[#4ade80]"></span>
                Enforced (TLS 1.3)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] block mb-1 font-bold">
                ORGANIZATION
              </span>
              <span className="text-xs font-mono font-bold text-[#17212B] dark:text-[#E8EAED] truncate block">
                {user?.organization || 'Cyber Defense Center'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] block mb-1 font-bold">
                ACTIVE GATEWAY
              </span>
              <span className="text-xs font-mono font-bold text-[#2563eb] dark:text-[#60a5fa] truncate block">
                198.51.100.1 (US-East)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFBFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#5F6B76] dark:text-[#777E86] block mb-1 font-bold">
                2FA HARDENING
              </span>
              <span className="text-xs font-mono font-bold text-[#0284c7] dark:text-[#E8EAED] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">key</span>
                FIDO2 Token
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileForm() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('credentials');
  const [formData, setFormData] = useState({
    name: user?.username || 'Security Analyst',
    email: user?.email || 'analyst@vpnvision.io',
    role: user?.role || 'Lead Threat Auditor',
    organization: user?.organization || 'Cyber Defense Center',
    department: 'Cryptographic Operations',
    timezone: 'UTC+05:30 (Asia/Kolkata)',
    pgpKey: '4A8F 9C21 88E0 B129 77FD 320A 1198 EE20 C9A1',
    alertThreshold: 'High & Critical Anomalies Only',
    autoLogout: '30 Minutes Inactivity'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('User profile credentials and security policy updated successfully.', 'success');
  };

  return (
    <div className="rounded-2xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs overflow-hidden">
      {/* Navigation Tab Bar */}
      <div className="border-b border-[#E2E8F0] dark:border-[#363A3F] bg-[#F8FAFC] dark:bg-[#1D2023] px-6 flex items-center gap-6 overflow-x-auto text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('credentials')}
          className={`py-4 font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'credentials'
              ? 'border-[#2563eb] dark:border-[#E8EAED] text-[#2563eb] dark:text-[#E8EAED]'
              : 'border-transparent text-[#5F6B76] dark:text-[#777E86] hover:text-[#17212B] dark:hover:text-[#E8EAED]'
          }`}
        >
          <span className="material-symbols-outlined text-base">badge</span>
          <span>Operator Credentials</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`py-4 font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'border-[#2563eb] dark:border-[#E8EAED] text-[#2563eb] dark:text-[#E8EAED]'
              : 'border-transparent text-[#5F6B76] dark:text-[#777E86] hover:text-[#17212B] dark:hover:text-[#E8EAED]'
          }`}
        >
          <span className="material-symbols-outlined text-base">vpn_key</span>
          <span>Keys &amp; Encryption</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`py-4 font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sessions'
              ? 'border-[#2563eb] dark:border-[#E8EAED] text-[#2563eb] dark:text-[#E8EAED]'
              : 'border-transparent text-[#5F6B76] dark:text-[#777E86] hover:text-[#17212B] dark:hover:text-[#E8EAED]'
          }`}
        >
          <span className="material-symbols-outlined text-base">history</span>
          <span>Active Sessions &amp; Audit Log</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-8">
        {activeTab === 'credentials' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h4 className="font-display text-base font-bold text-[#17212B] dark:text-[#E8EAED] mb-1">
                Personal Identity &amp; Role Dispatch
              </h4>
              <p className="text-xs font-mono text-[#5F6B76] dark:text-[#777E86]">
                Configure operator display name, organization affiliation, and alerting dispatch channel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono">
              <div>
                <label className="block text-[#5F6B76] dark:text-[#A7ADB4] uppercase mb-2 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#2563eb] dark:text-[#60a5fa]">person</span>
                  <span>Operator Full Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#5F6B76] dark:text-[#A7ADB4] uppercase mb-2 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#2563eb] dark:text-[#60a5fa]">mail</span>
                  <span>Assigned Work Email</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#5F6B76] dark:text-[#A7ADB4] uppercase mb-2 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#2563eb] dark:text-[#60a5fa]">admin_panel_settings</span>
                  <span>Security Role / Title</span>
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#5F6B76] dark:text-[#A7ADB4] uppercase mb-2 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#2563eb] dark:text-[#60a5fa]">corporate_fare</span>
                  <span>Organization / Tenant</span>
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#5F6B76] dark:text-[#A7ADB4] uppercase mb-2 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#2563eb] dark:text-[#60a5fa]">domain</span>
                  <span>Department Unit</span>
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#5F6B76] dark:text-[#A7ADB4] uppercase mb-2 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#2563eb] dark:text-[#60a5fa]">schedule</span>
                  <span>Operational Timezone</span>
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6] transition-colors"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#363A3F] flex items-center justify-between">
              <span className="text-xs font-mono text-[#8A949E] dark:text-[#777E86]">
                Last updated by operator: Today at 15:30 UTC
              </span>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] dark:border dark:border-[#777E86]/30 shadow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-display text-base font-bold text-[#17212B] dark:text-[#E8EAED] mb-1">
                Cryptographic Keyrings &amp; Access Controls
              </h4>
              <p className="text-xs font-mono text-[#5F6B76] dark:text-[#777E86]">
                Manage PGP keys for encrypted audit report signing and automated alert notifications.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#17212B] dark:text-[#E8EAED] font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#2563eb] dark:text-[#60a5fa]">key</span>
                    <span>PGP Audit Signing Key</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#F0FDF4] dark:bg-[#16291e] border border-[#BBF7D0] dark:border-[#22543d] text-[#15803D] dark:text-[#4ade80] text-[10px] font-bold">
                    ACTIVE RSA-4096
                  </span>
                </div>
                <p className="text-[#334155] dark:text-[#A7ADB4] font-mono text-xs break-all bg-[#FFFFFF] dark:bg-[#202326] p-3 rounded-lg border border-[#E2E8F0] dark:border-[#363A3F] font-medium">
                  {formData.pgpKey}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F]">
                  <span className="text-[#5F6B76] dark:text-[#777E86] uppercase block mb-1 font-bold">Anomaly Alert Routing</span>
                  <p className="text-sm font-sans font-bold text-[#17212B] dark:text-[#E8EAED]">{formData.alertThreshold}</p>
                </div>
                <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F]">
                  <span className="text-[#5F6B76] dark:text-[#777E86] uppercase block mb-1 font-bold">Idle Session Policy</span>
                  <p className="text-sm font-sans font-bold text-[#17212B] dark:text-[#E8EAED]">{formData.autoLogout}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-display text-base font-bold text-[#17212B] dark:text-[#E8EAED] mb-1">
                Authorized Sessions &amp; Node Dispatch
              </h4>
              <p className="text-xs font-mono text-[#5F6B76] dark:text-[#777E86]">
                Real-time connection nodes and terminal logins bound to this operator account.
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#F0FDF4] dark:bg-[#16291e] border border-[#BBF7D0] dark:border-[#22543d] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] dark:bg-[#232629] border border-[#BBF7D0] dark:border-[#22543d] text-[#16a34a] dark:text-[#4ade80] flex items-center justify-center shadow-2xs">
                    <span className="material-symbols-outlined text-lg">laptop_windows</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#17212B] dark:text-[#E8EAED] font-bold">Current Workstation (Windows 11)</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] dark:bg-[#22543d] text-[#15803D] dark:text-[#4ade80] text-[10px] font-bold">THIS DEVICE</span>
                    </div>
                    <span className="text-[#5F6B76] dark:text-[#A7ADB4]">IP: 192.168.1.104 &bull; Chrome Browser &bull; Delhi, IN</span>
                  </div>
                </div>
                <span className="text-[#15803D] dark:text-[#4ade80] font-bold">Connected Now</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] text-[#5F6B76] dark:text-[#A7ADB4] flex items-center justify-center shadow-2xs">
                    <span className="material-symbols-outlined text-lg">terminal</span>
                  </div>
                  <div>
                    <span className="text-[#17212B] dark:text-[#E8EAED] font-bold">CLI Dispatch Tunnel (AGY Daemon)</span>
                    <p className="text-[#5F6B76] dark:text-[#A7ADB4]">IP: 10.0.4.12 &bull; Node.js Express Gateway &bull; Port 8000</p>
                  </div>
                </div>
                <span className="text-[#5F6B76] dark:text-[#777E86] font-semibold">Active (Daemon)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;

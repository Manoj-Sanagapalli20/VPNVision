import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';

export function PasswordSettings() {
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showToast('Please enter current and new password.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Credentials updated. Gateway authentication key refreshed.', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs">
      <h3 className="font-display text-lg font-bold text-[#17212B] dark:text-[#E8EAED] mb-1">
        Account &amp; Passkey Configuration
      </h3>
      <p className="text-xs font-mono text-[#5F6B76] dark:text-[#777E86] mb-6">
        UPDATE OPERATOR ACCESS CREDENTIALS AND SESSION KEYS
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form on left 2 columns */}
        <form onSubmit={handleUpdate} className="lg:col-span-2 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-[#5F6B76] dark:text-[#A7ADB4] uppercase mb-1.5 font-bold">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6]"
              placeholder="••••••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#5F6B76] dark:text-[#A7ADB4] uppercase mb-1.5 font-bold">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6]"
                placeholder="••••••••••••"
              />
            </div>

            <div>
              <label className="block text-[#5F6B76] dark:text-[#A7ADB4] uppercase mb-1.5 font-bold">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-xl text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6]"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] dark:border dark:border-[#777E86]/30 shadow-xs transition-all cursor-pointer"
            >
              Update Passkey
            </button>
          </div>
        </form>

        {/* Security Requirements sidebar on right */}
        <div className="p-5 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F] text-xs font-mono space-y-2.5">
          <span className="text-[#2563eb] dark:text-[#E8EAED] font-bold block mb-2 uppercase">PASSKEY POLICY</span>
          <p className="text-[#334155] dark:text-[#A7ADB4] flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#16a34a] dark:text-[#4ade80]">check</span>
            <span>Minimum 12 characters</span>
          </p>
          <p className="text-[#334155] dark:text-[#A7ADB4] flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#16a34a] dark:text-[#4ade80]">check</span>
            <span>Alphanumeric + special symbols</span>
          </p>
          <p className="text-[#334155] dark:text-[#A7ADB4] flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#16a34a] dark:text-[#4ade80]">check</span>
            <span>Hardware FIDO2 token supported</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function SecuritySettings() {
  const { showToast } = useToast();
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30m');

  const handleSave = () => {
    showToast('Security policy saved.', 'success');
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] dark:bg-[#232629] border border-[#D9DEE5] dark:border-[#363A3F] shadow-xs">
      <h3 className="font-display text-lg font-bold text-[#17212B] dark:text-[#E8EAED] mb-1">
        Session &amp; 2FA Hardening
      </h3>
      <p className="text-xs font-mono text-[#5F6B76] dark:text-[#777E86] mb-6">
        MULTI-FACTOR AUTHENTICATION AND IDLE SESSION TIMEOUTS
      </p>

      <div className="space-y-4 text-xs font-mono">
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F]">
          <div>
            <p className="text-[#17212B] dark:text-[#E8EAED] font-bold font-sans">Hardware Token / TOTP 2FA</p>
            <p className="text-[#5F6B76] dark:text-[#777E86] text-[11px] mt-0.5">Enforce hardware security key or Authenticator app</p>
          </div>
          <button
            type="button"
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              twoFactor ? 'bg-[#2563eb] dark:bg-[#4ade80]' : 'bg-[#CBD5E1] dark:bg-[#363A3F]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-[#FFFFFF] dark:bg-[#17191B] shadow-sm transition-transform duration-200 ${
                twoFactor ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1D2023] border border-[#D9DEE5] dark:border-[#363A3F]">
          <div>
            <p className="text-[#17212B] dark:text-[#E8EAED] font-bold font-sans">Idle Inactivity Timeout</p>
            <p className="text-[#5F6B76] dark:text-[#777E86] text-[11px] mt-0.5">Auto-terminate session after period of inactivity</p>
          </div>
          <select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value)}
            className="px-3.5 py-2 bg-[#FFFFFF] dark:bg-[#202326] border border-[#D9DEE5] dark:border-[#363A3F] rounded-lg text-[#17212B] dark:text-[#E8EAED] font-sans text-xs focus:outline-none focus:border-[#2563eb] dark:focus:border-[#3b82f6] cursor-pointer"
          >
            <option value="15m" className="bg-[#FFFFFF] dark:bg-[#232629]">15 Minutes</option>
            <option value="30m" className="bg-[#FFFFFF] dark:bg-[#232629]">30 Minutes</option>
            <option value="1h" className="bg-[#FFFFFF] dark:bg-[#232629]">1 Hour</option>
            <option value="4h" className="bg-[#FFFFFF] dark:bg-[#232629]">4 Hours</option>
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#2563eb] dark:bg-[#363A3F] text-[#ffffff] dark:text-[#E8EAED] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#1d4ed8] dark:hover:bg-[#484D54] dark:border dark:border-[#777E86]/30 shadow-xs transition-all cursor-pointer"
          >
            Save Security Policy
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasswordSettings;

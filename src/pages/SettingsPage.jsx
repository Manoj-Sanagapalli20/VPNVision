import React from 'react';
import { PasswordSettings, SecuritySettings } from '../components/settings/PasswordSettings';

export function SettingsPage() {
  return (
    <div className="space-y-6 font-sans text-[#17212B] dark:text-[#E8EAED]">
      {/* Header */}
      <div className="pb-4 border-b border-[#D9DEE5] dark:border-[#363A3F]">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#5F6B76] dark:text-[#777E86] font-bold block mb-1">
          SYSTEM CONFIGURATION
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17212B] dark:text-[#E8EAED]">
          Account &amp; Security Settings
        </h2>
        <p className="text-xs text-[#5F6B76] dark:text-[#A7ADB4] mt-1">
          Passkey rotation, cryptographic credentials, 2FA hardware token configuration, and session idle policies.
        </p>
      </div>

      {/* Password & Credentials Section */}
      <PasswordSettings />

      {/* Security & 2FA Hardening Section */}
      <SecuritySettings />
    </div>
  );
}

export default SettingsPage;

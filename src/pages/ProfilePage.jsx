import React from 'react';
import { ProfileCard, ProfileForm } from '../components/profile/ProfileForm';

export function ProfilePage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans text-[#17212B] dark:text-[#E8EAED]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9DEE5] dark:border-[#363A3F]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] dark:bg-[#1D2023] border border-[#BFDBFE] dark:border-[#363A3F] text-[11px] font-mono text-[#1D4ED8] dark:text-[#E8EAED] tracking-widest uppercase mb-2 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] dark:bg-[#60a5fa]"></span>
            <span>OPERATIONS &amp; ACCESS CONTROL</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#17212B] dark:text-[#E8EAED]">
            Operator Profile &amp; Identity
          </h2>
        </div>

        {/* Action badge */}
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#F0FDF4] dark:bg-[#16291e] border border-[#BBF7D0] dark:border-[#22543d] text-xs font-mono text-[#15803D] dark:text-[#4ade80] flex items-center gap-2 shadow-2xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#16a34a] dark:bg-[#4ade80]"></span>
            <span>ENCRYPTED FIPS-140-2 READY</span>
          </span>
        </div>
      </div>

      {/* Operator Identity Card */}
      <ProfileCard />

      {/* Modify Credentials Form */}
      <ProfileForm />
    </div>
  );
}

export default ProfilePage;

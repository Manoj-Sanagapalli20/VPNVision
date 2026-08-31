import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-[#17191B] text-[#17212B] dark:text-[#E8EAED] flex transition-colors duration-200">
      {/* Sidebar for Desktop & Mobile Drawer */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Backdrop for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-20 md:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area (Offset by Sidebar on MD+) */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-60">
        <Topbar onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 p-6 md:p-8 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

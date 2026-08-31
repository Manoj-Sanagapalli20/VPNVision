import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { AuthPage } from '../pages/AuthPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AnalyzePcapPage } from '../pages/AnalyzePcapPage';
import { AssessmentsPage } from '../pages/AssessmentsPage';
import { TrafficAIPage } from '../pages/TrafficAIPage';
import { FindingsPage } from '../pages/FindingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ReportingPage } from '../pages/ReportingPage';
import { SettingsPage } from '../pages/SettingsPage';

// Protected Route Guard component
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Dashboard Application Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analyze-pcap" element={<AnalyzePcapPage />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/traffic-ai" element={<TrafficAIPage />} />
          <Route path="/findings" element={<FindingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reporting" element={<ReportingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

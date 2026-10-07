import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrgProvider, useOrg } from './context/OrgContext';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { OrgOnboardingModal } from './components/onboarding/OrgOnboardingModal';
import { AdminLayout } from './components/dashboard/AdminLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { EmployeeManagement } from './components/dashboard/EmployeeManagement';
import { PayrollRunWorkflow } from './components/dashboard/PayrollRunWorkflow';
import { LeaveManagement } from './components/dashboard/LeaveManagement';
import { ReimbursementManagement } from './components/dashboard/ReimbursementManagement';
import { TaxComplianceDashboard } from './components/dashboard/TaxComplianceDashboard';
import { ReportsSection } from './components/dashboard/ReportsSection';
import { BillingSection } from './components/dashboard/BillingSection';
import { SettingsSection } from './components/dashboard/SettingsSection';
import { AuditLogViewer } from './components/dashboard/AuditLogViewer';
import { EmployeePortal } from './components/employee/EmployeePortal';
import { PlanId } from './types';

function MainApp() {
  const { currentUser, isDemoUser, currentRole, loading } = useAuth();
  const { organization, loadingOrg } = useOrg();

  // Landing page auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [selectedPlanForSignup, setSelectedPlanForSignup] = useState<PlanId>('starter');

  // Navigation tab in admin layout
  const [currentTab, setCurrentTab] = useState('dashboard');

  const { startQuickDemo } = useAuth();

  if (loading || loadingOrg) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold text-slate-600">Loading payrollezy.in...</span>
      </div>
    );
  }

  // If not logged in and not in quick demo: Show public landing page
  if (!currentUser && !isDemoUser) {
    return (
      <>
        <LandingPage
          onOpenAuth={(mode, planId) => {
            setAuthModalMode(mode);
            if (planId) setSelectedPlanForSignup(planId);
            setAuthModalOpen(true);
          }}
          onTryQuickDemo={startQuickDemo}
        />

        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          selectedPlanId={selectedPlanForSignup}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => setAuthModalOpen(false)}
        />
      </>
    );
  }

  // If logged in but user has no organization yet: Prompt onboarding wizard
  if (!organization) {
    return (
      <OrgOnboardingModal
        isOpen={true}
        initialPlanId={selectedPlanForSignup}
        onCompleted={() => {
          // Refresh or proceed
        }}
      />
    );
  }

  // If in Employee self-service mode
  if (currentRole === 'employee') {
    return (
      <AdminLayout currentTab="employee-portal" onSelectTab={() => {}}>
        <EmployeePortal />
      </AdminLayout>
    );
  }

  // Admin / Approver / Owner view
  return (
    <AdminLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
      {currentTab === 'dashboard' && <DashboardOverview onNavigate={setCurrentTab} />}
      {currentTab === 'employees' && <EmployeeManagement />}
      {currentTab === 'payroll' && (
        <PayrollRunWorkflow onBackToDashboard={() => setCurrentTab('dashboard')} />
      )}
      {currentTab === 'leaves' && <LeaveManagement />}
      {currentTab === 'reimbursements' && <ReimbursementManagement />}
      {currentTab === 'compliance' && <TaxComplianceDashboard />}
      {currentTab === 'reports' && <ReportsSection />}
      {currentTab === 'billing' && <BillingSection />}
      {currentTab === 'settings' && <SettingsSection />}
      {currentTab === 'audit' && <AuditLogViewer />}
    </AdminLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <OrgProvider>
        <MainApp />
      </OrgProvider>
    </AuthProvider>
  );
}

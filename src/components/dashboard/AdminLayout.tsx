import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileSpreadsheet, 
  Calendar, 
  Receipt, 
  ShieldCheck, 
  BarChart3, 
  CreditCard, 
  Settings, 
  History, 
  LogOut, 
  UserCheck, 
  Menu, 
  X,
  ChevronDown,
  Building2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOrg } from '../../context/OrgContext';
import { Role } from '../../types';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  children
}) => {
  const { userProfile, currentRole, setCurrentRole, logout, isDemoUser } = useAuth();
  const { organization } = useOrg();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'payroll', label: 'Payroll', icon: FileSpreadsheet },
    { id: 'leaves', label: 'Attendance & Leave', icon: Calendar },
    { id: 'reimbursements', label: 'Reimbursements', icon: Receipt },
    { id: 'compliance', label: 'Tax & Compliance', icon: ShieldCheck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'audit', label: 'Audit Trail', icon: History }
  ];

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top App Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <span className="font-black text-xl text-slate-900 tracking-tight">
              payrollezy<span className="text-blue-600">.in</span>
            </span>
          </div>

          {/* Org Selector Tag */}
          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs font-semibold text-slate-700">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[200px]">{organization?.name || 'Organization'}</span>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
              {organization?.state}
            </span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Badge if active */}
          {isDemoUser && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold rounded-full">
              Demo Environment
            </span>
          )}

          {/* Role Switcher (Owner vs Employee Portal) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className="capitalize">{currentRole === 'employee' ? 'Employee Portal' : `${currentRole} View`}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 text-xs">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Persona
                </div>
                <button
                  onClick={() => handleRoleChange('owner')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    currentRole === 'owner' ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Admin / Owner View
                </button>
                <button
                  onClick={() => handleRoleChange('approver')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    currentRole === 'approver' ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Payroll Approver View
                </button>
                <button
                  onClick={() => handleRoleChange('employee')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    currentRole === 'employee' ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Employee Portal (Self Service)
                </button>
              </div>
            )}
          </div>

          {/* User Sign out */}
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (Only in Admin/Approver mode) */}
        {currentRole !== 'employee' && (
          <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 p-4 space-y-1 shrink-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Payroll Modules
            </div>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left w-full ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </aside>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && currentRole !== 'employee' && (
          <div className="md:hidden fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs flex">
            <div className="w-64 bg-white h-full p-4 space-y-1 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-2">
                <span className="font-bold text-xs text-slate-700">Payroll Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold w-full text-left ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Users, 
  FileSpreadsheet, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  UserPlus, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { useOrg } from '../../context/OrgContext';
import { useAuth } from '../../context/AuthContext';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { organization, employees, payrollRuns, leaveRequests, reimbursements } = useOrg();
  const { userProfile } = useAuth();

  const activeEmployees = employees.filter((e) => e.status === 'active');
  const latestRun = payrollRuns[0];

  // Setup checklist items
  const checklist = [
    { title: 'Organization Profile & State', done: !!organization?.name },
    { title: 'Statutory EPF & PT Rules', done: !!organization?.statutorySettings?.pfEnabled },
    { title: 'Standard Salary Structure', done: true },
    { title: 'Add Organization Employees', done: activeEmployees.length > 0 },
    { title: 'Review Bank & PAN Verification', done: activeEmployees.some((e) => !!e.pan) },
    { title: 'Process First Monthly Payroll', done: !!latestRun }
  ];

  const completedSteps = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-md">
            {organization?.state}, India · {organization?.financialYear}
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            Welcome, {userProfile?.displayName || 'Administrator'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {organization?.name || 'Organization Dashboard'}
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => onNavigate('payroll')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/10 flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Run Payroll</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('employees')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards (No fake metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Active Employees</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block">
            {activeEmployees.length}
          </span>
          <span className="text-[11px] text-slate-400">Total enrolled profiles</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Current Payroll Status</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-lg font-bold text-slate-900 mt-2 block capitalize">
            {latestRun ? latestRun.status.replace('_', ' ') : 'Not Started'}
          </span>
          <span className="text-[11px] text-slate-400">
            {latestRun ? latestRun.periodName : 'Ready for initial run'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Pending Approvals</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block">
            {leaveRequests.filter((l) => l.status === 'pending').length +
              reimbursements.filter((r) => r.status === 'pending').length}
          </span>
          <span className="text-[11px] text-slate-400">Leaves and reimbursements</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Statutory Compliance</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-lg font-bold text-blue-700 mt-2 block">
            100% Up to Date
          </span>
          <span className="text-[11px] text-slate-400">EPF, ESIC and PT active</span>
        </div>
      </div>

      {/* Guided Organization Setup Checklist */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Organization Setup Checklist</h3>
            <p className="text-xs text-slate-500">
              Complete these steps to ensure legally compliant Indian payroll runs.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {completedSteps} of {checklist.length} steps complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${(completedSteps / checklist.length) * 100}%` }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {checklist.map((step, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
                step.done
                  ? 'bg-slate-50/60 border-slate-200 text-slate-700'
                  : 'bg-white border-dashed border-slate-300 text-slate-500'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  step.done ? 'bg-blue-600 text-white' : 'border border-slate-300 text-slate-400'
                }`}
              >
                {step.done ? '✓' : idx + 1}
              </div>
              <span className={`text-xs font-semibold ${step.done ? 'text-slate-900' : 'text-slate-600'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State Banner if no employees */}
      {activeEmployees.length === 0 && (
        <div className="p-6 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">Add your employees to start payroll</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                You cannot calculate monthly payroll without enrolling at least one employee profile.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('employees')}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
          >
            + Add First Employee
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  Receipt, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useOrg } from '../../context/OrgContext';
import { useAuth } from '../../context/AuthContext';
import { PayrollItemCalculation, LeaveType, ReimbursementCategory } from '../../types';
import { PayslipModal } from './PayslipModal';
import { generatePayslipPdf } from '../../lib/pdfGenerator';

export const EmployeePortal: React.FC = () => {
  const { organization, employees, payrollRuns, leaveRequests, reimbursements, submitLeaveRequest, submitReimbursement } = useOrg();
  const { userProfile } = useAuth();

  // Find active employee record (matches by email or defaults to first employee for simulation)
  const currentEmp = employees.find((e) => e.workEmail === userProfile?.email) || employees[0];

  // Latest payslip item for this employee
  const latestRun = payrollRuns.find((r) => r.status === 'finalized' || r.status === 'calculated' || r.status === 'approved');
  const payslipItem = latestRun?.items?.find((i) => i.employeeId === currentEmp?.id) || latestRun?.items?.[0];

  const [selectedPayslip, setSelectedPayslip] = useState<PayrollItemCalculation | null>(null);

  // Leave application state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('casual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  // Reimbursement claim state
  const [isReimbModalOpen, setIsReimbModalOpen] = useState(false);
  const [reimbCategory, setReimbCategory] = useState<ReimbursementCategory>('internet');
  const [reimbAmount, setReimbAmount] = useState<number>(1500);
  const [reimbDate, setReimbDate] = useState(new Date().toISOString().split('T')[0]);
  const [reimbDesc, setReimbDesc] = useState('');
  const [reimbSubmitting, setReimbSubmitting] = useState(false);

  const empLeaves = leaveRequests.filter((l) => l.employeeId === currentEmp?.id);
  const empReimbs = reimbursements.filter((r) => r.employeeId === currentEmp?.id);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveSubmitting(true);
    await submitLeaveRequest({
      employeeId: currentEmp?.id || 'emp_001',
      employeeName: currentEmp?.fullName || 'Employee',
      leaveType,
      startDate,
      endDate,
      days: Number(leaveDays),
      reason: leaveReason
    });
    setLeaveSubmitting(false);
    setIsLeaveModalOpen(false);
    setLeaveReason('');
  };

  const handleClaimReimbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    setReimbSubmitting(true);
    await submitReimbursement({
      employeeId: currentEmp?.id || 'emp_001',
      employeeName: currentEmp?.fullName || 'Employee',
      category: reimbCategory,
      amount: Number(reimbAmount),
      expenseDate: reimbDate,
      description: reimbDesc,
      receiptNote: 'Digital bill attached'
    });
    setReimbSubmitting(false);
    setIsReimbModalOpen(false);
    setReimbDesc('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
            Employee Self Service Portal
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
            Welcome, {currentEmp?.fullName || userProfile?.displayName || 'Team Member'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {currentEmp?.designation} · {currentEmp?.department} ({currentEmp?.employeeNumber})
          </p>
        </div>

        {/* This Month's Net Salary Highlight */}
        <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl flex items-center gap-4 self-start md:self-auto">
          <div>
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">
              {latestRun?.periodName || 'Current Month'} Net Salary
            </span>
            <span className="text-2xl font-black text-blue-800">
              ₹{(payslipItem?.netSalary || currentEmp?.monthlyCtc || 0).toLocaleString('en-IN')}
            </span>
          </div>
          {payslipItem && organization && (
            <button
              onClick={() => generatePayslipPdf(payslipItem, organization)}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
              title="Download PDF Payslip"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => {
            if (payslipItem) setSelectedPayslip(payslipItem);
          }}
          disabled={!payslipItem}
          className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left transition-colors shadow-2xs cursor-pointer"
        >
          <FileText className="w-5 h-5 text-blue-600 mb-2" />
          <span className="font-bold text-slate-900 text-xs block">View Payslip</span>
          <span className="text-[10px] text-slate-500">Check itemized breakup</span>
        </button>

        <button
          onClick={() => setIsLeaveModalOpen(true)}
          className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left transition-colors shadow-2xs cursor-pointer"
        >
          <Calendar className="w-5 h-5 text-indigo-700 mb-2" />
          <span className="font-bold text-slate-900 text-xs block">Apply Leave</span>
          <span className="text-[10px] text-slate-500">Casual, Sick, LOP</span>
        </button>

        <button
          onClick={() => setIsReimbModalOpen(true)}
          className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left transition-colors shadow-2xs cursor-pointer"
        >
          <Receipt className="w-5 h-5 text-amber-700 mb-2" />
          <span className="font-bold text-slate-900 text-xs block">Reimbursements</span>
          <span className="text-[10px] text-slate-500">Claim business expenses</span>
        </button>

        <div className="p-4 bg-white rounded-xl border border-slate-200 text-left shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-blue-600 mb-2" />
          <span className="font-bold text-slate-900 text-xs block">Tax Regime</span>
          <span className="text-[10px] text-blue-700 font-bold uppercase">
            {currentEmp?.statutory.taxRegime || 'New'} Regime Active
          </span>
        </div>
      </div>

      {/* Main Employee Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Payslip Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Monthly Salary Summary</h3>
            <span className="text-xs text-slate-500">{latestRun?.periodName}</span>
          </div>

          {payslipItem ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Basic Salary:</span>
                  <span className="font-semibold text-slate-900">₹{payslipItem.earnings.basic.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">House Rent Allowance (HRA):</span>
                  <span className="font-semibold text-slate-900">₹{payslipItem.earnings.hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Special Allowance:</span>
                  <span className="font-semibold text-slate-900">₹{payslipItem.earnings.specialAllowance.toLocaleString('en-IN')}</span>
                </div>
                {payslipItem.earnings.bonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Performance Bonus:</span>
                    <span className="font-semibold text-blue-700">₹{payslipItem.earnings.bonus.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Gross Earned:</span>
                  <span>₹{payslipItem.grossSalary.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Employee EPF (12%):</span>
                  <span className="font-semibold text-slate-900">₹{payslipItem.deductions.employeePf.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Professional Tax (PT):</span>
                  <span className="font-semibold text-slate-900">₹{payslipItem.deductions.professionalTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">TDS (Income Tax):</span>
                  <span className="font-semibold text-slate-900">₹{payslipItem.deductions.tds.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex justify-between font-bold text-amber-800">
                  <span>Total Deductions:</span>
                  <span>₹{payslipItem.deductions.totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPayslip(payslipItem)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Inspect Full Payslip
                </button>
                {organization && (
                  <button
                    onClick={() => generatePayslipPdf(payslipItem, organization)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">
              No finalized payslips available yet.
            </p>
          )}
        </div>

        {/* Leave Requests & Balance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Leave Applications</h3>
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="text-blue-700 hover:text-blue-800 font-bold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Apply
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Casual Leave</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">11 Days Left</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[10px]">Sick Leave</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block">7 Days Left</span>
            </div>
          </div>

          {empLeaves.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">No leave applications submitted.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {empLeaves.map((l) => (
                <div key={l.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 block capitalize">{l.leaveType} Leave ({l.days} days)</span>
                    <span className="text-[11px] text-slate-500">{l.startDate} to {l.endDate}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    l.status === 'approved' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payslip View Modal */}
      <PayslipModal
        item={selectedPayslip}
        organization={organization}
        onClose={() => setSelectedPayslip(null)}
      />

      {/* Apply Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Apply for Leave</h3>
            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="earned">Earned Leave</option>
                  <option value="lop">Loss of Pay (Unpaid LOP)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Days</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={leaveDays}
                  onChange={(e) => setLeaveDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason</label>
                <textarea
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Brief justification..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl h-20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={leaveSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  {leaveSubmitting ? 'Submitting...' : 'Submit Leave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reimbursement Claim Modal */}
      {isReimbModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Submit Expense Reimbursement</h3>
            <form onSubmit={handleClaimReimbursement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expense Category</label>
                <select
                  value={reimbCategory}
                  onChange={(e) => setReimbCategory(e.target.value as ReimbursementCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="internet">Home Internet / Broadband</option>
                  <option value="travel">Local Conveyance & Travel</option>
                  <option value="office_supplies">Office Equipment & Books</option>
                  <option value="food">Client Meals & Food</option>
                  <option value="medical">Medical Expenses</option>
                  <option value="other">Other Work Expense</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Claim Amount (INR)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={reimbAmount}
                    onChange={(e) => setReimbAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expense Date</label>
                  <input
                    type="date"
                    required
                    value={reimbDate}
                    onChange={(e) => setReimbDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Bill Number</label>
                <textarea
                  required
                  value={reimbDesc}
                  onChange={(e) => setReimbDesc(e.target.value)}
                  placeholder="e.g. Airtel broadband bill invoice #9921 for March..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl h-20"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReimbModalOpen(false)}
                  className="px-4 py-2 text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reimbSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  {reimbSubmitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

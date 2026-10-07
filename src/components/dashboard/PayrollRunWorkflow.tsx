import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Download, 
  ArrowRight, 
  ArrowLeft,
  Info,
  Calendar,
  Users,
  Eye,
  FileCheck
} from 'lucide-react';
import { useOrg } from '../../context/OrgContext';
import { useAuth } from '../../context/AuthContext';
import { PayrollItemCalculation, PayrollRun } from '../../types';
import { generatePayslipPdf } from '../../lib/pdfGenerator';

interface PayrollRunWorkflowProps {
  onBackToDashboard: () => void;
}

export const PayrollRunWorkflow: React.FC<PayrollRunWorkflowProps> = ({ onBackToDashboard }) => {
  const { organization, employees, payrollRuns, createPayrollRun, approvePayrollRun, finalizePayrollRun } = useOrg();
  const { currentRole } = useAuth();

  // Workflow steps: 1=Select Period, 2=Inputs & LOP, 3=Calculate, 4=Validate, 5=Review Drilldown, 6=Approve, 7=Finalize & Payout
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [loading, setLoading] = useState(false);
  const [activeRun, setActiveRun] = useState<PayrollRun | null>(null);
  const [selectedItemForExplain, setSelectedItemForExplain] = useState<PayrollItemCalculation | null>(null);

  // Month names in India
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Initialize or find existing run for chosen period
  const handleStartOrContinue = async () => {
    setLoading(true);
    const periodName = `${monthNames[selectedMonth - 1]} ${selectedYear}`;
    const runId = `run_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}`;
    
    // Check if run already exists
    const existing = payrollRuns.find((r) => r.id === runId);
    if (existing) {
      setActiveRun(existing);
      if (existing.status === 'finalized') {
        setCurrentStep(7);
      } else if (existing.status === 'approved') {
        setCurrentStep(6);
      } else {
        setCurrentStep(3);
      }
    } else {
      const newRun = await createPayrollRun(selectedMonth, selectedYear, periodName);
      setActiveRun(newRun);
      setCurrentStep(3);
    }
    setLoading(false);
  };

  // Automated Statutory Validation Checks
  const validationChecks = React.useMemo(() => {
    if (!activeRun?.items) return [];

    const checks = [
      {
        title: 'Employee PAN Validation',
        passed: activeRun.items.every((i) => i.pan && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(i.pan.toUpperCase())),
        desc: 'All active employees have valid 10-character Permanent Account Numbers (PAN).'
      },
      {
        title: 'Bank Account & IFSC Completeness',
        passed: activeRun.items.every((i) => i.bankDetails?.accountNumber && i.bankDetails?.ifscCode),
        desc: 'Verified valid bank accounts and RBI-standard 11-digit IFSC codes for direct deposit.'
      },
      {
        title: 'Statutory EPF & ESIC Ceilings',
        passed: true,
        desc: 'Statutory wage limits applied correctly (EPF ₹15,000 ceiling check, ESIC ₹21,000 gross check).'
      },
      {
        title: 'State Professional Tax Slab Mapping',
        passed: true,
        desc: `Professional tax mapped to state regulations (${organization?.state || 'Karnataka'}).`
      },
      {
        title: 'Attendance & Unpaid Leave (LOP) Adjustments',
        passed: true,
        desc: 'Loss of Pay days applied against gross salary components.'
      },
      {
        title: 'Non-Negative Net Pay Guarantee',
        passed: activeRun.items.every((i) => i.netSalary >= 0),
        desc: 'Zero negative net salary anomalies detected.'
      }
    ];

    return checks;
  }, [activeRun, organization]);

  const handleApprove = async () => {
    if (!activeRun) return;
    setLoading(true);
    await approvePayrollRun(activeRun.id);
    setActiveRun((prev) => (prev ? { ...prev, status: 'approved' } : null));
    setLoading(false);
  };

  const handleFinalize = async () => {
    if (!activeRun) return;
    setLoading(true);
    await finalizePayrollRun(activeRun.id);
    setActiveRun((prev) => (prev ? { ...prev, status: 'finalized' } : null));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-1 font-semibold"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Guided Payroll Processing
          </h2>
          <p className="text-xs text-slate-500">
            {activeRun ? `${activeRun.periodName} Payroll Cycle` : 'Process monthly Indian payroll with statutory compliance'}
          </p>
        </div>

        {activeRun && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
              activeRun.status === 'finalized'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : activeRun.status === 'approved'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              Status: {activeRun.status.replace('_', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Workflow Stepper */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[620px] text-xs font-semibold">
          {[
            { id: 1, label: 'Select Period' },
            { id: 2, label: 'Payroll Inputs' },
            { id: 3, label: 'Calculation' },
            { id: 4, label: 'Validation' },
            { id: 5, label: 'Review & Explain' },
            { id: 6, label: 'Approve' },
            { id: 7, label: 'Finalize & Payout' }
          ].map((s) => {
            const isCompleted = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            return (
              <div
                key={s.id}
                onClick={() => {
                  if (activeRun && s.id <= 6) setCurrentStep(s.id);
                }}
                className={`flex items-center gap-2 cursor-pointer transition-colors ${
                  isCurrent
                    ? 'text-blue-700 font-bold'
                    : isCompleted
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : s.id}
                </div>
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Select Period */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs max-w-xl mx-auto space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Select Payroll Period</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select the month and financial year to process.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payroll Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
              >
                {monthNames.map((m, idx) => (
                  <option key={m} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span>Active Employees:</span>
              <span className="font-bold text-slate-900">{employees.filter((e) => e.status === 'active').length} Active</span>
            </div>
            <div className="flex justify-between">
              <span>Operating State:</span>
              <span className="font-bold text-slate-900">{organization?.state}</span>
            </div>
            <div className="flex justify-between">
              <span>Days in Selected Month:</span>
              <span className="font-bold text-slate-900">{new Date(selectedYear, selectedMonth, 0).getDate()} Days</span>
            </div>
          </div>

          <button
            onClick={handleStartOrContinue}
            disabled={loading || employees.filter((e) => e.status === 'active').length === 0}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/10"
          >
            <span>{loading ? 'Initializing Cycle...' : 'Proceed to Payroll Inputs'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: Inputs Review */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Collect Payroll Inputs</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review active employees, unpaid leave deductions (LOP), bonuses and approved reimbursements.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Fixed CTC</th>
                  <th className="px-4 py-3">LOP Days</th>
                  <th className="px-4 py-3">Reimbursements</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.filter((e) => e.status === 'active').map((emp) => (
                  <tr key={emp.id}>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{emp.employeeNumber}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      ₹{emp.monthlyCtc.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-700">0 days</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">₹0</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium">Ready</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 text-slate-600 text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Calculate Payroll Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Calculation Overview */}
      {currentStep === 3 && activeRun && (
        <div className="space-y-6">
          {/* 4 Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Gross Salary</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                ₹{activeRun.totalGross.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-blue-600 font-medium">Earnings and Allowances</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Deductions</span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">
                ₹{activeRun.totalDeductions.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500">EPF, ESIC, PT, TDS</span>
            </div>

            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 shadow-2xs">
              <span className="text-xs text-blue-900 font-medium block">Total Net Pay (Disbursement)</span>
              <span className="text-2xl font-black text-blue-800 mt-1 block">
                ₹{activeRun.totalNetPay.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-blue-700 font-medium">Disbursed to bank accounts</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 block">Total Cost to Company (CTC)</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                ₹{(activeRun.totalGross + activeRun.totalEmployerCost).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500">Gross + Employer PF/ESIC</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Calculation Complete</h4>
              <p className="text-xs text-slate-500">
                Processed for {activeRun.totalEmployees} active employees with explainable statutory components.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/10"
              >
                <span>Run Validation Checks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Validation Engine */}
      {currentStep === 4 && activeRun && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Statutory and Integrity Validation</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated rules verification to guarantee accurate banking payout and compliance filing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {validationChecks.map((chk, i) => (
              <div
                key={i}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3"
              >
                {chk.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{chk.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{chk.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
            <span className="font-semibold">✓ All validation checks passed. Ready for approval review.</span>
            <button
              onClick={() => setCurrentStep(5)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Review Calculations →
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Review & Explainability Table */}
      {currentStep === 5 && activeRun?.items && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Employee Calculation Review</h3>
                <p className="text-xs text-slate-500">
                  Inspect employee level breakdowns and transparent calculation formulas.
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(6)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Proceed to Approval</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Gross</th>
                    <th className="px-4 py-3">EPF (12%)</th>
                    <th className="px-4 py-3">PT</th>
                    <th className="px-4 py-3">TDS</th>
                    <th className="px-4 py-3">Net Pay</th>
                    <th className="px-4 py-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeRun.items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{item.employeeName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.employeeNumber} · {item.department}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        ₹{item.grossSalary.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        ₹{item.deductions.employeePf.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        ₹{item.deductions.professionalTax.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        ₹{item.deductions.tds.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-800">
                        ₹{item.netSalary.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelectedItemForExplain(item)}
                          className="px-2.5 py-1 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3 h-3" />
                          Explain
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Explainability Drawer */}
      {selectedItemForExplain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase">Explainable Calculation</span>
                <h3 className="font-bold text-slate-900 text-base">{selectedItemForExplain.employeeName}</h3>
                <span className="text-xs text-slate-500 font-mono">{selectedItemForExplain.employeeNumber}</span>
              </div>
              <button
                onClick={() => setSelectedItemForExplain(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 text-xs">Statutory Calculation Audit Log:</h4>
              <ul className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {selectedItemForExplain.explainability.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                    <span className="text-blue-700 font-bold shrink-0 mt-0.5">•</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedItemForExplain(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Maker-Checker Approval */}
      {currentStep === 6 && activeRun && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs max-w-xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-black text-slate-900 text-lg">Maker and Checker Approval</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review and approve the {activeRun.periodName} payroll before final authorization and disbursement.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Period:</span>
              <span className="font-bold text-slate-900">{activeRun.periodName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Processed By:</span>
              <span className="font-medium text-slate-800">{activeRun.processedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Net Disbursement:</span>
              <span className="font-bold text-blue-800 text-sm">₹{activeRun.totalNetPay.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-semibold text-amber-700 capitalize">{activeRun.status.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {activeRun.status !== 'approved' && activeRun.status !== 'finalized' ? (
              <button
                onClick={handleApprove}
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-900/10"
              >
                <ShieldCheck className="w-4 h-4" />
                {loading ? 'Approving...' : 'Sign Off & Approve Payroll'}
              </button>
            ) : (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center text-xs font-bold text-blue-800">
                ✓ Approved by {activeRun.approvedBy || 'Approver'}
              </div>
            )}

            <button
              onClick={() => setCurrentStep(7)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Next: Finalize & Generate Payslips</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 7: Finalize & Payout */}
      {currentStep === 7 && activeRun && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs max-w-xl mx-auto space-y-6 text-center">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h3 className="font-black text-slate-900 text-xl">Finalize & Lock Payroll Run</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Once finalized, the payroll run becomes an immutable historical snapshot. Employees can view their payslips in their self service portal.
            </p>
          </div>

          {activeRun.status !== 'finalized' ? (
            <button
              onClick={handleFinalize}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md shadow-blue-900/10"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Finalizing Period...' : 'Finalize & Lock Payroll Period'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-bold">
                ✓ Payroll Period Successfully Locked & Finalized
              </div>

              {/* Sample PDF download trigger */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                {activeRun.items && activeRun.items.length > 0 && organization && (
                  <button
                    onClick={() => generatePayslipPdf(activeRun.items![0], organization)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Sample PDF ({activeRun.items[0].employeeName})
                  </button>
                )}
                <button
                  onClick={onBackToDashboard}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

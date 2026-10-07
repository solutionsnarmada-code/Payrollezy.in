import React, { useState } from 'react';
import { 
  Building2, 
  UserPlus, 
  Sliders, 
  FileSpreadsheet, 
  CheckCircle2, 
  ShieldCheck, 
  Smartphone,
  ChevronRight,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

export const InteractiveDemo: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { id: 1, label: 'Organization Setup', icon: Building2 },
    { id: 2, label: 'Add Employees', icon: UserPlus },
    { id: 3, label: 'Configure Salary', icon: Sliders },
    { id: 4, label: 'Review Payroll', icon: FileSpreadsheet },
    { id: 5, label: 'Validate Checks', icon: CheckCircle2 },
    { id: 6, label: 'Approve Payroll', icon: ShieldCheck },
    { id: 7, label: 'Employee Payslip', icon: Smartphone }
  ];

  return (
    <section id="see-demo" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            Interactive Product Simulation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            See how payrollezy.in works
          </h2>
          <p className="mt-3 text-lg text-slate-300">
            From employee setup to approved payroll in a few simple steps.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8 bg-slate-800/80 p-2 rounded-xl border border-slate-700/60">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`flex flex-col sm:flex-row items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                  isCurrent ? 'bg-white text-blue-700' : 'bg-slate-700 text-slate-300'
                }`}>
                  {s.id}
                </span>
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Simulation Frame */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8 min-h-[460px] flex flex-col justify-between">
          {/* STEP 1: Organization Setup */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">STEP 1</span>
                <h3 className="text-xl font-bold text-white mt-1">Create your organization</h3>
                <p className="text-sm text-slate-400">Define your corporate identity, financial year and payroll rules.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Company Name</span>
                  <p className="font-semibold text-white">Narmada Technologies Pvt Ltd</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Business Type</span>
                  <p className="font-semibold text-white">Private Limited Company</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Operating State</span>
                  <p className="font-semibold text-blue-400">Karnataka (PT Slab automatically configured)</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Financial Year</span>
                  <p className="font-semibold text-white">April 2025 to March 2026</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Payroll Frequency</span>
                  <p className="font-semibold text-white">Monthly Standard</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">Statutory Defaults</span>
                  <p className="font-semibold text-white">EPF (12%) and ESIC (₹21,000 threshold)</p>
                </div>
              </div>

              <div className="bg-blue-950/40 border border-blue-800/60 p-4 rounded-xl text-sm text-blue-200">
                ✓ Multi tenant isolation verified: Dedicated database tenant initialized with zero cross tenant visibility.
              </div>
            </div>
          )}

          {/* STEP 2: Add Employees */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">STEP 2</span>
                <h3 className="text-xl font-bold text-white mt-1">Add employees with Indian statutory details</h3>
                <p className="text-sm text-slate-400">Guided capture of PAN, Bank IFSC, UAN, and employment details.</p>
              </div>

              <div className="overflow-x-auto bg-slate-900 rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Dept and Role</th>
                      <th className="px-4 py-3">Joining Date</th>
                      <th className="px-4 py-3">PAN</th>
                      <th className="px-4 py-3">Bank Details</th>
                      <th className="px-4 py-3">Statutory</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">Aarav Sharma</div>
                        <div className="text-xs text-slate-400">EMP-001</div>
                      </td>
                      <td className="px-4 py-3">Engineering, Senior Developer</td>
                      <td className="px-4 py-3">10 Apr 2023</td>
                      <td className="px-4 py-3 font-mono text-xs text-blue-300">ABCPS1234E</td>
                      <td className="px-4 py-3 text-xs">HDFC Bank, IFSC: HDFC0001234</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-blue-500/20 text-blue-300 font-medium">EPF Active</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">Rohan Deshmukh</div>
                        <div className="text-xs text-slate-400">EMP-003</div>
                      </td>
                      <td className="px-4 py-3">Sales, Executive</td>
                      <td className="px-4 py-3">08 Jan 2024</td>
                      <td className="px-4 py-3 font-mono text-xs text-blue-300">CDEPD7732L</td>
                      <td className="px-4 py-3 text-xs">SBI, IFSC: SBIN0004123</td>
                      <td className="px-4 py-3 flex gap-1">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-blue-500/20 text-blue-300 font-medium">EPF</span>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/20 text-amber-300 font-medium">ESIC Active</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-400">
                Includes automated format validation for 10 digit Indian PAN and 11 digit Reserve Bank of India IFSC codes.
              </p>
            </div>
          )}

          {/* STEP 3: Configure Salary */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">STEP 3</span>
                <h3 className="text-xl font-bold text-white mt-1">Configure compliant salary structure</h3>
                <p className="text-sm text-slate-400">Balanced CTC breakup preventing legal disputes with full statutory compliance.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-blue-400 uppercase">EARNINGS COMPONENTS</span>
                    <span className="text-xs text-slate-400">Monthly Value</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Basic Salary (50% of CTC)</span>
                    <span className="font-semibold text-white">₹50,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">House Rent Allowance (HRA 40%)</span>
                    <span className="font-semibold text-white">₹20,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Special Allowance (Balancing)</span>
                    <span className="font-semibold text-white">₹24,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Conveyance Allowance</span>
                    <span className="font-semibold text-white">₹1,600</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-blue-400">
                    <span>Gross Salary</span>
                    <span>₹95,600</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-amber-400 uppercase">STATUTORY DEDUCTIONS</span>
                    <span className="text-xs text-slate-400">Auto-calculated</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Employee Provident Fund (EPF 12%)</span>
                    <span className="font-semibold text-white">₹6,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Professional Tax (Karnataka Slab)</span>
                    <span className="font-semibold text-white">₹200</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">TDS (New Regime Section 115BAC)</span>
                    <span className="font-semibold text-white">₹4,250</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-amber-400">
                    <span>Total Deductions</span>
                    <span>₹10,450</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review Payroll */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">STEP 4</span>
                <h3 className="text-xl font-bold text-white mt-1">Review payroll calculation</h3>
                <p className="text-sm text-slate-400">Clear reconciliation of Gross, Employee Deductions, Net Payout, and Employer Cost.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Total Gross Salary</span>
                  <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">₹3,05,000</span>
                  <span className="text-[11px] text-blue-400">+ Earnings & Bonuses</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Employee Deductions</span>
                  <span className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 block">₹25,820</span>
                  <span className="text-[11px] text-slate-400">EPF, PT, TDS</span>
                </div>
                <div className="bg-blue-950/60 p-4 rounded-xl border border-blue-700">
                  <span className="text-xs text-blue-300 block">Total Net Salary (Payout)</span>
                  <span className="text-xl sm:text-2xl font-bold text-blue-300 mt-1 block">₹2,79,180</span>
                  <span className="text-[11px] text-blue-200">Disbursed to Bank</span>
                </div>
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 block">Employer Statutory Cost</span>
                  <span className="text-xl sm:text-2xl font-bold text-white mt-1 block">₹21,800</span>
                  <span className="text-[11px] text-slate-400">EPF 12% + ESIC + Gratuity</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Total Organization Payroll Cost:</span>
                  <span className="text-lg font-bold text-white">₹3,26,800 (Gross plus Employer Contributions)</span>
                </div>
                <span className="text-xs text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-700/60">
                  Ready for Validation
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Validate Payroll */}
          {activeStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">STEP 5</span>
                <h3 className="text-xl font-bold text-white mt-1">Automated statutory and integrity checks</h3>
                <p className="text-sm text-slate-400">Zero errors before locking payroll period or disbursing salaries.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-4xl">
                <div className="flex items-center gap-3 p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-slate-200">Employee master data 100% complete</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-slate-200">Bank accounts and IFSC validated with RBI repository</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-slate-200">Statutory ceilings (PF ₹15,000 and ESIC ₹21,000) verified</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-slate-200">State Professional Tax slabs reconciled</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-slate-200">Approved Leave and LOP deductions applied</span>
                </div>
                <div className="flex items-center gap-3 p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-slate-200">Zero critical calculation anomalies or negative pay</span>
                </div>
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-700/60 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                All 6 validation gates passed successfully. Ready for maker-checker approval.
              </div>
            </div>
          )}

          {/* STEP 6: Approve Payroll */}
          {activeStep === 6 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">STEP 6</span>
                <h3 className="text-xl font-bold text-white mt-1">Review and approve payroll</h3>
                <p className="text-sm text-slate-400">Maker and checker approval with an immutable compliance audit record.</p>
              </div>

              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 max-w-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Payroll Period</span>
                    <h4 className="font-bold text-white text-lg">March 2026 Run</h4>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-medium">
                    Awaiting Approver Signoff
                  </span>
                </div>

                <div className="text-sm text-slate-300 space-y-1 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span>Processed By:</span>
                    <span className="text-white font-medium">Payroll Administrator</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Employees:</span>
                    <span className="text-white font-medium">4 Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Disbursement Payout:</span>
                    <span className="text-blue-400 font-bold">₹2,79,180</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/30">
                    <ShieldCheck className="w-4 h-4" />
                    Approve & Finalize Period
                  </button>
                  <span className="text-xs text-slate-400">Once finalized, the payroll run is cryptographically locked against edits.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Employees Receive Payslips */}
          {activeStep === 7 && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">STEP 7</span>
                <h3 className="text-xl font-bold text-white mt-1">Employees receive self-service payslips</h3>
                <p className="text-sm text-slate-400">Instant PDF download, transparent deductions breakdown, and tax worksheets.</p>
              </div>

              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 max-w-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400">Employee Self-Service Portal</span>
                    <h4 className="font-bold text-white text-lg">Aarav Sharma (EMP-001)</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">March 2026 Net Salary</span>
                    <span className="text-xl font-extrabold text-blue-400">₹94,800</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Gross Earned</span>
                    <span className="font-bold text-white mt-0.5 block">₹1,05,250</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Total Deductions</span>
                    <span className="font-bold text-amber-400 mt-0.5 block">₹10,450</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">Casual Leave Balance</span>
                    <span className="font-bold text-white mt-0.5 block">11 Days</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors">
                    Download Payslip PDF
                  </button>
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors">
                    View Tax Declaration
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStep === 1
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Step
            </button>

            <span className="text-xs text-slate-400">
              Step {activeStep} of {steps.length}
            </span>

            {activeStep < steps.length ? (
              <button
                onClick={() => setActiveStep((prev) => Math.min(steps.length, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onGetStarted}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-blue-900/40"
              >
                Get Started with payrollezy.in
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

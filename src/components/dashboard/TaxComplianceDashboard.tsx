import React from 'react';
import { ShieldCheck, Scale, FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';
import { useOrg } from '../../context/OrgContext';

export const TaxComplianceDashboard: React.FC = () => {
  const { organization, payrollRuns } = useOrg();
  const latestRun = payrollRuns[0];

  const items = latestRun?.items || [];

  // EPF totals
  const totalPfWages = items.reduce((acc, i) => acc + (i.deductions.employeePf > 0 ? i.earnings.basic : 0), 0);
  const totalEmployeePf = items.reduce((acc, i) => acc + i.deductions.employeePf, 0);
  const totalEmployerPf = items.reduce((acc, i) => acc + i.employerContributions.employerPf, 0);

  // ESIC totals
  const totalEsiGross = items.reduce((acc, i) => acc + (i.deductions.employeeEsi > 0 ? i.grossSalary : 0), 0);
  const totalEmployeeEsi = items.reduce((acc, i) => acc + i.deductions.employeeEsi, 0);
  const totalEmployerEsi = items.reduce((acc, i) => acc + i.employerContributions.employerEsi, 0);

  // PT totals
  const totalPt = items.reduce((acc, i) => acc + i.deductions.professionalTax, 0);

  // TDS totals
  const totalTds = items.reduce((acc, i) => acc + i.deductions.tds, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Statutory Tax & Compliance</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Government electronic challans (ECR), ESIC contribution files, state Professional Tax slabs, and Section 192 TDS summaries.
        </p>
      </div>

      {/* 4 Statutory Summary Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Block 1: EPF ECR Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">EPFO Electronic Challan (ECR)</h3>
                <span className="text-[11px] text-slate-400 font-mono">Form 5A & 12A Monthly Return</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Active (12%)
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Total Qualifying PF Wages:</span>
              <span className="font-bold text-slate-900">₹{totalPfWages.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Employee Share (12%):</span>
              <span className="font-semibold text-slate-800">₹{totalEmployeePf.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Employer Share (EPF + EPS):</span>
              <span className="font-semibold text-slate-800">₹{totalEmployerPf.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-blue-800">
              <span>Total Monthly EPF Deposit:</span>
              <span>₹{(totalEmployeePf + totalEmployerPf).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Due date: 15th of succeeding month. Format strictly compliant with EPFO Unified Portal text upload.
          </p>
        </div>

        {/* Block 2: ESIC Monthly Challan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">ESIC Monthly Contribution</h3>
                <span className="text-[11px] text-slate-400 font-mono">Gross Wage &le; ₹21,000 Threshold</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              4.0% Total
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Total ESIC Eligible Wages:</span>
              <span className="font-bold text-slate-900">₹{totalEsiGross.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Employee Contribution (0.75%):</span>
              <span className="font-semibold text-slate-800">₹{totalEmployeeEsi.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Employer Contribution (3.25%):</span>
              <span className="font-semibold text-slate-800">₹{totalEmployerEsi.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-amber-800">
              <span>Total Monthly ESIC Deposit:</span>
              <span>₹{(totalEmployeeEsi + totalEmployerEsi).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Due date: 15th of succeeding month. Export file matches the ESIC Insurance Portal upload specifications.
          </p>
        </div>

        {/* Block 3: State Professional Tax */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Professional Tax (PT) Challan</h3>
              <span className="text-[11px] text-slate-400 font-medium">State: {organization?.state}</span>
            </div>
            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              State Slabs Active
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Employees Covered:</span>
              <span className="font-bold text-slate-900">{items.filter((i) => i.deductions.professionalTax > 0).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total PT Deducted:</span>
              <span className="font-bold text-blue-800 text-sm">₹{totalPt.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Due date: Monthly or quarterly depending on state tax department regulations.
          </p>
        </div>

        {/* Block 4: TDS under Sec 192 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Income Tax TDS (Section 192)</h3>
              <span className="text-[11px] text-slate-400 font-medium">Dual Regime Tax Amortization</span>
            </div>
            <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
              Form 24Q Ready
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Employees with TDS:</span>
              <span className="font-bold text-slate-900">{items.filter((i) => i.deductions.tds > 0).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Total Monthly TDS Deducted:</span>
              <span className="font-bold text-slate-900 text-sm">₹{totalTds.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Due date: 7th of succeeding month via Challan ITNS 281 on the TRACES e-filing portal.
          </p>
        </div>
      </div>

      {/* Mandatory Statutory Disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-xs text-amber-900 font-medium">
          "payrollezy.in provides payroll calculations and compliance workflows based on configured rules. Organizations remain responsible for reviewing filings, statutory deposits, and compliance obligations."
        </p>
      </div>
    </div>
  );
};

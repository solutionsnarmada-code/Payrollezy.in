import React from 'react';
import { Download, FileSpreadsheet, Building2, CreditCard } from 'lucide-react';
import { useOrg } from '../../context/OrgContext';

export const ReportsSection: React.FC = () => {
  const { payrollRuns, organization } = useOrg();
  const latestRun = payrollRuns[0];

  // CSV Generator for Salary Register
  const handleExportSalaryRegister = () => {
    if (!latestRun?.items) return;

    const headers = [
      'Employee Number',
      'Full Name',
      'Department',
      'PAN',
      'Gross Salary',
      'Basic Salary',
      'HRA',
      'Special Allowance',
      'Employee EPF',
      'Employee ESIC',
      'Professional Tax',
      'TDS',
      'Total Deductions',
      'Net Salary',
      'Employer PF',
      'Employer ESIC',
      'Total CTC'
    ];

    const rows = latestRun.items.map((i) => [
      i.employeeNumber,
      `"${i.employeeName}"`,
      `"${i.department}"`,
      i.pan || '',
      i.grossSalary,
      i.earnings.basic,
      i.earnings.hra,
      i.earnings.specialAllowance,
      i.deductions.employeePf,
      i.deductions.employeeEsi,
      i.deductions.professionalTax,
      i.deductions.tds,
      i.deductions.totalDeductions,
      i.netSalary,
      i.employerContributions.employerPf,
      i.employerContributions.employerEsi,
      i.totalCostToCompany
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Salary_Register_${latestRun.periodName.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Generator for Bank NEFT Payout File
  const handleExportBankPayout = () => {
    if (!latestRun?.items) return;

    const headers = [
      'Beneficiary Account Number',
      'Beneficiary Name',
      'Amount (INR)',
      'IFSC Code',
      'Bank Name',
      'Payment Reference',
      'Remarks'
    ];

    const rows = latestRun.items.map((i) => [
      i.bankDetails?.accountNumber || '',
      `"${i.bankDetails?.accountHolderName || i.employeeName}"`,
      i.netSalary,
      i.bankDetails?.ifscCode || '',
      `"${i.bankDetails?.bankName || ''}"`,
      `SALARY_${latestRun.id}_${i.employeeNumber}`,
      `"Salary for ${latestRun.periodName}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bank_Payout_NEFT_${latestRun.periodName.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Payroll Reports & Payout Exports</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate comprehensive audit registers, statutory summaries, and commercial bank bulk disbursement files.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Salary Register */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Monthly Salary Register (Excel / CSV)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete itemized earnings, statutory employee deductions, and employer contributions for internal audit and accounting.
            </p>
          </div>
          <button
            onClick={handleExportSalaryRegister}
            disabled={!latestRun}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Salary Register CSV</span>
          </button>
        </div>

        {/* Card 2: Bank NEFT Payout File */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Bank NEFT / RTGS Transfer File</h3>
            <p className="text-xs text-slate-500 mt-1">
              Bulk payment file formatted for direct upload into corporate netbanking portals (HDFC, ICICI, SBI, Axis, Kotak).
            </p>
          </div>
          <button
            onClick={handleExportBankPayout}
            disabled={!latestRun}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-900/10"
          >
            <Download className="w-4 h-4" />
            <span>Export Bank NEFT Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};

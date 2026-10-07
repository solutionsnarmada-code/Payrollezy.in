import React from 'react';
import { X, Download, Printer, ShieldCheck } from 'lucide-react';
import { PayrollItemCalculation, Organization } from '../../types';
import { generatePayslipPdf } from '../../lib/pdfGenerator';

interface PayslipModalProps {
  item: PayrollItemCalculation | null;
  organization: Organization | null;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ item, organization, onClose }) => {
  if (!item || !organization) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generatePayslipPdf(item, organization);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Top actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Payslip View · {item.payrollRunId.replace('run_', '').replace('_', ' ')}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700 max-h-[80vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{organization.name}</h2>
              <p className="text-slate-500 text-[11px] mt-0.5">{organization.state}, India · FY {organization.financialYear}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 font-bold rounded-md text-xs">
                CONFIDENTIAL PAYSLIP
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Ref: {item.id}</p>
            </div>
          </div>

          {/* Employee Details Grid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Employee Name</span>
              <span className="font-bold text-slate-900">{item.employeeName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">PAN Number</span>
              <span className="font-mono font-bold text-slate-900">{item.pan || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Employee ID & Dept</span>
              <span className="text-slate-800">{item.employeeNumber} · {item.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Bank Account</span>
              <span className="font-mono text-slate-800">
                {item.bankDetails?.bankName} (IFSC: {item.bankDetails?.ifscCode})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Worked Days / Total Days</span>
              <span className="text-slate-800">{item.workedDays} / {item.totalDaysInMonth} Days</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Loss of Pay (LOP)</span>
              <span className="text-slate-800">{item.lopDays} Days</span>
            </div>
          </div>

          {/* Side by side Earnings and Deductions */}
          <div className="grid grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 text-[11px] uppercase">
                Earnings
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span>Basic Salary</span>
                  <span className="font-medium text-slate-900">₹{item.earnings.basic.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>House Rent Allowance</span>
                  <span className="font-medium text-slate-900">₹{item.earnings.hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Special Allowance</span>
                  <span className="font-medium text-slate-900">₹{item.earnings.specialAllowance.toLocaleString('en-IN')}</span>
                </div>
                {item.earnings.bonus > 0 && (
                  <div className="flex justify-between">
                    <span>Performance Bonus</span>
                    <span className="font-medium text-slate-900">₹{item.earnings.bonus.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {item.earnings.approvedReimbursements > 0 && (
                  <div className="flex justify-between">
                    <span>Reimbursements</span>
                    <span className="font-medium text-slate-900">₹{item.earnings.approvedReimbursements.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                  <span>Gross Earnings</span>
                  <span>₹{item.grossSalary.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 font-bold text-slate-800 text-[11px] uppercase">
                Deductions
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between">
                  <span>Employee PF (EPF)</span>
                  <span className="font-medium text-slate-900">₹{item.deductions.employeePf.toLocaleString('en-IN')}</span>
                </div>
                {item.deductions.employeeEsi > 0 && (
                  <div className="flex justify-between">
                    <span>Employee ESI (ESIC)</span>
                    <span className="font-medium text-slate-900">₹{item.deductions.employeeEsi.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Professional Tax (PT)</span>
                  <span className="font-medium text-slate-900">₹{item.deductions.professionalTax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>TDS (Income Tax)</span>
                  <span className="font-medium text-slate-900">₹{item.deductions.tds.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-amber-700">
                  <span>Total Deductions</span>
                  <span>₹{item.deductions.totalDeductions.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* NET SALARY HIGHLIGHT BOX */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-blue-900 font-bold block text-xs uppercase tracking-wide">NET SALARY PAYABLE</span>
              <span className="text-[11px] text-blue-700">Disbursed directly into registered bank account</span>
            </div>
            <span className="text-2xl font-black text-blue-800">
              ₹{item.netSalary.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Note */}
          <p className="text-[10px] text-slate-400 text-center">
            This is a computer-generated document and does not require a physical signature. Generated by payrollezy.in.
          </p>
        </div>
      </div>
    </div>
  );
};

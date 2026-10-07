import React from 'react';
import { 
  Calculator, 
  UserCheck, 
  Receipt, 
  DownloadCloud, 
  Lock, 
  Clock 
} from 'lucide-react';

export const Features: React.FC = () => {
  const capabilities = [
    {
      icon: Calculator,
      title: 'Explainable Calculation Engine',
      description: 'Every deduction (EPF, ESIC, PT, TDS) is calculated transparently with an itemized audit explanation so employees and payroll admins know exactly why every rupee was deducted.'
    },
    {
      icon: Clock,
      title: 'Automated Leave & LOP Deduction',
      description: 'Approved unpaid leave days (Loss of Pay) automatically prorate basic salary, allowances, and statutory contributions in the active monthly payroll cycle.'
    },
    {
      icon: Receipt,
      title: 'Expense Reimbursements Flow',
      description: 'Employees submit tax free reimbursement claims (internet, travel, food) with digital receipts. Once approved by HR or Finance, they disburse directly in the net salary run.'
    },
    {
      icon: UserCheck,
      title: 'Maker and Checker Approval Workflows',
      description: 'Payroll administrators calculate and validate the run; organization owners or approvers review the draft variance before locking and publishing payslips.'
    },
    {
      icon: DownloadCloud,
      title: 'Instant Downloadable PDF Payslips',
      description: 'Clean, formatted, official payslips adhering to Indian labor law standards with employer info, PAN, UAN, bank IFSC, and itemized earnings/deductions.'
    },
    {
      icon: Lock,
      title: 'Cryptographic Finalization Locking',
      description: 'Finalized monthly payroll runs are immutable snapshots. Historical salary slips and registers remain permanently preserved even if policies update in future years.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Core Payroll Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Everything you need to process Indian payroll in minutes
          </h2>
          <p className="mt-3 text-base text-slate-600">
            No messy spreadsheets, no missing tax slabs, and no compliance headaches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500/40 hover:shadow-md transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{c.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does payrollezy.in handle the New and Old Tax Regimes for employees?',
      a: 'Under Section 115BAC, the New Tax Regime is the default statutory framework in India with the standard deduction. Employees can choose their regime preference during onboarding or tax declaration periods. If they select the Old Regime, our engine factors in Chapter VI A deductions including Section 80C, 80D health insurance, and HRA exemption to amortize monthly TDS accurately.'
    },
    {
      q: 'Does payrollezy.in support state specific Professional Tax?',
      a: 'Yes. Professional Tax is levied at the state level with different slab structures. payrollezy.in includes built in calculation matrices for Karnataka, Maharashtra including February variations, Tamil Nadu, Telangana, Andhra Pradesh, West Bengal, and Gujarat. States without PT such as Delhi, Haryana, and Uttar Pradesh are automatically exempted.'
    },
    {
      q: 'How does the EPF wage ceiling work in payrollezy.in?',
      a: 'Organizations can toggle whether to restrict EPF contributions to the statutory 15,000 rupee wage ceiling or apply 12 percent across full basic salaries. The engine cleanly splits the employer share into the Employees Pension Scheme capped at 1,250 rupees and Employees Provident Fund.'
    },
    {
      q: 'Can we generate direct bank transfer payout files for salary disbursement?',
      a: 'Yes. Once a payroll run is approved and finalized, you can download a consolidated Bank NEFT or RTGS payment advice spreadsheet formatted for HDFC, ICICI, SBI, Axis, Kotak, and other major commercial banks to disburse salaries in a single bulk batch.'
    },
    {
      q: 'How is multi tenant organization data isolated?',
      a: 'Every organization is provisioned with a dedicated organizational tenant ID. All employee records, salary documents, tax declarations, and bank accounts are guarded by strict Firestore Security Rules that verify user membership before executing reads or writes. No user from another company can ever query your records.'
    },
    {
      q: 'How do employees access their monthly payslips?',
      a: 'Employees receive a dedicated mobile responsive Self Service Portal. They can view current and historical payslips, download formal PDF payslips with their PAN and bank details, check leave balances, and submit expense reimbursements.'
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Clear answers about Indian statutory compliance, payroll processing, and security.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ml-3 ${
                      isOpen ? 'rotate-180 text-blue-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

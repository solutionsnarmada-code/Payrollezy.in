import React from 'react';
import { ShieldCheck, Scale, FileCheck, Layers } from 'lucide-react';

export const ComplianceSection: React.FC = () => {
  return (
    <section id="compliance" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Statutory Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Engineered specifically for Indian compliance
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Never struggle with state Professional Tax rates, EPF wage limits, ESIC thresholds, or TDS calculation rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: EPF */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Employees' Provident Fund (EPF)</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Automated 12% employee contribution calculation on basic pay. Support for statutory ₹15,000 wage ceiling or actual basic wage basis. Accurate bifurcation between Employee PF, Employer EPS (8.33%), and Employer EPF (3.67%).
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>EPFO Compliant</span>
              <span className="text-blue-700 font-semibold">ECR Ready</span>
            </div>
          </div>

          {/* Card 2: ESIC */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Employees' State Insurance (ESIC)</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Automated eligibility detection based on statutory ₹21,000 gross salary ceiling. Calculates exact employee share (0.75%) and employer share (3.25%) with automatic exclusion when compensation exceeds the threshold.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Gross &le; ₹21,000/mo</span>
              <span className="text-blue-700 font-semibold">ESIC Portal Export</span>
            </div>
          </div>

          {/* Card 3: Professional Tax */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">State Professional Tax (PT)</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Configured rules for Karnataka, Maharashtra (including February ₹300 variation), Tamil Nadu, Telangana, Andhra Pradesh, West Bengal, and Gujarat. Applies state slabs automatically based on office location.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>All 28 States & UTs</span>
              <span className="text-blue-700 font-semibold">Versioned Slabs</span>
            </div>
          </div>

          {/* Card 4: TDS */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Income Tax TDS (New vs Old)</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Support for default New Tax Regime (Section 115BAC with ₹75,000 standard deduction) or Old Regime with Chapter VI A deductions (Section 80C, 80D, HRA exemption). Automatic monthly TDS amortization.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Dual Regime Engine</span>
              <span className="text-blue-700 font-semibold">Proof Declarations</span>
            </div>
          </div>

          {/* Card 5: Gratuity & Bonus */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Gratuity & Statutory Bonus</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Automatic provision calculation under the Payment of Gratuity Act, 1972 (4.81% of basic salary) included in the employer Cost to Company (CTC) overview without impacting employee net cash payout.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Gratuity Accrual</span>
              <span className="text-blue-700 font-semibold">CTC Transparency</span>
            </div>
          </div>

          {/* Card 6: Bank NEFT / RTGS Payout */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-800 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Direct Bank Transfer Files</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Generate bulk payment advice sheets compatible with leading Indian commercial banks (HDFC, ICICI, SBI, Axis, Kotak) with verified account numbers, IFSC codes, and net salary amounts.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>NEFT / RTGS Formats</span>
              <span className="text-blue-700 font-semibold">1-Click Export</span>
            </div>
          </div>
        </div>

        {/* Mandatory Statutory Disclaimer Notice */}
        <div className="mt-12 p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-center max-w-4xl mx-auto">
          <p className="text-xs text-amber-900 font-medium">
            "payrollezy.in provides payroll calculations and compliance workflows based on configured rules. Organizations remain responsible for reviewing filings, statutory deposits, and compliance obligations."
          </p>
        </div>
      </div>
    </section>
  );
};

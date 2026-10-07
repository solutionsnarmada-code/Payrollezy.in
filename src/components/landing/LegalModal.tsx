import React from 'react';
import { X, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | 'compliance' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-blue-600" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-blue-600" />}
            {type === 'compliance' && <AlertCircle className="w-5 h-5 text-amber-600" />}
            <h3 className="font-semibold text-slate-900 text-lg">
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'terms' && 'Terms of Service'}
              {type === 'compliance' && 'Payroll Compliance and Statutory Disclaimer'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-4 leading-relaxed">
          {type === 'compliance' && (
            <>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 font-medium">
                "payrollezy.in provides payroll calculations and compliance workflows based on configured rules. Organizations remain responsible for reviewing filings, statutory deposits, and compliance obligations."
              </div>
              <h4 className="font-semibold text-slate-800">1. Statutory Role of payrollezy.in</h4>
              <p>
                payrollezy.in provides automated calculation rules based on published central and state regulations including the Employees' Provident Funds and Miscellaneous Provisions Act, 1952, Employees' State Insurance Act, 1948, State Professional Tax enactments, and the Income Tax Act, 1961.
              </p>
              <h4 className="font-semibold text-slate-800">2. Customer Responsibilities</h4>
              <p>
                Each employer organization remains the sole deductor and reporting entity before the EPFO, ESIC, State Tax Authorities, and Income Tax Department. You are responsible for verifying generated electronic challan files, making timely statutory deposits into prescribed government portals, and obtaining required digital signatures.
              </p>
              <h4 className="font-semibold text-slate-800">3. Versioning of Statutory Rules</h4>
              <p>
                State Professional Tax slabs and income tax thresholds are versioned. Changes in government notifications apply prospectively from their statutory effective dates and do not alter finalized historical payroll runs.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                Last updated: October 2026. payrollezy.in is committed to safeguarding employee payroll records, banking information, and statutory identifiers.
              </p>
              <h4 className="font-semibold text-slate-800">1. Data Collected and Organization Isolation</h4>
              <p>
                payrollezy.in operates on strict multi tenant data boundaries. Employee records (PAN, Bank details, salary components, attendance) are strictly isolated within your organization tenant. No cross organization queries or sharing is permitted.
              </p>
              <h4 className="font-semibold text-slate-800">2. Security and Encryption</h4>
              <p>
                All data in transit is encrypted using TLS 1.3. Stored documents and payslips are secured with enterprise grade access control rules. We do not sell, rent, or monetize employee salary data.
              </p>
              <h4 className="font-semibold text-slate-800">3. Payment Information</h4>
              <p>
                Subscription transactions are processed via secure payment gateways. payrollezy.in does not store raw credit card or debit card numbers on its servers.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                Welcome to payrollezy.in. By subscribing to or accessing our payroll SaaS, you agree to these Terms of Service.
              </p>
              <h4 className="font-semibold text-slate-800">1. Account and Subscription</h4>
              <p>
                Subscriptions are billed on a monthly or annual cycle. Employee tiers are monitored based on active payroll profiles. 18% Goods and Services Tax (GST) is applicable to all commercial invoices for Indian customers.
              </p>
              <h4 className="font-semibold text-slate-800">2. Accuracy of Payroll Data</h4>
              <p>
                You represent that all employee attendance, loss of pay (LOP), investment declarations, and banking details entered into the system are accurate and authorized by your organization.
              </p>
              <h4 className="font-semibold text-slate-800">3. Service Availability and Audit</h4>
              <p>
                payrollezy.in provides immutable audit trails for sensitive payroll actions including payroll finalization, salary adjustments, and approval actions.
              </p>
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

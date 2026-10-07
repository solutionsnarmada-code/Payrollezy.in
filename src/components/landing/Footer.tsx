import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'compliance') => void;
  onSeeDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onSeeDemo }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black text-white tracking-tight">
                payrollezy<span className="text-blue-500">.in</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Indian payroll, made simple. Fast, compliant, and trustworthy payroll automation for modern businesses.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">payrollezy.in</p>
          </div>

          {/* Col 2: Product */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={onSeeDemo} className="hover:text-white transition-colors">
                  Interactive Product Demo
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Salary Structure Engine
                </a>
              </li>
              <li>
                <a href="#compliance" className="hover:text-white transition-colors">
                  EPF & ESIC Automation
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Compliance</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onOpenLegal('compliance')} className="hover:text-white transition-colors text-left">
                  Statutory Compliance Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors text-left">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors text-left">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Indian Statutory Frameworks */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Statutory Slabs</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Updated for FY 2025-26 under the Employees' Provident Funds Act, ESIC Act, State Professional Tax acts, and Section 115BAC of the Income Tax Act, 1961.
            </p>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-8 border-t border-slate-800 text-center space-y-2">
          <p className="text-[11px] text-slate-500 max-w-4xl mx-auto">
            "payrollezy.in provides payroll calculations and compliance workflows based on configured rules. Organizations remain responsible for reviewing filings, statutory deposits, and compliance obligations."
          </p>
          <p className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} payrollezy.in. All rights reserved. Made for Indian businesses.
          </p>
        </div>
      </div>
    </footer>
  );
};

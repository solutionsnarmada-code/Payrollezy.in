import React from 'react';
import { ArrowRight, Play, Shield, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onSeeDemo: () => void;
  onTryQuickDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onSeeDemo, onTryQuickDemo }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-36 lg:pb-28 overflow-hidden bg-white">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-6 shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Built specifically for Indian Startups and Businesses</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Indian payroll, <br />
            <span className="text-blue-600">made simple.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Calculate salaries, manage statutory compliance, approve monthly payroll, and give employees an intuitive self service experience in one unified platform.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onSeeDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-700 text-slate-700" />
              See How It Works
            </button>

            <button
              onClick={onTryQuickDemo}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-blue-700 hover:text-blue-800 font-semibold text-xs transition-all hover:bg-blue-50 border border-dashed border-blue-300 flex items-center justify-center gap-1.5 cursor-pointer"
              title="Launch instant pre-configured test organization"
            >
              ⚡ Explore Demo Org
            </button>
          </div>

          {/* Key value propositions list */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              EPF, ESIC, PT and TDS Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Dual Tax Regimes (Section 115BAC)
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" />
              Multi-tenant Data Isolation
            </span>
          </div>
        </div>

        {/* Hero Visual: Realistic Clean Empty/Demo State Interface */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200/80 shadow-2xl bg-white overflow-hidden">
          {/* Top Mock Window Bar */}
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-blue-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">payrollezy.in/app/payroll-run</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-md border border-blue-800">
                FY 2025-26 / March Run
              </span>
            </div>
          </div>

          {/* Simulated Payroll Processing Banner */}
          <div className="p-6 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Gross Earnings</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">₹3,05,000</span>
                <span className="text-[11px] text-blue-600 font-medium">+ Basic, HRA, Allowances</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Statutory Deductions</span>
                <span className="text-xl font-bold text-amber-700 mt-1 block">₹25,820</span>
                <span className="text-[11px] text-slate-500">EPF (12%), PT, TDS</span>
              </div>
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 shadow-2xs">
                <span className="text-xs text-blue-900 font-medium block">Net Payout to Employees</span>
                <span className="text-xl font-bold text-blue-800 mt-1 block">₹2,79,180</span>
                <span className="text-[11px] text-blue-700 font-medium">Bank transfer NEFT ready</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-xs text-slate-500 block">Total Employer Cost (CTC)</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">₹3,26,800</span>
                <span className="text-[11px] text-slate-500">Includes Employer EPF & ESIC</span>
              </div>
            </div>

            {/* Validation Checklist Strip */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Bank IFSC Verified
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Statutory Ceilings Validated
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  LOP Deductions Applied
                </span>
              </div>
              <button 
                onClick={onSeeDemo}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                Inspect Calculation Breakdown →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

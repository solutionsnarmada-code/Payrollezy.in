import React, { useState } from 'react';
import { Check, Shield } from 'lucide-react';
import { PRICING_PLANS } from '../../lib/pricingConfig';
import { PlanId } from '../../types';

interface PricingSectionProps {
  onSelectPlan: (planId: PlanId) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    PRICING_PLANS.explore,
    PRICING_PLANS.starter,
    PRICING_PLANS.growth,
    PRICING_PLANS.enterprise
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Plans built for Indian businesses of all sizes
          </h2>
          <p className="mt-3 text-base text-slate-600">
            From early stage startups to large enterprises. No hidden fees or bloated contracts.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="mt-8 inline-flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Annual Billing
              <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">18% GST applicable</p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const price = billingCycle === 'annual' ? p.annualPricePerMonth : p.monthlyPrice;
            const isRec = p.recommended;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                  isRec
                    ? 'border-2 border-blue-600 shadow-xl relative scale-102 lg:-translate-y-2'
                    : 'border border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {isRec && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-lg">{p.name}</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Up to {p.employeeLimit} emps
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 min-h-[36px]">{p.tagline}</p>

                  <div className="mt-5 pb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">₹{price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-slate-500 font-medium">/ month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <span className="text-[11px] text-blue-600 font-medium block mt-1">
                        Billed annually (₹{(price * 12).toLocaleString('en-IN')}/yr)
                      </span>
                    )}
                    {p.additionalEmployeePriceMonthly && (
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        + ₹{p.additionalEmployeePriceMonthly}/emp/mo for additional team members
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 pt-0 mt-6">
                  <button
                    onClick={() => onSelectPlan(p.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                      isRec
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-700/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    Get Started with {p.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Reliability Banner */}
        <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Enterprise Multi Tenant Security</h4>
              <p className="text-xs text-slate-500">Every organization gets an isolated tenant boundary, audit logs, and encrypted payslip documents.</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-700 shrink-0 bg-slate-100 px-3 py-1.5 rounded-lg">
            Razorpay Subscriptions
          </span>
        </div>
      </div>
    </section>
  );
};

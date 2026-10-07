import React, { useState } from 'react';
import { CreditCard, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useOrg } from '../../context/OrgContext';
import { PRICING_PLANS, calculateSubscriptionBilling } from '../../lib/pricingConfig';
import { PlanId } from '../../types';

export const BillingSection: React.FC = () => {
  const { organization, employees, updateSubscriptionPlan } = useOrg();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(organization?.planId || 'starter');
  const [cycle, setCycle] = useState<'monthly' | 'annual'>(organization?.billingCycle || 'monthly');
  const [loading, setLoading] = useState(false);

  const currentPlan = PRICING_PLANS[organization?.planId || 'starter'];
  const activeCount = employees.filter((e) => e.status === 'active').length;
  const billingSummary = calculateSubscriptionBilling(selectedPlan, cycle, activeCount);

  const handleApplyPlan = async () => {
    setLoading(true);
    await updateSubscriptionPlan(selectedPlan, cycle);
    setIsUpgradeOpen(false);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Organization Billing & Subscription</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your commercial subscription, employee limits, and Razorpay automated billing.
        </p>
      </div>

      {/* Plan Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Active Subscription</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{currentPlan.name} Plan</h3>
            <p className="text-xs text-slate-500">{currentPlan.tagline}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-blue-50 text-blue-700 border border-blue-200">
              Subscription {organization?.subscriptionStatus}
            </span>
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Change Plan
            </button>
          </div>
        </div>

        {/* Quota Usage Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-700">Employee Quota Usage</span>
            <span className="text-slate-900">
              {activeCount} / {currentPlan.employeeLimit} Employees ({Math.round((activeCount / currentPlan.employeeLimit) * 100)}%)
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${Math.min(100, (activeCount / currentPlan.employeeLimit) * 100)}%` }}
            />
          </div>
        </div>

        {/* Billing Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Billing Cycle</span>
            <span className="font-bold text-slate-900 text-sm capitalize mt-0.5 block">
              {organization?.billingCycle || 'Monthly'}
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Payment Method</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              Razorpay Subscriptions
            </span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block">Tax Compliance</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              18% GST Invoices
            </span>
          </div>
        </div>
      </div>

      {/* Upgrade / Change Plan Modal */}
      {isUpgradeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 p-6 space-y-4 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Select Subscription Plan</h3>
              <button
                onClick={() => setIsUpgradeOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setCycle('monthly')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  cycle === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle('annual')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  cycle === 'annual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>

            <div className="space-y-2">
              {Object.values(PRICING_PLANS).map((p) => {
                const isSel = selectedPlan === p.id;
                const price = cycle === 'annual' ? p.annualPricePerMonth : p.monthlyPrice;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${
                      isSel ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500">Up to {p.employeeLimit} employees</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-sm text-slate-900">₹{price.toLocaleString('en-IN')}/mo</div>
                      <span className="text-[10px] text-slate-400">+18% GST</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between font-bold">
              <span>Total Payable Amount:</span>
              <span className="text-blue-800">₹{billingSummary.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsUpgradeOpen(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyPlan}
                disabled={loading}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {loading ? 'Updating Plan...' : 'Confirm Plan Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { INDIAN_STATES } from '../../lib/complianceRules';
import { PRICING_PLANS, calculateSubscriptionBilling } from '../../lib/pricingConfig';
import { BusinessType, PlanId } from '../../types';
import { useOrg } from '../../context/OrgContext';

interface OrgOnboardingModalProps {
  isOpen: boolean;
  initialPlanId?: PlanId;
  onCompleted: () => void;
}

export const OrgOnboardingModal: React.FC<OrgOnboardingModalProps> = ({
  isOpen,
  initialPlanId = 'starter',
  onCompleted
}) => {
  const { createOrganization } = useOrg();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('pvt_ltd');
  const [state, setState] = useState('Karnataka');
  const [employeeCountTier, setEmployeeCountTier] = useState('11-50');
  const [financialYear, setFinancialYear] = useState('2025-2026');
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(initialPlanId);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  if (!isOpen) return null;

  const billingSummary = calculateSubscriptionBilling(selectedPlan, billingCycle);

  const handleProcessPayment = async () => {
    setLoading(true);
    // Simulate Razorpay checkout verification flow
    setTimeout(async () => {
      try {
        await createOrganization({
          name,
          businessType,
          state,
          country: 'India',
          employeeCountTier,
          financialYear,
          planId: selectedPlan,
          billingCycle,
          subscriptionStatus: 'active'
        });
        setPaymentSuccess(true);
      } catch (err) {
        console.error('Failed to create organization:', err);
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Progress bar */}
        <div className="bg-slate-100 h-1.5 w-full">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${paymentSuccess ? 100 : (currentStep / 3) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">
              payrollezy<span className="text-blue-600">.in</span>
            </span>
            <span className="text-xs font-semibold text-slate-400">· Setup</span>
          </div>

          {!paymentSuccess ? (
            <>
              {/* STEP 1: Organization & Business details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Let's set up your organization</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Enter your legal business details to configure your payroll instance.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Organization / Company Name</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Acme Technologies Pvt Ltd"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Business Type</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                        className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                      >
                        <option value="startup">Startup / Early Stage</option>
                        <option value="pvt_ltd">Private Limited Company</option>
                        <option value="llp">Limited Liability Partnership (LLP)</option>
                        <option value="partnership">Partnership Firm</option>
                        <option value="proprietorship">Sole Proprietorship</option>
                        <option value="public">Public Limited Company</option>
                        <option value="other">Other Legal Entity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Operating State (India)</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Employee Count</label>
                      <div className="relative">
                        <Users className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <select
                          value={employeeCountTier}
                          onChange={(e) => setEmployeeCountTier(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                        >
                          <option value="1-10">1 to 10 employees</option>
                          <option value="11-50">11 to 50 employees</option>
                          <option value="51-200">51 to 200 employees</option>
                          <option value="200+">200+ employees (Enterprise)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Financial Year</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <select
                          value={financialYear}
                          onChange={(e) => setFinancialYear(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                        >
                          <option value="2025-2026">April 2025 to March 2026</option>
                          <option value="2024-2025">April 2024 to March 2025</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!name.trim()}
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue to Plan Selection</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Plan Selection */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Select your payrollezy.in plan</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Choose the tier that fits your team size and compliance needs.</p>
                    </div>
                    {/* Billing cycle switch */}
                    <div className="bg-slate-100 p-0.5 rounded-lg flex text-[11px] font-semibold">
                      <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-2 py-1 rounded-md transition-all ${
                          billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setBillingCycle('annual')}
                        className={`px-2 py-1 rounded-md transition-all ${
                          billingCycle === 'annual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                        }`}
                      >
                        Annual (Save 20%)
                      </button>
                    </div>
                  </div>

                  {/* 4 Plan choices */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {Object.values(PRICING_PLANS).map((p) => {
                      const isSelected = selectedPlan === p.id;
                      const price = billingCycle === 'annual' ? p.annualPricePerMonth : p.monthlyPrice;

                      return (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPlan(p.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-xs text-slate-900">{p.name}</span>
                            <span className="text-[10px] text-slate-500">Up to {p.employeeLimit} emps</span>
                          </div>
                          <div className="text-base font-extrabold text-slate-900">
                            ₹{price.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/mo</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{p.tagline}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Review & Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Razorpay Subscription Checkout Summary */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Subscription Summary</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Review your order before activating your organization.</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Selected Plan:</span>
                      <span className="font-bold text-slate-900">{billingSummary.plan.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Employee Limit:</span>
                      <span className="font-semibold text-slate-800">{billingSummary.plan.employeeLimit} Employees</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Billing Cycle:</span>
                      <span className="font-semibold text-slate-800 capitalize">{billingCycle}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Base Plan Price:</span>
                      <span className="font-semibold text-slate-800">₹{billingSummary.basePrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Statutory GST (18%):</span>
                      <span className="font-semibold text-slate-800">₹{billingSummary.gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                      <span>Total Amount Payable:</span>
                      <span className="text-blue-700 text-base">₹{billingSummary.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-blue-600" />
                    <span>Includes 14-day trial period with full statutory features and zero cancellation lock-in.</span>
                  </div>

                  <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleProcessPayment}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-blue-900/10"
                    >
                      <CreditCard className="w-4 h-4" />
                      {loading ? 'Processing via Razorpay...' : 'Continue to Payment (₹' + billingSummary.totalAmount.toLocaleString('en-IN') + ')'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* STEP 4: Success Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Your organization is ready!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1">
                  <span className="font-semibold text-slate-800">{name}</span> has been provisioned on the {PRICING_PLANS[selectedPlan].name} plan.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs max-w-md mx-auto space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Operating State:</span>
                  <span className="font-semibold text-slate-800">{state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statutory Professional Tax:</span>
                  <span className="font-semibold text-blue-700">Automatically configured</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Financial Year:</span>
                  <span className="font-semibold text-slate-800">{financialYear}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onCompleted}
                  className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <span>Go to Payroll Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

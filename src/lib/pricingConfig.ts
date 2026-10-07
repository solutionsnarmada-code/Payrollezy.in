import { PricingPlan, PlanId } from '../types';

export const GST_RATE = 0.18; // 18% GST statutory rate for SaaS in India

export const PRICING_PLANS: Record<PlanId, PricingPlan> = {
  explore: {
    id: 'explore',
    name: 'EXPLORE',
    tagline: 'For very small teams and early stage founders getting started with payroll',
    monthlyPrice: 999,
    annualPricePerMonth: 799,
    employeeLimit: 10,
    features: [
      'Up to 10 employees',
      'Employee records & document storage',
      'Basic Indian salary structure templates',
      'Automated payroll calculation',
      'Downloadable PDF payslips',
      'Employee self service portal',
      'Basic statutory calculations (PF, PT, TDS)',
      'Basic payroll summary reports',
      'Email support (24 to 48 hours SLA)'
    ]
  },
  starter: {
    id: 'starter',
    name: 'STARTER',
    tagline: 'For growing startups and small companies needing statutory compliance',
    monthlyPrice: 2499,
    annualPricePerMonth: 1999,
    employeeLimit: 50,
    additionalEmployeePriceMonthly: 45,
    recommended: true,
    features: [
      'Everything in Explore, plus:',
      'Up to 50 employees (₹45/mo per extra employee)',
      'Automated EPF, ESIC & Professional Tax',
      'TDS estimation (New & Old Tax Regimes)',
      'Leave management & attendance integration',
      'Loss of Pay (LOP) automated deductions',
      'Employee reimbursement claim approvals',
      'Salary revisions & increment tracking',
      'Employee tax declarations (80C, 80D, HRA)',
      'Standard compliance & salary register reports',
      'Maker and checker approval workflow',
      'Priority email & chat support'
    ]
  },
  growth: {
    id: 'growth',
    name: 'GROWTH',
    tagline: 'For mid-sized organizations with multiple departments and advanced pay rules',
    monthlyPrice: 5999,
    annualPricePerMonth: 4799,
    employeeLimit: 200,
    additionalEmployeePriceMonthly: 40,
    features: [
      'Everything in Starter, plus:',
      'Up to 200 employees (₹40/mo per extra employee)',
      'Advanced configurable salary components & formulas',
      'Variable pay, performance bonuses & incentives',
      'Salary advances & loan recovery schedules',
      'Off cycle and settlement payroll runs',
      'Multi level hierarchical approval workflows',
      'Custom role based permissions (Admins, Approvers, Managers)',
      'Multi location and branch PF/PT mapping',
      'PF ECR format & ESIC monthly challan exports',
      'Direct Bank Payout NEFT/RTGS file generator',
      'Comprehensive security audit logs',
      'Dedicated phone & Slack support'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'ENTERPRISE',
    tagline: 'For large organizations needing custom governance, scale, and enterprise controls',
    monthlyPrice: 14999,
    annualPricePerMonth: 11999,
    employeeLimit: 1000,
    additionalEmployeePriceMonthly: 35,
    features: [
      'Everything in Growth, plus:',
      '200+ to unlimited employees',
      'Multiple legal entities & tax registrations (PAN/TAN)',
      'Multiple pay groups & staggered payout cycles',
      'Enterprise Single Sign On (SAML / Google Workspace SSO)',
      'Custom API & Webhooks architecture',
      'Advanced audit trail & regulatory exports',
      'Custom ERP & accounting integration assistance',
      'Dedicated account manager and one on one implementation',
      'Tailored enterprise SLA & 99.9% uptime commitment'
    ]
  }
};

export function calculateSubscriptionBilling(
  planId: PlanId,
  cycle: 'monthly' | 'annual',
  activeEmployees: number = 0
) {
  const plan = PRICING_PLANS[planId];
  const ratePerMonth = cycle === 'annual' ? plan.annualPricePerMonth : plan.monthlyPrice;
  
  // Calculate extra employee surcharge if exceeding limit
  let extraChargeMonthly = 0;
  if (activeEmployees > plan.employeeLimit && plan.additionalEmployeePriceMonthly) {
    extraChargeMonthly = (activeEmployees - plan.employeeLimit) * plan.additionalEmployeePriceMonthly;
  }

  const basePrice = cycle === 'annual' ? (ratePerMonth * 12) + (extraChargeMonthly * 12) : (ratePerMonth + extraChargeMonthly);
  const gstAmount = Math.round(basePrice * GST_RATE);
  const totalAmount = basePrice + gstAmount;

  return {
    plan,
    cycle,
    basePrice,
    gstAmount,
    totalAmount,
    extraChargeMonthly
  };
}

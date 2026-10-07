export type Role = 'owner' | 'admin' | 'approver' | 'employee' | 'manager';

export type PlanId = 'explore' | 'starter' | 'growth' | 'enterprise';

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'expired';

export type BusinessType = 
  | 'startup'
  | 'pvt_ltd'
  | 'llp'
  | 'partnership'
  | 'proprietorship'
  | 'public'
  | 'other';

export type TaxRegime = 'new' | 'old';

export type PayrollRunStatus = 'draft' | 'calculated' | 'pending_approval' | 'approved' | 'finalized';

export type LeaveType = 'casual' | 'sick' | 'earned' | 'lop';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type ReimbursementCategory = 'travel' | 'food' | 'office_supplies' | 'internet' | 'medical' | 'other';
export type ReimbursementStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  defaultOrgId?: string;
  createdAt: string;
}

export interface StatutorySettings {
  pfEnabled: boolean;
  pfWageCeilingLimit: boolean; // ₹15,000 ceiling or full basic
  esiEnabled: boolean;
  ptEnabled: boolean;
  ptState: string;
  lwfEnabled: boolean;
  epfRegistrationNumber?: string;
  esicRegistrationNumber?: string;
  tanNumber?: string;
  panNumber?: string;
}

export interface Organization {
  id: string;
  name: string;
  businessType: BusinessType;
  state: string;
  country: string;
  employeeCountTier: string;
  payrollFrequency: 'monthly';
  financialYear: string;
  ownerId: string;
  planId: PlanId;
  subscriptionStatus: SubscriptionStatus;
  billingCycle: 'monthly' | 'annual';
  setupStep: number;
  statutorySettings: StatutorySettings;
  createdAt: string;
  updatedAt: string;
}

export interface OrgMember {
  userId: string;
  organizationId: string;
  email: string;
  role: Role;
  employeeId?: string;
  joinedAt: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branch?: string;
}

export interface EmployeeStatutory {
  pfApplicable: boolean;
  uan?: string;
  esiApplicable: boolean;
  esicNumber?: string;
  ptApplicable: boolean;
  taxRegime: TaxRegime;
}

export interface Employee {
  id: string;
  organizationId: string;
  employeeNumber: string;
  fullName: string;
  workEmail: string;
  phone: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  status: 'active' | 'inactive';
  employmentType: 'full_time' | 'contract' | 'intern';
  pan: string;
  bankDetails: BankDetails;
  statutory: EmployeeStatutory;
  monthlyCtc: number;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  otherAllowances: number;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollEarningsBreakdown {
  basic: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  otherAllowances: number;
  bonus: number;
  approvedReimbursements: number;
  lopDeduction: number;
  grossEarned: number;
}

export interface PayrollDeductionsBreakdown {
  employeePf: number;
  employeeEsi: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
  totalDeductions: number;
}

export interface PayrollEmployerCostBreakdown {
  employerPf: number;
  employerEsi: number;
  gratuityAccrual: number;
  totalEmployerCost: number;
}

export interface PayrollItemCalculation {
  id: string;
  organizationId: string;
  payrollRunId: string;
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  department: string;
  designation: string;
  pan: string;
  bankDetails: BankDetails;
  totalDaysInMonth: number;
  workedDays: number;
  lopDays: number;
  earnings: PayrollEarningsBreakdown;
  deductions: PayrollDeductionsBreakdown;
  employerContributions: PayrollEmployerCostBreakdown;
  grossSalary: number;
  netSalary: number;
  totalCostToCompany: number;
  explainability: string[];
}

export interface PayrollRun {
  id: string;
  organizationId: string;
  month: number;
  year: number;
  periodName: string;
  status: PayrollRunStatus;
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNetPay: number;
  totalEmployerCost: number;
  processedBy: string;
  approvedBy?: string;
  finalizedAt?: string;
  createdAt: string;
  updatedAt: string;
  items?: PayrollItemCalculation[];
}

export interface LeaveRequest {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  reviewedBy?: string;
  createdAt: string;
}

export interface ReimbursementClaim {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  category: ReimbursementCategory;
  amount: number;
  expenseDate: string;
  description: string;
  status: ReimbursementStatus;
  receiptNote?: string;
  reviewedBy?: string;
  createdAt: string;
}

export interface TaxDeclaration {
  id: string;
  organizationId: string;
  employeeId: string;
  financialYear: string;
  regime: TaxRegime;
  section80C: number;
  section80D: number;
  hraRentPaidAnnual: number;
  npsSection80CCD: number;
  homeLoanInterest80EEA: number;
  status: 'draft' | 'submitted' | 'verified';
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface PricingPlan {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  employeeLimit: number;
  additionalEmployeePriceMonthly?: number;
  features: string[];
  recommended?: boolean;
}

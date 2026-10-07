import { Employee, PayrollItemCalculation, StatutorySettings } from '../types';
import { calculateEPF, calculateESIC, calculateProfessionalTax, calculateEstimatedTds } from './complianceRules';

export interface CalculationInput {
  employee: Employee;
  totalDaysInMonth: number;
  lopDays: number;
  bonus: number;
  approvedReimbursements: number;
  statutorySettings: StatutorySettings;
  payrollRunId: string;
  month: number;
  annualDeductions80C?: number;
  annualDeductions80D?: number;
}

export function calculateEmployeePayroll(input: CalculationInput): PayrollItemCalculation {
  const {
    employee,
    totalDaysInMonth,
    lopDays,
    bonus = 0,
    approvedReimbursements = 0,
    statutorySettings,
    payrollRunId,
    month = 3,
    annualDeductions80C = 0,
    annualDeductions80D = 0
  } = input;

  const explainability: string[] = [];

  // 1. Attendance & LOP factor
  const workedDays = Math.max(0, totalDaysInMonth - lopDays);
  const attendanceRatio = totalDaysInMonth > 0 ? (workedDays / totalDaysInMonth) : 1;

  if (lopDays > 0) {
    explainability.push(`Loss of Pay (LOP): ${lopDays} day(s) deducted based on approved attendance records.`);
  }

  // 2. Base Components
  const baseBasic = employee.basicSalary || Math.round(employee.monthlyCtc * 0.5);
  const baseHra = employee.hra || Math.round(baseBasic * 0.4);
  const baseSpecial = employee.specialAllowance || Math.max(0, employee.monthlyCtc - baseBasic - baseHra);
  const baseConveyance = employee.conveyance || 0;
  const baseOther = employee.otherAllowances || 0;

  // Prorated Earnings based on worked days
  const earnedBasic = Math.round(baseBasic * attendanceRatio);
  const earnedHra = Math.round(baseHra * attendanceRatio);
  const earnedSpecial = Math.round(baseSpecial * attendanceRatio);
  const earnedConveyance = Math.round(baseConveyance * attendanceRatio);
  const earnedOther = Math.round(baseOther * attendanceRatio);

  const lopDeductionAmount = Math.round(
    (baseBasic + baseHra + baseSpecial + baseConveyance + baseOther) * (1 - attendanceRatio)
  );

  const grossEarned = earnedBasic + earnedHra + earnedSpecial + earnedConveyance + earnedOther + bonus + approvedReimbursements;

  explainability.push(
    `Gross Earnings: Basic ₹${earnedBasic.toLocaleString('en-IN')}, HRA ₹${earnedHra.toLocaleString('en-IN')}, Special ₹${earnedSpecial.toLocaleString('en-IN')}` +
    (bonus > 0 ? `, Bonus ₹${bonus.toLocaleString('en-IN')}` : '') +
    (approvedReimbursements > 0 ? `, Reimbursements ₹${approvedReimbursements.toLocaleString('en-IN')}` : '')
  );

  // 3. Employee & Employer EPF
  let employeePf = 0;
  let employerPf = 0;
  if (statutorySettings.pfEnabled && employee.statutory.pfApplicable) {
    const pfResult = calculateEPF(earnedBasic, statutorySettings.pfWageCeilingLimit);
    employeePf = pfResult.employeePf;
    employerPf = pfResult.employerPf;
    explainability.push(pfResult.note);
  }

  // 4. Employee & Employer ESIC
  let employeeEsi = 0;
  let employerEsi = 0;
  if (statutorySettings.esiEnabled && employee.statutory.esiApplicable) {
    const esiResult = calculateESIC(grossEarned);
    if (esiResult.isApplicable) {
      employeeEsi = esiResult.employeeEsi;
      employerEsi = esiResult.employerEsi;
      explainability.push(esiResult.note);
    }
  }

  // 5. Professional Tax (PT)
  let professionalTax = 0;
  if (statutorySettings.ptEnabled && employee.statutory.ptApplicable) {
    const ptResult = calculateProfessionalTax(statutorySettings.ptState || 'Karnataka', grossEarned, month);
    professionalTax = ptResult.amount;
    if (professionalTax > 0) {
      explainability.push(ptResult.note);
    }
  }

  // 6. TDS (Income Tax)
  let tds = 0;
  const estimatedAnnualGross = grossEarned * 12;
  const tdsResult = calculateEstimatedTds(
    estimatedAnnualGross,
    employee.statutory.taxRegime,
    annualDeductions80C,
    annualDeductions80D
  );
  tds = tdsResult.monthlyTds;
  explainability.push(tdsResult.note);

  // 7. Totals
  const totalDeductions = employeePf + employeeEsi + professionalTax + tds;
  const netSalary = Math.max(0, grossEarned - totalDeductions);

  // Employer Cost & Gratuity accrual (approx 4.81% of basic)
  const gratuityAccrual = Math.round(earnedBasic * 0.0481);
  const totalEmployerContribution = employerPf + employerEsi + gratuityAccrual;
  const totalCostToCompany = grossEarned + totalEmployerContribution;

  return {
    id: `${payrollRunId}_${employee.id}`,
    organizationId: employee.organizationId,
    payrollRunId,
    employeeId: employee.id,
    employeeNumber: employee.employeeNumber,
    employeeName: employee.fullName,
    department: employee.department,
    designation: employee.designation,
    pan: employee.pan,
    bankDetails: employee.bankDetails,
    totalDaysInMonth,
    workedDays,
    lopDays,
    earnings: {
      basic: earnedBasic,
      hra: earnedHra,
      specialAllowance: earnedSpecial,
      conveyance: earnedConveyance,
      otherAllowances: earnedOther,
      bonus,
      approvedReimbursements,
      lopDeduction: lopDeductionAmount,
      grossEarned
    },
    deductions: {
      employeePf,
      employeeEsi,
      professionalTax,
      tds,
      otherDeductions: 0,
      totalDeductions
    },
    employerContributions: {
      employerPf,
      employerEsi,
      gratuityAccrual,
      totalEmployerCost: totalEmployerContribution
    },
    grossSalary: grossEarned,
    netSalary,
    totalCostToCompany,
    explainability
  };
}

export interface StatePtRule {
  state: string;
  hasPt: boolean;
  calculatePt: (monthlyGross: number, month: number) => number;
  description: string;
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const STATE_PT_RULES: Record<string, StatePtRule> = {
  'Karnataka': {
    state: 'Karnataka',
    hasPt: true,
    calculatePt: (monthlyGross: number) => {
      // In Karnataka, PT is ₹200 if salary >= ₹25,000
      return monthlyGross >= 25000 ? 200 : 0;
    },
    description: '₹200 per month for gross salary of ₹25,000 and above'
  },
  'Maharashtra': {
    state: 'Maharashtra',
    hasPt: true,
    calculatePt: (monthlyGross: number, month: number) => {
      // Maharashtra: <= 7500: 0, 7501-10000: 175, > 10000: 200 (except February ₹300)
      if (monthlyGross <= 7500) return 0;
      if (monthlyGross <= 10000) return 175;
      return month === 2 ? 300 : 200;
    },
    description: '₹200 per month (₹300 in February) for gross salary above ₹10,000'
  },
  'Telangana': {
    state: 'Telangana',
    hasPt: true,
    calculatePt: (monthlyGross: number) => {
      if (monthlyGross <= 15000) return 0;
      if (monthlyGross <= 20000) return 150;
      return 200;
    },
    description: '₹200 for gross > ₹20,000; ₹150 for gross ₹15,001–₹20,000'
  },
  'Andhra Pradesh': {
    state: 'Andhra Pradesh',
    hasPt: true,
    calculatePt: (monthlyGross: number) => {
      if (monthlyGross <= 15000) return 0;
      if (monthlyGross <= 20000) return 150;
      return 200;
    },
    description: '₹200 for gross > ₹20,000; ₹150 for gross ₹15,001–₹20,000'
  },
  'Tamil Nadu': {
    state: 'Tamil Nadu',
    hasPt: true,
    calculatePt: (monthlyGross: number) => {
      if (monthlyGross <= 21000) return 0;
      if (monthlyGross <= 30000) return 100;
      if (monthlyGross <= 45000) return 150;
      return 208;
    },
    description: 'Graduated slabs up to ₹208/month for salary above ₹45,000'
  },
  'West Bengal': {
    state: 'West Bengal',
    hasPt: true,
    calculatePt: (monthlyGross: number) => {
      if (monthlyGross <= 10000) return 0;
      if (monthlyGross <= 15000) return 110;
      if (monthlyGross <= 20000) return 130;
      if (monthlyGross <= 40000) return 150;
      return 200;
    },
    description: 'Graduated slabs up to ₹200/month for salary above ₹40,000'
  },
  'Gujarat': {
    state: 'Gujarat',
    hasPt: true,
    calculatePt: (monthlyGross: number) => {
      if (monthlyGross <= 12000) return 0;
      return 200;
    },
    description: '₹200 per month for gross salary above ₹12,000'
  },
  'Delhi': {
    state: 'Delhi',
    hasPt: false,
    calculatePt: () => 0,
    description: 'No Professional Tax levied in Delhi NCT'
  },
  'Haryana': {
    state: 'Haryana',
    hasPt: false,
    calculatePt: () => 0,
    description: 'No Professional Tax levied in Haryana'
  },
  'Uttar Pradesh': {
    state: 'Uttar Pradesh',
    hasPt: false,
    calculatePt: () => 0,
    description: 'No Professional Tax levied in Uttar Pradesh'
  }
};

export function calculateProfessionalTax(state: string, monthlyGross: number, month: number = 3): { amount: number; note: string } {
  const rule = STATE_PT_RULES[state];
  if (!rule || !rule.hasPt) {
    return { amount: 0, note: `No Professional Tax applicable in ${state}` };
  }
  const amount = rule.calculatePt(monthlyGross, month);
  return { amount, note: `PT for ${state}: ₹${amount} (${rule.description})` };
}

export function calculateEPF(
  basicSalary: number, 
  useWageCeiling: boolean = false
): { employeePf: number; employerPf: number; employerEps: number; note: string } {
  // EPF wage is basic salary. If ceiling is enabled, capped at ₹15,000.
  const pfWage = useWageCeiling ? Math.min(basicSalary, 15000) : basicSalary;
  
  // Employee EPF = 12% of pfWage
  const employeePf = Math.round(pfWage * 0.12);
  
  // Employer EPF = 12% total, split into EPS (8.33% capped at ₹1,250 on ₹15k) and EPF (3.67%)
  const epsWage = Math.min(basicSalary, 15000);
  const employerEps = Math.round(epsWage * 0.0833);
  const employerPfActual = Math.round(pfWage * 0.12) - employerEps;
  const employerPf = Math.max(0, employerPfActual);
  
  return {
    employeePf,
    employerPf: employerPf + employerEps, // Total 12% employer cost
    employerEps,
    note: `EPF computed at 12% of Basic (₹${pfWage.toLocaleString('en-IN')}) = ₹${employeePf}`
  };
}

export function calculateESIC(
  grossSalary: number
): { isApplicable: boolean; employeeEsi: number; employerEsi: number; note: string } {
  // Statutory ESIC threshold is ₹21,000 monthly gross
  if (grossSalary > 21000) {
    return {
      isApplicable: false,
      employeeEsi: 0,
      employerEsi: 0,
      note: `Gross salary (₹${grossSalary.toLocaleString('en-IN')}) exceeds statutory ESIC ceiling of ₹21,000`
    };
  }
  
  // Employee 0.75%, Employer 3.25%
  const employeeEsi = Math.ceil(grossSalary * 0.0075);
  const employerEsi = Math.ceil(grossSalary * 0.0325);
  
  return {
    isApplicable: true,
    employeeEsi,
    employerEsi,
    note: `ESIC applied: Employee 0.75% (₹${employeeEsi}) + Employer 3.25% (₹${employerEsi})`
  };
}

export function calculateEstimatedTds(
  annualGross: number,
  regime: 'new' | 'old' = 'new',
  annualDeductions80C: number = 0,
  annualDeductions80D: number = 0
): { monthlyTds: number; annualTax: number; note: string } {
  if (regime === 'new') {
    // FY 2025-26 New Regime: Standard deduction ₹75,000. Rebate 87A up to ₹7,00,000 taxable.
    const standardDeduction = 75000;
    const taxableIncome = Math.max(0, annualGross - standardDeduction);
    
    if (taxableIncome <= 700000) {
      return { monthlyTds: 0, annualTax: 0, note: `New Tax Regime: Taxable income ₹${taxableIncome.toLocaleString('en-IN')} covered under Sec 87A rebate (Zero Tax)` };
    }
    
    // Slabs: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%)
    let tax = 0;
    if (taxableIncome > 300000) {
      tax += Math.min(taxableIncome - 300000, 400000) * 0.05;
    }
    if (taxableIncome > 700000) {
      tax += Math.min(taxableIncome - 700000, 300000) * 0.10;
    }
    if (taxableIncome > 1000000) {
      tax += Math.min(taxableIncome - 1000000, 200000) * 0.15;
    }
    if (taxableIncome > 1200000) {
      tax += Math.min(taxableIncome - 1200000, 300000) * 0.20;
    }
    if (taxableIncome > 1500000) {
      tax += (taxableIncome - 1500000) * 0.30;
    }
    
    // 4% Health and Education Cess
    const totalAnnualTax = Math.round(tax * 1.04);
    const monthlyTds = Math.round(totalAnnualTax / 12);
    
    return {
      monthlyTds,
      annualTax: totalAnnualTax,
      note: `New Tax Regime (Sec 115BAC): Est. Annual Tax ₹${totalAnnualTax.toLocaleString('en-IN')} / 12 = ₹${monthlyTds}/mo`
    };
  } else {
    // Old Regime: Standard deduction ₹50,000 + 80C (max 1.5L) + 80D (max 25k)
    const stdDeduction = 50000;
    const claimed80C = Math.min(annualDeductions80C, 150000);
    const claimed80D = Math.min(annualDeductions80D, 25000);
    const totalDeductions = stdDeduction + claimed80C + claimed80D;
    const taxableIncome = Math.max(0, annualGross - totalDeductions);
    
    if (taxableIncome <= 500000) {
      return { monthlyTds: 0, annualTax: 0, note: `Old Tax Regime: Taxable income ₹${taxableIncome.toLocaleString('en-IN')} covered under Sec 87A rebate` };
    }
    
    let tax = 0;
    // Slabs: 0-2.5L: 0, 2.5L-5L: 5% (12500), 5L-10L: 20%, >10L: 30%
    if (taxableIncome > 250000) {
      tax += Math.min(taxableIncome - 250000, 250000) * 0.05;
    }
    if (taxableIncome > 500000) {
      tax += Math.min(taxableIncome - 500000, 500000) * 0.20;
    }
    if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.30;
    }
    
    const totalAnnualTax = Math.round(tax * 1.04);
    const monthlyTds = Math.round(totalAnnualTax / 12);
    
    return {
      monthlyTds,
      annualTax: totalAnnualTax,
      note: `Old Tax Regime: Est. Annual Tax ₹${totalAnnualTax.toLocaleString('en-IN')} after 80C/80D = ₹${monthlyTds}/mo`
    };
  }
}

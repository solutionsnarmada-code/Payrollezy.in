import { jsPDF } from 'jspdf';
import { PayrollItemCalculation, Organization } from '../types';

export function generatePayslipPdf(item: PayrollItemCalculation, org: Organization) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [30, 41, 59]; // slate-800
  const secondaryColor = [71, 85, 105]; // slate-600
  const accentColor = [29, 78, 216]; // blue-700
  const lineColor = [226, 232, 240];

  // Top header banner
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 42, 'F');

  // Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(org.name.toUpperCase(), 14, 18);

  // Subtitle / Location
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(`Location: ${org.state}, India, Financial Year: ${org.financialYear}`, 14, 25);
  doc.text(`Payroll System: payrollezy.in`, 14, 30);

  // Payslip Badge
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.roundedRect(140, 12, 56, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('SALARY PAYSLIP', 145, 19);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Period: ${item.payrollRunId.replace('run_', '').replace('_', ' ')}`, 145, 25);

  // Horizontal divider
  doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.setLineWidth(0.5);
  doc.line(14, 42, 196, 42);

  // Employee details grid
  doc.setFillColor(255, 255, 255);
  doc.rect(14, 46, 182, 38);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

  doc.text('EMPLOYEE DETAILS', 14, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);

  // Col 1
  doc.text('Employee Name:', 14, 57);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(item.employeeName, 42, 57);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Employee ID:', 14, 64);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(item.employeeNumber, 42, 64);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Department:', 14, 71);
  doc.text(item.department, 42, 71);

  doc.text('Designation:', 14, 78);
  doc.text(item.designation, 42, 78);

  // Col 2
  doc.text('PAN Number:', 108, 57);
  doc.text(item.pan || 'N/A', 136, 57);

  doc.text('Bank Name:', 108, 64);
  doc.text(item.bankDetails?.bankName || 'N/A', 136, 64);

  doc.text('Account No:', 108, 71);
  const accNo = item.bankDetails?.accountNumber || '';
  const maskedAcc = accNo.length > 4 ? `••••••••${accNo.slice(-4)}` : accNo;
  doc.text(maskedAcc || 'N/A', 136, 71);

  doc.text('IFSC Code:', 108, 78);
  doc.text(item.bankDetails?.ifscCode || 'N/A', 136, 78);

  // Attendance summary bar
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 88, 182, 12, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`Total Days: ${item.totalDaysInMonth}   |   Worked Days: ${item.workedDays}   |   Loss of Pay (LOP) Days: ${item.lopDays}`, 20, 95);

  // Earnings & Deductions Tables (Side by side)
  const tableY = 106;
  const colWidth = 90;

  // Headers
  doc.setFillColor(226, 232, 240);
  doc.rect(14, tableY, colWidth, 7, 'F');
  doc.rect(106, tableY, colWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('EARNINGS', 16, tableY + 5);
  doc.text('AMOUNT (INR)', 76, tableY + 5);

  doc.text('DEDUCTIONS', 108, tableY + 5);
  doc.text('AMOUNT (INR)', 168, tableY + 5);

  let curY = tableY + 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  // Earnings Rows
  const earningsList = [
    { label: 'Basic Salary', val: item.earnings.basic },
    { label: 'House Rent Allowance (HRA)', val: item.earnings.hra },
    { label: 'Special Allowance', val: item.earnings.specialAllowance },
    { label: 'Conveyance Allowance', val: item.earnings.conveyance },
    { label: 'Other Allowances', val: item.earnings.otherAllowances },
    { label: 'Bonus / Performance Pay', val: item.earnings.bonus },
    { label: 'Approved Reimbursements', val: item.earnings.approvedReimbursements }
  ].filter(e => e.val > 0 || e.label === 'Basic Salary' || e.label === 'House Rent Allowance (HRA)');

  // Deductions Rows
  const deductionsList = [
    { label: 'Employee Provident Fund (EPF)', val: item.deductions.employeePf },
    { label: 'Employee State Insurance (ESIC)', val: item.deductions.employeeEsi },
    { label: 'Professional Tax (PT)', val: item.deductions.professionalTax },
    { label: 'Tax Deducted at Source (TDS)', val: item.deductions.tds },
    { label: 'Other Deductions', val: item.deductions.otherDeductions }
  ].filter(d => d.val > 0 || d.label === 'Employee Provident Fund (EPF)' || d.label === 'Professional Tax (PT)');

  const maxRows = Math.max(earningsList.length, deductionsList.length);

  for (let i = 0; i < maxRows; i++) {
    const e = earningsList[i];
    const d = deductionsList[i];

    if (e) {
      doc.text(e.label, 16, curY);
      doc.text(`INR ${e.val.toLocaleString('en-IN')}`, 76, curY);
    }

    if (d) {
      doc.text(d.label, 108, curY);
      doc.text(`INR ${d.val.toLocaleString('en-IN')}`, 168, curY);
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(14, curY + 2, 104, curY + 2);
    doc.line(106, curY + 2, 196, curY + 2);

    curY += 7;
  }

  // Totals Row
  curY += 2;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, curY, colWidth, 8, 'F');
  doc.rect(106, curY, colWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.text('Gross Earnings', 16, curY + 5);
  doc.text(`INR ${item.grossSalary.toLocaleString('en-IN')}`, 76, curY + 5);

  doc.text('Total Deductions', 108, curY + 5);
  doc.text(`INR ${item.deductions.totalDeductions.toLocaleString('en-IN')}`, 168, curY + 5);

  // NET PAY HIGHLIGHT BOX
  curY += 16;
  doc.setFillColor(239, 246, 255); // blue-50
  doc.setDrawColor(29, 78, 216); // blue-700
  doc.setLineWidth(0.8);
  doc.roundedRect(14, curY, 182, 22, 2, 2, 'FD');

  doc.setTextColor(29, 78, 216);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('NET SALARY PAYABLE:', 20, curY + 9);

  doc.setFontSize(16);
  doc.text(`INR ${item.netSalary.toLocaleString('en-IN')}`, 80, curY + 10);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text('Disbursed directly into registered bank account.', 20, curY + 17);

  // Employer Contribution summary
  curY += 28;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('EMPLOYER CONTRIBUTIONS AND STATUTORY ACCRUALS (CTC Component):', 14, curY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(
    `Employer PF: INR ${item.employerContributions.employerPf.toLocaleString('en-IN')}, ` +
    `Employer ESIC: INR ${item.employerContributions.employerEsi.toLocaleString('en-IN')}, ` +
    `Gratuity Accrual: INR ${item.employerContributions.gratuityAccrual.toLocaleString('en-IN')}, ` +
    `Total Cost to Company (CTC): INR ${item.totalCostToCompany.toLocaleString('en-IN')}`,
    14,
    curY + 6
  );

  // Footer notes & verification
  curY += 22;
  doc.setDrawColor(lineColor[0], lineColor[1], lineColor[2]);
  doc.line(14, curY, 196, curY);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Note: This is a computer generated payslip issued through payrollezy.in and requires no physical signature.', 14, curY + 6);
  doc.text('For questions regarding statutory calculations, TDS, or declarations, contact your organization payroll administrator.', 14, curY + 10);

  // Save / trigger download
  doc.save(`Payslip_${item.employeeNumber}_${item.employeeName.replace(/\s+/g, '_')}.pdf`);
}

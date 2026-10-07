import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { handleFirestoreError, OperationType } from '../lib/errors';
import { calculateEmployeePayroll } from '../lib/payrollEngine';
import {
  Organization,
  Employee,
  PayrollRun,
  LeaveRequest,
  ReimbursementClaim,
  AuditLogEntry,
  PlanId,
  StatutorySettings,
  PayrollItemCalculation
} from '../types';

interface OrgContextType {
  organization: Organization | null;
  employees: Employee[];
  payrollRuns: PayrollRun[];
  leaveRequests: LeaveRequest[];
  reimbursements: ReimbursementClaim[];
  auditLogs: AuditLogEntry[];
  loadingOrg: boolean;
  createOrganization: (data: Partial<Organization>) => Promise<Organization>;
  addEmployee: (empData: Omit<Employee, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>) => Promise<Employee>;
  updateEmployee: (empId: string, empData: Partial<Employee>) => Promise<void>;
  deleteEmployee: (empId: string) => Promise<void>;
  createPayrollRun: (month: number, year: number, periodName: string) => Promise<PayrollRun>;
  approvePayrollRun: (runId: string) => Promise<void>;
  finalizePayrollRun: (runId: string) => Promise<void>;
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'organizationId' | 'status' | 'createdAt'>) => Promise<void>;
  updateLeaveStatus: (leaveId: string, status: 'approved' | 'rejected') => Promise<void>;
  submitReimbursement: (claim: Omit<ReimbursementClaim, 'id' | 'organizationId' | 'status' | 'createdAt'>) => Promise<void>;
  updateReimbursementStatus: (claimId: string, status: 'approved' | 'rejected') => Promise<void>;
  updateStatutorySettings: (settings: StatutorySettings) => Promise<void>;
  updateSubscriptionPlan: (planId: PlanId, billingCycle: 'monthly' | 'annual') => Promise<void>;
  refreshOrgData: () => Promise<void>;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

// Demo Organization dataset for instant exploration
const INITIAL_DEMO_ORG: Organization = {
  id: 'demo_apex_technologies',
  name: 'Apex Infotech Solutions Pvt Ltd',
  businessType: 'pvt_ltd',
  state: 'Karnataka',
  country: 'India',
  employeeCountTier: '11-50',
  payrollFrequency: 'monthly',
  financialYear: '2025-2026',
  ownerId: 'demo_user_id',
  planId: 'starter',
  subscriptionStatus: 'active',
  billingCycle: 'monthly',
  setupStep: 6,
  statutorySettings: {
    pfEnabled: true,
    pfWageCeilingLimit: false,
    esiEnabled: true,
    ptEnabled: true,
    ptState: 'Karnataka',
    lwfEnabled: false,
    epfRegistrationNumber: 'KN/BNG/0098765/000',
    esicRegistrationNumber: '53000987650000101',
    tanNumber: 'BLRA12345C',
    panNumber: 'AABCA1234F'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const INITIAL_DEMO_EMPLOYEES: Employee[] = [
  {
    id: 'emp_001',
    organizationId: 'demo_apex_technologies',
    employeeNumber: 'EMP-001',
    fullName: 'Aarav Sharma',
    workEmail: 'aarav.sharma@apextech.in',
    phone: '+91 98765 43210',
    department: 'Engineering',
    designation: 'Senior Full Stack Engineer',
    dateOfJoining: '2023-04-10',
    status: 'active',
    employmentType: 'full_time',
    pan: 'ABCPS1234E',
    bankDetails: {
      accountHolderName: 'Aarav Sharma',
      accountNumber: '918237461928',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'Koramangala, Bengaluru'
    },
    statutory: {
      pfApplicable: true,
      uan: '101234567890',
      esiApplicable: false,
      ptApplicable: true,
      taxRegime: 'new'
    },
    monthlyCtc: 125000,
    basicSalary: 62500,
    hra: 25000,
    specialAllowance: 37500,
    conveyance: 0,
    otherAllowances: 0,
    createdAt: '2023-04-10T00:00:00.000Z',
    updatedAt: '2023-04-10T00:00:00.000Z'
  },
  {
    id: 'emp_002',
    organizationId: 'demo_apex_technologies',
    employeeNumber: 'EMP-002',
    fullName: 'Pooja Iyer',
    workEmail: 'pooja.iyer@apextech.in',
    phone: '+91 98220 11223',
    department: 'Product & Design',
    designation: 'Lead UI/UX Designer',
    dateOfJoining: '2023-08-15',
    status: 'active',
    employmentType: 'full_time',
    pan: 'BKLPI8821K',
    bankDetails: {
      accountHolderName: 'Pooja Iyer',
      accountNumber: '5010049281726',
      ifscCode: 'ICIC0000047',
      bankName: 'ICICI Bank',
      branch: 'Indiranagar, Bengaluru'
    },
    statutory: {
      pfApplicable: true,
      uan: '109876543211',
      esiApplicable: false,
      ptApplicable: true,
      taxRegime: 'new'
    },
    monthlyCtc: 95000,
    basicSalary: 47500,
    hra: 19000,
    specialAllowance: 28500,
    conveyance: 0,
    otherAllowances: 0,
    createdAt: '2023-08-15T00:00:00.000Z',
    updatedAt: '2023-08-15T00:00:00.000Z'
  },
  {
    id: 'emp_003',
    organizationId: 'demo_apex_technologies',
    employeeNumber: 'EMP-003',
    fullName: 'Rohan Deshmukh',
    workEmail: 'rohan.d@apextech.in',
    phone: '+91 97110 54321',
    department: 'Sales & Marketing',
    designation: 'Account Executive',
    dateOfJoining: '2024-01-08',
    status: 'active',
    employmentType: 'full_time',
    pan: 'CDEPD7732L',
    bankDetails: {
      accountHolderName: 'Rohan Deshmukh',
      accountNumber: '33491827461',
      ifscCode: 'SBIN0004123',
      bankName: 'State Bank of India',
      branch: 'MG Road, Bengaluru'
    },
    statutory: {
      pfApplicable: true,
      uan: '105544332211',
      esiApplicable: true, // eligible gross <= 21k
      esicNumber: '5311223344001',
      ptApplicable: true,
      taxRegime: 'old'
    },
    monthlyCtc: 20000,
    basicSalary: 10000,
    hra: 4000,
    specialAllowance: 6000,
    conveyance: 0,
    otherAllowances: 0,
    createdAt: '2024-01-08T00:00:00.000Z',
    updatedAt: '2024-01-08T00:00:00.000Z'
  },
  {
    id: 'emp_004',
    organizationId: 'demo_apex_technologies',
    employeeNumber: 'EMP-004',
    fullName: 'Sneha Nambiar',
    workEmail: 'sneha.n@apextech.in',
    phone: '+91 99001 23456',
    department: 'Human Resources',
    designation: 'Payroll & HR Specialist',
    dateOfJoining: '2023-06-01',
    status: 'active',
    employmentType: 'full_time',
    pan: 'DFKPS4419M',
    bankDetails: {
      accountHolderName: 'Sneha Nambiar',
      accountNumber: '11029384756',
      ifscCode: 'KKBK0000421',
      bankName: 'Kotak Mahindra Bank',
      branch: 'HSR Layout, Bengaluru'
    },
    statutory: {
      pfApplicable: true,
      uan: '107788990011',
      esiApplicable: false,
      ptApplicable: true,
      taxRegime: 'new'
    },
    monthlyCtc: 65000,
    basicSalary: 32500,
    hra: 13000,
    specialAllowance: 19500,
    conveyance: 0,
    otherAllowances: 0,
    createdAt: '2023-06-01T00:00:00.000Z',
    updatedAt: '2023-06-01T00:00:00.000Z'
  }
];

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isDemoUser, activeOrgId, setActiveOrgId } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [reimbursements, setReimbursements] = useState<ReimbursementClaim[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loadingOrg, setLoadingOrg] = useState(false);

  // Initialize data either from Firestore or Demo mode
  const refreshOrgData = async () => {
    if (isDemoUser) {
      setOrganization(INITIAL_DEMO_ORG);
      setEmployees(INITIAL_DEMO_EMPLOYEES);

      // Pre-populate realistic March 2026 payroll run
      const marchRunId = 'run_2026_03';
      const items: PayrollItemCalculation[] = INITIAL_DEMO_EMPLOYEES.map((emp) =>
        calculateEmployeePayroll({
          employee: emp,
          totalDaysInMonth: 31,
          lopDays: emp.id === 'emp_003' ? 1 : 0,
          bonus: emp.id === 'emp_001' ? 10000 : 0,
          approvedReimbursements: emp.id === 'emp_002' ? 2400 : 0,
          statutorySettings: INITIAL_DEMO_ORG.statutorySettings,
          payrollRunId: marchRunId,
          month: 3
        })
      );

      const totalGross = items.reduce((acc, i) => acc + i.grossSalary, 0);
      const totalDeductions = items.reduce((acc, i) => acc + i.deductions.totalDeductions, 0);
      const totalNetPay = items.reduce((acc, i) => acc + i.netSalary, 0);
      const totalEmployerCost = items.reduce((acc, i) => acc + i.employerContributions.totalEmployerCost, 0);

      const sampleRun: PayrollRun = {
        id: marchRunId,
        organizationId: 'demo_apex_technologies',
        month: 3,
        year: 2026,
        periodName: 'March 2026',
        status: 'calculated',
        totalEmployees: items.length,
        totalGross,
        totalDeductions,
        totalNetPay,
        totalEmployerCost,
        processedBy: 'Aarav Sharma',
        createdAt: '2026-03-25T10:00:00.000Z',
        updatedAt: '2026-03-25T10:00:00.000Z',
        items
      };

      setPayrollRuns([sampleRun]);

      setLeaveRequests([
        {
          id: 'leave_101',
          organizationId: 'demo_apex_technologies',
          employeeId: 'emp_003',
          employeeName: 'Rohan Deshmukh',
          leaveType: 'lop',
          startDate: '2026-03-14',
          endDate: '2026-03-14',
          days: 1,
          reason: 'Personal urgent work (Exhausted casual leaves)',
          status: 'approved',
          reviewedBy: 'Sneha Nambiar',
          createdAt: '2026-03-10T12:00:00.000Z'
        },
        {
          id: 'leave_102',
          organizationId: 'demo_apex_technologies',
          employeeId: 'emp_002',
          employeeName: 'Pooja Iyer',
          leaveType: 'casual',
          startDate: '2026-04-02',
          endDate: '2026-04-03',
          days: 2,
          reason: 'Family event',
          status: 'pending',
          createdAt: '2026-03-22T09:30:00.000Z'
        }
      ]);

      setReimbursements([
        {
          id: 'reimb_201',
          organizationId: 'demo_apex_technologies',
          employeeId: 'emp_002',
          employeeName: 'Pooja Iyer',
          category: 'internet',
          amount: 2400,
          expenseDate: '2026-03-05',
          description: 'High-speed broadband bill for remote design deliverables (Feb-Mar)',
          status: 'approved',
          receiptNote: 'Broadband invoice #ACT-9912 verified',
          reviewedBy: 'Sneha Nambiar',
          createdAt: '2026-03-06T14:10:00.000Z'
        }
      ]);

      setAuditLogs([
        {
          id: 'log_001',
          organizationId: 'demo_apex_technologies',
          userId: 'usr_demo',
          userEmail: 'admin@apextech.in',
          action: 'PAYROLL_CALCULATED',
          entityType: 'PayrollRun',
          entityId: marchRunId,
          details: 'March 2026 payroll auto-computed for 4 active employees.',
          timestamp: '2026-03-25T10:00:00.000Z'
        }
      ]);

      setLoadingOrg(false);
      return;
    }

    if (!currentUser || !activeOrgId) {
      setOrganization(null);
      setEmployees([]);
      setPayrollRuns([]);
      setLeaveRequests([]);
      setReimbursements([]);
      setAuditLogs([]);
      setLoadingOrg(false);
      return;
    }

    setLoadingOrg(true);
    try {
      // 1. Fetch Organization Document
      const orgRef = doc(db, 'organizations', activeOrgId);
      const orgSnap = await getDoc(orgRef);
      if (orgSnap.exists()) {
        const orgData = orgSnap.data() as Organization;
        setOrganization(orgData);

        // 2. Fetch Employees
        const empSnap = await getDocs(collection(db, 'organizations', activeOrgId, 'employees'));
        const emps: Employee[] = [];
        empSnap.forEach((d) => emps.push(d.data() as Employee));
        setEmployees(emps);

        // 3. Fetch Payroll Runs
        const runSnap = await getDocs(collection(db, 'organizations', activeOrgId, 'payrollRuns'));
        const runs: PayrollRun[] = [];
        runSnap.forEach((d) => runs.push(d.data() as PayrollRun));
        setPayrollRuns(runs);

        // 4. Fetch Leaves
        const leaveSnap = await getDocs(collection(db, 'organizations', activeOrgId, 'leaveRequests'));
        const leaves: LeaveRequest[] = [];
        leaveSnap.forEach((d) => leaves.push(d.data() as LeaveRequest));
        setLeaveRequests(leaves);

        // 5. Fetch Reimbursements
        const reimbSnap = await getDocs(collection(db, 'organizations', activeOrgId, 'reimbursements'));
        const reimbs: ReimbursementClaim[] = [];
        reimbSnap.forEach((d) => reimbs.push(d.data() as ReimbursementClaim));
        setReimbursements(reimbs);

        // 6. Fetch Audit Logs
        const auditSnap = await getDocs(collection(db, 'organizations', activeOrgId, 'auditLogs'));
        const logs: AuditLogEntry[] = [];
        auditSnap.forEach((d) => logs.push(d.data() as AuditLogEntry));
        setAuditLogs(logs);
      } else {
        setOrganization(null);
      }
    } catch (err) {
      console.error('Error fetching org data:', err);
    } finally {
      setLoadingOrg(false);
    }
  };

  useEffect(() => {
    refreshOrgData();
  }, [currentUser, activeOrgId, isDemoUser]);

  const createOrganization = async (data: Partial<Organization>): Promise<Organization> => {
    const orgId = `org_${Date.now()}`;
    const newOrg: Organization = {
      id: orgId,
      name: data.name || 'My Organization',
      businessType: data.businessType || 'pvt_ltd',
      state: data.state || 'Karnataka',
      country: 'India',
      employeeCountTier: data.employeeCountTier || '1-10',
      payrollFrequency: 'monthly',
      financialYear: data.financialYear || '2025-2026',
      ownerId: currentUser?.uid || 'usr_demo',
      planId: data.planId || 'starter',
      subscriptionStatus: 'active',
      billingCycle: data.billingCycle || 'monthly',
      setupStep: 2,
      statutorySettings: {
        pfEnabled: true,
        pfWageCeilingLimit: false,
        esiEnabled: true,
        ptEnabled: true,
        ptState: data.state || 'Karnataka',
        lwfEnabled: false,
        ...(data.statutorySettings || {})
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isDemoUser) {
      setOrganization(newOrg);
      setActiveOrgId(orgId);
      return newOrg;
    }

    try {
      await setDoc(doc(db, 'organizations', orgId), newOrg);
      // Create owner membership
      await setDoc(doc(db, 'organizations', orgId, 'members', currentUser!.uid), {
        userId: currentUser!.uid,
        organizationId: orgId,
        email: currentUser!.email,
        role: 'owner',
        joinedAt: new Date().toISOString()
      });
      // Update user defaultOrg
      await updateDoc(doc(db, 'users', currentUser!.uid), {
        defaultOrgId: orgId
      });

      setOrganization(newOrg);
      setActiveOrgId(orgId);
      return newOrg;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `organizations/${orgId}`);
    }
  };

  const addEmployee = async (empData: Omit<Employee, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>): Promise<Employee> => {
    const empId = `emp_${Date.now()}`;
    const newEmp: Employee = {
      ...empData,
      id: empId,
      organizationId: organization?.id || 'demo_apex_technologies',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isDemoUser) {
      setEmployees((prev) => [newEmp, ...prev]);
      return newEmp;
    }

    try {
      await setDoc(doc(db, 'organizations', organization!.id, 'employees', empId), newEmp);
      setEmployees((prev) => [newEmp, ...prev]);
      return newEmp;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `organizations/${organization?.id}/employees/${empId}`);
    }
  };

  const updateEmployee = async (empId: string, empData: Partial<Employee>): Promise<void> => {
    if (isDemoUser) {
      setEmployees((prev) => prev.map((e) => (e.id === empId ? { ...e, ...empData, updatedAt: new Date().toISOString() } : e)));
      return;
    }

    try {
      await updateDoc(doc(db, 'organizations', organization!.id, 'employees', empId), {
        ...empData,
        updatedAt: new Date().toISOString()
      });
      setEmployees((prev) => prev.map((e) => (e.id === empId ? { ...e, ...empData } : e)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `organizations/${organization?.id}/employees/${empId}`);
    }
  };

  const deleteEmployee = async (empId: string): Promise<void> => {
    if (isDemoUser) {
      setEmployees((prev) => prev.filter((e) => e.id !== empId));
      return;
    }

    try {
      await deleteDoc(doc(db, 'organizations', organization!.id, 'employees', empId));
      setEmployees((prev) => prev.filter((e) => e.id !== empId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `organizations/${organization?.id}/employees/${empId}`);
    }
  };

  const createPayrollRun = async (month: number, year: number, periodName: string): Promise<PayrollRun> => {
    const runId = `run_${year}_${month.toString().padStart(2, '0')}`;
    const daysInMonth = new Date(year, month, 0).getDate();

    // Compute for all active employees
    const items: PayrollItemCalculation[] = employees
      .filter((e) => e.status === 'active')
      .map((emp) => {
        // Check approved LOP leaves
        const lopDays = leaveRequests
          .filter((l) => l.employeeId === emp.id && l.status === 'approved' && l.leaveType === 'lop')
          .reduce((acc, l) => acc + l.days, 0);

        // Check approved reimbursements
        const approvedReimbursements = reimbursements
          .filter((r) => r.employeeId === emp.id && r.status === 'approved')
          .reduce((acc, r) => acc + r.amount, 0);

        return calculateEmployeePayroll({
          employee: emp,
          totalDaysInMonth: daysInMonth,
          lopDays,
          bonus: 0,
          approvedReimbursements,
          statutorySettings: organization!.statutorySettings,
          payrollRunId: runId,
          month
        });
      });

    const totalGross = items.reduce((acc, i) => acc + i.grossSalary, 0);
    const totalDeductions = items.reduce((acc, i) => acc + i.deductions.totalDeductions, 0);
    const totalNetPay = items.reduce((acc, i) => acc + i.netSalary, 0);
    const totalEmployerCost = items.reduce((acc, i) => acc + i.employerContributions.totalEmployerCost, 0);

    const newRun: PayrollRun = {
      id: runId,
      organizationId: organization!.id,
      month,
      year,
      periodName,
      status: 'calculated',
      totalEmployees: items.length,
      totalGross,
      totalDeductions,
      totalNetPay,
      totalEmployerCost,
      processedBy: currentUser?.displayName || 'Administrator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items
    };

    if (isDemoUser) {
      setPayrollRuns((prev) => [newRun, ...prev.filter((r) => r.id !== runId)]);
      return newRun;
    }

    try {
      await setDoc(doc(db, 'organizations', organization!.id, 'payrollRuns', runId), newRun);
      setPayrollRuns((prev) => [newRun, ...prev.filter((r) => r.id !== runId)]);
      return newRun;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `organizations/${organization?.id}/payrollRuns/${runId}`);
    }
  };

  const approvePayrollRun = async (runId: string) => {
    if (isDemoUser) {
      setPayrollRuns((prev) =>
        prev.map((r) => (r.id === runId ? { ...r, status: 'approved', approvedBy: 'Payroll Approver' } : r))
      );
      return;
    }

    try {
      await updateDoc(doc(db, 'organizations', organization!.id, 'payrollRuns', runId), {
        status: 'approved',
        approvedBy: currentUser?.displayName || 'Approver',
        updatedAt: new Date().toISOString()
      });
      setPayrollRuns((prev) =>
        prev.map((r) => (r.id === runId ? { ...r, status: 'approved', approvedBy: currentUser?.displayName || 'Approver' } : r))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `organizations/${organization?.id}/payrollRuns/${runId}`);
    }
  };

  const finalizePayrollRun = async (runId: string) => {
    if (isDemoUser) {
      setPayrollRuns((prev) =>
        prev.map((r) =>
          r.id === runId
            ? { ...r, status: 'finalized', finalizedAt: new Date().toISOString() }
            : r
        )
      );
      return;
    }

    try {
      await updateDoc(doc(db, 'organizations', organization!.id, 'payrollRuns', runId), {
        status: 'finalized',
        finalizedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setPayrollRuns((prev) =>
        prev.map((r) =>
          r.id === runId
            ? { ...r, status: 'finalized', finalizedAt: new Date().toISOString() }
            : r
        )
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `organizations/${organization?.id}/payrollRuns/${runId}`);
    }
  };

  const submitLeaveRequest = async (req: Omit<LeaveRequest, 'id' | 'organizationId' | 'status' | 'createdAt'>) => {
    const id = `leave_${Date.now()}`;
    const newReq: LeaveRequest = {
      ...req,
      id,
      organizationId: organization?.id || 'demo_apex_technologies',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (isDemoUser) {
      setLeaveRequests((prev) => [newReq, ...prev]);
      return;
    }

    try {
      await setDoc(doc(db, 'organizations', organization!.id, 'leaveRequests', id), newReq);
      setLeaveRequests((prev) => [newReq, ...prev]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `organizations/${organization?.id}/leaveRequests/${id}`);
    }
  };

  const updateLeaveStatus = async (leaveId: string, status: 'approved' | 'rejected') => {
    if (isDemoUser) {
      setLeaveRequests((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status, reviewedBy: 'HR Admin' } : l))
      );
      return;
    }

    try {
      await updateDoc(doc(db, 'organizations', organization!.id, 'leaveRequests', leaveId), {
        status,
        reviewedBy: currentUser?.displayName || 'HR Admin'
      });
      setLeaveRequests((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status, reviewedBy: currentUser?.displayName || 'HR Admin' } : l))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `organizations/${organization?.id}/leaveRequests/${leaveId}`);
    }
  };

  const submitReimbursement = async (claim: Omit<ReimbursementClaim, 'id' | 'organizationId' | 'status' | 'createdAt'>) => {
    const id = `reimb_${Date.now()}`;
    const newClaim: ReimbursementClaim = {
      ...claim,
      id,
      organizationId: organization?.id || 'demo_apex_technologies',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (isDemoUser) {
      setReimbursements((prev) => [newClaim, ...prev]);
      return;
    }

    try {
      await setDoc(doc(db, 'organizations', organization!.id, 'reimbursements', id), newClaim);
      setReimbursements((prev) => [newClaim, ...prev]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `organizations/${organization?.id}/reimbursements/${id}`);
    }
  };

  const updateReimbursementStatus = async (claimId: string, status: 'approved' | 'rejected') => {
    if (isDemoUser) {
      setReimbursements((prev) =>
        prev.map((r) => (r.id === claimId ? { ...r, status, reviewedBy: 'Finance Approver' } : r))
      );
      return;
    }

    try {
      await updateDoc(doc(db, 'organizations', organization!.id, 'reimbursements', claimId), {
        status,
        reviewedBy: currentUser?.displayName || 'Finance Approver'
      });
      setReimbursements((prev) =>
        prev.map((r) => (r.id === claimId ? { ...r, status, reviewedBy: currentUser?.displayName || 'Finance Approver' } : r))
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `organizations/${organization?.id}/reimbursements/${claimId}`);
    }
  };

  const updateStatutorySettings = async (settings: StatutorySettings) => {
    if (isDemoUser) {
      setOrganization((prev) => (prev ? { ...prev, statutorySettings: settings } : null));
      return;
    }

    try {
      await updateDoc(doc(db, 'organizations', organization!.id), {
        statutorySettings: settings,
        updatedAt: new Date().toISOString()
      });
      setOrganization((prev) => (prev ? { ...prev, statutorySettings: settings } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `organizations/${organization?.id}`);
    }
  };

  const updateSubscriptionPlan = async (planId: PlanId, billingCycle: 'monthly' | 'annual') => {
    if (isDemoUser) {
      setOrganization((prev) => (prev ? { ...prev, planId, billingCycle } : null));
      return;
    }

    try {
      await updateDoc(doc(db, 'organizations', organization!.id), {
        planId,
        billingCycle,
        updatedAt: new Date().toISOString()
      });
      setOrganization((prev) => (prev ? { ...prev, planId, billingCycle } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `organizations/${organization?.id}`);
    }
  };

  return (
    <OrgContext.Provider
      value={{
        organization,
        employees,
        payrollRuns,
        leaveRequests,
        reimbursements,
        auditLogs,
        loadingOrg,
        createOrganization,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        createPayrollRun,
        approvePayrollRun,
        finalizePayrollRun,
        submitLeaveRequest,
        updateLeaveStatus,
        submitReimbursement,
        updateReimbursementStatus,
        updateStatutorySettings,
        updateSubscriptionPlan,
        refreshOrgData
      }}
    >
      {children}
    </OrgContext.Provider>
  );
};

export function useOrg() {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
}

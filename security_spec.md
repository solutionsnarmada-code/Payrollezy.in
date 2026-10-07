# Security Specification for PayrollEzy

## 1. Data Invariants
1. Organization boundaries are absolute: No user from Organization A can access, read, or mutate data belonging to Organization B.
2. Membership Verification: A user can only access resources under `/organizations/{orgId}` if they have a matching membership document at `/organizations/{orgId}/members/{userId}`.
3. Role-Based Permissions:
   - Organization Owner (`owner`): Can manage organization settings, members, subscription, and has full access.
   - Payroll Admin (`admin`): Can manage employees, salary structures, initiate payroll runs, approve/reject leaves and reimbursements.
   - Approver (`approver`): Can review and approve/reject payroll runs.
   - Employee (`employee`): Can only read their own employee profile, submit/view their own leave requests, submit/view their own reimbursements, and read their own payroll payslip items.
4. Non-Transferrable Identity: `userId` or `employeeId` fields cannot be spoofed to impersonate other employees.
5. Immutability of Finalized Payroll: Once a payroll run is finalized, item records cannot be altered.

## 2. The "Dirty Dozen" Threat Payloads
1. Cross-Tenant Snooping: User A in Org 1 tries to list employees under Org 2 -> PERMISSION_DENIED.
2. Employee Privilege Escalation: Employee tries to modify their own role to 'admin' in members collection -> PERMISSION_DENIED.
3. Salary Data Leakage: Employee 1 tries to read Employee 2's payroll item or payslip -> PERMISSION_DENIED.
4. Ghost Field Injection: An unauthorized update includes shadow parameters like `isOwner: true` -> PERMISSION_DENIED.
5. Unauthenticated Access: Anonymous or unauthenticated request to read organizations or payroll -> PERMISSION_DENIED.
6. Identity Impersonation: Employee submitting leave request with another employee's `employeeId` -> PERMISSION_DENIED.
7. Modifying Finalized Payroll: Modifying a payroll item when `payrollRun.status == 'finalized'` -> PERMISSION_DENIED.
8. Self-Approval of Expenses: An employee attempting to change reimbursement status from `pending` to `approved` -> PERMISSION_DENIED.
9. Denial of Wallet via ID Injection: Trying to write an ID longer than 128 chars or with illegal characters -> PERMISSION_DENIED.
10. Tenant Deletion: Non-owner trying to delete an organization -> PERMISSION_DENIED.
11. Organization Switching via Client: Attempting to rewrite `organizationId` on an existing employee -> PERMISSION_DENIED.
12. Unverified User Mutations: Performing write actions without an authenticated session -> PERMISSION_DENIED.

## 3. Test Runner Invariants
All operations in the "Dirty Dozen" return PERMISSION_DENIED under the Master Gate security model.

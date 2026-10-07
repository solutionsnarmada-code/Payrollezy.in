import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  Shield, 
  MoreVertical,
  X,
  FileText
} from 'lucide-react';
import { useOrg } from '../../context/OrgContext';
import { Employee } from '../../types';
import { AddEmployeeModal } from './AddEmployeeModal';

export const EmployeeManagement: React.FC = () => {
  const { employees, deleteEmployee } = useOrg();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Departments list from employees
  const departments = Array.from(new Set(employees.map((e) => e.department))).filter(Boolean);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.workEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Employee Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee master records, statutory enrollments, salary structures and bank payout accounts.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, email or role..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-blue-600 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-blue-600"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:bg-white focus:outline-blue-600"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table or Empty State */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No employees yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            Add your first employee to start building your payroll and configuring statutory compliance.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Add First Employee
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-4 py-3">Department & Role</th>
                  <th className="px-4 py-3">Monthly CTC</th>
                  <th className="px-4 py-3">Statutory & PAN</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{emp.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{emp.employeeNumber} · {emp.workEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{emp.department}</div>
                      <div className="text-[11px] text-slate-400">{emp.designation}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900">₹{emp.monthlyCtc.toLocaleString('en-IN')}</div>
                      <div className="text-[11px] text-slate-400">Basic: ₹{emp.basicSalary.toLocaleString('en-IN')}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-mono text-[11px] font-bold text-slate-800">{emp.pan || 'PAN Pending'}</div>
                      <div className="flex gap-1 mt-0.5">
                        {emp.statutory.pfApplicable && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
                            EPF
                          </span>
                        )}
                        {emp.statutory.esiApplicable && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200/60">
                            ESIC
                          </span>
                        )}
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-semibold uppercase">
                          {emp.statutory.taxRegime} Regime
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        emp.status === 'active'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(emp);
                        }}
                        className="text-blue-700 hover:text-blue-800 font-semibold text-xs"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Detail Drawer / Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{selectedEmployee.fullName}</h3>
                <span className="text-xs text-slate-500 font-mono">{selectedEmployee.employeeNumber} · {selectedEmployee.designation}</span>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 max-h-[75vh] overflow-y-auto">
              {/* Overview Details */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Work Email:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.workEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date of Joining:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.dateOfJoining}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Employment Type:</span>
                  <span className="font-semibold text-slate-800 capitalize">{selectedEmployee.employmentType.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Salary Structure */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider">Salary Structure Breakdown</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  <div className="flex justify-between p-2.5 bg-white">
                    <span>Monthly Fixed CTC</span>
                    <span className="font-bold text-slate-900">₹{selectedEmployee.monthlyCtc.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50">
                    <span>Basic Salary (50%)</span>
                    <span className="font-semibold text-slate-800">₹{selectedEmployee.basicSalary.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-white">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="font-semibold text-slate-800">₹{selectedEmployee.hra.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50">
                    <span>Special Allowance</span>
                    <span className="font-semibold text-slate-800">₹{selectedEmployee.specialAllowance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider">Registered Bank Account</h4>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bank Name:</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.bankDetails?.bankName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Number:</span>
                    <span className="font-mono font-semibold text-slate-800">{selectedEmployee.bankDetails?.accountNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">IFSC Code:</span>
                    <span className="font-mono font-semibold text-blue-700">{selectedEmployee.bankDetails?.ifscCode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Account Holder:</span>
                    <span className="font-semibold text-slate-800">{selectedEmployee.bankDetails?.accountHolderName || selectedEmployee.fullName}</span>
                  </div>
                </div>
              </div>

              {/* Statutory */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs mb-2 uppercase tracking-wider">Statutory Details</h4>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500">PAN:</span>
                    <span className="font-bold text-slate-900">{selectedEmployee.pan || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500">UAN (EPF):</span>
                    <span className="text-slate-800">{selectedEmployee.statutory.uan || 'Not configured'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans text-slate-500">Income Tax Regime:</span>
                    <span className="font-sans font-bold text-blue-800 uppercase">{selectedEmployee.statutory.taxRegime} Regime</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  deleteEmployee(selectedEmployee.id);
                  setSelectedEmployee(null);
                }}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
              >
                Delete Record
              </button>
              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Guided Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

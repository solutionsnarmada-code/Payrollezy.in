import React, { useState } from 'react';
import { X, User, Briefcase, IndianRupee, CreditCard, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Employee, TaxRegime } from '../../types';
import { useOrg } from '../../context/OrgContext';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose }) => {
  const { addEmployee, organization, employees } = useOrg();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  // Step 1: Basic
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState(`EMP-${(employees.length + 1).toString().padStart(3, '0')}`);

  // Step 2: Employment
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Software Engineer');
  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().split('T')[0]);
  const [employmentType, setEmploymentType] = useState<'full_time' | 'contract' | 'intern'>('full_time');

  // Step 3: Salary / CTC
  const [monthlyCtc, setMonthlyCtc] = useState<number>(75000);
  const [basicSalary, setBasicSalary] = useState<number>(37500); // 50% default
  const [hra, setHra] = useState<number>(15000); // 40% of basic default
  const [specialAllowance, setSpecialAllowance] = useState<number>(22500); // balancing

  // Step 4: Bank Details
  const [bankName, setBankName] = useState('HDFC Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');

  // Step 5: Statutory & Tax
  const [pan, setPan] = useState('');
  const [pfApplicable, setPfApplicable] = useState(true);
  const [uan, setUan] = useState('');
  const [esiApplicable, setEsiApplicable] = useState(false);
  const [esicNumber, setEsicNumber] = useState('');
  const [ptApplicable, setPtApplicable] = useState(true);
  const [taxRegime, setTaxRegime] = useState<TaxRegime>('new');

  if (!isOpen) return null;

  // Auto-balance salary structure when monthly CTC changes
  const handleCtcChange = (ctcVal: number) => {
    setMonthlyCtc(ctcVal);
    const basic = Math.round(ctcVal * 0.5);
    const hraVal = Math.round(basic * 0.4);
    const special = Math.max(0, ctcVal - basic - hraVal);
    setBasicSalary(basic);
    setHra(hraVal);
    setSpecialAllowance(special);

    // Auto-detect ESIC eligibility if CTC <= 21,000
    if (ctcVal <= 21000) {
      setEsiApplicable(true);
    } else {
      setEsiApplicable(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    // Validation
    const panClean = pan.trim().toUpperCase();
    if (panClean && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panClean)) {
      setError('Invalid PAN format. Indian PAN must follow the format ABCDE1234F.');
      setLoading(false);
      return;
    }

    const ifscClean = ifscCode.trim().toUpperCase();
    if (ifscClean && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscClean)) {
      setError('Invalid IFSC format. Must be 11 characters (e.g. HDFC0001234).');
      setLoading(false);
      return;
    }

    try {
      await addEmployee({
        employeeNumber,
        fullName,
        workEmail,
        phone,
        department,
        designation,
        dateOfJoining,
        status: 'active',
        employmentType,
        pan: panClean,
        bankDetails: {
          accountHolderName: accountHolderName || fullName,
          accountNumber,
          ifscCode: ifscClean,
          bankName
        },
        statutory: {
          pfApplicable,
          uan: uan.trim() || undefined,
          esiApplicable,
          esicNumber: esicNumber.trim() || undefined,
          ptApplicable,
          taxRegime
        },
        monthlyCtc,
        basicSalary,
        hra,
        specialAllowance,
        conveyance: 0,
        otherAllowances: 0
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Add New Employee</h3>
            <p className="text-[11px] text-slate-500">Step {step} of 5: {
              step === 1 ? 'Personal Details' :
              step === 2 ? 'Employment Profile' :
              step === 3 ? 'Salary & CTC Breakup' :
              step === 4 ? 'Bank Account & Payment' :
              'Indian Statutory & Tax'
            }</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="flex h-1 bg-slate-100">
          <div className="bg-blue-600 transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }} />
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (!accountHolderName) setAccountHolderName(e.target.value);
                    }}
                    placeholder="e.g. Priyadarshini Rao"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    placeholder="priya.r@company.in"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID / Code *</label>
                <input
                  type="text"
                  required
                  value={employeeNumber}
                  onChange={(e) => setEmployeeNumber(e.target.value)}
                  placeholder="EMP-005"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!fullName.trim() || !workEmail.trim() || !employeeNumber.trim()}
                  onClick={() => setStep(2)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Employment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Employment Profile */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance & Accounts">Finance & Accounts</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Backend Engineer"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Joining</label>
                  <input
                    type="date"
                    required
                    value={dateOfJoining}
                    onChange={(e) => setDateOfJoining(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  >
                    <option value="full_time">Full Time Permanent</option>
                    <option value="contract">Fixed Term Contract</option>
                    <option value="intern">Intern / Trainee</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Salary & CTC</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Salary & CTC Breakup */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Gross CTC (INR) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    min="10000"
                    step="500"
                    value={monthlyCtc}
                    onChange={(e) => handleCtcChange(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Annualized CTC: ₹{(monthlyCtc * 12).toLocaleString('en-IN')}
                </span>
              </div>

              {/* Auto-computed components breakdown */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span>Basic Pay (50% of CTC)</span>
                  <span className="font-bold text-slate-900">₹{basicSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>House Rent Allowance (HRA, 40% of Basic)</span>
                  <span className="font-bold text-slate-900">₹{hra.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Special Allowance (Balancing Component)</span>
                  <span className="font-bold text-slate-900">₹{specialAllowance.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-blue-800">
                  <span>Total Monthly Gross</span>
                  <span>₹{monthlyCtc.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Bank Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Bank Details */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Holder Name *</label>
                <input
                  type="text"
                  required
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Exact name as in bank passbook"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-medium"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Yes Bank">Yes Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                    <option value="Other Commercial Bank">Other Commercial Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bank IFSC Code *</label>
                  <input
                    type="text"
                    required
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0001234"
                    maxLength={11}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Account Number *</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 5010049281726"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={!accountNumber.trim() || !ifscCode.trim()}
                  onClick={() => setStep(5)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next: Statutory & PAN</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Indian Statutory & Tax */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Permanent Account Number (PAN) *</label>
                <input
                  type="text"
                  required
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-blue-600 text-slate-900 font-mono uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Format: 5 letters, 4 digits, 1 letter</span>
              </div>

              <div className="space-y-3 pt-1">
                {/* EPF checkbox & UAN */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pfApplicable}
                        onChange={(e) => setPfApplicable(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      Deduct Employee Provident Fund (EPF 12%)
                    </label>
                  </div>
                  {pfApplicable && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <label className="block text-[11px] text-slate-600 mb-1">Universal Account Number (UAN)</label>
                      <input
                        type="text"
                        value={uan}
                        onChange={(e) => setUan(e.target.value)}
                        placeholder="12-digit UAN (optional for new joiners)"
                        maxLength={12}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* ESIC */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-800 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={esiApplicable}
                        onChange={(e) => setEsiApplicable(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      Deduct ESIC (Applicable if Gross &le; ₹21,000)
                    </label>
                  </div>
                </div>

                {/* Tax Regime Selection */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <label className="block text-xs font-semibold text-slate-800 mb-1.5">Income Tax Regime</label>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="regime"
                        value="new"
                        checked={taxRegime === 'new'}
                        onChange={() => setTaxRegime('new')}
                        className="text-blue-600"
                      />
                      New Tax Regime (Section 115BAC, Default)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="regime"
                        value="old"
                        checked={taxRegime === 'old'}
                        onChange={() => setTaxRegime('old')}
                        className="text-blue-600"
                      />
                      Old Tax Regime (Chapter VI-A)
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading || !pan.trim()}
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-blue-900/10"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {loading ? 'Adding Employee...' : 'Save & Add Employee'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

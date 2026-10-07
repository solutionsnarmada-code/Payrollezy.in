import React, { useState } from 'react';
import { Settings, ShieldCheck, Building2, Save } from 'lucide-react';
import { useOrg } from '../../context/OrgContext';
import { INDIAN_STATES } from '../../lib/complianceRules';

export const SettingsSection: React.FC = () => {
  const { organization, updateStatutorySettings } = useOrg();

  const [pfEnabled, setPfEnabled] = useState(organization?.statutorySettings?.pfEnabled ?? true);
  const [pfWageCeilingLimit, setPfWageCeilingLimit] = useState(organization?.statutorySettings?.pfWageCeilingLimit ?? false);
  const [esiEnabled, setEsiEnabled] = useState(organization?.statutorySettings?.esiEnabled ?? true);
  const [ptEnabled, setPtEnabled] = useState(organization?.statutorySettings?.ptEnabled ?? true);
  const [ptState, setPtState] = useState(organization?.statutorySettings?.ptState || organization?.state || 'Karnataka');
  const [epfReg, setEpfReg] = useState(organization?.statutorySettings?.epfRegistrationNumber || '');
  const [esicReg, setEsicReg] = useState(organization?.statutorySettings?.esicRegistrationNumber || '');
  const [tan, setTan] = useState(organization?.statutorySettings?.tanNumber || '');
  const [pan, setPan] = useState(organization?.statutorySettings?.panNumber || '');

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await updateStatutorySettings({
      pfEnabled,
      pfWageCeilingLimit,
      esiEnabled,
      ptEnabled,
      ptState,
      lwfEnabled: false,
      epfRegistrationNumber: epfReg,
      esicRegistrationNumber: esicReg,
      tanNumber: tan,
      panNumber: pan
    });

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Organization & Statutory Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure statutory calculation options, company identification numbers, and state compliance mapping.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Statutory Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Statutory Calculation Configurations</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* PF */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pfEnabled}
                  onChange={(e) => setPfEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-600"
                />
                Enable Employees' Provident Fund (EPF 12%)
              </label>

              {pfEnabled && (
                <div className="pl-6 pt-1">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pfWageCeilingLimit}
                      onChange={(e) => setPfWageCeilingLimit(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                    Restrict PF contribution to statutory ₹15,000 wage ceiling limit (₹1,800/mo)
                  </label>
                </div>
              )}
            </div>

            {/* ESIC */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={esiEnabled}
                  onChange={(e) => setEsiEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-600"
                />
                Enable ESIC (Automatically checks ₹21,000 monthly gross threshold)
              </label>
            </div>

            {/* PT State */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ptEnabled}
                  onChange={(e) => setPtEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-600"
                />
                Enable State Professional Tax (PT)
              </label>

              {ptEnabled && (
                <div className="pl-6 pt-1 flex items-center gap-3">
                  <span className="text-slate-600">Governing State Slabs:</span>
                  <select
                    value={ptState}
                    onChange={(e) => setPtState(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Corporate Statutory Registration IDs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Corporate Statutory Registration Codes</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company PAN</label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="AABCA1234F"
                maxLength={10}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tax Deduction Account Number (TAN)</label>
              <input
                type="text"
                value={tan}
                onChange={(e) => setTan(e.target.value.toUpperCase())}
                placeholder="BLRA12345C"
                maxLength={10}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">EPFO Establishment Code</label>
              <input
                type="text"
                value={epfReg}
                onChange={(e) => setEpfReg(e.target.value.toUpperCase())}
                placeholder="KN/BNG/0098765/000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">ESIC Employer Code</label>
              <input
                type="text"
                value={esicReg}
                onChange={(e) => setEsicReg(e.target.value)}
                placeholder="53000987650000101"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
              ✓ Settings saved successfully
            </span>
          )}
          <button
            type="submit"
            disabled={loading}
            className="ml-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-blue-900/10"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

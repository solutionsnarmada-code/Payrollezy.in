import React from 'react';
import { ShieldCheck, Clock } from 'lucide-react';
import { useOrg } from '../../context/OrgContext';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useOrg();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Security & Compliance Audit Trail</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable system log of critical actions: payroll finalizations, salary revisions, member roles, and statutory edits.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {auditLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <span>No audit logs recorded yet. Events are logged automatically upon sensitive modifications.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-800">
                      {log.userEmail}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {log.entityType} ({log.entityId})
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-700">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

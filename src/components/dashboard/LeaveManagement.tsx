import React, { useState } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useOrg } from '../../context/OrgContext';

export const LeaveManagement: React.FC = () => {
  const { leaveRequests, updateLeaveStatus } = useOrg();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filteredRequests = leaveRequests.filter((l) => (filter === 'all' ? true : l.status === filter));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Attendance & Leave Records</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review employee leave requests. Approved Loss of Pay (LOP) days automatically prorate active payroll runs.
          </p>
        </div>

        <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                filter === st ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto shadow-2xs">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900 text-sm">No leave requests found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Employees can submit leave requests from their employee self service portal.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-700 uppercase">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Dates & Days</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 text-xs">{leave.employeeName}</div>
                      <span className="text-[11px] text-slate-400 font-mono">{leave.employeeId}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                        leave.leaveType === 'lop'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-800'
                      }`}>
                        {leave.leaveType === 'lop' ? 'Loss of Pay (LOP)' : leave.leaveType}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{leave.startDate} to {leave.endDate}</div>
                      <span className="text-[11px] text-slate-500 font-semibold">{leave.days} day(s)</span>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-slate-600">
                      {leave.reason}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        leave.status === 'approved'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : leave.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {leave.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'approved')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateLeaveStatus(leave.id, 'rejected')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

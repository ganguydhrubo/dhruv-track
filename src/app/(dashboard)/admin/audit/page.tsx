'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { generateCSV } from '@/lib/utils';
import { Filter, FileText, Download } from 'lucide-react';

export default function AuditLogsPage() {
  const [filter, setFilter] = useState({ action: '', entity_type: '' });
  const supabase = createClient();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit_logs', filter],
    queryFn: async () => {
      let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
      if (filter.action) query = query.eq('action', filter.action);
      if (filter.entity_type) query = query.eq('entity_type', filter.entity_type);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const exportCSV = () => {
    if (logs) generateCSV(logs, 'audit-logs.csv');
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Audit Logs</h1>
        <button onClick={exportCSV} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition w-full md:w-auto">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50 items-center">
          <Filter size={18} className="text-slate-500" />
          <span className="text-sm font-semibold text-slate-700">Filters:</span>
          <select className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm" value={filter.action} onChange={(e) => setFilter(s => ({ ...s, action: e.target.value }))}>
            <option value="">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="STATUS_CHANGE">Status Change</option>
          </select>
          <select className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm" value={filter.entity_type} onChange={(e) => setFilter(s => ({ ...s, entity_type: e.target.value }))}>
            <option value="">All Entities</option>
            <option value="corrective_actions">Corrective Actions</option>
            <option value="vehicles">Vehicles</option>
            <option value="visits">Visits</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 uppercase font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Entity Type</th>
                <th className="px-6 py-3">Entity ID</th>
                <th className="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading audit logs...</td></tr>
              ) : logs?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No logs found.</td></tr>
              ) : (
                logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-slate-600">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs">{log.user_id?.substring(0, 8)}...</td>
                    <td className="px-6 py-4 font-medium">
                      <span className={`px-2 py-1 rounded text-xs ${log.action === 'CREATE' ? 'bg-green-100 text-green-800' : log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' : log.action === 'DELETE' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-800">{log.entity_type}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.entity_id?.substring(0, 8)}...</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:underline flex items-center gap-1" onClick={() => alert(JSON.stringify(log.new_data, null, 2))}>
                        <FileText size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

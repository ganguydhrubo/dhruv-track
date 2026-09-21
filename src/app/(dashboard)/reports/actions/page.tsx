'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Download, Activity } from 'lucide-react';
import { generateCSV } from '@/lib/utils';

export default function ActionsReportPage() {
  const [filter, setFilter] = useState({ status: '' });
  const supabase = createClient();

  const { data, isLoading } = useQuery({
    queryKey: ['report_actions', filter],
    queryFn: async () => {
      let query = supabase.from('corrective_actions').select('*').order('created_at', { ascending: false });
      if (filter.status) query = query.eq('status', filter.status);
      const { data: result, error } = await query;
      if (error) throw error;
      return result;
    }
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" /> Actions Report
          </h1>
        </div>
        <div className="flex gap-2">
          <select className="border border-slate-300 rounded-lg px-3 py-2 text-sm" value={filter.status} onChange={e => setFilter({status: e.target.value})}>
            <option value="">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
          <button onClick={() => data && generateCSV(data, 'actions-report.csv')} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
            <Download size={18} /> Export
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><th className="px-6 py-3">Action #</th><th className="px-6 py-3">Location</th><th className="px-6 py-3">Priority</th><th className="px-6 py-3">Status</th></tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={4} className="p-6 text-center text-slate-500">Loading...</td></tr> : 
             data?.map(item => (
              <tr key={item.id} className="border-b border-slate-100"><td className="px-6 py-4 font-bold">{item.action_number}</td><td className="px-6 py-4">{item.location_id}</td><td className="px-6 py-4">{item.priority}</td><td className="px-6 py-4">{item.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

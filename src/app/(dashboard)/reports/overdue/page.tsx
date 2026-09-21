'use client';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Download, AlertTriangle } from 'lucide-react';
import { generateCSV } from '@/lib/utils';
import Link from 'next/link';

export default function OverdueReportPage() {
  const supabase = createClient();
  const { data, isLoading } = useQuery({
    queryKey: ['report_overdue'],
    queryFn: async () => {
      // Filter for items where due date is in the past and status is not closed
      const { data: result, error } = await supabase.from('corrective_actions')
        .select('*')
        .neq('status', 'CLOSED')
        .lt('due_date', new Date().toISOString())
        .order('due_date', { ascending: true });
      if (error) throw error;
      return result;
    }
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-red-700 flex items-center gap-2">
            <AlertTriangle /> Overdue Actions
          </h1>
          <p className="text-slate-500 mt-1">Actions that have passed their deadline and are not yet closed.</p>
        </div>
        <button onClick={() => data && generateCSV(data, 'overdue-actions.csv')} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          <Download size={18} /> Export
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-red-50 border-b border-red-100 text-red-800">
            <tr><th className="px-6 py-3">Action #</th><th className="px-6 py-3">Responsible</th><th className="px-6 py-3">Due Date</th><th className="px-6 py-3">Status</th></tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={4} className="p-6 text-center text-slate-500">Loading...</td></tr> : 
             !data?.length ? <tr><td colSpan={4} className="p-6 text-center text-slate-500">Great job! No overdue actions.</td></tr> :
             data?.map(item => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-blue-600"><Link href={`/actions/${item.id}`}>{item.action_number}</Link></td>
                <td className="px-6 py-4">{item.responsible_id}</td>
                <td className="px-6 py-4 font-bold text-red-600">{new Date(item.due_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

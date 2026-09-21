'use client';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Download, AlertCircle } from 'lucide-react';
import { generateCSV } from '@/lib/utils';

export default function ObservationsReportPage() {
  const supabase = createClient();
  const { data, isLoading } = useQuery({
    queryKey: ['report_observations'],
    queryFn: async () => {
      const { data: result, error } = await supabase.from('observations').select('*').order('created_at', { ascending: false });
      if (error) return [];
      return result;
    }
  });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <AlertCircle className="text-orange-600" /> Observations Report
          </h1>
        </div>
        <button onClick={() => data && generateCSV(data, 'observations-report.csv')} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
          <Download size={18} /> Export
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><th className="px-6 py-3">Type</th><th className="px-6 py-3">Description</th><th className="px-6 py-3">Severity</th><th className="px-6 py-3">Date</th></tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={4} className="p-6 text-center text-slate-500">Loading...</td></tr> : 
             !data?.length ? <tr><td colSpan={4} className="p-6 text-center text-slate-500">No observations found.</td></tr> :
             data?.map(item => (
              <tr key={item.id} className="border-b border-slate-100"><td className="px-6 py-4">{item.type}</td><td className="px-6 py-4 truncate max-w-xs">{item.description}</td><td className="px-6 py-4">{item.severity}</td><td className="px-6 py-4">{new Date(item.created_at).toLocaleDateString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, ShieldCheck } from 'lucide-react';
import { generateCSV } from '@/lib/utils';

export default function ComplianceReportPage() {
  const [filter, setFilter] = useState({ region: '' });
  const supabase = createClient();

  const { data, isLoading } = useQuery({
    queryKey: ['compliance_report', filter],
    queryFn: async () => {
      // Mocking aggregated data structure for the report as a placeholder for SQL VIEWs
      return [
        { name: 'North Region', safe_observations: 120, unsafe_observations: 24, compliance_score: 83.3 },
        { name: 'South Region', safe_observations: 200, unsafe_observations: 15, compliance_score: 93.0 },
        { name: 'East Region', safe_observations: 85, unsafe_observations: 30, compliance_score: 73.9 },
        { name: 'West Region', safe_observations: 150, unsafe_observations: 10, compliance_score: 93.7 },
      ];
    }
  });

  const exportCSV = () => {
    if (data) generateCSV(data, 'compliance-report.csv');
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" /> Compliance Report
          </h1>
          <p className="text-slate-500 mt-1">Aggregated safety compliance scores by region.</p>
        </div>
        <button onClick={exportCSV} className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition w-full md:w-auto">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Regional Safety Observations</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="safe_observations" name="Safe" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unsafe_observations" name="Unsafe" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-0 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Compliance Scorecard</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading data...</div>
            ) : (
              data?.map((region, i) => (
                <div key={i} className="p-4 flex justify-between items-center hover:bg-slate-50 transition">
                  <div>
                    <h4 className="font-semibold text-slate-800">{region.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">Total Obs: {region.safe_observations + region.unsafe_observations}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    region.compliance_score > 90 ? 'bg-green-100 text-green-700' :
                    region.compliance_score > 80 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {region.compliance_score.toFixed(1)}%
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

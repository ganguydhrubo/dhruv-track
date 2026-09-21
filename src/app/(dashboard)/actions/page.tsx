'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { PlusCircle, Download, Search, Filter } from 'lucide-react';
import { generateCSV } from '@/lib/utils';

export default function ActionsPage() {
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const supabase = createClient();

  const { data: actions, isLoading } = useQuery({
    queryKey: ['actions', filter],
    queryFn: async () => {
      let query = supabase.from('corrective_actions').select('*').order('due_date', { ascending: true });
      if (filter.status) query = query.eq('status', filter.status);
      if (filter.priority) query = query.eq('priority', filter.priority);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const exportCSV = () => {
    if (actions) {
      generateCSV(actions, 'corrective-actions.csv');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      OPEN: 'bg-blue-100 text-blue-800',
      ASSIGNED: 'bg-purple-100 text-purple-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      PENDING_VERIFICATION: 'bg-orange-100 text-orange-800',
      CLOSED: 'bg-green-100 text-green-800',
      REOPENED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'CRITICAL') return 'bg-red-600 text-white';
    if (priority === 'HIGH') return 'bg-orange-500 text-white';
    if (priority === 'MEDIUM') return 'bg-yellow-400 text-black';
    return 'bg-blue-100 text-blue-800';
  };

  const stats = [
    { label: 'Open', value: actions?.filter(a => a.status === 'OPEN').length || 0 },
    { label: 'Assigned', value: actions?.filter(a => a.status === 'ASSIGNED').length || 0 },
    { label: 'In Progress', value: actions?.filter(a => a.status === 'IN_PROGRESS').length || 0 },
    { label: 'Pending Verify', value: actions?.filter(a => a.status === 'PENDING_VERIFICATION').length || 0 },
    { label: 'Overdue', value: actions?.filter(a => new Date(a.due_date) < new Date() && a.status !== 'CLOSED').length || 0, highlight: true },
    { label: 'Closed', value: actions?.filter(a => a.status === 'CLOSED').length || 0 },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Corrective Actions</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={exportCSV} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition">
            <Download size={18} /> Export CSV
          </button>
          <Link href="/actions/new" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <PlusCircle size={18} /> New Action
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${stat.highlight && stat.value > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
            <div className={`text-2xl font-bold ${stat.highlight && stat.value > 0 ? 'text-red-700' : 'text-slate-800'}`}>{stat.value}</div>
            <div className={`text-sm font-medium ${stat.highlight && stat.value > 0 ? 'text-red-600' : 'text-slate-500'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search actions..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-2">
            <select className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm" value={filter.status} onChange={(e) => setFilter(s => ({ ...s, status: e.target.value }))}>
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PENDING_VERIFICATION">Pending Verify</option>
              <option value="CLOSED">Closed</option>
            </select>
            <select className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm" value={filter.priority} onChange={(e) => setFilter(s => ({ ...s, priority: e.target.value }))}>
              <option value="">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 uppercase font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Action #</th>
                <th className="px-6 py-3">Issue</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading actions...</td></tr>
              ) : actions?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No actions found.</td></tr>
              ) : (
                actions?.map((action) => {
                  const isOverdue = new Date(action.due_date) < new Date() && action.status !== 'CLOSED';
                  return (
                    <tr key={action.id} className={`hover:bg-slate-50 transition ${isOverdue ? 'bg-red-50/50' : ''}`}>
                      <td className="px-6 py-4 font-medium text-blue-600">
                        <Link href={`/actions/${action.id}`}>{action.action_number}</Link>
                      </td>
                      <td className="px-6 py-4 text-slate-800">{action.issue_description?.substring(0, 40) || 'No description'}...</td>
                      <td className="px-6 py-4 text-slate-600">{action.location_id || 'Unknown Location'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </span>
                      </td>
                      <td className={`px-6 py-4 ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                        {new Date(action.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(action.status)}`}>
                          {action.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

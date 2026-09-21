'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { generateCSV, formatDate, statusColor } from '@/lib/utils';
import { Download, Search } from 'lucide-react';

const supabase = createClient();

export default function TrainingReportPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: records, isLoading } = useQuery({
    queryKey: ['report-training', statusFilter, categoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('training_records')
        .select('*, training_courses(name, category, validity_months), profiles!training_records_employee_id_fkey(name, employee_id)')
        .order('training_date', { ascending: false });
      if (statusFilter) query = query.eq('status', statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const filtered = categoryFilter
    ? records?.filter((r: any) => r.training_courses?.category === categoryFilter) || []
    : records || [];

  const stats = {
    total: records?.length || 0,
    trained: records?.filter((r: any) => r.status === 'TRAINED').length || 0,
    pending: records?.filter((r: any) => r.status === 'PENDING').length || 0,
    overdue: records?.filter((r: any) => r.status === 'OVERDUE').length || 0,
    expired: records?.filter((r: any) => r.status === 'EXPIRED').length || 0,
  };

  const handleExport = () => {
    if (!filtered.length) return;
    generateCSV(
      filtered.map((r: any) => ({
        'Employee': r.profiles?.name || '',
        'Employee ID': r.profiles?.employee_id || '',
        'Course': r.training_courses?.name || '',
        'Category': r.training_courses?.category || '',
        'Training Date': formatDate(r.training_date),
        'Status': r.status,
        'Score': r.score ?? '',
        'Pass/Fail': r.pass_fail === true ? 'PASS' : r.pass_fail === false ? 'FAIL' : '',
        'Expiry Date': r.expiry_date ? formatDate(r.expiry_date) : '',
      })),
      'training_report'
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Training Report</h1>
          <p className="text-gray-500">Training status and completion analysis</p>
        </div>
        <button onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'bg-gray-100 text-gray-800' },
          { label: 'Trained', value: stats.trained, color: 'bg-green-100 text-green-800' },
          { label: 'Pending', value: stats.pending, color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Overdue', value: stats.overdue, color: 'bg-red-100 text-red-800' },
          { label: 'Expired', value: stats.expired, color: 'bg-orange-100 text-orange-800' },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
          <option value="">All Statuses</option>
          <option value="TRAINED">Trained</option>
          <option value="PENDING">Pending</option>
          <option value="OVERDUE">Overdue</option>
          <option value="EXPIRED">Expired</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
          <option value="">All Categories</option>
          {['SAFETY','BEHAVIORAL','SOP','EMERGENCY','DRIVING','TANKER','RETAIL','LPG','REFRESHER'].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Employee</th>
              <th className="text-left px-4 py-3 font-medium">Course</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No training records found</td></tr>
            ) : (
              filtered.map((rec: any) => (
                <tr key={rec.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{rec.profiles?.name || '—'}</td>
                  <td className="px-4 py-3">{rec.training_courses?.name || '—'}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{rec.training_courses?.category}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatDate(rec.training_date)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(rec.status)}`}>{rec.status}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">{rec.score != null ? `${rec.score}%` : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

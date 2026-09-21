'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatDate, statusColor } from '@/lib/utils';
import { MapPin, Users, GraduationCap, ClipboardCheck, AlertTriangle, Clock, Eye, QrCode } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient();

export default function LocationDashboardPage() {
  const { id } = useParams<{ id: string }>();

  const { data: location, isLoading: locLoading } = useQuery({
    queryKey: ['location', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*, areas(name, code, regions(name, code, divisions(name, type)))')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: employees } = useQuery({
    queryKey: ['location-employees', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, employee_id, status, employment_type')
        .eq('location_id', id)
        .eq('status', 'ACTIVE');
      return data || [];
    },
    enabled: !!id,
  });

  const { data: trainingStats } = useQuery({
    queryKey: ['location-training', id],
    queryFn: async () => {
      const empIds = employees?.map((e: any) => e.id) || [];
      if (!empIds.length) return { trained: 0, pending: 0, overdue: 0, expired: 0 };

      const { data } = await supabase
        .from('training_records')
        .select('status')
        .in('employee_id', empIds);

      const records = data || [];
      return {
        trained: records.filter((r: any) => r.status === 'TRAINED').length,
        pending: records.filter((r: any) => r.status === 'PENDING').length,
        overdue: records.filter((r: any) => r.status === 'OVERDUE').length,
        expired: records.filter((r: any) => r.status === 'EXPIRED').length,
      };
    },
    enabled: !!employees?.length,
  });

  const { data: recentVisits } = useQuery({
    queryKey: ['location-visits', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('field_visits')
        .select('id, visit_date, purpose, status, profiles!field_visits_officer_id_fkey(name)')
        .eq('location_id', id)
        .order('visit_date', { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!id,
  });

  const { data: openActions } = useQuery({
    queryKey: ['location-actions', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('corrective_actions')
        .select('id, action_number, issue, priority, status, due_date')
        .eq('location_id', id)
        .not('status', 'eq', 'CLOSED')
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!id,
  });

  const { data: observations } = useQuery({
    queryKey: ['location-observations', id],
    queryFn: async () => {
      const { data } = await supabase
        .from('safety_observations')
        .select('id, category, severity, status, created_at')
        .eq('location_id', id)
        .eq('status', 'OPEN');
      return data || [];
    },
    enabled: !!id,
  });

  if (locLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!location) {
    return <div className="p-4 md:p-6 text-center text-gray-500">Location not found</div>;
  }

  const overdueActions = openActions?.filter((a: any) => {
    if (!a.due_date) return false;
    return new Date(a.due_date) < new Date();
  }) || [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>{location.areas?.regions?.divisions?.name}</span>
            <span>→</span>
            <span>{location.areas?.regions?.name}</span>
            <span>→</span>
            <span>{location.areas?.name}</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            {location.name}
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-1">{location.code}</p>
          {location.address && <p className="text-gray-500 text-sm mt-1">{location.address}</p>}
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/locations/${id}`} className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <QrCode className="h-4 w-4" /> View QR
          </Link>
          <Link href={`/visits/new?location=${id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Eye className="h-4 w-4" /> Start Visit
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Users className="h-4 w-4" />
            <span className="text-sm">People</span>
          </div>
          <p className="text-2xl font-bold">{employees?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm">Trained</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{trainingStats?.trained || 0}</p>
          {(trainingStats?.pending || 0) > 0 && (
            <p className="text-xs text-yellow-600 mt-1">{trainingStats?.pending} pending</p>
          )}
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Open Observations</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{observations?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <ClipboardCheck className="h-4 w-4" />
            <span className="text-sm">Open Actions</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{openActions?.length || 0}</p>
          {overdueActions.length > 0 && (
            <p className="text-xs text-red-600 mt-1">{overdueActions.length} overdue</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Visits */}
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h3 className="font-semibold">Recent Visits</h3>
            <Link href={`/visits?location=${id}`} className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y">
            {recentVisits?.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">No visits recorded</p>
            ) : (
              recentVisits?.map((v: any) => (
                <Link key={v.id} href={`/visits/${v.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium">{v.purpose?.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-500">{formatDate(v.visit_date)} · {v.profiles?.name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(v.status)}`}>{v.status}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Open Actions */}
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h3 className="font-semibold">Open Actions</h3>
            <Link href={`/actions?location=${id}`} className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y">
            {openActions?.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">No open actions</p>
            ) : (
              openActions?.slice(0, 5).map((a: any) => (
                <Link key={a.id} href={`/actions/${a.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium">{a.action_number}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{a.issue}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(a.priority)}`}>{a.priority}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(a.status)}`}>{a.status}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Employees */}
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="font-semibold">Workforce ({employees?.length || 0})</h3>
          <Link href={`/workforce?location=${id}`} className="text-sm text-blue-600 hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-2 font-medium">ID</th>
                <th className="text-left px-4 py-2 font-medium">Name</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {employees?.slice(0, 10).map((emp: any) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono text-xs">{emp.employee_id}</td>
                  <td className="px-4 py-2">
                    <Link href={`/workforce/${emp.id}`} className="text-blue-600 hover:underline">{emp.name}</Link>
                  </td>
                  <td className="px-4 py-2 text-gray-500">{emp.employment_type}</td>
                  <td className="px-4 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(emp.status)}`}>{emp.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

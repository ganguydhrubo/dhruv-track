'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { PlusCircle, Search, AlertTriangle, Truck } from 'lucide-react';

export default function VehiclesPage() {
  const [filter, setFilter] = useState({ type: '', status: '' });
  const supabase = createClient();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['vehicles', filter],
    queryFn: async () => {
      let query = supabase.from('vehicles').select('*').order('vehicle_number', { ascending: true });
      if (filter.type) query = query.eq('type', filter.type);
      if (filter.status) query = query.eq('status', filter.status);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
           status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' : 
           'bg-red-100 text-red-800';
  };

  const getExpiryStatus = (dateStr: string) => {
    const daysLeft = Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (daysLeft < 0) return { label: 'Expired', color: 'text-red-600 font-bold', bg: 'bg-red-50' };
    if (daysLeft <= 30) return { label: `${daysLeft} days`, color: 'text-orange-600 font-semibold', bg: 'bg-orange-50' };
    return { label: 'Valid', color: 'text-slate-600', bg: '' };
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="text-blue-600" /> Fleet Management
          </h1>
          <p className="text-slate-500 mt-1">Track vehicle compliance, fitness, and insurance.</p>
        </div>
        <Link href="/vehicles/new" className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          <PlusCircle size={18} /> Add Vehicle
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 bg-slate-50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search vehicles by number..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-2">
            <select className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-sm" value={filter.status} onChange={(e) => setFilter(s => ({ ...s, status: e.target.value }))}>
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 uppercase font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Vehicle #</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Contractor</th>
                <th className="px-6 py-3">Fitness Expiry</th>
                <th className="px-6 py-3">Ins. Expiry</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading vehicles...</td></tr>
              ) : vehicles?.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No vehicles found.</td></tr>
              ) : (
                vehicles?.map((vehicle) => {
                  const fitness = getExpiryStatus(vehicle.fitness_expiry);
                  const insurance = getExpiryStatus(vehicle.insurance_expiry);
                  return (
                    <tr key={vehicle.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-bold text-blue-600">
                        <Link href={`/vehicles/${vehicle.id}`}>{vehicle.vehicle_number}</Link>
                      </td>
                      <td className="px-6 py-4 text-slate-800">{vehicle.type}</td>
                      <td className="px-6 py-4 text-slate-600">{vehicle.contractor_id || 'N/A'}</td>
                      <td className={`px-6 py-4 ${fitness.bg} ${fitness.color}`}>
                        {new Date(vehicle.fitness_expiry).toLocaleDateString()}
                        {fitness.bg && <AlertTriangle size={14} className="inline ml-1 mb-0.5" />}
                      </td>
                      <td className={`px-6 py-4 ${insurance.bg} ${insurance.color}`}>
                        {new Date(vehicle.insurance_expiry).toLocaleDateString()}
                        {insurance.bg && <AlertTriangle size={14} className="inline ml-1 mb-0.5" />}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
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

'use client';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Truck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function VehicleDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ['vehicle', params.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('vehicles').select('*').eq('id', params.id).single();
      if (error) throw error;
      return data;
    }
  });

  const renewMutation = useMutation({
    mutationFn: async ({ field, date }: { field: string, date: string }) => {
      await supabase.from('vehicles').update({ [field]: date }).eq('id', params.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicle', params.id] })
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!vehicle) return <div className="p-8 text-red-600">Not found</div>;

  const isExpired = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Link href="/vehicles" className="inline-flex items-center text-blue-600 font-medium text-sm mb-2"><ArrowLeft size={16} className="mr-1" /> Back</Link>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2"><Truck /> {vehicle.vehicle_number}</h1>
          <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold">{vehicle.status}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Details</h3>
            <p className="text-sm"><span className="text-slate-500 font-medium">Type:</span> {vehicle.type}</p>
            <p className="text-sm"><span className="text-slate-500 font-medium">Contractor:</span> {vehicle.contractor_id || 'N/A'}</p>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800">Compliance</h3>
            <div className={`p-3 rounded border ${isExpired(vehicle.fitness_expiry) ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">Fitness Expiry</span>
                <span className="font-bold">{new Date(vehicle.fitness_expiry).toLocaleDateString()}</span>
              </div>
            </div>
            <div className={`p-3 rounded border ${isExpired(vehicle.insurance_expiry) ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">Insurance Expiry</span>
                <span className="font-bold">{new Date(vehicle.insurance_expiry).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

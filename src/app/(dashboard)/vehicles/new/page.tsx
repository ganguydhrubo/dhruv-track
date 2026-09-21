'use client';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';

const vehicleSchema = z.object({
  vehicle_number: z.string().min(1, 'Vehicle number required'),
  type: z.string().min(1, 'Type required'),
  contractor_id: z.string().optional(),
  fitness_expiry: z.string().min(1, 'Fitness expiry required'),
  insurance_expiry: z.string().min(1, 'Insurance expiry required'),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function NewVehiclePage() {
  const router = useRouter();
  const supabase = createClient();
  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormValues>({ resolver: zodResolver(vehicleSchema) });

  const mutation = useMutation({
    mutationFn: async (values: VehicleFormValues) => {
      const { data, error } = await supabase.from('vehicles').insert({ ...values, status: 'ACTIVE' }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => router.push(`/vehicles/${data.id}`)
  });

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-sm border mt-6">
      <h1 className="text-2xl font-bold mb-6">Add Vehicle</h1>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Vehicle Number *</label>
          <input {...register('vehicle_number')} className="w-full border p-2 rounded" />
          {errors.vehicle_number && <p className="text-red-500 text-xs">{errors.vehicle_number.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Type *</label>
          <select {...register('type')} className="w-full border p-2 rounded">
            <option value="TRUCK">Truck</option><option value="VAN">Van</option><option value="CAR">Car</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Fitness Expiry *</label>
          <input type="date" {...register('fitness_expiry')} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Insurance Expiry *</label>
          <input type="date" {...register('insurance_expiry')} className="w-full border p-2 rounded" />
        </div>
        <div className="flex gap-4 pt-4">
          <Link href="/vehicles" className="px-4 py-2 border rounded">Cancel</Link>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Vehicle</button>
        </div>
      </form>
    </div>
  );
}

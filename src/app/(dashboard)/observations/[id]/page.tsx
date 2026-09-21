'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function ObservationDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Observation Details</h1>
          <p className="text-muted-foreground mt-1">Observation #{params.id}</p>
        </div>
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800">MEDIUM Severity</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
          <h3 className="font-semibold leading-none tracking-tight border-b pb-2">Information</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Date:</strong> Oct 25, 2023</p>
            <p><strong>Category:</strong> Unsafe Condition</p>
            <p><strong>Location:</strong> Retail Outlet A</p>
            <p><strong>Reported By:</strong> John Doe</p>
            <p><strong>Status:</strong> Open</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
          <h3 className="font-semibold leading-none tracking-tight border-b pb-2">Location Data</h3>
          <div className="space-y-2 text-sm">
            <p><strong>GPS Coordinates:</strong> 23.8103° N, 90.4125° E</p>
            <p><strong>Accuracy:</strong> ±5 meters</p>
            <p className="text-muted-foreground italic mt-2">GPS verified at time of creation.</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
        <h3 className="font-semibold leading-none tracking-tight border-b pb-2">Description</h3>
        <p className="text-sm">Spill in aisle 3 not cleaned up promptly, causing a potential slipping hazard for both staff and customers. Needs immediate attention.</p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
        <h3 className="font-semibold leading-none tracking-tight border-b pb-2">Evidence</h3>
        <div className="bg-muted rounded-md aspect-video relative overflow-hidden flex items-center justify-center">
          <span className="text-muted-foreground">Photo placeholder</span>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button className="w-full">Create Corrective Action</Button>
        <Button variant="outline" className="w-full">Mark as Resolved</Button>
      </div>
    </div>
  );
}

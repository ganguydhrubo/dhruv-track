'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VisitDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Visit Details</h1>
          <p className="text-muted-foreground mt-1">Visit #{params.id} at Retail Outlet A</p>
        </div>
        <div className="flex gap-2">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-transparent bg-secondary text-secondary-foreground">In Progress</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-col gap-1">
            <h3 className="font-semibold leading-none tracking-tight mb-2">Info</h3>
            <p className="text-sm"><strong>Date:</strong> Oct 25, 2023</p>
            <p className="text-sm"><strong>Officer:</strong> John Doe</p>
            <p className="text-sm"><strong>Purpose:</strong> Inspection</p>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 flex flex-col justify-center gap-4">
          <Button asChild className="w-full">
            <Link href={`/visits/${params.id}/inspect`}>Start / Continue Inspection</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/observations/new?visitId=${params.id}`}>Add Safety Observation</Link>
          </Button>
          <Button variant="secondary" className="w-full">Complete Visit</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Recent Observations</h3>
        <p className="text-sm text-muted-foreground italic">No observations added during this visit yet.</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Corrective Actions Created</h3>
        <p className="text-sm text-muted-foreground italic">No actions created yet.</p>
      </div>
    </div>
  );
}

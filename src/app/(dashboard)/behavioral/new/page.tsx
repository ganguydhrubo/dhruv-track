'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NewBehavioralObservationPage() {
  const router = useRouter();
  const [locationId, setLocationId] = useState('');
  const [behaviorType, setBehaviorType] = useState('PPE');
  const [result, setResult] = useState('COMPLIANT');
  const [employee, setEmployee] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting behavioral observation', { locationId, behaviorType, result, employee, notes });
    router.push('/behavioral');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Record Behavioral Observation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            required
          >
            <option value="">Select Location...</option>
            <option value="loc_1">Retail Outlet A</option>
            <option value="loc_2">LPG Plant B</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Behavior Type</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={behaviorType}
              onChange={(e) => setBehaviorType(e.target.value)}
            >
              <option value="PPE">PPE Compliance</option>
              <option value="SOP">Following SOP</option>
              <option value="MOVEMENT">Safe Movement</option>
              <option value="DRIVING">Safe Driving</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Observation Result</label>
            <select 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={result}
              onChange={(e) => setResult(e.target.value)}
            >
              <option value="COMPLIANT">Compliant / Good Practice</option>
              <option value="NON_COMPLIANT">Non-Compliant / At Risk</option>
              <option value="NOT_OBSERVED">Not Observed</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Employee / Person Involved (Optional)</label>
          <input 
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            placeholder="Name or Designation..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes & Context</label>
          <textarea 
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe the context and behavior observed..."
            required={result === 'NON_COMPLIANT'}
          />
        </div>

        <Button type="submit" className="w-full h-12">Submit Observation</Button>
      </form>
    </div>
  );
}

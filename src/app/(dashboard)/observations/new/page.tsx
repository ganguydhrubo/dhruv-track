'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GPSCapture, GPSLocation } from '@/components/shared/gps-capture';
import { PhotoCapture } from '@/components/shared/photo-capture';
import { useRouter } from 'next/navigation';

export default function NewObservationPage() {
  const router = useRouter();
  const [category, setCategory] = useState('UNSAFE_CONDITION');
  const [severity, setSeverity] = useState('LOW');
  const [description, setDescription] = useState('');
  const [gps, setGps] = useState<GPSLocation | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [createAction, setCreateAction] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Observation submitted', { category, severity, description, gps, photoUrl, createAction });
    router.push('/observations');
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Record Safety Observation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Category</label>
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="UNSAFE_ACT">Unsafe Act</option>
              <option value="UNSAFE_CONDITION">Unsafe Condition</option>
              <option value="NEAR_MISS">Near Miss</option>
              <option value="GOOD_PRACTICE">Good Practice</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Severity</label>
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Description</label>
          <textarea 
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you observed..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Location Evidence (GPS)</label>
          <GPSCapture onLocationCaptured={setGps} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Photo Evidence</label>
          <PhotoCapture onPhotoUploaded={setPhotoUrl} />
        </div>

        <div className="flex items-center space-x-2 border p-4 rounded-md bg-muted/20">
          <input 
            type="checkbox" 
            id="create-action" 
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            checked={createAction}
            onChange={(e) => setCreateAction(e.target.checked)}
          />
          <label htmlFor="create-action" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Create Corrective Action immediately
          </label>
        </div>

        <Button type="submit" className="w-full">Submit Observation</Button>
      </form>
    </div>
  );
}

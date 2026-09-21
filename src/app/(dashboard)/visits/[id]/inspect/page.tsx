'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PhotoCapture } from '@/components/shared/photo-capture';
import { useRouter } from 'next/navigation';

const DUMMY_QUESTIONS = [
  { id: 'q1', text: 'Are fire extinguishers accessible and inspected?', required: true, allow_photo: true, allow_comment: true },
  { id: 'q2', text: 'Are emergency exits clearly marked and unobstructed?', required: true, allow_photo: true, allow_comment: true },
  { id: 'q3', text: 'Is PPE being worn correctly by all staff?', required: true, allow_photo: true, allow_comment: true },
];

export default function InspectionExecutionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleAnswer = (qId: string, result: string) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], result } }));
  };

  const handleComment = (qId: string, comment: string) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], comment } }));
  };

  const handlePhoto = (qId: string, url: string) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], photo_url: url } }));
  };

  const isComplete = DUMMY_QUESTIONS.every(q => answers[q.id]?.result || !q.required);

  const handleSubmit = () => {
    console.log('Submitting inspection:', answers);
    router.push(`/visits/${params.id}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Execute Inspection</h1>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(Object.keys(answers).length / DUMMY_QUESTIONS.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="space-y-8">
        {DUMMY_QUESTIONS.map((q, idx) => (
          <div key={q.id} className="rounded-xl border bg-card text-card-foreground shadow p-4 space-y-4">
            <div>
              <p className="font-medium text-lg"><span className="text-muted-foreground mr-2">{idx + 1}.</span>{q.text}</p>
              {q.required && <span className="text-xs text-destructive">* Required</span>}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name={`q_${q.id}`} value="PASS" checked={answers[q.id]?.result === 'PASS'} onChange={() => handleAnswer(q.id, 'PASS')} className="h-4 w-4 text-primary" />
                <span>Pass</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name={`q_${q.id}`} value="FAIL" checked={answers[q.id]?.result === 'FAIL'} onChange={() => handleAnswer(q.id, 'FAIL')} className="h-4 w-4 text-destructive" />
                <span>Fail</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name={`q_${q.id}`} value="NA" checked={answers[q.id]?.result === 'NA'} onChange={() => handleAnswer(q.id, 'NA')} className="h-4 w-4 text-muted-foreground" />
                <span>N/A</span>
              </label>
            </div>

            {answers[q.id]?.result === 'FAIL' && (
              <div className="bg-destructive/10 p-3 rounded-md mt-2 flex justify-between items-center">
                <span className="text-sm font-medium text-destructive">Failed item requires corrective action.</span>
                <Button size="sm" variant="destructive">Create Action</Button>
              </div>
            )}

            {(q.allow_comment || q.allow_photo) && (
              <div className="mt-4 pt-4 border-t space-y-4">
                {q.allow_photo && (
                  <div>
                    <label className="text-sm font-medium mb-1 block text-muted-foreground">Attach Photo</label>
                    <PhotoCapture onPhotoUploaded={(url) => handlePhoto(q.id, url)} />
                  </div>
                )}
                {q.allow_comment && (
                  <div>
                    <label className="text-sm font-medium mb-1 block text-muted-foreground">Comment</label>
                    <textarea 
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={answers[q.id]?.comment || ''}
                      onChange={(e) => handleComment(q.id, e.target.value)}
                      placeholder="Add observations..."
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={!isComplete} className="w-full h-12 text-lg">
        Complete Inspection
      </Button>
    </div>
  );
}

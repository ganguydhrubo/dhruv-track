'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { validateTransition } from '@/lib/actions/workflow';
import { ArrowLeft, UploadCloud, CheckCircle, Clock, AlertTriangle, FileText, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function ActionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createClient();
  
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: action, isLoading } = useQuery({
    queryKey: ['action', params.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('corrective_actions').select('*').eq('id', params.id).single();
      if (error) throw error;
      return data;
    }
  });

  const { data: evidence } = useQuery({
    queryKey: ['evidence', params.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('action_evidence').select('*').eq('action_id', params.id);
      if (error) return [];
      return data;
    }
  });

  const statusMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string, notes?: string }) => {
      if (!validateTransition(action.status, status as any)) throw new Error('Invalid transition');
      const { error } = await supabase.from('corrective_actions').update({ status, last_notes: notes }).eq('id', action.id);
      if (error) throw error;
      
      // Also log the transition in audit_logs (assumed triggered by DB or done here)
      await supabase.from('audit_logs').insert({
        action: 'STATUS_CHANGE', entity_type: 'corrective_actions', entity_id: action.id, new_data: { status, notes }
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['action', params.id] })
  });

  const handleUpload = async () => {
    if (!evidenceFile) return;
    setIsUploading(true);
    try {
      const fileName = `${action.id}-${Date.now()}-${evidenceFile.name}`;
      const { data, error } = await supabase.storage.from('evidence').upload(fileName, evidenceFile);
      if (error) throw error;
      
      await supabase.from('action_evidence').insert({
        action_id: action.id,
        file_url: data.path,
        file_type: evidenceFile.type,
        uploaded_by: 'current_user' // placeholder
      });
      setEvidenceFile(null);
      queryClient.invalidateQueries({ queryKey: ['evidence', params.id] });
    } catch (e) {
      console.error(e);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!action) return <div className="p-8 text-center text-red-600">Action not found</div>;

  const timelineStages = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'CLOSED'];
  const currentStageIdx = timelineStages.indexOf(action.status);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <Link href="/actions" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
        <ArrowLeft size={16} className="mr-1" /> Back to Actions
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{action.action_number || 'New Action'}</h1>
            <p className="text-slate-500 mt-1">{action.issue_description}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
            {action.status.replace('_', ' ')}
          </span>
        </div>

        <div className="p-6 pt-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[600px] mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full"></div>
            <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 rounded-full transition-all duration-500" style={{ width: `${(Math.max(0, currentStageIdx) / (timelineStages.length - 1)) * 100}%` }}></div>
            {timelineStages.map((stage, idx) => (
              <div key={stage} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${idx <= currentStageIdx ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-300'}`}>
                  {idx < currentStageIdx ? <CheckCircle size={16} /> : idx + 1}
                </div>
                <div className={`mt-2 text-xs font-semibold ${idx <= currentStageIdx ? 'text-blue-700' : 'text-slate-400'}`}>{stage.replace('_', ' ')}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border-t border-slate-100">
          <div className="p-6 border-r border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Action Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="block text-slate-500 font-medium text-xs">Priority</span><span className="font-semibold text-slate-800">{action.priority}</span></div>
              <div><span className="block text-slate-500 font-medium text-xs">Source Type</span><span className="font-semibold text-slate-800">{action.source_type}</span></div>
              <div><span className="block text-slate-500 font-medium text-xs">Location</span><span className="font-semibold text-slate-800">{action.location_id}</span></div>
              <div><span className="block text-slate-500 font-medium text-xs">Due Date</span><span className="font-semibold text-red-600">{new Date(action.due_date).toLocaleDateString()}</span></div>
              <div><span className="block text-slate-500 font-medium text-xs">Responsible</span><span className="font-semibold text-slate-800">{action.responsible_id}</span></div>
              <div><span className="block text-slate-500 font-medium text-xs">Supervisor</span><span className="font-semibold text-slate-800">{action.supervisor_id}</span></div>
            </div>
            {action.detailed_description && (
              <div className="mt-4"><span className="block text-slate-500 font-medium text-xs mb-1">Detailed Description</span><p className="text-sm text-slate-700 bg-slate-50 p-3 rounded">{action.detailed_description}</p></div>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Evidence & Files</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {evidence?.map((file: any) => (
                  <div key={file.id} className="relative aspect-square bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center overflow-hidden group">
                    {file.file_type.includes('image') ? (
                      <ImageIcon size={24} className="text-slate-400 mb-1" />
                    ) : (
                      <FileText size={24} className="text-slate-400 mb-1" />
                    )}
                    <span className="text-[10px] text-slate-500 truncate w-full px-2 text-center">Attachment</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="file" onChange={(e) => setEvidenceFile(e.target.files?.[0] || null)} className="text-sm block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <button onClick={handleUpload} disabled={!evidenceFile || isUploading} className="px-4 py-2 bg-slate-800 text-white rounded-full text-sm font-medium hover:bg-slate-700 disabled:opacity-50">Upload</button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4">Update Workflow Status</h3>
              
              <div className="flex flex-wrap gap-2">
                {action.status === 'OPEN' && (
                  <button onClick={() => statusMutation.mutate({ status: 'ASSIGNED' })} className="px-4 py-2 bg-blue-600 text-white rounded shadow text-sm font-medium hover:bg-blue-700">Assign Action</button>
                )}
                {action.status === 'ASSIGNED' && (
                  <button onClick={() => statusMutation.mutate({ status: 'IN_PROGRESS' })} className="px-4 py-2 bg-blue-600 text-white rounded shadow text-sm font-medium hover:bg-blue-700">Start Work</button>
                )}
                {action.status === 'IN_PROGRESS' && (
                  <button onClick={() => statusMutation.mutate({ status: 'PENDING_VERIFICATION' })} className="px-4 py-2 bg-blue-600 text-white rounded shadow text-sm font-medium hover:bg-blue-700">Submit for Verification</button>
                )}
                {action.status === 'PENDING_VERIFICATION' && (
                  <div className="space-y-3 w-full">
                    <textarea value={verificationNotes} onChange={e => setVerificationNotes(e.target.value)} placeholder="Verification notes..." className="w-full text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-500"></textarea>
                    <div className="flex gap-2">
                      <button onClick={() => statusMutation.mutate({ status: 'CLOSED', notes: verificationNotes })} className="px-4 py-2 bg-green-600 text-white rounded shadow text-sm font-medium hover:bg-green-700 flex-1">Verify & Close</button>
                      <button onClick={() => statusMutation.mutate({ status: 'REOPENED', notes: verificationNotes })} className="px-4 py-2 bg-red-600 text-white rounded shadow text-sm font-medium hover:bg-red-700 flex-1">Reject & Reopen</button>
                    </div>
                  </div>
                )}
                {(action.status === 'CLOSED' || action.status === 'REOPENED') && (
                  <div className="space-y-3 w-full">
                     <textarea value={reopenReason} onChange={e => setReopenReason(e.target.value)} placeholder="Reason for reopening..." className="w-full text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-blue-500"></textarea>
                     <button onClick={() => statusMutation.mutate({ status: 'REOPENED', notes: reopenReason })} className="px-4 py-2 bg-orange-600 text-white rounded shadow text-sm font-medium hover:bg-orange-700 w-full">Reopen Action</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

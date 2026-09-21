'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { X, Check, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: isOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await supabase.from('notifications').update({ read: true }).eq('read', false);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'ACTION_ASSIGNED': return <CheckCircle2 className="text-blue-500" size={18} />;
      case 'ACTION_OVERDUE': return <AlertCircle className="text-red-500" size={18} />;
      default: return <Info className="text-slate-500" size={18} />;
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 transition-opacity" onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => markAllReadMutation.mutate()} className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <Check size={14} /> Mark all read
            </button>
            <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="text-center text-slate-500 py-8">Loading...</div>
          ) : notifications?.length === 0 ? (
            <div className="text-center text-slate-500 py-8">You have no notifications.</div>
          ) : (
            notifications?.map((notif: any) => (
              <div key={notif.id} className={`p-4 rounded-xl border transition ${notif.read ? 'bg-white border-slate-100 opacity-70' : 'bg-blue-50 border-blue-100'}`}>
                <div className="flex gap-3">
                  <div className="mt-1">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800">{notif.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.body}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-[10px] text-slate-400">{new Date(notif.created_at).toLocaleString()}</span>
                      {!notif.read && (
                        <button onClick={() => markReadMutation.mutate(notif.id)} className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

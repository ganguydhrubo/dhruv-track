import { getDB } from './db';
import { createClient } from '@/lib/supabase/client';

export async function processSyncQueue() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;
  
  const db = await getDB();
  const supabase = createClient();
  const tx = db.transaction('syncQueue', 'readwrite');
  const queue = await tx.store.getAll();
  
  for (const item of queue) {
    if (item.status === 'PENDING' || item.status === 'FAILED') {
      item.status = 'SYNCING';
      await db.put('syncQueue', item);
      
      try {
        if (item.operation === 'INSERT') {
          const { error } = await supabase.from(item.entity_type).insert(item.payload);
          if (error) throw error;
        } else if (item.operation === 'UPDATE') {
          const { error } = await supabase.from(item.entity_type).update(item.payload).eq('id', item.payload.id);
          if (error) throw error;
        } else if (item.operation === 'DELETE') {
          const { error } = await supabase.from(item.entity_type).delete().eq('id', item.payload.id);
          if (error) throw error;
        }
        
        item.status = 'SYNCED';
        const deleteTx = db.transaction('syncQueue', 'readwrite');
        await deleteTx.store.delete(item.id);
      } catch (e) {
        console.error('Sync failed for item', item.id, e);
        item.status = 'FAILED';
        const failTx = db.transaction('syncQueue', 'readwrite');
        await failTx.store.put(item);
      }
    }
  }
}

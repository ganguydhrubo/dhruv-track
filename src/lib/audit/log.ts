import { createClient } from '@/lib/supabase/server';

export async function createAuditLog(
  org_id: string,
  user_id: string,
  action: string,
  entity_type: string,
  entity_id: string,
  old_data: any,
  new_data: any
) {
  const supabase = createClient();
  const { error } = await (await supabase).from('audit_logs').insert({
    org_id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to create audit log:', error);
  }
}

import { createClient } from '@/lib/supabase/server';

export async function createNotification(
  org_id: string,
  user_id: string,
  type: string,
  title: string,
  body: string,
  data?: any
) {
  const supabase = createClient();
  const { error } = await (await supabase).from('notifications').insert({
    org_id,
    user_id,
    type,
    title,
    body,
    data: data || {},
    read: false,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error('Failed to create notification:', error);
  }
}

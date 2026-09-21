import { createClient } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFile(bucket: string, file: File, path: string = ''): Promise<{ path: string; url: string } | null> {
  const supabase = createClient();
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = path ? `${path}/${fileName}` : fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  const { data: urlData } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry for simplicity, adjust as needed

  return {
    path: filePath,
    url: urlData?.signedUrl || ''
  };
}

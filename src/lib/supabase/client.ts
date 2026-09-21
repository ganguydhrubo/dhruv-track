import { createBrowserClient } from '@supabase/ssr';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gsdvznprosgdczqztlgr.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzZHZ6bnByb3NnZGN6cXp0bGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5NjcxMTcsImV4cCI6MjEwNTU0MzExN30.6Q7f8M9k_yCUyk52Ql4ZzcwucTzWGzf3Y9H0x-1qZgw';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// FIX 2026-08-16: prefer the server-only service-role key (RLS stays locked: no anon policies).
// NEXT_PUBLIC anon key is kept as a fallback for local/dev setups.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL (+ SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
}

// Lazy init: only create client when env vars are present
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_client) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase not configured — missing env vars');
    }
    _client = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 1 } },
    });
  }
  return _client;
}

// Backward-compat export (safe for build-time — won't throw until actually used)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return Reflect.get(getSupabase(), prop);
  },
});

export default supabase;

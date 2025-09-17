import { createClient } from '@supabase/supabase-js'

// Fallback values for development/build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pmadgbdfpbnhacqjxwct.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYWRnYmRmcGJuaGFjcWp4d2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MTQ4NTksImV4cCI6MjA3MzM5MDg1OX0.Q2R5iftFJJIrNj8xBdL7r4IRW8GzghjsN1OMvb7mixE'

// Module-level singleton instances
let supabaseClient: any = null;
let supabaseAdminClient: any = null;

// Create singleton client instances
function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        flowType: 'pkce'
      }
    });
    
    // Log successful client creation (only once)
    if (typeof window !== 'undefined') {
      console.log('🔍 Supabase Environment Check:');
      console.log('URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
      console.log('Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');
      console.log('✅ Supabase client created successfully');
    }
  } else if (typeof window !== 'undefined') {
    // Log if client already exists (for debugging)
    console.log('🔄 Using existing Supabase client instance');
  }
  
  return supabaseClient;
}

function getSupabaseAdminClient() {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  
  return supabaseAdminClient;
}

export const supabase = getSupabaseClient();
export const supabaseAdmin = getSupabaseAdminClient();

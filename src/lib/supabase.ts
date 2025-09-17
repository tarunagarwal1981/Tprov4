import { createClient } from '@supabase/supabase-js'

// Fallback values for development/build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pmadgbdfpbnhacqjxwct.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYWRnYmRmcGJuaGFjcWp4d2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MTQ4NTksImV4cCI6MjA3MzM5MDg1OX0.Q2R5iftFJJIrNj8xBdL7r4IRW8GzghjsN1OMvb7mixE'

// Global singleton instances - using window object for browser persistence
declare global {
  interface Window {
    __supabaseClient?: any;
    __supabaseAdminClient?: any;
  }
}

// Create singleton client instances
function getSupabaseClient() {
  // Check if we're in browser and client already exists
  if (typeof window !== 'undefined' && window.__supabaseClient) {
    return window.__supabaseClient;
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      flowType: 'pkce'
    }
  });

  // Store in window object for browser persistence
  if (typeof window !== 'undefined') {
    window.__supabaseClient = client;
    console.log('🔍 Supabase Environment Check:');
    console.log('URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
    console.log('Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');
    console.log('✅ Supabase client created successfully');
  }
  
  return client;
}

function getSupabaseAdminClient() {
  // Check if we're in browser and admin client already exists
  if (typeof window !== 'undefined' && window.__supabaseAdminClient) {
    return window.__supabaseAdminClient;
  }

  const client = createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Store in window object for browser persistence
  if (typeof window !== 'undefined') {
    window.__supabaseAdminClient = client;
  }
  
  return client;
}

export const supabase = getSupabaseClient();
export const supabaseAdmin = getSupabaseAdminClient();

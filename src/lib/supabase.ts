import { createClient } from '@supabase/supabase-js'

// Fallback values for development/build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pmadgbdfpbnhacqjxwct.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYWRnYmRmcGJuaGFjcWp4d2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MTQ4NTksImV4cCI6MjA3MzM5MDg1OX0.Q2R5iftFJJIrNj8xBdL7r4IRW8GzghjsN1OMvb7mixE'

// Global variables to prevent multiple instances
declare global {
  var __supabaseClient: any;
  var __supabaseAdminClient: any;
}

// Log environment status for debugging (only once)
if (typeof window !== 'undefined' && !global.__supabaseClient) {
  console.log('🔍 Supabase Environment Check:');
  console.log('URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
  console.log('Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');
}

// Create singleton client instances using global variables
if (!global.__supabaseClient) {
  global.__supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  });
  
  // Log successful client creation
  if (typeof window !== 'undefined') {
    console.log('✅ Supabase client created successfully');
  }
}

if (!global.__supabaseAdminClient) {
  global.__supabaseAdminClient = createClient(
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

export const supabase = global.__supabaseClient;
export const supabaseAdmin = global.__supabaseAdminClient;

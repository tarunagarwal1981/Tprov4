import { createClient } from '@supabase/supabase-js'

// Fallback values for development/build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pmadgbdfpbnhacqjxwct.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYWRnYmRmcGJuaGFjcWp4d2N0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4MTQ4NTksImV4cCI6MjA3MzM5MDg1OX0.Q2R5iftFJJIrNj8xBdL7r4IRW8GzghjsN1OMvb7mixE'

// Log environment status for debugging
if (typeof window !== 'undefined') {
  console.log('🔍 Supabase Environment Check:');
  console.log('URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
  console.log('Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey, // Fallback to anon key if service role not available
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

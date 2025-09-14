'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function EnvDebugger() {
  useEffect(() => {
    console.log('🔍 Environment Variables Debug:');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Present' : 'Missing');
    
    // Test existing Supabase client instead of creating a new one
    try {
      console.log('✅ Using existing Supabase client');
      console.log('📊 Client info:', {
        url: supabase.supabaseUrl,
        hasKey: !!supabase.supabaseKey
      });
    } catch (error) {
      console.error('❌ Error with Supabase client:', error);
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs">
      <div>Env Debug Active</div>
      <div>Check console for details</div>
    </div>
  );
}

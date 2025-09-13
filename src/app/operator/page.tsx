'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function OperatorPage() {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if user is authenticated
    if (state.isAuthenticated && state.user) {
      router.push('/operator/dashboard');
    } else {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    }
  }, [state.isAuthenticated, state.user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
    </div>
  );
}

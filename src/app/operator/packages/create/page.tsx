'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompactPackageWizard from '@/components/packages/create/CompactPackageWizard';
import { useSimpleAuth } from '@/context/SimpleAuthContext';
import { UserRole } from '@/lib/types';

export default function CreatePackagePage() {
  const router = useRouter();
  const { state } = useSimpleAuth();

  // Check authentication and authorization
  useEffect(() => {
    if (state.isLoading) return;

    if (!state.user) {
      router.push('/auth/login?redirect=/operator/packages/create');
      return;
    }

    if (![UserRole.TOUR_OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(state.user.role)) {
      router.push('/operator/dashboard');
      return;
    }
  }, [state.user, state.isLoading, router]);

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Creating Your Package</h2>
          <p className="text-gray-600">Setting up the package creation wizard...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authorized
  if (!state.user || ![UserRole.TOUR_OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(state.user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to create packages.</p>
          <button
            onClick={() => router.push('/operator/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <CompactPackageWizard />;
}

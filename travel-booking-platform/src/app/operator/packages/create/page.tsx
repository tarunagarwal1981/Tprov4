'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PackageWizard from '@/components/packages/create/PackageWizard';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';

export default function CreatePackagePage() {
  const router = useRouter();
  const { state, hasAnyRole } = useAuth();

  // Check authentication and authorization
  useEffect(() => {
    if (state.isLoading) return;

    if (!state.isAuthenticated) {
      router.push('/auth/login?redirect=/operator/packages/create');
      return;
    }

    if (!hasAnyRole([UserRole.TOUR_OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
      router.push('/operator/dashboard');
      return;
    }
  }, [state.isAuthenticated, state.isLoading, hasAnyRole, router]);

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package creation wizard...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not authorized
  if (!state.isAuthenticated || !hasAnyRole([UserRole.TOUR_OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN])) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have permission to create packages.</p>
          <button
            onClick={() => router.push('/operator/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <PackageWizard />;
}

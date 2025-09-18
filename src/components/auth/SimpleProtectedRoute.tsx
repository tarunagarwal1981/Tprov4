'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSimpleAuth } from '@/context/SimpleAuthContext';
import { UserRole } from '@/lib/types';

// ===== INTERFACES =====
interface SimpleProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
  fallback?: ReactNode;
}

// ===== ROLE-BASED REDIRECTS =====
const defaultRoleRedirects: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: '/admin/dashboard',
  [UserRole.ADMIN]: '/admin/dashboard',
  [UserRole.TOUR_OPERATOR]: '/operator/dashboard',
  [UserRole.TRAVEL_AGENT]: '/agent/dashboard',
};

export function SimpleProtectedRoute({
  children,
  requiredRoles,
  redirectTo,
  fallback,
}: SimpleProtectedRouteProps) {
  const { state } = useSimpleAuth();
  const router = useRouter();
  const pathname = usePathname();

  console.log('🛡️ SimpleProtectedRoute - Current state:', {
    pathname,
    user: state.user,
    isLoading: state.isLoading,
    requiredRoles,
  });

  // ===== REDIRECT LOGIC =====
  useEffect(() => {
    // Don't redirect while loading
    if (state.isLoading) return;

    // If not authenticated, redirect to login
    if (!state.user) {
      console.log('🚫 Not authenticated, redirecting to login');
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // If user is authenticated but no specific roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('✅ No role requirements, allowing access');
      return;
    }

    // Check if user has required role
    if (!requiredRoles.includes(state.user.role)) {
      console.log('❌ User does not have required role, redirecting');
      
      // If redirectTo is specified, use it
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      // Otherwise, redirect based on user's role
      const userDashboard = defaultRoleRedirects[state.user.role];
      if (userDashboard) {
        console.log('🔄 Redirecting to user role dashboard:', userDashboard);
        router.push(userDashboard);
        return;
      }

      // Fallback to home page
      console.log('🏠 Fallback redirect to home');
      router.push('/');
    } else {
      console.log('✅ User has required role, allowing access');
    }
  }, [state.user, state.isLoading, requiredRoles, redirectTo, pathname]);

  // ===== LOADING STATE =====
  if (state.isLoading) {
    console.log('🔄 Showing loading spinner - isLoading:', state.isLoading, 'user:', !!state.user, 'pathname:', pathname);
    
    // If we're on a dashboard page and user is null, we might be redirecting
    if (pathname.includes('/dashboard') && !state.user) {
      console.log('🔄 On dashboard page with no user, might be redirecting...');
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ===== NOT AUTHENTICATED =====
  if (!state.user) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  // ===== ROLE CHECK =====
  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(state.user.role)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // ===== RENDER CHILDREN =====
  return <>{children}</>;
}

// ===== HIGHER-ORDER COMPONENT =====
export function withSimpleAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRoles?: UserRole[];
    redirectTo?: string;
    fallback?: ReactNode;
  }
) {
  const WrappedComponent = (props: P) => (
    <SimpleProtectedRoute {...options}>
      <Component {...props} />
    </SimpleProtectedRoute>
  );

  WrappedComponent.displayName = `withSimpleAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

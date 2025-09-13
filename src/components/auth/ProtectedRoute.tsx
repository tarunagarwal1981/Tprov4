'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
  fallback?: ReactNode;
}

interface RoleBasedRedirects {
  [key: string]: string;
}

// Default redirect paths based on user roles
const defaultRoleRedirects: RoleBasedRedirects = {
  [UserRole.SUPER_ADMIN]: '/admin/dashboard',
  [UserRole.ADMIN]: '/admin/dashboard',
  [UserRole.TOUR_OPERATOR]: '/1operator/dashboard',
  [UserRole.TRAVEL_AGENT]: '/agent/dashboard',
};

export function ProtectedRoute({
  children,
  requiredRoles,
  redirectTo,
  fallback,
}: ProtectedRouteProps) {
  const { state, hasAnyRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  console.log('🛡️ ProtectedRoute - Current state:', {
    pathname,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    isLoading: state.isLoading,
    requiredRoles,
    hasRequiredRole: requiredRoles ? hasAnyRole(requiredRoles) : 'N/A'
  });

  useEffect(() => {
    // Don't redirect while loading
    if (state.isLoading) return;

    // If not authenticated, redirect to login
    if (!state.isAuthenticated) {
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
    if (!hasAnyRole(requiredRoles)) {
      console.log('❌ User does not have required role, redirecting');
      // If redirectTo is specified, use it
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      // Otherwise, redirect based on user's role
      const userRole = state.user?.role;
      if (userRole && defaultRoleRedirects[userRole]) {
        console.log('🔄 Redirecting to user role dashboard:', defaultRoleRedirects[userRole]);
        router.push(defaultRoleRedirects[userRole]);
        return;
      }

      // Fallback to home page
      console.log('🏠 Fallback redirect to home');
      router.push('/');
    } else {
      console.log('✅ User has required role, allowing access');
    }
  }, [state.isAuthenticated, state.isLoading, state.user, requiredRoles, redirectTo, router, pathname, hasAnyRole]);

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show fallback if not authenticated
  if (!state.isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return <>{children}</>;
}

// Higher-order component for easier usage
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requiredRoles?: UserRole[];
    redirectTo?: string;
    fallback?: ReactNode;
  }
) {
  const WrappedComponent = (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for checking authentication status
export function useAuthGuard(requiredRoles?: UserRole[]) {
  const { state, hasAnyRole } = useAuth();
  const router = useRouter();

  const checkAccess = (): boolean => {
    if (state.isLoading) return false;
    if (!state.isAuthenticated) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return hasAnyRole(requiredRoles);
  };

  const redirectIfUnauthorized = (redirectTo?: string) => {
    if (state.isLoading) return;

    if (!state.isAuthenticated) {
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      router.push(loginUrl);
      return;
    }

    if (requiredRoles && requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      const userRole = state.user?.role;
      if (userRole && defaultRoleRedirects[userRole]) {
        router.push(defaultRoleRedirects[userRole]);
        return;
      }

      router.push('/');
    }
  };

  return {
    isAuthorized: checkAccess(),
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    redirectIfUnauthorized,
  };
}

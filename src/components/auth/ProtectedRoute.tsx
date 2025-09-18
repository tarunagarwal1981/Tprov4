'use client';

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/SupabaseAuthContext';
import { UserRole } from '@/lib/types';

// ===== INTERFACES =====
interface ProtectedRouteProps {
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

export function ProtectedRoute({
  children,
  requiredRoles,
  redirectTo,
  fallback,
}: ProtectedRouteProps) {
  console.log('🛡️ ProtectedRoute: Component function called');
  
  // ALL HOOKS MUST BE CALLED FIRST - Before any conditional returns
  const { state } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const renderCountRef = useRef(0);
  const effectRunCountRef = useRef(0);
  const prevDepsRef = useRef<any>({});
  
  console.log('🛡️ ProtectedRoute: useAuth state:', {
    isLoading: state.isLoading,
    hasUser: !!state.user,
    userRole: state.user?.role
  });
  console.log('🛡️ ProtectedRoute: useRouter called');
  console.log('🛡️ ProtectedRoute: usePathname called, pathname:', pathname);

  // Circuit breaker to prevent infinite loops
  renderCountRef.current += 1;
  console.log(`🛡️ ProtectedRoute: Render count: ${renderCountRef.current}`);
  
  if (renderCountRef.current > 50) {
    console.error('🚨 ProtectedRoute: Potential infinite render loop detected, breaking');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Render Loop Detected</h2>
          <p className="text-gray-600">Please refresh the page</p>
        </div>
      </div>
    );
  }

  // ALL useEffect HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // Handle hydration - use a more robust approach
  useEffect(() => {
    console.log('🛡️ ProtectedRoute: setIsClient useEffect running');
    setIsClient(true);
  }, []);

  // ===== REDIRECT LOGIC USEEFFECT =====
  useEffect(() => {
    effectRunCountRef.current += 1;
    console.log(`🛡️ ProtectedRoute useEffect triggered (run #${effectRunCountRef.current})`);
    
    // Circuit breaker for useEffect
    if (effectRunCountRef.current > 10) {
      console.error('🚨 ProtectedRoute: useEffect running too many times, breaking');
      return;
    }
    
    // Don't redirect while loading or before client hydration
    if (state.isLoading || !isClient) {
      console.log('⏳ ProtectedRoute: Skipping redirect - loading or not client-side');
      return;
    }

    // If not authenticated, redirect to login
    if (!state.user) {
      console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login');
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
      router.push(loginUrl);
      return;
    }

    // If user is authenticated but no specific roles required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('✅ ProtectedRoute: No role requirements, allowing access');
      return;
    }

    // Check if user has required role
    if (!requiredRoles.includes(state.user.role)) {
      console.log('❌ ProtectedRoute: User does not have required role, redirecting');
      
      // If redirectTo is specified, use it
      if (redirectTo) {
        router.push(redirectTo);
        return;
      }

      // Otherwise, redirect based on user's role
      const userDashboard = defaultRoleRedirects[state.user.role];
      if (userDashboard) {
        console.log('🔄 ProtectedRoute: Redirecting to user role dashboard:', userDashboard);
        router.push(userDashboard);
        return;
      }

      // Fallback to home page
      console.log('🏠 ProtectedRoute: Fallback redirect to home');
      router.push('/');
    } else {
      console.log('✅ ProtectedRoute: User has required role, allowing access');
    }
  }, [state.user?.id, state.isLoading, isClient, pathname]); // Simplified dependencies

  // Store previous dependencies to detect changes
  const currentDeps = {
    user: state.user,
    isLoading: state.isLoading,
    isClient,
    pathname,
    requiredRoles,
    redirectTo
  };
  
  // Log what changed
  const changedDeps = Object.keys(currentDeps).filter(key => {
    const changed = prevDepsRef.current[key] !== (currentDeps as any)[key];
    if (changed) {
      console.log(`🔄 ProtectedRoute: Dependency changed - ${key}:`, {
        old: prevDepsRef.current[key],
        new: (currentDeps as any)[key]
      });
    }
    return changed;
  });
  
  prevDepsRef.current = currentDeps;

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    console.log('🛡️ ProtectedRoute: Not client-side yet, showing hydration spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  console.log('🛡️ ProtectedRoute: Client-side confirmed, proceeding with logic');

  console.log('🛡️ ProtectedRoute - Current state:', {
    pathname,
    user: state.user,
    isLoading: state.isLoading,
    requiredRoles,
    isClient,
  });


  // ===== LOADING STATE =====
  if (state.isLoading) {
    console.log('🔄 Showing loading spinner - isLoading:', state.isLoading, 'user:', !!state.user, 'pathname:', pathname);
    
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
  console.log('✅ ProtectedRoute: Rendering children');
  return <>{children}</>;
}

// ===== HIGHER-ORDER COMPONENT =====
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
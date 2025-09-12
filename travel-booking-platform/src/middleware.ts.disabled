import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UserRole } from '@/lib/types';

// Mock JWT token validation function
function validateMockToken(token: string): { userId: string; email: string; role: UserRole } | null {
  try {
    const payload = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp < now) {
      return null; // Token expired
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/about',
  '/contact',
  '/packages',
  '/packages/[id]',
];

// Admin routes
const adminRoutes = [
  '/admin',
  '/admin/dashboard',
  '/admin/users',
  '/admin/packages',
  '/admin/bookings',
  '/admin/settings',
];

// Tour operator routes
const operatorRoutes = [
  '/operator',
  '/operator/dashboard',
  '/operator/packages',
  '/operator/bookings',
  '/operator/profile',
];

// Travel agent routes
const agentRoutes = [
  '/agent',
  '/agent/dashboard',
  '/agent/bookings',
  '/agent/customers',
  '/agent/profile',
];

// Check if a path matches any route pattern
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => {
    // Handle dynamic routes like [id]
    if (route.includes('[') && route.includes(']')) {
      const pattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(pathname);
    }
    return pathname === route || pathname.startsWith(route + '/');
  });
}

// Get redirect path based on user role
function getRedirectPath(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
    case UserRole.ADMIN:
      return '/admin/dashboard';
    case UserRole.TOUR_OPERATOR:
      return '/operator/dashboard';
    case UserRole.TRAVEL_AGENT:
      return '/agent/dashboard';
    default:
      return '/';
  }
}

// Check if user has access to a route
function hasRouteAccess(role: UserRole, pathname: string): boolean {
  // Super admin has access to everything
  if (role === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Admin has access to admin routes
  if (role === UserRole.ADMIN && matchesRoute(pathname, adminRoutes)) {
    return true;
  }

  // Tour operator has access to operator routes
  if (role === UserRole.TOUR_OPERATOR && matchesRoute(pathname, operatorRoutes)) {
    return true;
  }

  // Travel agent has access to agent routes
  if (role === UserRole.TRAVEL_AGENT && matchesRoute(pathname, agentRoutes)) {
    return true;
  }

  // All authenticated users have access to public routes
  if (matchesRoute(pathname, publicRoutes)) {
    return true;
  }

  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Allow public routes
  if (matchesRoute(pathname, publicRoutes)) {
    return NextResponse.next();
  }

  // Check for authentication token
  if (!token) {
    // Redirect to login with return URL
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validate token
  const user = validateMockToken(token);
  if (!user) {
    // Invalid or expired token, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('auth_token');
    return response;
  }

  // Check route access
  if (!hasRouteAccess(user.role, pathname)) {
    // User doesn't have access to this route, redirect to appropriate dashboard
    const redirectPath = getRedirectPath(user.role);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Add user info to headers for use in components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.userId);
  requestHeaders.set('x-user-email', user.email);
  requestHeaders.set('x-user-role', user.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};

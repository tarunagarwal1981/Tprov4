'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSimpleAuth } from '@/context/SimpleAuthContext';
import { UserRole } from '@/lib/types';

// ===== FORM SCHEMA =====
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ===== DEMO USERS =====
const demoUsers = [
  {
    email: 'admin@travelbooking.com',
    password: 'Admin123!',
    name: 'Super Admin',
    role: UserRole.SUPER_ADMIN,
  },
  {
    email: 'operator@adventuretravel.com',
    password: 'Operator123!',
    name: 'Sarah Johnson',
    role: UserRole.TOUR_OPERATOR,
  },
  {
    email: 'agent@travelpro.com',
    password: 'Agent123!',
    name: 'Mike Chen',
    role: UserRole.TRAVEL_AGENT,
  },
];

export function SimpleLoginForm() {
  const { signIn, state, clearError } = useSimpleAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ===== CLEAR ERRORS ON MOUNT =====
  useEffect(() => {
    clearError();
  }, [clearError]);

  // ===== REDIRECT AFTER LOGIN =====
  useEffect(() => {
    console.log('🔄 LoginForm useEffect - Auth state:', { 
      user: state.user, 
      isLoading: state.isLoading,
      currentPath: window.location.pathname
    });
    
    if (state.user && !state.isLoading) {
      console.log('🔍 User role for redirect:', state.user.role);
      console.log('🔍 User role type:', typeof state.user.role);
      const dashboardUrl = getDashboardUrl(state.user.role);
      console.log('🚀 Redirecting to dashboard:', dashboardUrl);
      console.log('🔍 Current path before redirect:', window.location.pathname);
      
      // Only redirect if we're still on the login page
      if (window.location.pathname === '/auth/login' || window.location.pathname === '/auth/login/') {
        console.log('🔄 Currently on login page, redirecting to dashboard');
        setIsRedirecting(true);
        // Use window.location.replace for immediate redirect without history
        window.location.replace(dashboardUrl);
      } else {
        console.log('🔄 Not on login page, no redirect needed');
      }
    } else {
      console.log('⏳ Not redirecting yet - user:', !!state.user, 'loading:', state.isLoading);
    }
  }, [state.user, state.isLoading]);

  // ===== GET DASHBOARD URL =====
  const getDashboardUrl = (role: UserRole): string => {
    console.log('🎯 getDashboardUrl called with role:', role);
    console.log('🎯 Role comparison with UserRole.TOUR_OPERATOR:', role === UserRole.TOUR_OPERATOR);
    console.log('🎯 UserRole.TOUR_OPERATOR value:', UserRole.TOUR_OPERATOR);
    
    switch (role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        console.log('🎯 Redirecting to admin dashboard');
        return '/admin/dashboard';
      case UserRole.TOUR_OPERATOR:
        console.log('🎯 Redirecting to operator dashboard');
        return '/operator/dashboard';
      case UserRole.TRAVEL_AGENT:
        console.log('🎯 Redirecting to agent dashboard');
        return '/agent/dashboard';
      default:
        console.log('🎯 Default redirect to home');
        return '/';
    }
  };

  // ===== HANDLE FORM SUBMISSION =====
  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('🔐 Attempting login:', data.email);
      const result = await signIn(data.email, data.password);
      
      if (!result.success) {
        setError('root', { message: result.error || 'Login failed' });
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      setError('root', { message: 'An unexpected error occurred' });
    }
  };

  // ===== HANDLE DEMO LOGIN =====
  const handleDemoLogin = async (email: string, password: string) => {
    try {
      console.log('🎯 Demo login:', email);
      const result = await signIn(email, password);
      
      if (!result.success) {
        setError('root', { message: result.error || 'Demo login failed' });
      }
    } catch (error) {
      console.error('💥 Demo login error:', error);
      setError('root', { message: 'Demo login failed' });
    }
  };

  // ===== SHOW REDIRECTING STATE =====
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Travel Booking Platform
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errors.root && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{errors.root.message}</div>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || state.isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || state.isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Demo Users */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Demo Users</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {demoUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleDemoLogin(user.email, user.password)}
                disabled={isSubmitting || state.isLoading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Login as {user.name} ({user.role})
              </button>
            ))}
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

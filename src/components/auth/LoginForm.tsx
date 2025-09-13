'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, state, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

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
      rememberMe: false,
    },
  });

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Helper function to get dashboard URL based on user role
  const getDashboardUrl = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return '/admin/dashboard';
      case UserRole.TOUR_OPERATOR:
        return '/operator/dashboard';
      case UserRole.TRAVEL_AGENT:
        return '/agent/dashboard';
      default:
        return '/';
    }
  };

  // Redirect after successful login
  useEffect(() => {
    console.log('LoginForm useEffect - Auth state:', { 
      isAuthenticated: state.isAuthenticated, 
      user: state.user, 
      isLoading: state.isLoading 
    });
    
    if (state.isAuthenticated && state.user && !state.isLoading) {
      const dashboardUrl = getDashboardUrl(state.user.role);
      console.log('Redirecting to dashboard:', dashboardUrl);
      router.push(dashboardUrl);
    }
  }, [state.isAuthenticated, state.user, state.isLoading, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Redirect is handled by useEffect above
    } catch (error) {
      // Error is handled by the auth context
      console.error('Login error:', error);
    }
  };

  const handleDemoLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      // Redirect is handled by useEffect above
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={cn(
                  'input mt-1',
                  errors.email && 'input-error',
                  state.error && 'input-error'
                )}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className={cn(
                  'input mt-1',
                  errors.password && 'input-error',
                  state.error && 'input-error'
                )}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'btn btn-primary w-full',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Demo Accounts</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={() => handleDemoLogin('admin@test.com', '1')}
              disabled={isSubmitting}
              className="btn btn-secondary w-full"
            >
              Demo as Admin (Password: 1)
            </button>
            <button
              onClick={() => handleDemoLogin('operator@test.com', '1')}
              disabled={isSubmitting}
              className="btn btn-secondary w-full"
            >
              Demo as Tour Operator (Password: 1)
            </button>
            <button
              onClick={() => handleDemoLogin('agent@test.com', '1')}
              disabled={isSubmitting}
              className="btn btn-secondary w-full"
            >
              Demo as Travel Agent (Password: 1)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

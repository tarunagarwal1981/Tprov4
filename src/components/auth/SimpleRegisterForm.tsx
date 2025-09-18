'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSimpleAuth } from '@/context/SimpleAuthContext';
import { UserRole } from '@/lib/types';

// ===== FORM SCHEMA =====
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function SimpleRegisterForm() {
  const { signUp, state, clearError } = useSimpleAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.TRAVEL_AGENT,
    },
  });

  // ===== CLEAR ERRORS ON MOUNT =====
  useEffect(() => {
    clearError();
  }, [clearError]);

  // ===== REDIRECT AFTER REGISTRATION =====
  useEffect(() => {
    if (state.user && !state.isLoading) {
      const dashboardUrl = getDashboardUrl(state.user.role);
      console.log('🚀 Redirecting to dashboard:', dashboardUrl);
      router.replace(dashboardUrl);
    }
  }, [state.user, state.isLoading]);

  // ===== GET DASHBOARD URL =====
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

  // ===== HANDLE FORM SUBMISSION =====
  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('📝 Attempting registration:', data.email);
      const result = await signUp(data.email, data.password, data.name, data.role);
      
      if (!result.success) {
        setError('root', { message: result.error || 'Registration failed' });
      } else {
        // Show success message
        console.log('✅ Registration successful');
      }
    } catch (error) {
      console.error('💥 Registration error:', error);
      setError('root', { message: 'An unexpected error occurred' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the Travel Booking Platform
          </p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                {...register('name')}
                type="text"
                autoComplete="name"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

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

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                {...register('role')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={UserRole.TRAVEL_AGENT}>Travel Agent</option>
                <option value={UserRole.TOUR_OPERATOR}>Tour Operator</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
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
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                autoComplete="new-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
              {isSubmitting || state.isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

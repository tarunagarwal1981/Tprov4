'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ModernLoginForm() {
  const { signIn, resetPassword, state, clearError } = useImprovedAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [currentView, setCurrentView] = useState<'login' | 'forgot-password' | 'success'>('login');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors, isSubmitting: isForgotSubmitting },
    setError: setForgotError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redirect after successful login - Fixed to prevent loops
  useEffect(() => {
    if (state.user && !state.isLoading && !isRedirecting) {
      const dashboardUrl = getDashboardUrl(state.user.role);
      setIsRedirecting(true);
      
      // Use router.push for smooth navigation instead of window.location.replace
      // This prevents page refreshes and multiple redirects
      router.push(dashboardUrl);
    }
  }, [state.user, state.isLoading, isRedirecting, router]);

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

  // Handle login form submission - Fixed to prevent multiple submissions
  const onSubmit = async (data: LoginFormData) => {
    // Prevent multiple submissions
    if (isSubmitting || state.isLoading || isRedirecting) {
      return;
    }

    try {
      const result = await signIn(data.email, data.password);
      
      if (!result.success) {
        setError('root', { message: result.error || 'Login failed' });
        // Reset redirect state on error
        setIsRedirecting(false);
      }
      // Success is handled by the auth state change effect
    } catch (error) {
      console.error('Login error:', error);
      setError('root', { message: 'An unexpected error occurred' });
      // Reset redirect state on error
      setIsRedirecting(false);
    }
  };

  // Handle forgot password form submission
  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const result = await resetPassword(data.email);

      if (!result.success) {
        setForgotError('root', { message: result.error || 'Failed to send reset email' });
      } else {
        setSuccessMessage('Password reset email sent! Check your inbox for further instructions.');
        setCurrentView('success');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setForgotError('root', { message: 'Failed to send reset email' });
    }
  };

  // Show redirecting state
  if (isRedirecting) {
    return (
      <div className="auth-layout">
        <div className="auth-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
                  <div className="auth-success-icon">
                    <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="auth-title">Redirecting to dashboard...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <AnimatePresence mode="wait">
          {currentView === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="auth-card">
                <div className="auth-header">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="auth-icon"
                  >
                    <Lock className="w-6 h-6" />
                  </motion.div>
                  <h1 className="auth-title">Welcome back</h1>
                  <p className="auth-description">Sign in to your account to continue</p>
                </div>

                <div className="auth-content">
                  <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    {/* Email Field */}
                    <div className="auth-field">
                      <label htmlFor="email" className="auth-label">Email address</label>
                      <div className="auth-input-group">
                        <Mail className="auth-input-icon" />
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="Enter your email"
                          className={`auth-input ${errors.email ? 'error' : ''}`}
                          {...register('email')}
                        />
                      </div>
                      {errors.email && (
                        <p className="auth-error">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="auth-field">
                      <label htmlFor="password" className="auth-label">Password</label>
                      <div className="auth-input-group">
                        <Lock className="auth-input-icon" />
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className={`auth-input ${errors.password ? 'error' : ''}`}
                          {...register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="auth-input-toggle"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="auth-error">
                          <AlertCircle className="w-4 h-4" />
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="auth-options">
                      <div className="auth-checkbox-group">
                        <input
                          type="checkbox"
                          id="remember-me"
                          className="auth-checkbox"
                          {...register('rememberMe')}
                        />
                        <label htmlFor="remember-me" className="auth-checkbox-label">Remember me</label>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentView('forgot-password')}
                        className="auth-link"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Error Message */}
                    {errors.root && (
                      <div className="auth-alert error">
                        <AlertCircle className="w-4 h-4" />
                        <span className="auth-alert-text">{errors.root.message}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || state.isLoading || isRedirecting}
                      className="auth-button"
                    >
                      {isSubmitting || state.isLoading || isRedirecting ? (
                        <div className="auth-loading">
                          <div className="auth-spinner" />
                          {isRedirecting ? 'Redirecting...' : 'Signing in...'}
                        </div>
                      ) : (
                        <>
                          Sign in
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Register Link */}
                  <div className="auth-footer">
                    <p className="auth-footer-text">
                      Don't have an account?{' '}
                      <Link href="/auth/register" className="auth-link">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'forgot-password' && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="auth-card">
                <div className="auth-header">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="auth-icon"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #dc2626)' }}
                  >
                    <Mail className="w-6 h-6" />
                  </motion.div>
                  <h1 className="auth-title">Reset your password</h1>
                  <p className="auth-description">Enter your email address and we'll send you a link to reset your password</p>
                </div>

                <div className="auth-content">
                  <form onSubmit={handleForgotSubmit(onForgotPasswordSubmit)} className="auth-form">
                    {/* Email Field */}
                    <div className="auth-field">
                      <label htmlFor="forgot-email" className="auth-label">Email address</label>
                      <div className="auth-input-group">
                        <Mail className="auth-input-icon" />
                        <input
                          id="forgot-email"
                          type="email"
                          autoComplete="email"
                          placeholder="Enter your email"
                          className={`auth-input ${forgotErrors.email ? 'error' : ''}`}
                          {...registerForgot('email')}
                        />
                      </div>
                      {forgotErrors.email && (
                        <p className="auth-error">
                          <AlertCircle className="w-4 h-4" />
                          {forgotErrors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Error Message */}
                    {forgotErrors.root && (
                      <div className="auth-alert error">
                        <AlertCircle className="w-4 h-4" />
                        <span className="auth-alert-text">{forgotErrors.root.message}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isForgotSubmitting}
                      className="auth-button"
                      style={{ background: 'linear-gradient(90deg, #f59e0b, #dc2626)' }}
                    >
                      {isForgotSubmitting ? (
                        <div className="auth-loading">
                          <div className="auth-spinner" />
                          Sending...
                        </div>
                      ) : (
                        <>
                          Send reset link
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Back to Login */}
                  <div className="auth-footer">
                    <button
                      onClick={() => setCurrentView('login')}
                      className="auth-footer-link"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to sign in
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="auth-card">
                <div className="auth-header">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="auth-success-icon"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                  <h1 className="auth-title">Check your email</h1>
                  <p className="auth-description">{successMessage}</p>
                </div>

                <div className="auth-content">
                  <div className="text-center space-y-4">
                    <p className="auth-description">
                      We've sent a password reset link to your email address. 
                      Click the link in the email to reset your password.
                    </p>
                    
                    <div className="auth-alert info">
                      <span className="auth-alert-text">
                        <strong>Didn't receive the email?</strong> Check your spam folder or try again.
                      </span>
                    </div>
                  </div>

                  {/* Back to Login */}
                  <div className="auth-footer">
                    <button
                      onClick={() => {
                        setCurrentView('login');
                        reset();
                      }}
                      className="auth-footer-link"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to sign in
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

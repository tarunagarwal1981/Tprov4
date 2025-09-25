'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const { resetPassword, state, clearError } = useImprovedAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const result = await resetPassword(data.email);

      if (!result.success) {
        setError('root', { message: result.error || 'Failed to send reset email' });
      } else {
        setSuccessMessage('Password reset email sent! Check your inbox for further instructions.');
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError('root', { message: 'Failed to send reset email' });
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-layout">
        <div className="auth-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

                <button
                  onClick={() => setIsSuccess(false)}
                  className="auth-button secondary"
                >
                  Try another email
                </button>

                <div className="auth-footer">
                  <Link href="/auth/login" className="auth-footer-link">
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                  disabled={isSubmitting || state.isLoading}
                  className="auth-button"
                  style={{ background: 'linear-gradient(90deg, #f59e0b, #dc2626)' }}
                >
                  {isSubmitting || state.isLoading ? (
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
                <Link href="/auth/login" className="auth-footer-link">
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

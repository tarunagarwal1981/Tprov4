'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/SupabaseAuthContext';
import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

// Step 1: Basic info validation schema
const basicInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Step 2: Role selection schema
const roleSelectionSchema = z.object({
  role: z.nativeEnum(UserRole),
});

// Step 3: Company info schema
const companyInfoSchema = z.object({
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  description: z.string().min(20, 'Description must be at least 20 characters'),
});

type BasicInfoData = z.infer<typeof basicInfoSchema>;
type RoleSelectionData = z.infer<typeof roleSelectionSchema>;
type CompanyInfoData = z.infer<typeof companyInfoSchema>;

interface FormData extends BasicInfoData, RoleSelectionData, CompanyInfoData {}

export function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const { register: registerUser, state, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Set role from URL parameter
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'tour_operator') {
      setFormData(prev => ({ ...prev, role: UserRole.TOUR_OPERATOR }));
    } else if (roleParam === 'travel_agent') {
      setFormData(prev => ({ ...prev, role: UserRole.TRAVEL_AGENT }));
    }
  }, [searchParams]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Your personal information' },
    { id: 2, title: 'Role Selection', description: 'Choose your account type' },
    { id: 3, title: 'Company Info', description: 'Business details' },
  ];

  const handleNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (data: CompanyInfoData) => {
    const finalData = { ...formData, ...data } as RegisterData;
    try {
      await registerUser(finalData);
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-4 text-center text-2xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a href="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </a>
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                  currentStep >= step.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                )}>
                  {step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={cn(
                    'text-sm font-medium',
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-16 h-0.5 mx-4',
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-200'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <BasicInfoStep
                key="step1"
                onNext={handleNext}
                defaultValues={formData}
              />
            )}
            {currentStep === 2 && (
              <RoleSelectionStep
                key="step2"
                onNext={handleNext}
                onPrev={handlePrev}
                defaultValues={formData}
              />
            )}
            {currentStep === 3 && (
              <CompanyInfoStep
                key="step3"
                onSubmit={handleSubmit}
                onPrev={handlePrev}
                defaultValues={formData}
                isSubmitting={state.isLoading}
                error={state.error}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Step 1: Basic Info Component
function BasicInfoStep({ onNext, defaultValues }: { onNext: (data: BasicInfoData) => void; defaultValues: Partial<FormData> }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      firstName: defaultValues.firstName || '',
      lastName: defaultValues.lastName || '',
      email: defaultValues.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onNext)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register('firstName')}
              className={cn('input mt-1', errors.firstName && 'input-error')}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register('lastName')}
              className={cn('input mt-1', errors.lastName && 'input-error')}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={cn('input mt-1', errors.email && 'input-error')}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
              className={cn('input mt-1', errors.password && 'input-error')}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
              className={cn('input mt-1', errors.confirmPassword && 'input-error')}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            Next Step
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// Step 2: Role Selection Component
function RoleSelectionStep({ onNext, onPrev, defaultValues }: { 
  onNext: (data: RoleSelectionData) => void; 
  onPrev: () => void;
  defaultValues: Partial<FormData>;
}) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultValues.role || UserRole.TRAVEL_AGENT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ role: selectedRole });
  };

  const roles = [
    {
      value: UserRole.TRAVEL_AGENT,
      title: 'Travel Agent',
      description: 'Help customers plan and book their perfect trips',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      features: ['Customer booking management', 'Commission tracking', 'Travel planning tools', 'Customer support']
    },
    {
      value: UserRole.TOUR_OPERATOR,
      title: 'Tour Operator',
      description: 'Create and manage travel packages for agents and customers',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      features: ['Package creation', 'Inventory management', 'Agent network', 'Revenue tracking']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Choose your account type</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {roles.map((role) => (
              <motion.div
                key={role.value}
                className={cn(
                  'relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200',
                  selectedRole === role.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
                onClick={() => setSelectedRole(role.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      selectedRole === role.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    )}>
                      {role.icon}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{role.title}</h4>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2',
                    selectedRole === role.value
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  )}>
                    {selectedRole === role.value && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <ul className="text-sm text-gray-600 space-y-1">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button type="button" onClick={onPrev} className="btn btn-secondary">
            Previous
          </button>
          <button type="submit" className="btn btn-primary">
            Next Step
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// Step 3: Company Info Component
function CompanyInfoStep({ onSubmit, onPrev, defaultValues, isSubmitting, error }: {
  onSubmit: (data: CompanyInfoData) => void;
  onPrev: () => void;
  defaultValues: Partial<FormData>;
  isSubmitting: boolean;
  error: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyInfoData>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      phone: defaultValues.phone || '',
      companyName: defaultValues.companyName || '',
      website: defaultValues.website || '',
      description: defaultValues.description || '',
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                {...register('phone')}
                className={cn('input mt-1', errors.phone && 'input-error')}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                {...register('companyName')}
                className={cn('input mt-1', errors.companyName && 'input-error')}
                placeholder="Enter your company name"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website (Optional)
            </label>
            <input
              id="website"
              type="url"
              {...register('website')}
              className={cn('input mt-1', errors.website && 'input-error')}
              placeholder="https://yourcompany.com"
            />
            {errors.website && (
              <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Company Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className={cn('input mt-1', errors.description && 'input-error')}
              placeholder="Tell us about your company and what makes it special..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button type="button" onClick={onPrev} className="btn btn-secondary">
            Previous
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'btn btn-primary',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
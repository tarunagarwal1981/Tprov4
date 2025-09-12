import { z } from 'zod';
import { PackageType, DifficultyLevel } from '@/lib/types';

// Package Type Step Validation
export const packageTypeSchema = z.object({
  type: z.nativeEnum(PackageType, {
    required_error: 'Please select a package type',
    invalid_type_error: 'Invalid package type selected'
  })
});

// Basic Info Step Validation
export const basicInfoSchema = z.object({
  title: z.string()
    .min(3, 'Package title must be at least 3 characters')
    .max(100, 'Package title must be no more than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&,()]+$/, 'Title can only contain letters, numbers, spaces, and basic punctuation'),
  
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be no more than 2000 characters'),
  
  shortDescription: z.string()
    .min(10, 'Short description must be at least 10 characters')
    .max(200, 'Short description must be no more than 200 characters'),
  
  duration: z.object({
    days: z.number()
      .min(1, 'Duration must be at least 1 day')
      .max(365, 'Duration cannot exceed 365 days'),
    nights: z.number()
      .min(0, 'Nights cannot be negative')
      .max(364, 'Nights cannot exceed 364')
  }).refine(
    (data) => data.nights <= data.days,
    'Nights cannot exceed days'
  ),
  
  groupSize: z.object({
    min: z.number()
      .min(1, 'Minimum group size must be at least 1')
      .max(100, 'Minimum group size cannot exceed 100'),
    max: z.number()
      .min(1, 'Maximum group size must be at least 1')
      .max(100, 'Maximum group size cannot exceed 100'),
    ideal: z.number()
      .min(1, 'Ideal group size must be at least 1')
      .max(100, 'Ideal group size cannot exceed 100')
  }).refine(
    (data) => data.min <= data.max,
    'Minimum group size cannot exceed maximum group size'
  ).refine(
    (data) => data.ideal >= data.min && data.ideal <= data.max,
    'Ideal group size must be between minimum and maximum'
  ),
  
  difficulty: z.nativeEnum(DifficultyLevel, {
    required_error: 'Please select a difficulty level'
  }),
  
  destinations: z.array(z.string())
    .min(1, 'Please select at least one destination')
    .max(10, 'Cannot select more than 10 destinations'),
  
  category: z.string()
    .min(1, 'Please select a package category'),
  
  tags: z.array(z.string())
    .max(10, 'Cannot have more than 10 tags')
    .optional()
    .default([]),
  
  isFeatured: z.boolean().default(false)
});

// Combined validation for both steps
export const packageCreationSchema = z.object({
  packageType: packageTypeSchema,
  basicInfo: basicInfoSchema
});

// Type exports
export type PackageTypeFormData = z.infer<typeof packageTypeSchema>;
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type PackageCreationFormData = z.infer<typeof packageCreationSchema>;

// Validation helper functions
export const validatePackageType = (data: unknown) => {
  return packageTypeSchema.safeParse(data);
};

export const validateBasicInfo = (data: unknown) => {
  return basicInfoSchema.safeParse(data);
};

// Error message formatters
export const formatValidationErrors = (errors: z.ZodError) => {
  const formattedErrors: Record<string, string[]> = {};
  
  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(error.message);
  });
  
  return formattedErrors;
};

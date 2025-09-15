import { z } from 'zod';
import { PackageType, DifficultyLevel } from '@/lib/types';

// Package Type Step Validation
export const packageTypeSchema = z.object({
  type: z.nativeEnum(PackageType, {
    message: 'Please select a package type'
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
  
  bannerImage: z.string()
    .min(1, 'Banner image is required'),
  
  additionalImages: z.array(z.string())
    .max(10, 'Cannot have more than 10 additional images')
    .optional()
    .default([]),
  
  additionalNotes: z.string()
    .max(500, 'Additional notes cannot exceed 500 characters')
    .optional()
    .default('')
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
  
  errors.issues.forEach((error) => {
    const path = error.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(error.message);
  });
  
  return formattedErrors;
};

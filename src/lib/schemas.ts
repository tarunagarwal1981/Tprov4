// Form validation schemas using Zod
import { z } from 'zod';
import { UserRole, PackageType, DifficultyLevel } from './types';

// User registration schema
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.nativeEnum(UserRole),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Package creation schema
export const packageCreationSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.nativeEnum(PackageType),
  basePrice: z.number().min(0, 'Price must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  duration: z.object({
    days: z.number().min(1, 'Must be at least 1 day'),
    nights: z.number().min(0, 'Nights cannot be negative'),
  }),
  groupSize: z.object({
    min: z.number().min(1, 'Minimum group size must be at least 1'),
    max: z.number().min(1, 'Maximum group size must be at least 1'),
    ideal: z.number().min(1, 'Ideal group size must be at least 1'),
  }),
  difficulty: z.nativeEnum(DifficultyLevel),
  inclusions: z.array(z.string()).min(1, 'At least one inclusion is required'),
  exclusions: z.array(z.string()).optional(),
  destinations: z.array(z.string()).min(1, 'At least one destination is required'),
});

// Booking form schema
export const bookingFormSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),
  travelers: z.array(z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    dateOfBirth: z.date(),
    nationality: z.string().min(2, 'Nationality is required'),
    passportNumber: z.string().optional(),
    passportExpiry: z.date().optional(),
    dietaryRequirements: z.array(z.string()).optional(),
    medicalConditions: z.array(z.string()).optional(),
  })).min(1, 'At least one traveler is required'),
  departureDate: z.date(),
  returnDate: z.date(),
  specialRequests: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => data.returnDate > data.departureDate, {
  message: "Return date must be after departure date",
  path: ["returnDate"],
});

// Contact form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  phone: z.string().optional(),
});

// Review form schema
export const reviewFormSchema = z.object({
  packageId: z.string().min(1, 'Package ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  comment: z.string().min(20, 'Comment must be at least 20 characters'),
  pros: z.array(z.string()).min(1, 'At least one pro is required'),
  cons: z.array(z.string()).optional(),
});

// Tour operator registration schema
export const tourOperatorRegistrationSchema = z.object({
  companyName: z.string().min(3, 'Company name must be at least 3 characters'),
  legalName: z.string().min(3, 'Legal name must be at least 3 characters'),
  registrationNumber: z.string().min(5, 'Registration number must be at least 5 characters'),
  taxId: z.string().min(5, 'Tax ID must be at least 5 characters'),
  website: z.string().url('Invalid website URL').optional(),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  foundedYear: z.number().min(1800, 'Invalid founded year').max(new Date().getFullYear(), 'Founded year cannot be in the future').optional(),
  employeeCount: z.number().min(1, 'Employee count must be at least 1').optional(),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  address: z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    country: z.string().min(2, 'Country must be at least 2 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  }),
});

// Type exports for use in components
export type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;
export type PackageCreationForm = z.infer<typeof packageCreationSchema>;
export type BookingForm = z.infer<typeof bookingFormSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type ReviewForm = z.infer<typeof reviewFormSchema>;
export type TourOperatorRegistrationForm = z.infer<typeof tourOperatorRegistrationSchema>;

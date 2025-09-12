import { Package, PackageType, PackageStatus, DifficultyLevel, PackageDuration, GroupSize, PackagePricing, ItineraryDay } from '@/lib/types';

// Wizard Step Types
export type WizardStep = 
  | 'package-type'
  | 'basic-info'
  | 'destinations'
  | 'pricing'
  | 'media'
  | 'review';

// Step Configuration
export interface StepConfig {
  id: WizardStep;
  title: string;
  description: string;
  isCompleted: boolean;
  isAccessible: boolean;
  order: number;
}

// Package Creation Form Data
export interface PackageFormData {
  // Step 1: Package Type
  type: PackageType;
  
  // Step 2: Basic Information
  title: string;
  description: string;
  shortDescription: string;
  difficulty: DifficultyLevel;
  duration: PackageDuration;
  groupSize: GroupSize;
  tags: string[];
  isFeatured: boolean;
  
  // Step 3: Destinations & Itinerary
  destinations: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  termsAndConditions: string[];
  
  // Step 4: Pricing & Commission
  pricing: PackagePricing;
  
  // Step 5: Media & Gallery
  images: string[];
  coverImage: string;
  
  // Step 6: Review & Publish
  status: PackageStatus;
  publishDate?: Date;
}

// Wizard State
export interface WizardState {
  currentStep: WizardStep;
  steps: StepConfig[];
  formData: Partial<PackageFormData>;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved?: Date;
  errors: Record<string, string[]>;
  isValid: boolean;
}

// Wizard Actions
export interface WizardActions {
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateFormData: (data: Partial<PackageFormData>) => void;
  validateStep: (step: WizardStep) => boolean;
  saveDraft: () => Promise<void>;
  publishPackage: () => Promise<void>;
  resetWizard: () => void;
}

// Step Component Props
export interface StepProps {
  formData: Partial<PackageFormData>;
  updateFormData: (data: Partial<PackageFormData>) => void;
  errors: Record<string, string[]>;
  isValid: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

// Auto-save Configuration
export interface AutoSaveConfig {
  enabled: boolean;
  interval: number; // in milliseconds
  onSave: (data: Partial<PackageFormData>) => Promise<void>;
}

// Exit Confirmation Props
export interface ExitConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  hasUnsavedChanges: boolean;
}

// Validation Rules
export interface ValidationRule {
  field: keyof PackageFormData;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

// Step Validation Configuration
export interface StepValidation {
  step: WizardStep;
  rules: ValidationRule[];
}

// Draft Package Interface
export interface DraftPackage {
  id: string;
  formData: Partial<PackageFormData>;
  createdAt: Date;
  updatedAt: Date;
  lastStep: WizardStep;
  isPublished: boolean;
}

// Package Creation Result
export interface PackageCreationResult {
  success: boolean;
  package?: Package;
  errors?: Record<string, string[]>;
  message?: string;
}

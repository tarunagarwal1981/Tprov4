'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  WizardStep, 
  StepConfig, 
  PackageFormData, 
  WizardState, 
  WizardActions,
  AutoSaveConfig,
  ValidationRule,
  StepValidation,
  DraftPackage,
  PackageCreationResult
} from '@/lib/types/wizard';
import { validatePackageType, validateBasicInfo, formatValidationErrors } from '@/lib/validations/packageWizard';
import { PackageType, PackageStatus, DifficultyLevel, Package } from '@/lib/types';
import { PackageService } from '@/lib/services/packageService';
import { TourOperatorService } from '@/lib/services/tourOperatorService';
import { useSimpleAuth } from '@/context/SimpleAuthContext';

// Step configurations
const STEP_CONFIGS: StepConfig[] = [
  {
    id: 'package-type',
    title: 'Package Type',
    description: 'Choose the type of package you want to create',
    isCompleted: false,
    isAccessible: true,
    order: 1
  },
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Enter package details and basic information',
    isCompleted: false,
    isAccessible: false,
    order: 2
  },
  {
    id: 'location-timing',
    title: 'Location & Timing',
    description: 'Set destinations, timing, and duration',
    isCompleted: false,
    isAccessible: false,
    order: 3
  },
  {
    id: 'detailed-planning',
    title: 'Detailed Planning',
    description: 'Create itinerary and detailed planning',
    isCompleted: false,
    isAccessible: false,
    order: 4
  },
  {
    id: 'inclusions-exclusions',
    title: 'Inclusions & Exclusions',
    description: 'Define what\'s included and excluded',
    isCompleted: false,
    isAccessible: false,
    order: 5
  },
  {
    id: 'pricing-policies',
    title: 'Pricing & Policies',
    description: 'Set pricing and booking policies',
    isCompleted: false,
    isAccessible: false,
    order: 6
  },
  {
    id: 'review',
    title: 'Review & Publish',
    description: 'Review your package and publish it',
    isCompleted: false,
    isAccessible: false,
    order: 7
  }
];

// Validation rules for each step
const STEP_VALIDATIONS: StepValidation[] = [
  {
    step: 'package-type',
    rules: [
      { field: 'type', type: 'required', message: 'Please select a package type' }
    ]
  },
  {
    step: 'basic-info',
    rules: [
      { field: 'title', type: 'required', message: 'Package title is required' },
      { field: 'title', type: 'min', value: 3, message: 'Title must be at least 3 characters' },
      { field: 'description', type: 'required', message: 'Package description is required' },
      { field: 'description', type: 'min', value: 50, message: 'Description must be at least 50 characters' },
      { field: 'shortDescription', type: 'required', message: 'Short description is required' },
      { field: 'shortDescription', type: 'min', value: 20, message: 'Short description must be at least 20 characters' },
      { field: 'duration', type: 'required', message: 'Duration is required' },
      { field: 'groupSize', type: 'required', message: 'Group size is required' }
    ]
  },
  {
    step: 'location-timing',
    rules: [
      { field: 'place', type: 'required', message: 'Place is required' },
      { field: 'pickupPoints', type: 'required', message: 'At least one pickup point is required' },
      { field: 'timingNotes', type: 'required', message: 'Timing notes are required' }
    ]
  },
  {
    step: 'detailed-planning',
    rules: [
      { field: 'itinerary', type: 'required', message: 'Detailed itinerary is required' },
      { field: 'difficulty', type: 'required', message: 'Difficulty level is required' }
    ]
  },
  {
    step: 'inclusions-exclusions',
    rules: [
      { field: 'inclusions', type: 'required', message: 'At least one inclusion is required' },
      { field: 'exclusions', type: 'required', message: 'At least one exclusion is required' }
    ]
  },
  {
    step: 'pricing-policies',
    rules: [
      { field: 'pricing.basePrice', type: 'required', message: 'Base price is required' },
      { field: 'pricing.basePrice', type: 'min', value: 1, message: 'Base price must be greater than 0' },
      { field: 'pricing.currency', type: 'required', message: 'Currency is required' }
    ]
  }
];

export function useSupabasePackageWizard() {
  const router = useRouter();
  const { state: authState } = useSimpleAuth();
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 'package-type',
    steps: [...STEP_CONFIGS],
    formData: {},
    isDirty: false,
    isSaving: false,
    errors: {},
    isValid: false
  });

  console.log('🚀 useSupabasePackageWizard initialized with:', {
    currentStep: wizardState.currentStep,
    formData: wizardState.formData,
    steps: wizardState.steps.map(s => ({ id: s.id, isCompleted: s.isCompleted, isAccessible: s.isAccessible }))
  });

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<Partial<PackageFormData>>({});

  // Initialize form with react-hook-form
  const form = useForm<PackageFormData>({
    mode: 'onChange',
    defaultValues: {
      type: undefined, // No default type - user must select
      title: '',
      description: '',
      shortDescription: '',
      difficulty: DifficultyLevel.MODERATE,
      duration: { days: 7, nights: 6 },
      groupSize: { min: 2, max: 12, ideal: 6 },
      tags: [],
      isFeatured: false,
      destinations: [],
      itinerary: [],
      inclusions: [],
      exclusions: [],
      termsAndConditions: [],
      pricing: {
        basePrice: 0,
        currency: 'USD',
        pricePerPerson: true,
        groupDiscounts: [],
        seasonalPricing: [],
        inclusions: [],
        taxes: { gst: 0, serviceTax: 0, tourismTax: 0, other: [] },
        fees: { bookingFee: 0, processingFee: 0, cancellationFee: 0, other: [] }
      },
      images: [],
      coverImage: '',
      status: PackageStatus.DRAFT
    }
  });

  // Validate a specific step
  const validateStep = useCallback((step: WizardStep): { isValid: boolean; errors: string[] } => {
    const stepValidation = STEP_VALIDATIONS.find(v => v.step === step);
    if (!stepValidation) {
      return { isValid: true, errors: [] };
    }

    const errors: string[] = [];
    const formValues = form.getValues();

    // Special validation for location-timing step
    if (step === 'location-timing') {
      const packageType = formValues.type;
      
      // Always required fields
      if (!formValues.place || formValues.place.trim() === '') {
        errors.push('Place is required');
      }
      
      if (!formValues.pickupPoints || formValues.pickupPoints.length === 0) {
        errors.push('At least one pickup point is required');
      }
      
      if (!formValues.timingNotes || formValues.timingNotes.trim() === '') {
        errors.push('Timing notes are required');
      }
      
      // Package type specific validations
      if (packageType === 'TRANSFERS' || packageType === 'LAND_PACKAGE' || packageType === 'LAND_PACKAGE_WITH_HOTEL') {
        if (!formValues.fromLocation || formValues.fromLocation.trim() === '') {
          errors.push('From location is required for this package type');
        }
        if (!formValues.toLocation || formValues.toLocation.trim() === '') {
          errors.push('To location is required for this package type');
        }
      }
      
      if (packageType === 'DAY_TOUR' || packageType === 'ACTIVITY') {
        if (!formValues.durationHours || formValues.durationHours <= 0) {
          errors.push('Duration in hours is required for this package type');
        }
      }
      
      if (packageType === 'LAND_PACKAGE' || packageType === 'LAND_PACKAGE_WITH_HOTEL' || packageType === 'MULTI_CITY_TOUR') {
        if (!formValues.durationDays || formValues.durationDays <= 0) {
          errors.push('Duration in days is required for this package type');
        }
      }
      
      console.log('🔍 Location-timing validation result:', { isValid: errors.length === 0, errors, formValues });
      return { isValid: errors.length === 0, errors };
    }

    // Standard validation for other steps
    stepValidation.rules.forEach(rule => {
      const fieldValue = formValues[rule.field as keyof PackageFormData];
      
      switch (rule.type) {
        case 'required':
          if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
            errors.push(rule.message);
          }
          break;
        case 'min':
          if (typeof fieldValue === 'string' && fieldValue.length < (rule.value as number)) {
            errors.push(rule.message);
          } else if (typeof fieldValue === 'number' && fieldValue < (rule.value as number)) {
            errors.push(rule.message);
          }
          break;
        case 'max':
          if (typeof fieldValue === 'string' && fieldValue.length > (rule.value as number)) {
            errors.push(rule.message);
          } else if (typeof fieldValue === 'number' && fieldValue > (rule.value as number)) {
            errors.push(rule.message);
          }
          break;
        case 'pattern':
          if (typeof fieldValue === 'string' && !new RegExp(rule.value as string).test(fieldValue)) {
            errors.push(rule.message);
          }
          break;
      }
    });

    return { isValid: errors.length === 0, errors };
  }, [form]);

  // Update form data and trigger validation
  const updateFormData = useCallback((updates: Partial<PackageFormData>) => {
    console.log('📝 Updating form data:', updates);
    
    // Update form values
    Object.entries(updates).forEach(([key, value]) => {
      form.setValue(key as keyof PackageFormData, value, { shouldValidate: true });
    });

    // Update wizard state
    setWizardState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
      isDirty: true,
      errors: {}
    }));

    // Trigger auto-save after delay
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 2000); // Auto-save after 2 seconds of inactivity
  }, [form]);

  // Save draft to Supabase
  const saveDraft = useCallback(async (): Promise<boolean> => {
    if (!authState.user) {
      console.error('No authenticated user for saving draft');
      return false;
    }

    try {
      setWizardState(prev => ({ ...prev, isSaving: true }));

      const formData = form.getValues();
      
      // Get tour operator profile for the current user
      const { data: tourOperator, error: tourOperatorError } = await TourOperatorService.getTourOperatorByUserId(authState.user.id);
      
      if (tourOperatorError || !tourOperator) {
        console.error('Error getting tour operator profile:', tourOperatorError);
        setWizardState(prev => ({ 
          ...prev, 
          isSaving: false,
          errors: { general: 'Tour operator profile not found. Please contact support.' }
        }));
        return false;
      }
      
      // Convert to database format
      const dbPackage = PackageService.convertToDbPackage({
        ...formData,
        tourOperatorId: tourOperator.id, // Use the actual tour operator ID
        status: PackageStatus.DRAFT
      });

      // Save to Supabase
      const { data, error } = await PackageService.createPackage(dbPackage);

      if (error) {
        console.error('Error saving draft:', error);
        setWizardState(prev => ({ 
          ...prev, 
          isSaving: false,
          errors: { general: 'Failed to save draft' }
        }));
        return false;
      }

      console.log('✅ Draft saved successfully:', data);
      
      setWizardState(prev => ({ 
        ...prev, 
        isSaving: false,
        lastSaved: new Date(),
        errors: {}
      }));

      lastSavedDataRef.current = formData;
      return true;
    } catch (error) {
      console.error('Error in saveDraft:', error);
      setWizardState(prev => ({ 
        ...prev, 
        isSaving: false,
        errors: { general: 'Failed to save draft' }
      }));
      return false;
    }
  }, [form, authState.user]);

  // Publish package
  const publishPackage = useCallback(async (): Promise<PackageCreationResult> => {
    if (!authState.user) {
      return { success: false, message: 'No authenticated user' };
    }

    try {
      setWizardState(prev => ({ ...prev, isSaving: true }));

      const formData = form.getValues();
      
      // Validate all steps
      const allSteps: WizardStep[] = ['package-type', 'basic-info', 'destinations', 'pricing', 'media'];
      const validationErrors: string[] = [];

      for (const step of allSteps) {
        const { isValid, errors } = validateStep(step);
        if (!isValid) {
          validationErrors.push(...errors);
        }
      }

      if (validationErrors.length > 0) {
        setWizardState(prev => ({ 
          ...prev, 
          isSaving: false,
          errors: { general: validationErrors.join(', ') }
        }));
        return { success: false, message: validationErrors.join(', ') };
      }

      // Get tour operator profile for the current user
      const { data: tourOperator, error: tourOperatorError } = await TourOperatorService.getTourOperatorByUserId(authState.user.id);
      
      if (tourOperatorError || !tourOperator) {
        console.error('Error getting tour operator profile:', tourOperatorError);
        setWizardState(prev => ({ 
          ...prev, 
          isSaving: false,
          errors: { general: 'Tour operator profile not found. Please contact support.' }
        }));
        return { success: false, message: 'Tour operator profile not found. Please contact support.' };
      }

      // Convert to database format
      const dbPackage = PackageService.convertToDbPackage({
        ...formData,
        tourOperatorId: tourOperator.id, // Use the actual tour operator ID
        status: PackageStatus.ACTIVE
      });

      // Save to Supabase
      const { data, error } = await PackageService.createPackage(dbPackage);

      if (error) {
        console.error('Error publishing package:', error);
        setWizardState(prev => ({ 
          ...prev, 
          isSaving: false,
          errors: { general: 'Failed to publish package' }
        }));
        return { success: false, message: 'Failed to publish package' };
      }

      console.log('✅ Package published successfully:', data);
      
      setWizardState(prev => ({ 
        ...prev, 
        isSaving: false,
        lastSaved: new Date(),
        errors: {}
      }));

      return { 
        success: true, 
        packageId: data?.id,
        message: 'Package published successfully!' 
      };
    } catch (error) {
      console.error('Error in publishPackage:', error);
      setWizardState(prev => ({ 
        ...prev, 
        isSaving: false,
        errors: { general: 'Failed to publish package' }
      }));
      return { success: false, message: 'Failed to publish package' };
    }
  }, [form, authState.user, validateStep]);

  // Navigate to specific step
  const goToStep = useCallback((step: WizardStep) => {
    const stepIndex = STEP_CONFIGS.findIndex(s => s.id === step);
    const currentStepIndex = STEP_CONFIGS.findIndex(s => s.id === wizardState.currentStep);

    if (stepIndex > currentStepIndex) {
      // Going forward - validate current step first
      const validationResult = validateStep(wizardState.currentStep);
      console.log('🔍 Validation result for', wizardState.currentStep, ':', validationResult);
      if (!validationResult.isValid) {
        console.log('❌ Cannot proceed - current step is invalid:', validationResult.errors);
        return;
      }
    }

    setWizardState(prev => ({
      ...prev,
      currentStep: step
    }));
  }, [wizardState.currentStep, validateStep]);

  // Go to next step
  const nextStep = useCallback(() => {
    const currentIndex = STEP_CONFIGS.findIndex(s => s.id === wizardState.currentStep);
    if (currentIndex < STEP_CONFIGS.length - 1) {
      const nextStepId = STEP_CONFIGS[currentIndex + 1].id as WizardStep;
      goToStep(nextStepId);
    }
  }, [wizardState.currentStep, goToStep]);

  // Go to previous step
  const previousStep = useCallback(() => {
    const currentIndex = STEP_CONFIGS.findIndex(s => s.id === wizardState.currentStep);
    if (currentIndex > 0) {
      const prevStepId = STEP_CONFIGS[currentIndex - 1].id as WizardStep;
      goToStep(prevStepId);
    }
  }, [wizardState.currentStep, goToStep]);

  // Reset wizard
  const resetWizard = useCallback(() => {
    form.reset();
    setWizardState({
      currentStep: 'package-type',
      steps: [...STEP_CONFIGS],
      formData: {},
      isDirty: false,
      isSaving: false,
      errors: {},
      isValid: false
    });
    lastSavedDataRef.current = {};
  }, [form]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  const actions: WizardActions = {
    goToStep,
    nextStep,
    previousStep,
    updateFormData,
    validateStep,
    saveDraft,
    publishPackage,
    resetWizard
  };

  return {
    ...wizardState,
    form,
    actions,
    isAuthenticated: !!authState.user,
    user: authState.user
  };
}

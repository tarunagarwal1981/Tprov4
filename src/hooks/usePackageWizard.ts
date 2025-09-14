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
import { packageService } from '@/lib/services/packageService';

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
    id: 'destinations',
    title: 'Destinations & Itinerary',
    description: 'Set destinations and create your itinerary',
    isCompleted: false,
    isAccessible: false,
    order: 3
  },
  {
    id: 'pricing',
    title: 'Pricing & Commission',
    description: 'Configure pricing and commission settings',
    isCompleted: false,
    isAccessible: false,
    order: 4
  },
  {
    id: 'media',
    title: 'Media & Gallery',
    description: 'Upload images and media for your package',
    isCompleted: false,
    isAccessible: false,
    order: 5
  },
  {
    id: 'review',
    title: 'Review & Publish',
    description: 'Review your package and publish it',
    isCompleted: false,
    isAccessible: false,
    order: 6
  }
];

// Validation rules for each step
const STEP_VALIDATIONS: StepValidation[] = [
  {
    step: 'package-type',
    rules: [
      { field: 'type', required: true }
    ]
  },
  {
    step: 'basic-info',
    rules: [
      { field: 'title', required: true, minLength: 3, maxLength: 100 },
      { field: 'description', required: true, minLength: 50, maxLength: 2000 },
      { field: 'shortDescription', required: true, minLength: 10, maxLength: 200 },
      { field: 'difficulty', required: true },
      { field: 'duration', required: true },
      { field: 'groupSize', required: true }
    ]
  },
  {
    step: 'destinations',
    rules: [
      { field: 'destinations', required: true },
      { field: 'itinerary', required: true },
      { field: 'inclusions', required: true },
      { field: 'exclusions', required: true }
    ]
  },
  {
    step: 'pricing',
    rules: [
      { field: 'pricing', required: true }
    ]
  },
  {
    step: 'media',
    rules: [
      { field: 'images', required: true },
      { field: 'coverImage', required: true }
    ]
  },
  {
    step: 'review',
    rules: [
      { field: 'status', required: true }
    ]
  }
];

export function usePackageWizard() {
  const router = useRouter();
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 'package-type',
    steps: [...STEP_CONFIGS],
    formData: {},
    isDirty: false,
    isSaving: false,
    errors: {},
    isValid: false
  });

  console.log('🚀 usePackageWizard initialized with:', {
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


  // Update form data
  const updateFormData = useCallback((data: Partial<PackageFormData>) => {
    setWizardState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
      isDirty: true
    }));

    // Update react-hook-form
    Object.entries(data).forEach(([key, value]) => {
      form.setValue(key as keyof PackageFormData, value);
    });
  }, []);

  // Navigate to a specific step
  const goToStep = useCallback((step: WizardStep) => {
    setWizardState(prev => {
      const stepConfig = prev.steps.find(s => s.id === step);
      if (!stepConfig || !stepConfig.isAccessible) return prev;

      return {
        ...prev,
        currentStep: step
      };
    });
  }, []);

  // Go to next step
  const nextStep = useCallback(() => {
    setWizardState(prev => {
      const currentIndex = prev.steps.findIndex(s => s.id === prev.currentStep);
      if (currentIndex === -1 || currentIndex >= prev.steps.length - 1) return prev;

      // Validate current step
      let validationResult;
      switch (prev.currentStep) {
        case 'package-type':
          validationResult = validatePackageType({ type: prev.formData.type });
          break;
        case 'basic-info':
          validationResult = validateBasicInfo({
            title: prev.formData.title,
            description: prev.formData.description,
            shortDescription: prev.formData.shortDescription,
            duration: prev.formData.duration,
            groupSize: prev.formData.groupSize,
            difficulty: prev.formData.difficulty,
            destinations: prev.formData.destinations,
            category: prev.formData.category,
            tags: prev.formData.tags,
            isFeatured: prev.formData.isFeatured
          });
          break;
        default:
          validationResult = { success: true };
      }

      if (!validationResult.success) {
        const formattedErrors = formatValidationErrors(validationResult.error);
        return {
          ...prev,
          errors: formattedErrors,
          isValid: false
        };
      }

      const nextStepConfig = prev.steps[currentIndex + 1];
      if (nextStepConfig) {
        return {
          ...prev,
          currentStep: nextStepConfig.id,
          errors: {},
          isValid: true,
          steps: prev.steps.map(step => {
            if (step.id === prev.currentStep) {
              return { ...step, isCompleted: true };
            }
            if (step.id === nextStepConfig.id) {
              return { ...step, isAccessible: true };
            }
            return step;
          })
        };
      }

      return prev;
    });
  }, []);

  // Go to previous step
  const previousStep = useCallback(() => {
    setWizardState(prev => {
      const currentIndex = prev.steps.findIndex(s => s.id === prev.currentStep);
      if (currentIndex <= 0) return prev;

      const prevStepConfig = prev.steps[currentIndex - 1];
      if (prevStepConfig) {
        return {
          ...prev,
          currentStep: prevStepConfig.id
        };
      }

      return prev;
    });
  }, []);

  // Save draft
  const saveDraft = useCallback(async (): Promise<void> => {
    setWizardState(prev => {
      if (!prev.isDirty) return prev;
      
      const draftData: DraftPackage = {
        id: `draft-${Date.now()}`,
        formData: prev.formData,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastStep: prev.currentStep,
        isPublished: false
      };

      // Save to localStorage for now (in real app, this would be an API call)
      localStorage.setItem('package-draft', JSON.stringify(draftData));

      lastSavedDataRef.current = { ...prev.formData };

      return {
        ...prev,
        isDirty: false,
        isSaving: false,
        lastSaved: new Date()
      };
    });
  }, []);

  // Publish package
  const publishPackage = useCallback(async (): Promise<PackageCreationResult> => {
    // Validate all steps
    const allStepsValid = wizardState.steps.every(step => {
      if (step.isCompleted) return true;
      
      // Inline validation for each step
      let validationResult;
      switch (step.id) {
        case 'package-type':
          validationResult = validatePackageType({ type: wizardState.formData.type });
          break;
        case 'basic-info':
          validationResult = validateBasicInfo({
            title: wizardState.formData.title,
            description: wizardState.formData.description,
            shortDescription: wizardState.formData.shortDescription,
            duration: wizardState.formData.duration,
            groupSize: wizardState.formData.groupSize,
            difficulty: wizardState.formData.difficulty,
            destinations: wizardState.formData.destinations,
            category: wizardState.formData.category,
            tags: wizardState.formData.tags,
            isFeatured: wizardState.formData.isFeatured
          });
          break;
        default:
          validationResult = { success: true };
      }
      
      return validationResult.success;
    });

    if (!allStepsValid) {
      return {
        success: false,
        errors: wizardState.errors,
        message: 'Please fix all validation errors before publishing'
      };
    }

    setWizardState(prev => ({ ...prev, isSaving: true }));

    try {
      const packageData = {
        id: `pkg-${Date.now()}`,
        tourOperatorId: 'op-001', // This would come from auth context
        title: wizardState.formData.title || '',
        description: wizardState.formData.description || '',
        type: wizardState.formData.type || PackageType.LAND_PACKAGE,
        status: wizardState.formData.status || PackageStatus.DRAFT,
        pricing: wizardState.formData.pricing || {
          basePrice: 0,
          currency: 'USD',
          pricePerPerson: true,
          groupDiscounts: [],
          seasonalPricing: [],
          inclusions: [],
          taxes: { gst: 0, serviceTax: 0, tourismTax: 0, other: [] },
          fees: { bookingFee: 0, processingFee: 0, cancellationFee: 0, other: [] }
        },
        itinerary: wizardState.formData.itinerary || [],
        inclusions: wizardState.formData.inclusions || [],
        exclusions: wizardState.formData.exclusions || [],
        termsAndConditions: wizardState.formData.termsAndConditions || [],
        cancellationPolicy: {
          freeCancellationDays: 7,
          cancellationFees: [
            { daysBeforeTravel: 7, feePercentage: 0 },
            { daysBeforeTravel: 3, feePercentage: 25 },
            { daysBeforeTravel: 1, feePercentage: 50 },
            { daysBeforeTravel: 0, feePercentage: 100 }
          ],
          refundPolicy: {
            refundable: true,
            refundPercentage: 100,
            processingDays: 7,
            conditions: ['Cancellation must be made before travel date']
          },
          forceMajeurePolicy: 'Full refund for force majeure events'
        },
        images: wizardState.formData.images || [],
        destinations: wizardState.formData.destinations || [],
        duration: wizardState.formData.duration || { days: 1, nights: 0 },
        groupSize: wizardState.formData.groupSize || { min: 1, max: 10, ideal: 5 },
        difficulty: wizardState.formData.difficulty || DifficultyLevel.MODERATE,
        tags: wizardState.formData.tags || [],
        isFeatured: wizardState.formData.isFeatured || false,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Package;

      const response = await packageService.createPackage(packageData);

      if (response.success) {
        // Clear draft
        localStorage.removeItem('package-draft');
        
        setWizardState(prev => ({ ...prev, isSaving: false }));
        
        return {
          success: true,
          package: response.data,
          message: 'Package created successfully!'
        };
      } else {
        return {
          success: false,
          errors: { general: [response.error || 'Failed to create package'] },
          message: response.error || 'Failed to create package'
        };
      }
    } catch (error) {
      console.error('Error publishing package:', error);
      return {
        success: false,
        errors: { general: ['An unexpected error occurred'] },
        message: 'An unexpected error occurred'
      };
    } finally {
      setWizardState(prev => ({ ...prev, isSaving: false }));
    }
  }, []);

  // Reset wizard
  const resetWizard = useCallback(() => {
    setWizardState({
      currentStep: 'package-type',
      steps: [...STEP_CONFIGS],
      formData: {},
      isDirty: false,
      isSaving: false,
      errors: {},
      isValid: false
    });
    form.reset();
    localStorage.removeItem('package-draft');
  }, [form]);

  // Auto-save functionality
  useEffect(() => {
    if (!wizardState.isDirty) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 30000); // Auto-save every 30 seconds

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [wizardState.isDirty]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('package-draft');
    console.log('🔍 Checking for saved draft:', savedDraft);
    
    if (savedDraft) {
      try {
        const draft: DraftPackage = JSON.parse(savedDraft);
        console.log('📦 Found saved draft:', draft);
        
        // Clear the draft to start fresh
        localStorage.removeItem('package-draft');
        console.log('🗑️ Cleared saved draft to start fresh');
      } catch (error) {
        console.error('Error loading draft:', error);
        // Clear invalid draft
        localStorage.removeItem('package-draft');
      }
    } else {
      console.log('✨ No saved draft found, starting fresh');
    }
  }, [form]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (wizardState.isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [wizardState.isDirty]);

  const actions: WizardActions = {
    goToStep,
    nextStep,
    previousStep,
    updateFormData,
    saveDraft,
    publishPackage,
    resetWizard
  };

  return {
    ...wizardState,
    ...actions,
    form
  };
}

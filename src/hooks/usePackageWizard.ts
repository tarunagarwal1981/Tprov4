'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
      { field: 'type', required: true }
    ]
  },
  {
    step: 'basic-info',
    rules: [
      { field: 'title', required: true, minLength: 3, maxLength: 100 },
      { field: 'description', required: true, minLength: 50, maxLength: 2000 },
      { field: 'shortDescription', required: true, minLength: 10, maxLength: 200 },
      { field: 'bannerImage', required: true }
    ]
  },
  {
    step: 'location-timing',
    rules: [
      { field: 'place', required: true },
      { field: 'pickupPoints', required: true },
      { field: 'timingNotes', required: true }
    ]
  },
  {
    step: 'detailed-planning',
    rules: [
      { field: 'itinerary', required: true },
      { field: 'vehicleType', required: true },
      { field: 'acNonAc', required: true }
    ]
  },
  {
    step: 'inclusions-exclusions',
    rules: [
      { field: 'tourInclusions', required: true },
      { field: 'tourExclusions', required: true }
    ]
  },
  {
    step: 'pricing-policies',
    rules: [
      { field: 'adultPrice', required: true },
      { field: 'childPrice', required: true },
      { field: 'currency', required: true },
      { field: 'minGroupSize', required: true },
      { field: 'maxGroupSize', required: true }
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

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<Partial<PackageFormData>>({});


  // Update form data
  const updateFormData = useCallback((data: Partial<PackageFormData>) => {
    setWizardState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...data },
      isDirty: true
    }));
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
      
      if (currentIndex === -1 || currentIndex >= prev.steps.length - 1) {
        return prev;
      }

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
            bannerImage: prev.formData.bannerImage,
            additionalImages: prev.formData.additionalImages || [],
            additionalNotes: prev.formData.additionalNotes || ''
          });
          break;
        case 'location-timing':
          // Validate required fields based on package type
          const packageType = prev.formData.type;
          const validationErrors: string[] = [];
          
          console.log('🔍 Location-timing validation - packageType:', packageType);
          console.log('🔍 Location-timing validation - formData:', prev.formData);
          
          // Always required fields
          if (!prev.formData.place || prev.formData.place.trim() === '') {
            validationErrors.push('Place is required');
            console.log('❌ Missing place field');
          }
          
          if (!prev.formData.pickupPoints || prev.formData.pickupPoints.length === 0) {
            validationErrors.push('At least one pickup point is required');
            console.log('❌ Missing pickup points');
          }
          
          if (!prev.formData.timingNotes || prev.formData.timingNotes.trim() === '') {
            validationErrors.push('Timing notes are required');
            console.log('❌ Missing timing notes');
          }
          
          // Package type specific validations
          if (packageType === 'TRANSFERS' || packageType === 'LAND_PACKAGE' || packageType === 'LAND_PACKAGE_WITH_HOTEL') {
            if (!prev.formData.fromLocation || prev.formData.fromLocation.trim() === '') {
              validationErrors.push('From location is required for this package type');
              console.log('❌ Missing from location');
            }
            if (!prev.formData.toLocation || prev.formData.toLocation.trim() === '') {
              validationErrors.push('To location is required for this package type');
              console.log('❌ Missing to location');
            }
          }
          
          if (packageType === 'ACTIVITY' || packageType === 'TRANSFERS') {
            if (!prev.formData.durationHours || prev.formData.durationHours <= 0) {
              validationErrors.push('Duration in hours is required for this package type');
              console.log('❌ Missing duration hours');
            }
          }
          
          if (packageType === 'LAND_PACKAGE' || packageType === 'LAND_PACKAGE_WITH_HOTEL') {
            if (!prev.formData.durationDays || prev.formData.durationDays <= 0) {
              validationErrors.push('Duration in days is required for this package type');
              console.log('❌ Missing duration days');
            }
          }
          
          console.log('🔍 Location-timing validation errors:', validationErrors);
          
          validationResult = validationErrors.length === 0 ? { success: true } : { 
            success: false, 
            error: { 
              issues: validationErrors.map(error => ({ 
                path: ['general'], 
                message: error 
              })) 
            } 
          };
          break;
        case 'detailed-planning':
          validationResult = { success: true }; // Add validation logic
          break;
        case 'inclusions-exclusions':
          validationResult = { success: true }; // Add validation logic
          break;
        case 'pricing-policies':
          validationResult = { success: true }; // Add validation logic
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
    console.log('🚀 Starting package publish process...');
    
    // Get the current state at the time of execution
    let currentFormData: Partial<PackageFormData> = {};
    let currentErrors: Record<string, string[]> = {};
    
    setWizardState(currentState => {
      console.log('🔍 Current wizard state:', currentState);
      currentFormData = currentState.formData;
      currentErrors = currentState.errors;
      return currentState; // Don't modify state here
    });
    
    // Validate all steps based on current form data
    const validationErrors: string[] = [];
    
    // Step 1: Package Type
    if (!currentFormData.type) {
      validationErrors.push('Package type is required');
    }
    
    // Step 2: Basic Info
    if (!currentFormData.title || currentFormData.title.trim() === '') {
      validationErrors.push('Title is required');
    }
    if (!currentFormData.description || currentFormData.description.trim() === '') {
      validationErrors.push('Description is required');
    }
    if (!currentFormData.shortDescription || currentFormData.shortDescription.trim() === '') {
      validationErrors.push('Short description is required');
    }
    if (!currentFormData.bannerImage || currentFormData.bannerImage.trim() === '') {
      validationErrors.push('Banner image is required');
    }
    
    // Step 3: Location & Timing
    if (!currentFormData.place || currentFormData.place.trim() === '') {
      validationErrors.push('Place is required');
    }
    if (!currentFormData.pickupPoints || currentFormData.pickupPoints.length === 0) {
      validationErrors.push('At least one pickup point is required');
    }
    if (!currentFormData.timingNotes || currentFormData.timingNotes.trim() === '') {
      validationErrors.push('Timing notes are required');
    }
    
    // Package type specific validations
    const packageType = currentFormData.type;
    if (packageType === 'TRANSFERS' || packageType === 'LAND_PACKAGE' || packageType === 'LAND_PACKAGE_WITH_HOTEL') {
      if (!currentFormData.fromLocation || currentFormData.fromLocation.trim() === '') {
        validationErrors.push('From location is required for this package type');
      }
      if (!currentFormData.toLocation || currentFormData.toLocation.trim() === '') {
        validationErrors.push('To location is required for this package type');
      }
    }
    
    if (packageType === 'ACTIVITY' || packageType === 'TRANSFERS') {
      if (!currentFormData.durationHours || currentFormData.durationHours <= 0) {
        validationErrors.push('Duration in hours is required for this package type');
      }
    }
    
    if (packageType === 'LAND_PACKAGE' || packageType === 'LAND_PACKAGE_WITH_HOTEL') {
      if (!currentFormData.durationDays || currentFormData.durationDays <= 0) {
        validationErrors.push('Duration in days is required for this package type');
      }
    }
    
    // Step 4: Detailed Planning
    if (!currentFormData.vehicleType || currentFormData.vehicleType.trim() === '') {
      validationErrors.push('Vehicle type is required');
    }
    if (!currentFormData.acNonAc || currentFormData.acNonAc.trim() === '') {
      validationErrors.push('AC/Non-AC selection is required');
    }
    
    // Step 5: Inclusions & Exclusions
    if (!currentFormData.tourInclusions || currentFormData.tourInclusions.length === 0) {
      validationErrors.push('At least one tour inclusion is required');
    }
    if (!currentFormData.tourExclusions || currentFormData.tourExclusions.length === 0) {
      validationErrors.push('At least one tour exclusion is required');
    }
    
    // Step 6: Pricing & Policies
    if (!currentFormData.adultPrice || currentFormData.adultPrice <= 0) {
      validationErrors.push('Adult price is required and must be greater than 0');
    }
    if (!currentFormData.childPrice || currentFormData.childPrice <= 0) {
      validationErrors.push('Child price is required and must be greater than 0');
    }
    if (!currentFormData.currency || currentFormData.currency.trim() === '') {
      validationErrors.push('Currency is required');
    }
    if (!currentFormData.minGroupSize || currentFormData.minGroupSize <= 0) {
      validationErrors.push('Minimum group size is required');
    }
    if (!currentFormData.maxGroupSize || currentFormData.maxGroupSize <= 0) {
      validationErrors.push('Maximum group size is required');
    }
    
    const allStepsValid = validationErrors.length === 0;

    console.log('🔍 All steps valid:', allStepsValid);
    console.log('🔍 Current form data:', currentFormData);

    if (!allStepsValid) {
      console.log('❌ Validation failed - not all steps are valid');
      console.log('🔍 Validation errors:', validationErrors);
      return {
        success: false,
        errors: { general: validationErrors },
        message: 'Please fix all validation errors before publishing'
      };
    }

    console.log('✅ All steps validated successfully');
    setWizardState(prev => ({ ...prev, isSaving: true }));

    try {
      const packageData = {
        id: `pkg-${Date.now()}`,
        tourOperatorId: 'op-001', // This would come from auth context
        title: currentFormData.title || '',
        description: currentFormData.description || '',
        type: currentFormData.type || PackageType.ACTIVITY,
        status: currentFormData.status || PackageStatus.DRAFT,
        pricing: {
          basePrice: currentFormData.adultPrice || 0,
          currency: currentFormData.currency || 'USD',
          pricePerPerson: true,
          groupDiscounts: currentFormData.groupDiscounts || [],
          seasonalPricing: currentFormData.seasonalPricing || [],
          inclusions: currentFormData.tourInclusions || [],
          taxes: { gst: 0, serviceTax: 0, tourismTax: 0, other: [] },
          fees: { bookingFee: 0, processingFee: 0, cancellationFee: 0, other: [] }
        },
        itinerary: currentFormData.itinerary || [],
        inclusions: currentFormData.tourInclusions || [],
        exclusions: currentFormData.tourExclusions || [],
        termsAndConditions: currentFormData.termsAndConditions || [],
        cancellationPolicy: currentFormData.cancellationPolicy || {
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
        images: currentFormData.additionalImages || [],
        destinations: currentFormData.multipleDestinations || [],
        duration: {
          days: currentFormData.durationDays || 1,
          nights: currentFormData.durationDays ? currentFormData.durationDays - 1 : 0
        },
        groupSize: {
          min: currentFormData.minGroupSize || 1,
          max: currentFormData.maxGroupSize || 10,
          ideal: Math.floor((currentFormData.minGroupSize || 1 + currentFormData.maxGroupSize || 10) / 2)
        },
        difficulty: currentFormData.difficulty || DifficultyLevel.MODERATE,
        tags: currentFormData.tags || [],
        isFeatured: currentFormData.isFeatured || false,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Package;

      console.log('📦 Package data prepared:', packageData);
      console.log('🔄 Calling packageService.createPackage...');

      const response = await packageService.createPackage(packageData);

      console.log('📦 Package service response:', response);

      if (response.success) {
        // Clear draft
        localStorage.removeItem('package-draft');
        
        setWizardState(prev => ({ ...prev, isSaving: false }));
        
        console.log('✅ Package published successfully!');
        return {
          success: true,
          package: response.data,
          message: 'Package created successfully!'
        };
      } else {
        console.log('❌ Package service returned error:', response.error);
        return {
          success: false,
          errors: { general: [response.error || 'Failed to create package'] },
          message: response.error || 'Failed to create package'
        };
      }
    } catch (error) {
      console.error('❌ Error publishing package:', error);
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
    localStorage.removeItem('package-draft');
  }, []);

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
    
    if (savedDraft) {
      try {
        const draft: DraftPackage = JSON.parse(savedDraft);
        
        // Clear the draft to start fresh
        localStorage.removeItem('package-draft');
      } catch (error) {
        console.error('Error loading draft:', error);
        // Clear invalid draft
        localStorage.removeItem('package-draft');
      }
    }
  }, []);

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
    ...actions
  };
}

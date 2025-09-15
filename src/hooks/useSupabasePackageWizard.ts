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

  // Only log when the hook actually initializes, not on every render
  useEffect(() => {
    console.log('🚀 useSupabasePackageWizard initialized with:', {
      currentStep: wizardState.currentStep,
      formData: wizardState.formData,
      steps: wizardState.steps.map(s => ({ id: s.id, isCompleted: s.isCompleted, isAccessible: s.isAccessible }))
    });
  }, []); // Empty dependency array - only log once

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
      bannerImage: '',
      additionalImages: [],
      additionalNotes: '',
      place: '',
      fromLocation: '',
      toLocation: '',
      multipleDestinations: [],
      pickupPoints: [],
      durationHours: undefined, // Don't default to 0 - let user set it
      durationDays: undefined, // Don't default to 0 - let user set it
      startTime: '',
      endTime: '',
      timingNotes: '',
      itinerary: [],
      activitiesPerDay: [],
      mealPlanPerDay: [],
      freeTimeLeisure: [],
      hotelCategory: '',
      roomType: '',
      hotelNameOptions: [],
      checkInCheckOut: '',
      vehicleType: '',
      acNonAc: '',
      driverDetails: '',
      fuelInclusion: false,
      departureAirport: '',
      arrivalAirport: '',
      flightClass: '',
      airlinePreference: '',
      baggageAllowance: '',
      tourInclusions: [],
      mealInclusions: [],
      entryTickets: [],
      guideServices: [],
      insurance: [],
      tourExclusions: [],
      personalExpenses: [],
      optionalActivities: [],
      visaDocumentation: [],
      adultPrice: 0,
      childPrice: 0,
      infantPrice: 0,
      seniorCitizenPrice: 0,
      groupDiscounts: [],
      seasonalPricing: [],
      validityDates: { startDate: '', endDate: '', blackoutDates: [] },
      currency: 'USD',
      minGroupSize: 1,
      maxGroupSize: 10,
      advanceBookingDays: 7,
      cancellationPolicy: {
        freeCancellationDays: 7,
        cancellationFees: [],
        forceMajeurePolicy: ''
      },
      refundPolicy: {
        refundable: true,
        refundPercentage: 100,
        processingDays: 7,
        conditions: []
      },
      paymentTerms: [],
      ageRestrictions: [],
      physicalRequirements: [],
      specialEquipment: [],
      weatherDependency: [],
      languageOptions: [],
      dressCode: [],
      difficulty: DifficultyLevel.MODERATE,
      groupSize: { min: 2, max: 12, ideal: 6 },
      tags: [],
      isFeatured: false,
      category: '',
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
      
      // Field visibility matrix based on package type (matching the component)
      const FIELD_VISIBILITY = {
        [PackageType.ACTIVITY]: {
          place: true,
          fromLocation: false,
          toLocation: false,
          multipleDestinations: false,
          pickupPoints: true,
          durationHours: true,
          durationDays: false,
          startTime: true,
          endTime: true,
          timingNotes: true
        },
        [PackageType.TRANSFERS]: {
          place: true,
          fromLocation: true,
          toLocation: true,
          multipleDestinations: false,
          pickupPoints: true,
          durationHours: true,
          durationDays: false,
          startTime: true,
          endTime: false,
          timingNotes: true
        },
        [PackageType.LAND_PACKAGE]: {
          place: true,
          fromLocation: true,
          toLocation: true,
          multipleDestinations: true,
          pickupPoints: true,
          durationHours: false,
          durationDays: true,
          startTime: true,
          endTime: false,
          timingNotes: true
        },
        [PackageType.LAND_PACKAGE_WITH_HOTEL]: {
          place: true,
          fromLocation: true,
          toLocation: true,
          multipleDestinations: true,
          pickupPoints: true,
          durationHours: false,
          durationDays: true,
          startTime: true,
          endTime: false,
          timingNotes: true
        },
        [PackageType.FIXED_DEPARTURE_WITH_FLIGHT]: {
          place: true,
          fromLocation: true,
          toLocation: true,
          multipleDestinations: true,
          pickupPoints: true,
          durationHours: false,
          durationDays: true,
          startTime: true,
          endTime: false,
          timingNotes: true
        },
        [PackageType.DAY_TOUR]: {
          place: true,
          fromLocation: true,
          toLocation: true,
          multipleDestinations: false,
          pickupPoints: true,
          durationHours: true,
          durationDays: false,
          startTime: true,
          endTime: true,
          timingNotes: true
        },
        [PackageType.MULTI_CITY_TOUR]: {
          place: true,
          fromLocation: false,
          toLocation: false,
          multipleDestinations: true,
          pickupPoints: true,
          durationHours: false,
          durationDays: true,
          startTime: true,
          endTime: false,
          timingNotes: true
        }
      };
      
      const visibleFields = FIELD_VISIBILITY[packageType] || {};
      
      // Always required fields (always visible)
      if (!formValues.place || formValues.place.trim() === '') {
        errors.push('Place is required');
      }
      
      if (!formValues.pickupPoints || formValues.pickupPoints.length === 0) {
        errors.push('At least one pickup point is required');
      }
      
      if (!formValues.timingNotes || formValues.timingNotes.trim() === '') {
        errors.push('Timing notes are required');
      }
      
      // Package type specific validations - only validate visible fields
      if (visibleFields.fromLocation && (!formValues.fromLocation || formValues.fromLocation.trim() === '')) {
        errors.push('From location is required');
      }
      
      if (visibleFields.toLocation && (!formValues.toLocation || formValues.toLocation.trim() === '')) {
        errors.push('To location is required');
      }
      
      if (visibleFields.durationHours && (!formValues.durationHours || formValues.durationHours <= 0)) {
        errors.push('Duration in hours is required');
      }
      
      if (visibleFields.durationDays && (!formValues.durationDays || formValues.durationDays <= 0)) {
        errors.push('Duration in days is required');
      }
      
      if (visibleFields.startTime && (!formValues.startTime || formValues.startTime.trim() === '')) {
        errors.push('Start time is required');
      }
      
      if (visibleFields.endTime && (!formValues.endTime || formValues.endTime.trim() === '')) {
        errors.push('End time is required');
      }
      
      console.log('🔍 Location-timing validation result:', { 
        isValid: errors.length === 0, 
        errors, 
        formValues, 
        packageType,
        visibleFields 
      });
      return { isValid: errors.length === 0, errors };
    }

    // Special validation for detailed-planning step
    if (step === 'detailed-planning') {
      const packageType = formValues.type;
      
      // Field visibility matrix for detailed planning (matching the component)
      const PLANNING_FIELDS = {
        [PackageType.ACTIVITY]: {
          itinerary: false,
          activitiesPerDay: false,
          mealPlanPerDay: false,
          freeTimeLeisure: false,
          hotelCategory: false,
          roomType: false,
          hotelNameOptions: false,
          checkInCheckOut: false,
          vehicleType: true,
          acNonAc: true,
          driverDetails: false,
          fuelInclusion: true,
          departureAirport: false,
          arrivalAirport: false,
          flightClass: false,
          airlinePreference: false,
          baggageAllowance: false
        },
        [PackageType.TRANSFERS]: {
          itinerary: false,
          activitiesPerDay: false,
          mealPlanPerDay: false,
          freeTimeLeisure: false,
          hotelCategory: false,
          roomType: false,
          hotelNameOptions: false,
          checkInCheckOut: false,
          vehicleType: true,
          acNonAc: true,
          driverDetails: true,
          fuelInclusion: true,
          departureAirport: false,
          arrivalAirport: false,
          flightClass: false,
          airlinePreference: false,
          baggageAllowance: false
        },
        [PackageType.LAND_PACKAGE]: {
          itinerary: true,
          activitiesPerDay: true,
          mealPlanPerDay: true,
          freeTimeLeisure: true,
          hotelCategory: false,
          roomType: false,
          hotelNameOptions: false,
          checkInCheckOut: false,
          vehicleType: true,
          acNonAc: true,
          driverDetails: true,
          fuelInclusion: true,
          departureAirport: false,
          arrivalAirport: false,
          flightClass: false,
          airlinePreference: false,
          baggageAllowance: false
        },
        [PackageType.LAND_PACKAGE_WITH_HOTEL]: {
          itinerary: true,
          activitiesPerDay: true,
          mealPlanPerDay: true,
          freeTimeLeisure: true,
          hotelCategory: true,
          roomType: true,
          hotelNameOptions: true,
          checkInCheckOut: true,
          vehicleType: true,
          acNonAc: true,
          driverDetails: true,
          fuelInclusion: true,
          departureAirport: false,
          arrivalAirport: false,
          flightClass: false,
          airlinePreference: false,
          baggageAllowance: false
        },
        [PackageType.FIXED_DEPARTURE_WITH_FLIGHT]: {
          itinerary: true,
          activitiesPerDay: true,
          mealPlanPerDay: true,
          freeTimeLeisure: true,
          hotelCategory: true,
          roomType: true,
          hotelNameOptions: true,
          checkInCheckOut: true,
          vehicleType: true,
          acNonAc: true,
          driverDetails: true,
          fuelInclusion: true,
          departureAirport: true,
          arrivalAirport: true,
          flightClass: true,
          airlinePreference: true,
          baggageAllowance: true
        },
        [PackageType.DAY_TOUR]: {
          itinerary: true,
          activitiesPerDay: true,
          mealPlanPerDay: true,
          freeTimeLeisure: true,
          hotelCategory: false,
          roomType: false,
          hotelNameOptions: false,
          checkInCheckOut: false,
          vehicleType: true,
          acNonAc: true,
          driverDetails: true,
          fuelInclusion: true,
          departureAirport: false,
          arrivalAirport: false,
          flightClass: false,
          airlinePreference: false,
          baggageAllowance: false
        },
        [PackageType.MULTI_CITY_TOUR]: {
          itinerary: true,
          activitiesPerDay: true,
          mealPlanPerDay: true,
          freeTimeLeisure: true,
          hotelCategory: true,
          roomType: true,
          hotelNameOptions: true,
          checkInCheckOut: true,
          vehicleType: true,
          acNonAc: true,
          driverDetails: true,
          fuelInclusion: true,
          departureAirport: false,
          arrivalAirport: false,
          flightClass: false,
          airlinePreference: false,
          baggageAllowance: false
        }
      };
      
      const visibleFields = PLANNING_FIELDS[packageType] || {};
      
      // Only validate fields that are visible/required for this package type
      if (visibleFields.itinerary && (!formValues.itinerary || formValues.itinerary.length === 0)) {
        errors.push('Detailed itinerary is required');
      }
      
      if (visibleFields.vehicleType && (!formValues.vehicleType || formValues.vehicleType.trim() === '')) {
        errors.push('Vehicle type is required');
      }
      
      if (visibleFields.acNonAc && (!formValues.acNonAc || formValues.acNonAc.trim() === '')) {
        errors.push('AC/Non-AC selection is required');
      }
      
      if (visibleFields.driverDetails && (!formValues.driverDetails || formValues.driverDetails.trim() === '')) {
        errors.push('Driver details are required');
      }
      
      // Check if difficulty is selected (this should be required for all package types)
      if (!formValues.difficulty) {
        errors.push('Difficulty level is required');
      }
      
      console.log('🔍 Detailed-planning validation result:', { 
        isValid: errors.length === 0, 
        errors, 
        packageType,
        visibleFields,
        itinerary: formValues.itinerary,
        difficulty: formValues.difficulty
      });
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
      
      // Get or create tour operator profile for the current user
      const { data: tourOperator, error: tourOperatorError } = await TourOperatorService.ensureTourOperatorProfile(
        authState.user.id, 
        authState.user.name || 'My Travel Company'
      );
      
      if (tourOperatorError || !tourOperator) {
        console.error('Error getting/creating tour operator profile:', tourOperatorError);
        setWizardState(prev => ({ 
          ...prev, 
          isSaving: false,
          errors: { general: 'Failed to get tour operator profile. Please contact support.' }
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

      // Get or create tour operator profile for the current user
      const { data: tourOperator, error: tourOperatorError } = await TourOperatorService.ensureTourOperatorProfile(
        authState.user.id, 
        authState.user.name || 'My Travel Company'
      );
      
      if (tourOperatorError || !tourOperator) {
        console.error('Error getting/creating tour operator profile:', tourOperatorError);
        setWizardState(prev => ({ 
          ...prev, 
          isSaving: false,
          errors: { general: 'Failed to get tour operator profile. Please contact support.' }
        }));
        return { success: false, message: 'Failed to get tour operator profile. Please contact support.' };
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
      
      // Special validation for detailed-planning step when proceeding forward
      if (wizardState.currentStep === 'detailed-planning') {
        const formValues = form.getValues();
        if (!formValues.itinerary || formValues.itinerary.length === 0) {
          console.log('❌ Cannot proceed from detailed-planning - itinerary is required');
          return;
        }
      }
      
      if (!validationResult.isValid) {
        console.log('❌ Cannot proceed - current step is invalid:', validationResult.errors);
        return;
      }
    }

    setWizardState(prev => ({
      ...prev,
      currentStep: step
    }));
  }, [wizardState.currentStep, validateStep, form]);

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

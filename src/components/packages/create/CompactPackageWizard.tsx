'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabasePackageWizard } from '@/hooks/useSupabasePackageWizard';
import { WizardStep, StepProps } from '@/lib/types/wizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Eye, 
  X,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  FileText,
  DollarSign,
  Settings,
  Zap,
  Clock,
  Users,
  MapPin,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import step components
import CompactPackageEssentialsStep from './steps/CompactPackageEssentialsStep';
import CompactPackageDetailsStep from './steps/CompactPackageDetailsStep';
import CompactPricingReviewStep from './steps/CompactPricingReviewStep';

interface CompactPackageWizardProps {
  className?: string;
}

// Compact 3-step configuration
const COMPACT_STEPS: WizardStep[] = [
  'package-type',
  'detailed-planning', 
  'pricing-policies'
];

// Step configuration with icons and descriptions
const STEP_CONFIG = {
  'package-type': {
    icon: Sparkles,
    title: 'Package Essentials',
    description: 'Choose package type and basic information',
    color: 'blue'
  },
  'detailed-planning': {
    icon: FileText,
    title: 'Package Details',
    description: 'Add detailed planning and inclusions',
    color: 'green'
  },
  'pricing-policies': {
    icon: DollarSign,
    title: 'Pricing & Review',
    description: 'Set pricing and review your package',
    color: 'purple'
  }
};

export default function CompactPackageWizard({ className }: CompactPackageWizardProps) {
  const router = useRouter();
  
  // Use the existing wizard hook
  const {
    currentStep,
    steps,
    formData,
    isDirty,
    isSaving,
    lastSaved,
    errors,
    isValid,
    goToStep,
    nextStep,
    previousStep,
    updateFormData,
    saveDraft,
    publishPackage,
    resetWizard,
    form
  } = useSupabasePackageWizard();

  // Step mapping for compact workflow
  const stepComponents: Record<WizardStep, React.ComponentType<StepProps>> = {
    'package-type': CompactPackageEssentialsStep,
    'basic-info': CompactPackageEssentialsStep,
    'location-timing': CompactPackageEssentialsStep,
    'detailed-planning': CompactPackageDetailsStep,
    'inclusions-exclusions': CompactPackageDetailsStep,
    'pricing-policies': CompactPricingReviewStep,
    'review': CompactPricingReviewStep
  };

  // Map compact steps to wizard steps
  const compactStepMapping = {
    0: 'package-type',
    1: 'detailed-planning',
    2: 'pricing-policies'
  };

  const currentStepIndex = Object.values(compactStepMapping).indexOf(currentStep);
  const CurrentStepComponent = stepComponents[currentStep];

  const handleNextStep = () => {
    if (nextStep) {
      goToStep(nextStep);
    }
  };

  const handlePreviousStep = () => {
    if (previousStep) {
      goToStep(previousStep);
    }
  };

  const handleGoToStep = (stepIndex: number) => {
    const stepId = compactStepMapping[stepIndex as keyof typeof compactStepMapping];
    if (stepId) {
      goToStep(stepId);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft();
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handlePublishPackage = async () => {
    try {
      await publishPackage();
      router.push('/operator/packages');
    } catch (error) {
      console.error('Error publishing package:', error);
    }
  };

  const handleResetWizard = () => {
    resetWizard();
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${className || ''}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Package
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create amazing travel packages with our streamlined 3-step process. 
            All the power of the original wizard, now more efficient than ever.
          </p>
        </motion.div>

        {/* Compact Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {COMPACT_STEPS.map((step, index) => {
              const config = STEP_CONFIG[step];
              const IconComponent = config.icon;
              const isActive = step === currentStep;
              const isCompleted = currentStepIndex > index;
              const isAccessible = currentStepIndex >= index;
              
              return (
                <div key={step} className="flex flex-col items-center">
                  <button
                    onClick={() => isAccessible && handleGoToStep(index)}
                    disabled={!isAccessible}
                    className={cn(
                      "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive
                        ? `bg-${config.color}-600 text-white shadow-lg scale-110`
                        : isCompleted
                        ? "bg-green-600 text-white shadow-md"
                        : isAccessible
                        ? `bg-${config.color}-100 text-${config.color}-600 hover:bg-${config.color}-200 cursor-pointer`
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    <IconComponent className="w-6 h-6" />
                    {isCompleted && (
                      <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-600 bg-white rounded-full" />
                    )}
                  </button>
                  
                  <div className="mt-3 text-center">
                    <h3 className={cn(
                      "text-sm font-medium",
                      isActive ? `text-${config.color}-600` : "text-gray-600"
                    )}>
                      {config.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-24">
                      {config.description}
                    </p>
                  </div>
                  
                  {index < COMPACT_STEPS.length - 1 && (
                    <div className={cn(
                      "absolute top-8 left-16 w-32 h-1 transition-all duration-300",
                      isCompleted ? "bg-green-600" : "bg-gray-300"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isDirty && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            {isSaving && (
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Clock className="w-3 h-3 mr-1" />
                Saving...
              </Badge>
            )}
            {lastSaved && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Saved {new Date(lastSaved).toLocaleTimeString()}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSaving || !isDirty}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetWizard}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            {CurrentStepComponent && (
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                isValid={isValid}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
                onPublish={handlePublishPackage}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {COMPACT_STEPS.length} • 
            {isValid ? (
              <span className="text-green-600 ml-1">Ready to continue</span>
            ) : (
              <span className="text-red-600 ml-1">Please complete required fields</span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={!previousStep}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep === 'pricing-policies' ? (
              <Button
                onClick={handlePublishPackage}
                disabled={!isValid || isSaving}
                className="bg-green-600 hover:bg-green-700 text-white px-6 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Publish Package
              </Button>
            ) : (
              <Button
                onClick={handleNextStep}
                disabled={!isValid || !nextStep}
                className="flex items-center"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
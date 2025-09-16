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
    description: 'Type, basic info & location',
    color: 'blue',
    order: 1
  },
  'detailed-planning': {
    icon: FileText,
    title: 'Package Details',
    description: 'Planning & inclusions',
    color: 'purple',
    order: 2
  },
  'pricing-policies': {
    icon: DollarSign,
    title: 'Pricing & Review',
    description: 'Pricing & final review',
    color: 'green',
    order: 3
  }
};

// Step component mapping
const STEP_COMPONENTS: Record<WizardStep, React.ComponentType<StepProps>> = {
  'package-type': CompactPackageEssentialsStep,
  'detailed-planning': CompactPackageDetailsStep,
  'pricing-policies': CompactPricingReviewStep,
  // Legacy steps (not used in compact mode)
  'basic-info': CompactPackageEssentialsStep,
  'location-timing': CompactPackageEssentialsStep,
  'inclusions-exclusions': CompactPackageDetailsStep,
  'review': CompactPricingReviewStep
};

export default function CompactPackageWizard({ className }: CompactPackageWizardProps) {
  const router = useRouter();
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
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

  // Map compact steps to actual wizard steps
  const compactStepMapping = {
    0: 'package-type',
    1: 'detailed-planning', 
    2: 'pricing-policies'
  };

  const currentStepIndex = Object.values(compactStepMapping).indexOf(currentStep);
  const CurrentStepComponent = STEP_COMPONENTS[currentStep];

  // Handle exit confirmation
  const handleExit = () => {
    if (isDirty) {
      setShowExitConfirmation(true);
    } else {
      router.push('/operator/packages');
    }
  };

  const confirmExit = () => {
    resetWizard();
    router.push('/operator/packages');
  };

  const cancelExit = () => {
    setShowExitConfirmation(false);
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    await saveDraft();
  };

  // Handle publish
  const handlePublish = async () => {
    try {
      const result = await publishPackage();
      if (result && result.success) {
        router.push('/operator/packages');
      } else {
        console.error('Failed to publish package:', result?.message);
      }
    } catch (error) {
      console.error('Error publishing package:', error);
    }
  };

  // Navigation functions
  const handleNextStep = () => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < Object.keys(compactStepMapping).length) {
      const nextStepId = compactStepMapping[nextStepIndex as keyof typeof compactStepMapping];
      goToStep(nextStepId as WizardStep);
    }
  };

  const handlePreviousStep = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      const prevStepId = compactStepMapping[prevStepIndex as keyof typeof compactStepMapping];
      goToStep(prevStepId as WizardStep);
    }
  };

  const handleGoToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < Object.keys(compactStepMapping).length) {
      const stepId = compactStepMapping[stepIndex as keyof typeof compactStepMapping];
      goToStep(stepId as WizardStep);
    }
  };

  // Auto-save indicator
  const getAutoSaveStatus = () => {
    if (isSaving) return { text: 'Saving...', color: 'text-blue-600' };
    if (lastSaved) return { text: `Saved ${lastSaved}`, color: 'text-green-600' };
    if (isDirty) return { text: 'Unsaved changes', color: 'text-yellow-600' };
    return { text: 'All changes saved', color: 'text-gray-500' };
  };

  const autoSaveStatus = getAutoSaveStatus();

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100", className)}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <button
                onClick={handleExit}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-semibold">Back to Packages</span>
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center space-x-4">
              {Object.entries(compactStepMapping).map(([index, stepId]) => {
                const config = STEP_CONFIG[stepId as keyof typeof STEP_CONFIG];
                const IconComponent = config.icon;
                const stepIndex = parseInt(index);
                const isActive = stepIndex === currentStepIndex;
                const isCompleted = stepIndex < currentStepIndex;
                
                return (
                  <div key={stepId} className="flex items-center">
                    <button
                      onClick={() => handleGoToStep(stepIndex)}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                        isActive && "bg-blue-100 text-blue-700",
                        isCompleted && "bg-green-100 text-green-700",
                        !isActive && !isCompleted && "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        isActive && "bg-blue-600 text-white",
                        isCompleted && "bg-green-600 text-white",
                        !isActive && !isCompleted && "bg-gray-200"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium">{config.title}</div>
                        <div className="text-xs opacity-75">{config.description}</div>
                      </div>
                    </button>
                    {stepIndex < Object.keys(compactStepMapping).length - 1 && (
                      <div className="w-8 h-px bg-gray-300 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Auto-save status */}
              <div className="text-sm">
                <span className={autoSaveStatus.color}>{autoSaveStatus.text}</span>
              </div>

              {/* Save Draft */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>

              {/* Preview */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(true)}
                className="flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              isValid={isValid}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onPublish={handlePublish}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Unsaved Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
              </p>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={cancelExit}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmExit}>
                  Leave Without Saving
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Package Preview</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {/* Preview content would go here */}
              <div className="text-center py-8 text-gray-500">
                Package preview coming soon...
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePackageWizard } from '@/hooks/usePackageWizard';
import { WizardStep, StepProps } from '@/lib/types/wizard';
import StepIndicator from './StepIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Eye, 
  X,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import step components (we'll create these next)
import PackageTypeStep from './steps/PackageTypeStep';
import BasicInfoStep from './steps/BasicInfoStep';
import DestinationsStep from './steps/DestinationsStep';
import PricingStep from './steps/PricingStep';
import MediaStep from './steps/MediaStep';
import ReviewStep from './steps/ReviewStep';

interface PackageWizardProps {
  className?: string;
}

// Step component mapping
const STEP_COMPONENTS: Record<WizardStep, React.ComponentType<StepProps>> = {
  'package-type': PackageTypeStep,
  'basic-info': BasicInfoStep,
  'destinations': DestinationsStep,
  'pricing': PricingStep,
  'media': MediaStep,
  'review': ReviewStep
};

export default function PackageWizard({ className }: PackageWizardProps) {
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
    validateStep,
    saveDraft,
    publishPackage,
    resetWizard,
    form
  } = usePackageWizard();

  // Get current step component
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
    const result = await publishPackage();
    if (result.success) {
      router.push('/operator/packages');
    } else {
      // Handle error (could show toast notification)
      console.error('Failed to publish package:', result.message);
    }
  };

  // Handle step navigation
  const handleStepClick = (step: WizardStep) => {
    // Validate current step before navigating
    if (validateStep(currentStep)) {
      goToStep(step);
    }
  };

  // Auto-save indicator
  const getAutoSaveStatus = () => {
    if (isSaving) return 'Saving...';
    if (lastSaved) return `Saved ${lastSaved.toLocaleTimeString()}`;
    if (isDirty) return 'Unsaved changes';
    return 'All changes saved';
  };

  return (
    <div className={cn('min-h-screen bg-gray-50', className)}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleExit}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="w-5 h-5 mr-2" />
                  Exit
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Create New Package
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Auto-save status */}
                <div className="flex items-center text-sm text-gray-500">
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                      Saving...
                    </div>
                  ) : lastSaved ? (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Saved {lastSaved.toLocaleTimeString()}
                    </div>
                  ) : isDirty ? (
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                      Unsaved changes
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      All changes saved
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={!isDirty || isSaving}
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="mt-6">
              <StepIndicator
                steps={steps}
                currentStep={currentStep}
                onStepClick={handleStepClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{steps.find(s => s.id === currentStep)?.title}</span>
                  <span className="text-sm font-normal text-gray-500">
                    Step {steps.findIndex(s => s.id === currentStep) + 1} of {steps.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                    isValid={isValid}
                    onNext={nextStep}
                    onPrevious={previousStep}
                    onSave={handleSaveDraft}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={previousStep}
                      disabled={steps.findIndex(s => s.id === currentStep) === 0}
                      size="sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    
                    <Button
                      onClick={nextStep}
                      disabled={!isValid || isSaving}
                      size="sm"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {currentStep === 'review' && (
                    <Button
                      onClick={handlePublish}
                      disabled={!isValid || isSaving}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSaving ? 'Publishing...' : 'Publish Package'}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {steps.map((step) => (
                      <div
                        key={step.id}
                        className={cn(
                          'flex items-center justify-between p-2 rounded',
                          {
                            'bg-blue-50 border border-blue-200': step.id === currentStep,
                            'bg-green-50 border border-green-200': step.isCompleted,
                            'bg-gray-50': !step.isCompleted && step.id !== currentStep
                          }
                        )}
                      >
                        <span className="text-sm font-medium">{step.title}</span>
                        <div className="flex items-center">
                          {step.isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : step.id === currentStep ? (
                            <div className="w-4 h-4 bg-blue-600 rounded-full" />
                          ) : (
                            <div className="w-4 h-4 bg-gray-300 rounded-full" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Having trouble creating your package? Check out our guide or contact support.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      View Guide
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                Unsaved Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You have unsaved changes. Are you sure you want to leave? Your progress will be lost.
              </p>
              <div className="flex justify-end space-x-2">
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
    </div>
  );
}

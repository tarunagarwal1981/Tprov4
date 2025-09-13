'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePackageWizard } from '@/hooks/usePackageWizard';
import { WizardStep, StepProps } from '@/lib/types/wizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Eye, 
  X,
  CheckCircle,
  Sparkles,
  Zap,
  Heart,
  Star,
  Clock,
  Users,
  MapPin,
  DollarSign,
  Camera,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import step components
import ModernPackageTypeStep from './steps/ModernPackageTypeStep';
import ModernBasicInfoStep from './steps/ModernBasicInfoStep';
import ModernDestinationsStep from './steps/ModernDestinationsStep';
import ModernPricingStep from './steps/ModernPricingStep';
import ModernMediaStep from './steps/ModernMediaStep';
import ModernReviewStep from './steps/ModernReviewStep';

interface ModernPackageWizardProps {
  className?: string;
}

// Step component mapping
const STEP_COMPONENTS: Record<WizardStep, React.ComponentType<StepProps>> = {
  'package-type': ModernPackageTypeStep,
  'basic-info': ModernBasicInfoStep,
  'destinations': ModernDestinationsStep,
  'pricing': ModernPricingStep,
  'media': ModernMediaStep,
  'review': ModernReviewStep
};

// Step configuration with icons and descriptions
const STEP_CONFIG = {
  'package-type': {
    icon: Sparkles,
    title: 'Package Type',
    description: 'Choose your package style'
  },
  'basic-info': {
    icon: FileText,
    title: 'Basic Info',
    description: 'Tell us about your package'
  },
  'destinations': {
    icon: MapPin,
    title: 'Destinations',
    description: 'Where will you take them?'
  },
  'pricing': {
    icon: DollarSign,
    title: 'Pricing',
    description: 'Set your prices'
  },
  'media': {
    icon: Camera,
    title: 'Photos',
    description: 'Show them the experience'
  },
  'review': {
    icon: CheckCircle,
    title: 'Review',
    description: 'Ready to publish?'
  }
};

export default function ModernPackageWizard({ className }: ModernPackageWizardProps) {
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
  const currentStepConfig = STEP_CONFIG[currentStep];
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  console.log('🎯 ModernPackageWizard render:', {
    currentStep,
    currentStepIndex,
    formData,
    steps: steps.map(s => ({ id: s.id, isCompleted: s.isCompleted, isAccessible: s.isAccessible })),
    CurrentStepComponent: CurrentStepComponent?.name || 'Unknown'
  });

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
      }
    } catch (error) {
      console.error('Error publishing package:', error);
    }
  };

  // Handle step navigation
  const handleStepClick = (step: WizardStep) => {
    if (validateStep(currentStep)) {
      goToStep(step);
    }
  };

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100', className)}>
      {/* Compact Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={handleExit}
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4 mr-1" />
                  Exit
                </Button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      Create Package
                    </h1>
                    <p className="text-xs text-gray-600">
                      Build amazing travel experiences
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Compact Auto-save status */}
                <div className="flex items-center text-xs">
                  {isSaving ? (
                    <div className="flex items-center text-blue-600">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1" />
                      Saving...
                    </div>
                  ) : lastSaved ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Saved
                    </div>
                  ) : isDirty ? (
                    <div className="flex items-center text-orange-600">
                      <Clock className="w-3 h-3 mr-1" />
                      Unsaved
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Saved
                    </div>
                  )}
                </div>

                {/* Compact Action buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={!isDirty || isSaving}
                    size="sm"
                    className="rounded-lg text-xs px-3 py-1"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    size="sm"
                    className="rounded-lg text-xs px-3 py-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>

            {/* Compact Step Indicator */}
            <div className="mt-4">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const config = STEP_CONFIG[step.id];
                  const IconComponent = config.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = step.isCompleted;
                  const isUpcoming = index > currentStepIndex;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <motion.div
                        className={cn(
                          'flex items-center justify-center w-8 h-8 rounded-lg border-2 transition-all duration-300 cursor-pointer',
                          {
                            'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent text-white shadow-md': isActive,
                            'bg-green-500 border-green-500 text-white': isCompleted,
                            'bg-gray-100 border-gray-300 text-gray-400': isUpcoming,
                            'bg-white border-gray-300 text-gray-600 hover:border-gray-400': !isActive && !isCompleted && !isUpcoming
                          }
                        )}
                        onClick={() => handleStepClick(step.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                      </motion.div>
                      
                      <div className="ml-2 min-w-0">
                        <p className={cn(
                          'text-xs font-medium',
                          {
                            'text-gray-900': isActive,
                            'text-green-600': isCompleted,
                            'text-gray-400': isUpcoming,
                            'text-gray-600': !isActive && !isCompleted && !isUpcoming
                          }
                        )}>
                          {config.title}
                        </p>
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div className={cn(
                          'w-6 h-0.5 mx-2',
                          {
                            'bg-gradient-to-r from-blue-500 to-purple-500': index < currentStepIndex,
                            'bg-gray-300': index >= currentStepIndex
                          }
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Step Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-md bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
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
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Compact Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Quick Actions */}
              <Card className="border-0 shadow-md bg-white/90 backdrop-blur-sm">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                    <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      onClick={previousStep}
                      disabled={currentStepIndex === 0}
                      size="sm"
                      className="w-full rounded-lg text-xs"
                    >
                      <ArrowLeft className="w-3 h-3 mr-1" />
                      Previous
                    </Button>
                    
                    <Button
                      onClick={nextStep}
                      disabled={!isValid || isSaving}
                      size="sm"
                      className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs"
                    >
                      Next
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>

                    {currentStep === 'review' && (
                      <Button
                        onClick={handlePublish}
                        disabled={!isValid || isSaving}
                        className="w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xs"
                      >
                        <Heart className="w-3 h-3 mr-1" />
                        {isSaving ? 'Publishing...' : 'Publish Package'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-blue-500" />
                    Progress
                  </h3>
                  <div className="space-y-3">
                    {steps.map((step) => {
                      const config = STEP_CONFIG[step.id];
                      const IconComponent = config.icon;
                      
                      return (
                        <div
                          key={step.id}
                          className={cn(
                            'flex items-center justify-between p-3 rounded-xl transition-all duration-200',
                            {
                              'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200': step.id === currentStep,
                              'bg-green-50 border border-green-200': step.isCompleted,
                              'bg-gray-50 border border-gray-200': !step.isCompleted && step.id !== currentStep
                            }
                          )}
                        >
                          <div className="flex items-center">
                            <IconComponent className={cn(
                              'w-4 h-4 mr-2',
                              {
                                'text-blue-600': step.id === currentStep,
                                'text-green-600': step.isCompleted,
                                'text-gray-400': !step.isCompleted && step.id !== currentStep
                              }
                            )} />
                            <span className="text-sm font-medium">{config.title}</span>
                          </div>
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
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-500" />
                    Need Help?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Creating packages is easy! Follow the steps and you'll have an amazing travel experience ready in minutes.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full rounded-xl">
                      View Guide
                    </Button>
                    <Button variant="outline" size="sm" className="w-full rounded-xl">
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
      <AnimatePresence>
        {showExitConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                      <X className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Unsaved Changes</h3>
                      <p className="text-sm text-gray-600">Your progress will be lost</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    You have unsaved changes. Are you sure you want to leave? Your progress will be lost.
                  </p>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={cancelExit} className="rounded-xl">
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={confirmExit} className="rounded-xl">
                      Leave Without Saving
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

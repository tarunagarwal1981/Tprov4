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
import ModernLocationTimingStep from './steps/ModernLocationTimingStep';
import ModernDetailedPlanningStep from './steps/ModernDetailedPlanningStep';
import ModernInclusionsExclusionsStep from './steps/ModernInclusionsExclusionsStep';
import ModernPricingPoliciesStep from './steps/ModernPricingPoliciesStep';
import ModernReviewStep from './steps/ModernReviewStep';

interface ModernPackageWizardProps {
  className?: string;
}

// Step component mapping
const STEP_COMPONENTS: Record<WizardStep, React.ComponentType<StepProps>> = {
  'package-type': ModernPackageTypeStep,
  'basic-info': ModernBasicInfoStep,
  'location-timing': ModernLocationTimingStep,
  'detailed-planning': ModernDetailedPlanningStep,
  'inclusions-exclusions': ModernInclusionsExclusionsStep,
  'pricing-policies': ModernPricingPoliciesStep,
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
  'location-timing': {
    icon: MapPin,
    title: 'Location & Timing',
    description: 'Where and when?'
  },
  'detailed-planning': {
    icon: Clock,
    title: 'Detailed Planning',
    description: 'Plan the experience'
  },
  'inclusions-exclusions': {
    icon: CheckCircle,
    title: 'Inclusions & Exclusions',
    description: 'What\'s included?'
  },
  'pricing-policies': {
    icon: DollarSign,
    title: 'Pricing & Policies',
    description: 'Set your prices'
  },
  'review': {
    icon: Eye,
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
    saveDraft,
    publishPackage,
    resetWizard,
    form
  } = usePackageWizard();

  // Get current step component
  const CurrentStepComponent = STEP_COMPONENTS[currentStep];
  const currentStepConfig = STEP_CONFIG[currentStep];
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

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
    console.log('🚀 HandlePublish called');
    try {
      const result = await publishPackage();
      console.log('📦 Publish result:', result);
      if (result && result.success) {
        console.log('✅ Publishing successful, redirecting...');
        router.push('/operator/packages');
      } else {
        console.log('❌ Publishing failed:', result?.message);
      }
    } catch (error) {
      console.error('❌ Error publishing package:', error);
    }
  };

  // Handle step navigation
  const handleStepClick = (step: WizardStep) => {
    goToStep(step);
  };

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100', className)}>
      {/* Streamlined Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* Single Row Header */}
            <div className="flex items-center justify-between">
              {/* Left: Exit + Title */}
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
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Create Package
                    </h1>
                    <p className="text-sm text-gray-600">
                      Build amazing travel experiences
                    </p>
                  </div>
                </div>
              </div>

              {/* Center: Step Progress */}
              <div className="hidden md:flex items-center space-x-1">
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
                          'flex items-center justify-center w-10 h-10 rounded-xl border-2 transition-all duration-300 cursor-pointer',
                          {
                            'bg-gradient-to-r from-blue-500 to-purple-500 border-transparent text-white shadow-lg': isActive,
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
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <IconComponent className="w-5 h-5" />
                        )}
                      </motion.div>
                      
                      {index < steps.length - 1 && (
                        <div className={cn(
                          'w-8 h-0.5 mx-2',
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

              {/* Right: Status + Actions */}
              <div className="flex items-center space-x-3">
                {/* Auto-save status */}
                <div className="flex items-center text-sm">
                  {isSaving ? (
                    <div className="flex items-center text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                      Saving...
                    </div>
                  ) : lastSaved ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Saved
                    </div>
                  ) : isDirty ? (
                    <div className="flex items-center text-orange-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Unsaved
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Saved
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
                    className="rounded-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    size="sm"
                    className="rounded-lg"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Step Indicator */}
            <div className="md:hidden mt-4">
              <div className="flex items-center justify-center space-x-1">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = step.isCompleted;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        {
                          'bg-gradient-to-r from-blue-500 to-purple-500 text-white': isActive,
                          'bg-green-500 text-white': isCompleted,
                          'bg-gray-200 text-gray-400': !isActive && !isCompleted
                        }
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div className="w-4 h-0.5 mx-1 bg-gray-300" />
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-0 shadow-md bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    formData={formData}
                    updateFormData={updateFormData}
                    errors={errors}
                    isValid={isValid}
                    onNext={nextStep}
                    onPrevious={previousStep}
                    onSave={handleSaveDraft}
                    onPublish={handlePublish}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
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

'use client';

import { StepConfig, WizardStep } from '@/lib/types/wizard';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
  className?: string;
}

export default function StepIndicator({ 
  steps, 
  currentStep, 
  onStepClick, 
  className 
}: StepIndicatorProps) {
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);
  const currentStepIndex = sortedSteps.findIndex(step => step.id === currentStep);

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {sortedSteps.map((step, index) => {
            const isCompleted = step.isCompleted;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.isAccessible;
            const isClickable = isAccessible && (isCompleted || index <= currentStepIndex);

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                    className={cn(
                      'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                      {
                        'bg-blue-600 border-blue-600 text-white': isCurrent,
                        'bg-green-600 border-green-600 text-white': isCompleted,
                        'bg-gray-100 border-gray-300 text-gray-400': !isCompleted && !isCurrent,
                        'cursor-pointer hover:scale-105': isClickable,
                        'cursor-not-allowed': !isClickable
                      }
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.order}</span>
                    )}
                  </button>

                  {/* Step Info */}
                  <div className="mt-2 text-center max-w-32">
                    <h3 className={cn(
                      'text-sm font-medium',
                      {
                        'text-blue-600': isCurrent,
                        'text-green-600': isCompleted,
                        'text-gray-500': !isCompleted && !isCurrent
                      }
                    )}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 hidden lg:block">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < sortedSteps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={cn(
                      'h-0.5 transition-colors duration-200',
                      {
                        'bg-green-600': index < currentStepIndex,
                        'bg-gray-300': index >= currentStepIndex
                      }
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
              {
                'bg-blue-600 text-white': true // Current step is always highlighted on mobile
              }
            )}>
              {currentStepIndex + 1}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {sortedSteps[currentStepIndex]?.title}
              </h3>
              <p className="text-xs text-gray-500">
                Step {currentStepIndex + 1} of {sortedSteps.length}
              </p>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {Math.round(((currentStepIndex + 1) / sortedSteps.length) * 100)}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentStepIndex + 1) / sortedSteps.length) * 100}%` 
            }}
          />
        </div>

        {/* Step Dots */}
        <div className="flex justify-center space-x-2 mt-3">
          {sortedSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => step.isAccessible && onStepClick(step.id)}
              disabled={!step.isAccessible}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                {
                  'bg-blue-600': index === currentStepIndex,
                  'bg-green-600': step.isCompleted && index !== currentStepIndex,
                  'bg-gray-300': !step.isCompleted && index !== currentStepIndex,
                  'cursor-pointer': step.isAccessible,
                  'cursor-not-allowed': !step.isAccessible
                }
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

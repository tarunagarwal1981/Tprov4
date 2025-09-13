'use client';

import { StepProps } from '@/lib/types/wizard';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart } from 'lucide-react';

export default function ModernReviewStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to publish?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Review your package details and publish it to start attracting travelers.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <p className="text-center text-gray-600">Review step coming soon...</p>
      </div>

      <div className="flex justify-between pt-8">
        <Button onClick={onPrevious} variant="outline" size="lg" className="rounded-xl px-8 py-3">
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          size="lg"
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <Heart className="w-5 h-5 mr-2" />
          Publish Package
        </Button>
      </div>
    </div>
  );
}

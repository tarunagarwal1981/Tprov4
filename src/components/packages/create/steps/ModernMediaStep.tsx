'use client';

import { StepProps } from '@/lib/types/wizard';
import { Button } from '@/components/ui/button';
import { Camera, TrendingUp } from 'lucide-react';

export default function ModernMediaStep({ 
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
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Show them the experience
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Upload photos and videos that showcase your package.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
        <p className="text-center text-gray-600">Media step coming soon...</p>
      </div>

      <div className="flex justify-between pt-8">
        <Button onClick={onPrevious} variant="outline" size="lg" className="rounded-xl px-8 py-3">
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Continue to Review
        </Button>
      </div>
    </div>
  );
}

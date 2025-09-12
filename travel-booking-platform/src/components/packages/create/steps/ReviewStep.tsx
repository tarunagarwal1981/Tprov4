'use client';

import { useState } from 'react';
import { StepProps } from '@/lib/types/wizard';
import { PackageStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Eye, Save } from 'lucide-react';

export default function ReviewStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext, 
  onPrevious,
  onSave 
}: StepProps) {
  const [status, setStatus] = useState<PackageStatus>(formData.status || PackageStatus.DRAFT);

  const handleStatusChange = (value: PackageStatus) => {
    setStatus(value);
    updateFormData({ status: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Publish
        </h2>
        <p className="text-gray-600">
          Review your package details and choose how to publish
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Package Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Package Details</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p><strong>Title:</strong> {formData.title || 'Not set'}</p>
                <p><strong>Type:</strong> {formData.type || 'Not set'}</p>
                <p><strong>Duration:</strong> {formData.duration?.days} days, {formData.duration?.nights} nights</p>
                <p><strong>Group Size:</strong> {formData.groupSize?.min}-{formData.groupSize?.max} people</p>
                <p><strong>Difficulty:</strong> {formData.difficulty || 'Not set'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Pricing & Media</h4>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p><strong>Base Price:</strong> ${formData.pricing?.basePrice || 0}</p>
                <p><strong>Destinations:</strong> {formData.destinations?.length || 0} selected</p>
                <p><strong>Images:</strong> {formData.images?.length || 0} uploaded</p>
                <p><strong>Featured:</strong> {formData.isFeatured ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publishing Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Package Status</label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PackageStatus.DRAFT}>
                  <div>
                    <div className="font-medium">Draft</div>
                    <div className="text-sm text-gray-500">Save as draft for later editing</div>
                  </div>
                </SelectItem>
                <SelectItem value={PackageStatus.ACTIVE}>
                  <div>
                    <div className="font-medium">Active</div>
                    <div className="text-sm text-gray-500">Publish and make available for booking</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Ready to Publish?</h4>
            <p className="text-sm text-blue-800">
              Your package is ready to be published. Once published, it will be available 
              for customers to view and book.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Publish Package
          </Button>
        </div>
      </div>
    </div>
  );
}

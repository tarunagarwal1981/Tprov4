'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StepProps } from '@/lib/types/wizard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Image,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPackageTypeInfo } from '@/lib/packageTypeInfo';

export default function ModernBasicInfoStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  
  const [localData, setLocalData] = useState({
    title: formData.title || '',
    description: formData.description || '',
    shortDescription: formData.shortDescription || '',
    bannerImage: formData.bannerImage || '',
    additionalImages: formData.additionalImages || [],
    additionalNotes: formData.additionalNotes || '',
    newImage: ''
  });

  useEffect(() => {
    updateFormData(localData);
  }, [localData]);

  const handleInputChange = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addImage = () => {
    if (localData.newImage.trim()) {
      setLocalData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, prev.newImage.trim()],
        newImage: ''
      }));
    }
  };

  const removeImage = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    onNext();
  };

  const handlePrevious = () => {
    onPrevious();
  };

  const packageTypeInfo = formData.type ? getPackageTypeInfo(formData.type) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Basic Information
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Tell us about your {packageTypeInfo?.title.toLowerCase()} package.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Package Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Package Title *
              </Label>
              <Input
                id="title"
                value={localData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter a compelling package title..."
                className="mt-1"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
              )}
            </div>

            {/* Short Description */}
            <div>
              <Label htmlFor="shortDescription" className="text-sm font-medium text-gray-700">
                Short Description *
              </Label>
              <Textarea
                id="shortDescription"
                value={localData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief description for listings and cards..."
                className="mt-1"
                rows={3}
              />
              {errors.shortDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.shortDescription[0]}</p>
              )}
            </div>

            {/* Full Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Full Description *
              </Label>
              <Textarea
                id="description"
                value={localData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of your package..."
                className="mt-1"
                rows={6}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700">
                Additional Notes
              </Label>
              <Textarea
                id="additionalNotes"
                value={localData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                placeholder="Any special notes, requirements, or additional information..."
                className="mt-1"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Image className="w-5 h-5 mr-2 text-green-600" />
              Media & Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Banner Image */}
            <div>
              <Label htmlFor="bannerImage" className="text-sm font-medium text-gray-700">
                Banner/Cover Image URL *
              </Label>
              <Input
                id="bannerImage"
                value={localData.bannerImage}
                onChange={(e) => handleInputChange('bannerImage', e.target.value)}
                placeholder="https://example.com/banner-image.jpg"
                className="mt-1"
              />
              {errors.bannerImage && (
                <p className="text-red-500 text-sm mt-1">{errors.bannerImage[0]}</p>
              )}
            </div>

            {/* Additional Images */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Additional Images
              </Label>
              <div className="space-y-2 mt-1">
                {localData.additionalImages.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="outline" className="flex-1 justify-start">
                      <Image className="w-3 h-3 mr-1" />
                      {image}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    value={localData.newImage}
                    onChange={(e) => handleInputChange('newImage', e.target.value)}
                    placeholder="Add image URL..."
                    className="flex-1"
                  />
                  <Button onClick={addImage} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Type Specific Guidance */}
      {packageTypeInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {packageTypeInfo.title} Package Tips
                  </h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• <strong>Title:</strong> Make it specific and appealing (e.g., "Sunset Photography Tour in Santorini")</p>
                    <p>• <strong>Short Description:</strong> Perfect for search results and quick overviews</p>
                    <p>• <strong>Full Description:</strong> Include what makes your package unique and special</p>
                    <p>• <strong>Images:</strong> High-quality photos that showcase the experience</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Navigation */}
      <motion.div 
        className="flex justify-between pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="lg"
          className="px-8 py-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Next: Location & Timing
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { StepProps } from '@/lib/types/wizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageIcon, Upload } from 'lucide-react';

export default function MediaStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext, 
  onPrevious 
}: StepProps) {
  const [images, setImages] = useState<string[]>(formData.images || []);
  const [coverImage, setCoverImage] = useState(formData.coverImage || '');

  const handleImageUpload = () => {
    // Mock image upload - in real app, this would handle file upload
    const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&h=600&fit=crop`;
    const updated = [...images, mockImageUrl];
    setImages(updated);
    updateFormData({ images: updated });
    
    if (!coverImage) {
      setCoverImage(mockImageUrl);
      updateFormData({ coverImage: mockImageUrl });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Media & Gallery
        </h2>
        <p className="text-gray-600">
          Upload images and media for your package
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Package Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload Package Images
            </h3>
            <p className="text-gray-500 mb-4">
              Add high-quality images to showcase your package
            </p>
            <Button onClick={handleImageUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Images
            </Button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Package image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {coverImage === image && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Cover
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setCoverImage(image);
                      updateFormData({ coverImage: image });
                    }}
                    className="absolute bottom-2 left-2 bg-white text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-100"
                  >
                    Set as Cover
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={images.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
}

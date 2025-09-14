'use client';

import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  Trash2,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  packageId?: string;
  onImagesChange: (images: string[]) => void;
  onCoverImageChange: (coverImage: string) => void;
  currentImages?: string[];
  currentCoverImage?: string;
  maxImages?: number;
  className?: string;
}

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
  isUploading: boolean;
  isPrimary: boolean;
  error?: string;
}

export function PackageImageUpload({
  packageId,
  onImagesChange,
  onCoverImageChange,
  currentImages = [],
  currentCoverImage = '',
  maxImages = 10,
  className
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize images from props
  useState(() => {
    const initialImages: UploadedImage[] = currentImages.map((url, index) => ({
      id: `existing-${index}`,
      url,
      name: `Image ${index + 1}`,
      size: 0,
      isUploading: false,
      isPrimary: url === currentCoverImage
    }));
    setImages(initialImages);
  }, [currentImages, currentCoverImage]);

  // Upload file to Supabase Storage
  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${packageId || 'temp'}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('package-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('package-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }, [packageId]);

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed max images
    if (images.length + fileArray.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Create placeholder images
    const newImages: UploadedImage[] = fileArray.map((file, index) => ({
      id: `uploading-${Date.now()}-${index}`,
      url: '',
      name: file.name,
      size: file.size,
      isUploading: true,
      isPrimary: false,
      error: undefined
    }));

    setImages(prev => [...prev, ...newImages]);

    // Upload files
    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const imageIndex = images.length + i;

        try {
          const url = await uploadFile(file);
          
          if (url) {
            setImages(prev => prev.map((img, idx) => 
              idx === imageIndex 
                ? { ...img, url, isUploading: false }
                : img
            ));

            // If this is the first image and no cover image is set, make it primary
            if (imageIndex === 0 && !currentCoverImage) {
              setImages(prev => prev.map((img, idx) => 
                idx === imageIndex 
                  ? { ...img, isPrimary: true }
                  : { ...img, isPrimary: false }
              ));
              onCoverImageChange(url);
            }
          }
        } catch (error) {
          setImages(prev => prev.map((img, idx) => 
            idx === imageIndex 
              ? { 
                  ...img, 
                  isUploading: false, 
                  error: error instanceof Error ? error.message : 'Upload failed' 
                }
              : img
          ));
        }

        setUploadProgress(((i + 1) / fileArray.length) * 100);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [images.length, maxImages, uploadFile, currentCoverImage, onCoverImageChange]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  // Set as cover image
  const setAsCoverImage = useCallback((imageId: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    })));
    
    const image = images.find(img => img.id === imageId);
    if (image) {
      onCoverImageChange(image.url);
    }
  }, [images, onCoverImageChange]);

  // Remove image
  const removeImage = useCallback(async (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    
    if (image && image.url) {
      try {
        // Extract filename from URL
        const urlParts = image.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const fullPath = `${packageId || 'temp'}/${fileName}`;

        // Delete from Supabase Storage
        const { error } = await supabase.storage
          .from('package-images')
          .remove([fullPath]);

        if (error) {
          console.error('Error deleting image:', error);
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    setImages(prev => {
      const newImages = prev.filter(img => img.id !== imageId);
      
      // If we removed the cover image, set the first remaining image as cover
      if (image?.isPrimary && newImages.length > 0) {
        const firstImage = newImages[0];
        setAsCoverImage(firstImage.id);
      } else if (newImages.length === 0) {
        onCoverImageChange('');
      }
      
      return newImages;
    });
  }, [images, packageId, setAsCoverImage, onCoverImageChange]);

  // Update parent component when images change
  useState(() => {
    const imageUrls = images
      .filter(img => img.url && !img.isUploading)
      .map(img => img.url);
    
    onImagesChange(imageUrls);
  }, [images, onImagesChange]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              'hover:border-primary-500 hover:bg-primary-50',
              isUploading && 'border-primary-500 bg-primary-50'
            )}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Package Images
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Maximum {maxImages} images, up to 5MB each
            </p>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || images.length >= maxImages}
              className="mb-4"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Images
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            {isUploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600 mt-2">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery */}
      {images.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Package Images ({images.length}/{maxImages})
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={cn(
                    'relative group border rounded-lg overflow-hidden',
                    image.isPrimary && 'ring-2 ring-primary-500',
                    image.isUploading && 'opacity-50'
                  )}
                >
                  {image.isUploading ? (
                    <div className="aspect-square bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Uploading...</p>
                      </div>
                    </div>
                  ) : image.error ? (
                    <div className="aspect-square bg-red-50 flex items-center justify-center">
                      <div className="text-center">
                        <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="text-xs text-red-600">Error</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full aspect-square object-cover"
                    />
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      {!image.isPrimary && !image.isUploading && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setAsCoverImage(image.id)}
                          className="bg-white text-gray-900 hover:bg-gray-100"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Set Cover
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(image.url, '_blank')}
                        className="bg-white text-gray-900 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(image.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Cover
                    </div>
                  )}

                  {/* Error Badge */}
                  {image.error && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Error
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Image Guidelines:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high-quality images (at least 1200x800 pixels)</li>
                <li>• The first image will be used as the cover image</li>
                <li>• Supported formats: JPG, PNG, WebP</li>
                <li>• Maximum file size: 5MB per image</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Star, Image as ImageIcon } from 'lucide-react';
import { PackageType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import ImagesManager from '@/components/packages/create/ImagesManager';

export interface ImageItem {
  id: string;
  url: string;
  alt?: string;
  isHero?: boolean;
  order?: number;
}

interface ImageGalleryProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  packageType: PackageType;
  maxImages?: number;
  showHeroImage?: boolean;
  showGalleryImages?: boolean;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onChange,
  packageType,
  maxImages = 10,
  showHeroImage = true,
  showGalleryImages = true,
  className = ''
}) => {
  const setHeroImage = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isHero: img.id === imageId
    }));
    onChange(updatedImages);
  };

  const removeImage = (imageId: string) => {
    onChange(images.filter(img => img.id !== imageId));
  };

  const getGalleryTitle = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'Activity Images';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'Package Images';
      case PackageType.TRANSFERS:
        return 'Transfer Images';
      default:
        return 'Images';
    }
  };

  const getGalleryDescription = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'Upload images showcasing your activity experience';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'Upload images of destinations and experiences';
      case PackageType.TRANSFERS:
        return 'Upload images of vehicles and routes';
      default:
        return 'Upload images for your package';
    }
  };

  const heroImage = images.find(img => img.isHero);
  const galleryImages = images.filter(img => !img.isHero);

  return (
    <div className={`image-gallery ${className}`}>
      <div className="image-gallery-header">
        <div>
          <h4 className="image-gallery-title">{getGalleryTitle()}</h4>
          <p className="text-sm text-gray-600">{getGalleryDescription()}</p>
        </div>
        <div className="text-xs text-gray-500">
          {images.length}/{maxImages} images
        </div>
      </div>

      {/* Hero Image Section */}
      {showHeroImage && (
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900">Hero Image</h5>
          <div className="image-gallery-grid">
            {heroImage ? (
              <div className="image-gallery-item hero">
                <img
                  src={heroImage.url}
                  alt={heroImage.alt || 'Hero image'}
                  className="image-gallery-preview"
                />
                <div className="image-gallery-overlay">
                  <div className="image-gallery-actions">
                    <button
                      onClick={() => removeImage(heroImage.id)}
                      className="image-gallery-action-button"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                    <button
                      className="image-gallery-action-button"
                      title="Edit image"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>
                </div>
                <div className="image-gallery-hero-badge">
                  <Star className="w-3 h-3 inline mr-1" />
                  Hero Image
                </div>
              </div>
            ) : (
              <div className="image-gallery-item hero border-dashed border-2 border-gray-300">
                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="text-sm">No hero image selected</p>
                  <p className="text-xs">Click to upload</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gallery Images Section */}
      {showGalleryImages && (
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900">Gallery Images</h5>
          <div className="image-gallery-grid">
            <AnimatePresence>
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="image-gallery-item"
                >
                  <img
                    src={image.url}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    className="image-gallery-preview"
                  />
                  <div className="image-gallery-overlay">
                    <div className="image-gallery-actions">
                      <button
                        onClick={() => setHeroImage(image.id)}
                        className="image-gallery-action-button"
                        title="Set as hero image"
                      >
                        <Star className="w-4 h-4 text-yellow-600" />
                      </button>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="image-gallery-action-button"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        className="image-gallery-action-button"
                        title="Edit image"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Image Button */}
            {images.length < maxImages && (
              <div className="image-gallery-item border-dashed border-2 border-gray-300">
                <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                  <Plus className="w-8 h-8 mb-2" />
                  <p className="text-sm">Add Image</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Upload Manager */}
      <div className="mt-6">
        <ImagesManager
          items={images as any}
          onChange={(items) => onChange(items as ImageItem[])}
          max={maxImages}
        />
      </div>
    </div>
  );
};

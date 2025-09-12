import React from 'react';
import { cn } from '@/lib/utils';
import { Package, PackageType, DifficultyLevel } from '@/lib/types';

interface PackageCardProps {
  package: Package;
  className?: string;
}

export function PackageCard({ package: pkg, className }: PackageCardProps) {
  return (
    <div className={cn('card', 'card-elevated', 'animate-fade-in', className)}>
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">{pkg.title}</h3>
          <span className={cn(
            'px-2 py-1 rounded-md text-xs font-medium',
            pkg.type === PackageType.ACTIVITY && 'bg-blue-100 text-blue-800',
            pkg.type === PackageType.LAND_PACKAGE && 'bg-green-100 text-green-800',
            pkg.type === PackageType.CRUISE && 'bg-purple-100 text-purple-800'
          )}>
            {pkg.type.replace('_', ' ')}
          </span>
        </div>
        <p className="text-gray-600 mt-2">{pkg.description}</p>
      </div>
      
      <div className="card-body">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Duration:</span>
              <span className="text-sm font-medium">{pkg.duration.days} days</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Difficulty:</span>
              <span className={cn(
                'text-sm font-medium px-2 py-1 rounded',
                pkg.difficulty === DifficultyLevel.EASY && 'bg-green-100 text-green-800',
                pkg.difficulty === DifficultyLevel.MODERATE && 'bg-yellow-100 text-yellow-800',
                pkg.difficulty === DifficultyLevel.CHALLENGING && 'bg-orange-100 text-orange-800',
                pkg.difficulty === DifficultyLevel.EXPERT && 'bg-red-100 text-red-800'
              )}>
                {pkg.difficulty}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Group Size:</span>
              <span className="text-sm font-medium">
                {pkg.groupSize.min}-{pkg.groupSize.max} people
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500">Rating:</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{pkg.rating}</span>
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-500">({pkg.reviewCount})</span>
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  ${pkg.pricing.basePrice}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  {pkg.pricing.pricePerPerson ? 'per person' : 'total'}
                </span>
              </div>
              <button className="btn btn-primary">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {pkg.isFeatured && (
        <div className="card-footer">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm font-medium text-gray-700">Featured Package</span>
          </div>
        </div>
      )}
    </div>
  );
}

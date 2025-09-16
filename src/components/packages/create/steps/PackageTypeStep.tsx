'use client';

import { useState } from 'react';
import { StepProps } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package as PackageIcon,
  Plane,
  Car,
  Ship,
  Building,
  Activity,
  Settings,
  Zap,
  Check,
  Star,
  Clock,
  Users,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

const packageTypes = [
  {
    type: PackageType.ACTIVITY,
    title: 'Activity',
    description: 'Single or multiple activities and experiences',
    icon: Activity,
    features: ['Guided Tours', 'Adventure Sports', 'Cultural Experiences'],
    color: 'green',
    popular: true,
    exampleUseCase: 'Perfect for day trips, city tours, and adventure activities',
    duration: '1-3 days',
    groupSize: '1-50 people',
    priceRange: '$50 - $500'
  },
  {
    type: PackageType.TRANSFERS,
    title: 'Transfers',
    description: 'Transportation services between locations',
    icon: Car,
    features: ['Airport Transfers', 'City Transfers', 'Private Transport'],
    color: 'blue',
    popular: false,
    exampleUseCase: 'Ideal for airport pickups, city transfers, and private transportation',
    duration: 'Few hours',
    groupSize: '1-8 people',
    priceRange: '$30 - $200'
  },
  {
    type: PackageType.MULTI_CITY_PACKAGE,
    title: 'Multi City Package',
    description: 'Multi-day tours covering multiple cities without accommodation',
    icon: MapPin,
    features: ['Multi-City Tours', 'Activities', 'Transportation', 'No Accommodation'],
    color: 'purple',
    popular: true,
    exampleUseCase: 'Comprehensive multi-city tours with activities and transportation',
    duration: '3-14 days',
    groupSize: '2-20 people',
    priceRange: '$500 - $5000'
  },
  {
    type: PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL,
    title: 'Multi City Package with Hotel',
    description: 'Complete multi-city packages with accommodation included',
    icon: Building,
    features: ['Multi-City Tours', 'Accommodation', 'Activities', 'Transportation'],
    color: 'orange',
    popular: true,
    exampleUseCase: 'Complete packages for multi-city trips with hotels and everything included',
    duration: '3-14 days',
    groupSize: '2-20 people',
    priceRange: '$800 - $8000'
  },
  {
    type: PackageType.FIXED_DEPARTURE_WITH_FLIGHT,
    title: 'Fixed Departure with Flight',
    description: 'Pre-scheduled group tours with flights included',
    icon: Plane,
    features: ['Fixed Dates', 'Group Tours', 'Flights', 'Complete Package'],
    color: 'sky',
    popular: false,
    exampleUseCase: 'Pre-scheduled group tours with flights and complete travel arrangements',
    duration: '5-21 days',
    groupSize: '10-40 people',
    priceRange: '$1000 - $8000'
  }
];

export default function PackageTypeStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext 
}: StepProps) {
  const [selectedType, setSelectedType] = useState<PackageType>(
    formData.type || PackageType.LAND_PACKAGE
  );

  const handleTypeSelect = (type: PackageType) => {
    setSelectedType(type);
    updateFormData({ type });
  };

  const handleNext = () => {
    if (selectedType) {
      onNext();
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      green: {
        border: isSelected ? 'border-green-500' : 'border-green-200',
        bg: isSelected ? 'bg-green-50' : 'bg-green-25',
        text: 'text-green-900',
        hover: 'hover:bg-green-100',
        ring: isSelected ? 'ring-2 ring-green-200' : ''
      },
      blue: {
        border: isSelected ? 'border-blue-500' : 'border-blue-200',
        bg: isSelected ? 'bg-blue-50' : 'bg-blue-25',
        text: 'text-blue-900',
        hover: 'hover:bg-blue-100',
        ring: isSelected ? 'ring-2 ring-blue-200' : ''
      },
      purple: {
        border: isSelected ? 'border-purple-500' : 'border-purple-200',
        bg: isSelected ? 'bg-purple-50' : 'bg-purple-25',
        text: 'text-purple-900',
        hover: 'hover:bg-purple-100',
        ring: isSelected ? 'ring-2 ring-purple-200' : ''
      },
      orange: {
        border: isSelected ? 'border-orange-500' : 'border-orange-200',
        bg: isSelected ? 'bg-orange-50' : 'bg-orange-25',
        text: 'text-orange-900',
        hover: 'hover:bg-orange-100',
        ring: isSelected ? 'ring-2 ring-orange-200' : ''
      },
      sky: {
        border: isSelected ? 'border-sky-500' : 'border-sky-200',
        bg: isSelected ? 'bg-sky-50' : 'bg-sky-25',
        text: 'text-sky-900',
        hover: 'hover:bg-sky-100',
        ring: isSelected ? 'ring-2 ring-sky-200' : ''
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Choose Package Type
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the type of package that best fits your offering. Each type is optimized for different travel experiences.
        </p>
      </div>

      {/* Package Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packageTypes.map((pkgType) => {
          const IconComponent = pkgType.icon;
          const isSelected = selectedType === pkgType.type;
          const colors = getColorClasses(pkgType.color, isSelected);
          
          return (
            <Card
              key={pkgType.type}
              className={cn(
                'cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1',
                colors.border,
                colors.bg,
                colors.hover,
                colors.ring,
                isSelected && 'shadow-lg scale-105'
              )}
              onClick={() => handleTypeSelect(pkgType.type)}
            >
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={cn(
                      'p-3 rounded-xl mr-4 transition-colors duration-200',
                      isSelected 
                        ? 'bg-white bg-opacity-80 shadow-md' 
                        : 'bg-white bg-opacity-60'
                    )}>
                      <IconComponent className={cn('w-8 h-8', colors.text)} />
                    </div>
                    <div>
                      <h3 className={cn('font-bold text-xl mb-1', colors.text)}>
                        {pkgType.title}
                      </h3>
                      {pkgType.popular && (
                        <Badge className="bg-yellow-500 text-white text-xs font-medium">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-md">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className={cn('text-sm mb-4 leading-relaxed', colors.text)}>
                  {pkgType.description}
                </p>

                {/* Example Use Case */}
                <div className="mb-4">
                  <h4 className={cn('text-sm font-semibold mb-2', colors.text)}>
                    Best For:
                  </h4>
                  <p className={cn('text-sm italic', colors.text)}>
                    {pkgType.exampleUseCase}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className={cn('text-sm font-semibold mb-2', colors.text)}>
                    Includes:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {pkgType.features.map((feature, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className={cn('text-xs', colors.text, 'border-current')}
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Package Details */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-current border-opacity-20">
                  <div className="text-center">
                    <Clock className={cn('w-4 h-4 mx-auto mb-1', colors.text)} />
                    <div className={cn('text-xs font-medium', colors.text)}>
                      {pkgType.duration}
                    </div>
                  </div>
                  <div className="text-center">
                    <Users className={cn('w-4 h-4 mx-auto mb-1', colors.text)} />
                    <div className={cn('text-xs font-medium', colors.text)}>
                      {pkgType.groupSize}
                    </div>
                  </div>
                  <div className="text-center">
                    <MapPin className={cn('w-4 h-4 mx-auto mb-1', colors.text)} />
                    <div className={cn('text-xs font-medium', colors.text)}>
                      {pkgType.priceRange}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Error Display */}
      {errors.type && (
        <div className="text-center">
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 inline-block">
            {errors.type.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center pt-8 border-t border-gray-200">
        <Button
          onClick={handleNext}
          disabled={!selectedType}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
        >
          Continue to Basic Information
        </Button>
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Need Help Choosing?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <strong>Activity:</strong> Perfect for day trips, city tours, and adventure experiences.
          </div>
          <div>
            <strong>Land Package:</strong> Comprehensive multi-day trips with everything included.
          </div>
          <div>
            <strong>Land Package with Hotel:</strong> Hotel-focused packages with added experiences.
          </div>
          <div>
            <strong>Fixed Departure:</strong> Scheduled group tours with flights included.
          </div>
        </div>
      </div>
    </div>
  );
}

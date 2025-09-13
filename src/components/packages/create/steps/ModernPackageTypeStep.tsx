'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StepProps } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package as PackageIcon,
  Plane,
  Car,
  Building,
  Activity,
  Check,
  Star,
  Clock,
  Users,
  MapPin,
  Sparkles,
  Zap,
  Heart,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const packageTypes = [
  {
    type: PackageType.ACTIVITY,
    title: 'Activity Experience',
    subtitle: 'Single or multiple activities',
    description: 'Perfect for day trips, city tours, and adventure activities',
    icon: Activity,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    features: ['Guided Tours', 'Adventure Sports', 'Cultural Experiences'],
    duration: '1-3 days',
    groupSize: '1-50 people',
    priceRange: '$50 - $500',
    popular: true,
    examples: ['City Walking Tour', 'Cooking Class', 'Hiking Adventure']
  },
  {
    type: PackageType.LAND_PACKAGE,
    title: 'Complete Package',
    subtitle: 'Everything included',
    description: 'Comprehensive multi-day trips with accommodation, activities, and transportation',
    icon: PackageIcon,
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    features: ['Accommodation', 'Activities', 'Transportation', 'Meals'],
    duration: '3-14 days',
    groupSize: '2-20 people',
    priceRange: '$500 - $5000',
    popular: true,
    examples: ['Bali Adventure', 'European Tour', 'Cultural Journey']
  },
  {
    type: PackageType.HOTEL,
    title: 'Hotel Package',
    subtitle: 'Accommodation focused',
    description: 'Hotel-focused packages with added experiences and services',
    icon: Building,
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-50 to-red-50',
    features: ['Hotel Stay', 'Room Service', 'Amenities', 'Local Activities'],
    duration: '2-7 days',
    groupSize: '1-10 people',
    priceRange: '$200 - $2000',
    popular: true,
    examples: ['Luxury Resort', 'City Hotel', 'Beach Resort']
  },
  {
    type: PackageType.TRANSFERS,
    title: 'Transportation',
    subtitle: 'Get around easily',
    description: 'Ideal for airport pickups, city transfers, and private transportation',
    icon: Car,
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    features: ['Airport Transfers', 'City Transfers', 'Private Transport'],
    duration: 'Few hours',
    groupSize: '1-8 people',
    priceRange: '$30 - $200',
    popular: false,
    examples: ['Airport Pickup', 'City Transfer', 'Private Driver']
  },
  {
    type: PackageType.FLIGHT,
    title: 'Fixed Departure',
    subtitle: 'Scheduled group tours',
    description: 'Fixed departure tours with flights included and scheduled itineraries',
    icon: Plane,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    features: ['Flights', 'Seat Selection', 'Baggage', 'Ground Services'],
    duration: '5-21 days',
    groupSize: '10-40 people',
    priceRange: '$1000 - $8000',
    popular: false,
    examples: ['Group Tour', 'Fixed Dates', 'All Inclusive']
  }
];

export default function ModernPackageTypeStep({ 
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          What type of experience are you creating?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Choose the package type that best fits your offering. Each type is optimized for different travel experiences.
        </p>
      </motion.div>

      {/* Package Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packageTypes.map((pkgType, index) => {
          const IconComponent = pkgType.icon;
          const isSelected = selectedType === pkgType.type;
          
          return (
            <motion.div
              key={pkgType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'cursor-pointer transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 border-0 overflow-hidden',
                  `bg-gradient-to-br ${pkgType.bgGradient}`,
                  isSelected && 'shadow-2xl scale-105 ring-4 ring-white/50'
                )}
                onClick={() => handleTypeSelect(pkgType.type)}
              >
                <CardContent className="p-0">
                  {/* Header with gradient */}
                  <div className={cn(
                    'p-6 text-white relative overflow-hidden',
                    `bg-gradient-to-r ${pkgType.gradient}`
                  )}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl mb-1">
                              {pkgType.title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {pkgType.subtitle}
                            </p>
                          </div>
                        </div>
                        
                        {pkgType.popular && (
                          <Badge className="bg-yellow-500 text-white text-xs font-medium px-3 py-1">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        
                        {isSelected && (
                          <motion.div 
                            className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Description */}
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {pkgType.description}
                    </p>

                    {/* Examples */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                        Examples:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {pkgType.examples.map((example, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs bg-white/50 border-gray-200 text-gray-700"
                          >
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        <Heart className="w-4 h-4 mr-1 text-red-500" />
                        Includes:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {pkgType.features.map((feature, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs bg-white/50 border-gray-200 text-gray-700"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <div className="text-xs font-medium text-gray-700">
                          {pkgType.duration}
                        </div>
                      </div>
                      <div className="text-center">
                        <Users className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <div className="text-xs font-medium text-gray-700">
                          {pkgType.groupSize}
                        </div>
                      </div>
                      <div className="text-center">
                        <MapPin className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <div className="text-xs font-medium text-gray-700">
                          {pkgType.priceRange}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Error Display */}
      {errors.type && (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-4 inline-block">
            {errors.type.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action Button */}
      <motion.div 
        className="flex justify-center pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={handleNext}
          disabled={!selectedType}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Continue to Package Details
        </Button>
      </motion.div>

      {/* Help Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
          <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
          Need Help Choosing?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0" />
            <div>
              <strong className="text-gray-900">Activity Experience:</strong> Perfect for day trips, city tours, and adventure experiences.
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
            <div>
              <strong className="text-gray-900">Complete Package:</strong> Comprehensive multi-day trips with everything included.
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
            <div>
              <strong className="text-gray-900">Hotel Package:</strong> Hotel-focused packages with added experiences.
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
            <div>
              <strong className="text-gray-900">Transportation:</strong> Airport pickups, city transfers, and private transport.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

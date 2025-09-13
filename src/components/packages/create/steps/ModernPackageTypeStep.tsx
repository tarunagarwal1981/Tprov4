'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StepProps } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package as PackageIcon,
  Plane,
  Car,
  Building,
  Activity,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  Users,
  DollarSign,
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

console.log('Package types array:', packageTypes);
console.log('PackageType enum values:', Object.values(PackageType));

export default function ModernPackageTypeStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext 
}: StepProps) {
  const [selectedType, setSelectedType] = useState<PackageType | undefined>(
    formData.type
  );

  console.log('ModernPackageTypeStep - formData:', formData);
  console.log('ModernPackageTypeStep - selectedType:', selectedType);

  const handleTypeSelect = (type: PackageType) => {
    console.log('Selecting package type:', type);
    setSelectedType(type);
    updateFormData({ type });
  };

  const handleNext = () => {
    if (selectedType) {
      console.log('✅ Package type selected, proceeding to next step:', selectedType);
      onNext();
    } else {
      console.log('❌ No package type selected, cannot proceed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Package Type
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Select the type of travel package you want to create
        </p>
      </motion.div>

      {/* Compact Package Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packageTypes.map((pkg, index) => {
          const IconComponent = pkg.icon;
          const isSelected = selectedType === pkg.type;
          
          return (
            <motion.div
              key={pkg.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div 
                className={cn(
                  "cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border-2 rounded-xl p-4",
                  isSelected 
                    ? `border-blue-500 bg-gradient-to-br ${pkg.bgGradient} shadow-md` 
                    : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                )}
                onClick={() => handleTypeSelect(pkg.type)}
              >
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    `bg-gradient-to-r ${pkg.gradient}`
                  )}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  
                  {pkg.popular && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-2 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </div>

                {/* Title and Subtitle */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {pkg.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {pkg.subtitle}
                  </p>
                </div>

                {/* Compact Description */}
                <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                  {pkg.description}
                </p>

                {/* Compact Stats */}
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-white/70 rounded-md p-2">
                    <div className="text-xs text-gray-500 mb-1">Duration</div>
                    <div className="text-xs font-semibold text-gray-900">{pkg.duration}</div>
                  </div>
                  <div className="bg-white/70 rounded-md p-2">
                    <div className="text-xs text-gray-500 mb-1">Group</div>
                    <div className="text-xs font-semibold text-gray-900">{pkg.groupSize}</div>
                  </div>
                  <div className="bg-white/70 rounded-md p-2">
                    <div className="text-xs text-gray-500 mb-1">Price</div>
                    <div className="text-xs font-semibold text-gray-900">{pkg.priceRange}</div>
                  </div>
                </div>

                {/* Compact Examples */}
                <div className="flex flex-wrap gap-1">
                  {pkg.examples.slice(0, 2).map((example, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md"
                    >
                      {example}
                    </span>
                  ))}
                  {pkg.examples.length > 2 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{pkg.examples.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Compact Continue Button */}
      <motion.div 
        className="flex justify-center pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={handleNext}
          disabled={!selectedType}
          size="lg"
          className={cn(
            "px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300",
            selectedType 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Continue to Package Details
        </Button>
      </motion.div>

      {/* Compact Help Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-xl p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="text-center">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            💡 Need Help Choosing?
          </h4>
          <p className="text-xs text-gray-600 mb-3">
            <strong>Activity Experience:</strong> Perfect for day trips and single activities<br/>
            <strong>Complete Package:</strong> Full multi-day trips with everything included<br/>
            <strong>Hotel Package:</strong> Accommodation-focused with added services
          </p>
          <div className="flex justify-center space-x-4 text-xs text-gray-500">
            <span>💬 Contact Support</span>
            <span>📖 View Guide</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
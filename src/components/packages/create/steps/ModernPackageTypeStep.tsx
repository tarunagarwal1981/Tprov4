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
    title: 'Activity',
    subtitle: 'Day trips & experiences',
    icon: Activity,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    popular: true
  },
  {
    type: PackageType.TRANSFERS,
    title: 'Transfers',
    subtitle: 'Transportation only',
    icon: Car,
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    popular: false
  },
  {
    type: PackageType.LAND_PACKAGE,
    title: 'Land Package',
    subtitle: 'Complete ground tour',
    icon: PackageIcon,
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    popular: true
  },
  {
    type: PackageType.HOTEL,
    title: 'Land Package with Hotel',
    subtitle: 'Tour + accommodation',
    icon: Building,
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-50 to-red-50',
    popular: true
  },
  {
    type: PackageType.FLIGHT,
    title: 'Fixed Departure with Flight',
    subtitle: 'Group tours with flights',
    icon: Plane,
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    popular: false
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

      {/* Simple Package Type Selection */}
      <div className="space-y-3">
        {packageTypes.map((pkg, index) => {
          const IconComponent = pkg.icon;
          const isSelected = selectedType === pkg.type;
          
          return (
            <motion.div
              key={pkg.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div 
                className={cn(
                  "cursor-pointer transition-all duration-200 border-2 rounded-lg p-4 flex items-center justify-between",
                  isSelected 
                    ? "border-blue-500 bg-blue-50 shadow-sm" 
                    : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                )}
                onClick={() => handleTypeSelect(pkg.type)}
              >
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    `bg-gradient-to-r ${pkg.gradient}`
                  )}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {pkg.title}
                      </h3>
                      {pkg.popular && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-2 py-1">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {pkg.subtitle}
                    </p>
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
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

      {/* Simple Help Section */}
      <motion.div 
        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="text-center">
          <p className="text-sm text-gray-600">
            💡 <strong>Need help?</strong> Choose the package type that best fits your offering
          </p>
        </div>
      </motion.div>
    </div>
  );
}
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
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Info,
  Lightbulb,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { packageTypeInfo, getPackageTypeInfo } from '@/lib/packageTypeInfo';

console.log('Package types array:', Object.values(packageTypeInfo));
console.log('PackageType enum values:', Object.values(PackageType));

export default function ModernPackageTypeStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext 
}: StepProps) {
  console.log('🎯 ModernPackageTypeStep loaded with 7 new package types!');
  
  const [selectedType, setSelectedType] = useState<PackageType | undefined>(
    formData.type
  );
  const [showDetails, setShowDetails] = useState<PackageType | null>(null);

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
      console.log('🔍 onNext function:', typeof onNext, onNext);
      if (typeof onNext === 'function') {
        onNext();
      } else {
        console.error('❌ onNext is not a function:', onNext);
      }
    } else {
      console.log('❌ No package type selected, cannot proceed');
    }
  };

  const selectedTypeInfo = selectedType ? getPackageTypeInfo(selectedType) : null;

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Choose Package Type
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Select the type of travel package you want to create. Each type has different features and requirements.
        </p>
      </motion.div>

      {/* Package Type Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {Object.values(packageTypeInfo).map((pkg, index) => {
          const isSelected = selectedType === pkg.type;
          
          return (
            <motion.div
              key={pkg.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-300 border-2 hover:shadow-lg",
                  isSelected 
                    ? "border-blue-500 bg-blue-50 shadow-lg scale-105" 
                    : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
                )}
                onClick={() => handleTypeSelect(pkg.type)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        `bg-gradient-to-r ${pkg.gradient}`
                      )}>
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {pkg.title}
                          </h3>
                          {pkg.popular && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs px-2 py-1">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">
                          {pkg.subtitle}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          {pkg.description}
                        </p>
                        
                        {/* Features */}
                        <div className="space-y-1">
                          {pkg.features.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Type Details */}
      {selectedTypeInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Great choice! Here's what you'll need to know about {selectedTypeInfo.title} packages:
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tips */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                        Tips
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {selectedTypeInfo.tips.slice(0, 3).map((tip, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Examples */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <Target className="w-4 h-4 mr-2 text-green-500" />
                        Examples
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {selectedTypeInfo.examples.slice(0, 3).map((example, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-purple-500" />
                        Features
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {selectedTypeInfo.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div 
        className="flex justify-center pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={handleNext}
          disabled={!selectedType}
          size="lg"
          className={cn(
            "px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300",
            selectedType 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          )}
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Continue to Package Details
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>

      {/* Help Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need Help Choosing?
          </h3>
          <p className="text-gray-600 mb-4">
            Each package type is designed for different travel experiences. Consider your target audience and the complexity of your offering.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="text-left">
              <p className="font-medium mb-2">For simple experiences:</p>
              <p>Choose <strong>Activity</strong> or <strong>Transfers</strong> for straightforward, single-service packages.</p>
            </div>
            <div className="text-left">
              <p className="font-medium mb-2">For comprehensive tours:</p>
              <p>Choose <strong>Land Package</strong> or <strong>Hotel Package</strong> for multi-day experiences.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
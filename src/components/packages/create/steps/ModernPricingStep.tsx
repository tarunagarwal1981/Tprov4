'use client';

import { StepProps } from '@/lib/types/wizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Lightbulb, Target, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPackageTypeInfo } from '@/lib/packageTypeInfo';

export default function ModernPricingStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  // Get package type specific information
  const packageTypeInfo = formData.type ? getPackageTypeInfo(formData.type) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Set your prices
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Define pricing for your package and any additional options.
        </p>
      </motion.div>

      {/* Package Type Specific Pricing Guidance */}
      {packageTypeInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Pricing Tips for {packageTypeInfo.title} Packages
              </h3>
              <p className="text-gray-600 mb-4">
                Here are some specific pricing considerations for your package type:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-orange-500" />
                    Pricing Strategy
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {packageTypeInfo.pricingTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2 text-red-500" />
                    Cost Considerations
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      Factor in all operational costs
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      Consider seasonal demand variations
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      Include profit margins for sustainability
                    </li>
                    <li className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                      Research competitor pricing
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pricing Form Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Pricing Configuration
          </h3>
          <p className="text-gray-600 mb-6">
            Advanced pricing options will be available here, including base pricing, add-ons, group discounts, and seasonal rates.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Base Pricing</h4>
              <p>Set your main package price</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Add-ons</h4>
              <p>Optional extras and upgrades</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Discounts</h4>
              <p>Group rates and promotions</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div 
        className="flex justify-between pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Button onClick={onPrevious} variant="outline" size="lg" className="rounded-xl px-8 py-3">
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Continue to Photos
        </Button>
      </motion.div>
    </div>
  );
}

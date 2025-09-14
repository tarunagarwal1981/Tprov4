'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StepProps } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  X,
  Info,
  CheckCircle,
  Clock,
  CreditCard,
  Shield,
  FileText,
  TrendingUp,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ModernPricingPoliciesStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  const [localData, setLocalData] = useState({
    adultPrice: formData.adultPrice || 0,
    childPrice: formData.childPrice || 0,
    infantPrice: formData.infantPrice || 0,
    seniorCitizenPrice: formData.seniorCitizenPrice || 0,
    groupDiscounts: formData.groupDiscounts || [],
    seasonalPricing: formData.seasonalPricing || [],
    validityDates: formData.validityDates || { startDate: '', endDate: '', blackoutDates: [] },
    currency: formData.currency || 'USD',
    minGroupSize: formData.minGroupSize || 1,
    maxGroupSize: formData.maxGroupSize || 10,
    advanceBookingDays: formData.advanceBookingDays || 7,
    cancellationPolicy: formData.cancellationPolicy || {
      freeCancellationDays: 7,
      cancellationFees: [
        { daysBeforeTravel: 7, feePercentage: 0 },
        { daysBeforeTravel: 3, feePercentage: 25 },
        { daysBeforeTravel: 1, feePercentage: 50 },
        { daysBeforeTravel: 0, feePercentage: 100 }
      ],
      forceMajeurePolicy: 'Full refund for force majeure events'
    },
    refundPolicy: formData.refundPolicy || {
      refundable: true,
      refundPercentage: 100,
      processingDays: 7,
      conditions: ['Cancellation must be made before travel date']
    },
    paymentTerms: formData.paymentTerms || [],
    newGroupDiscount: { minGroupSize: 0, maxGroupSize: 0, discountPercentage: 0 },
    newSeasonalPricing: { season: '', startDate: '', endDate: '', priceMultiplier: 1 },
    newPaymentTerm: '',
    newBlackoutDate: ''
  });

  useEffect(() => {
    updateFormData(localData);
  }, [localData, updateFormData]);

  const handleInputChange = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addGroupDiscount = () => {
    if (localData.newGroupDiscount.minGroupSize > 0 && localData.newGroupDiscount.discountPercentage > 0) {
      setLocalData(prev => ({
        ...prev,
        groupDiscounts: [...prev.groupDiscounts, { ...prev.newGroupDiscount }],
        newGroupDiscount: { minGroupSize: 0, maxGroupSize: 0, discountPercentage: 0 }
      }));
    }
  };

  const removeGroupDiscount = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      groupDiscounts: prev.groupDiscounts.filter((_, i) => i !== index)
    }));
  };

  const addSeasonalPricing = () => {
    if (localData.newSeasonalPricing.season && localData.newSeasonalPricing.startDate && localData.newSeasonalPricing.endDate) {
      setLocalData(prev => ({
        ...prev,
        seasonalPricing: [...prev.seasonalPricing, { ...prev.newSeasonalPricing }],
        newSeasonalPricing: { season: '', startDate: '', endDate: '', priceMultiplier: 1 }
      }));
    }
  };

  const removeSeasonalPricing = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      seasonalPricing: prev.seasonalPricing.filter((_, i) => i !== index)
    }));
  };

  const addPaymentTerm = () => {
    if (localData.newPaymentTerm.trim()) {
      setLocalData(prev => ({
        ...prev,
        paymentTerms: [...prev.paymentTerms, prev.newPaymentTerm.trim()],
        newPaymentTerm: ''
      }));
    }
  };

  const removePaymentTerm = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      paymentTerms: prev.paymentTerms.filter((_, i) => i !== index)
    }));
  };

  const addBlackoutDate = () => {
    if (localData.newBlackoutDate) {
      setLocalData(prev => ({
        ...prev,
        validityDates: {
          ...prev.validityDates,
          blackoutDates: [...prev.validityDates.blackoutDates, prev.newBlackoutDate]
        },
        newBlackoutDate: ''
      }));
    }
  };

  const removeBlackoutDate = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      validityDates: {
        ...prev.validityDates,
        blackoutDates: prev.validityDates.blackoutDates.filter((_, i) => i !== index)
      }
    }));
  };

  const handleNext = () => {
    onNext();
  };

  const handlePrevious = () => {
    onPrevious();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Pricing & Policies
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Set your pricing structure and booking policies for your package.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Base Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adultPrice" className="text-sm font-medium text-gray-700">
                  Adult Price *
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {localData.currency}
                  </span>
                  <Input
                    id="adultPrice"
                    type="number"
                    value={localData.adultPrice}
                    onChange={(e) => handleInputChange('adultPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="pl-12"
                  />
                </div>
                {errors.adultPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.adultPrice[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="childPrice" className="text-sm font-medium text-gray-700">
                  Child Price *
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {localData.currency}
                  </span>
                  <Input
                    id="childPrice"
                    type="number"
                    value={localData.childPrice}
                    onChange={(e) => handleInputChange('childPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="pl-12"
                  />
                </div>
                {errors.childPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.childPrice[0]}</p>
                )}
              </div>
            </div>

            {/* Additional Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="infantPrice" className="text-sm font-medium text-gray-700">
                  Infant Price
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {localData.currency}
                  </span>
                  <Input
                    id="infantPrice"
                    type="number"
                    value={localData.infantPrice}
                    onChange={(e) => handleInputChange('infantPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="seniorCitizenPrice" className="text-sm font-medium text-gray-700">
                  Senior Citizen Price
                </Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {localData.currency}
                  </span>
                  <Input
                    id="seniorCitizenPrice"
                    type="number"
                    value={localData.seniorCitizenPrice}
                    onChange={(e) => handleInputChange('seniorCitizenPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="pl-12"
                  />
                </div>
              </div>
            </div>

            {/* Currency */}
            <div>
              <Label htmlFor="currency" className="text-sm font-medium text-gray-700">
                Currency *
              </Label>
              <Select value={localData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">{errors.currency[0]}</p>
              )}
            </div>

            {/* Group Discounts */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Group Discounts
              </Label>
              <div className="space-y-3 mt-1">
                {localData.groupDiscounts.map((discount, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                    <Badge variant="secondary" className="flex-1 justify-start">
                      <Users className="w-3 h-3 mr-1" />
                      {discount.minGroupSize}+ people: {discount.discountPercentage}% off
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGroupDiscount(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    value={localData.newGroupDiscount.minGroupSize}
                    onChange={(e) => handleInputChange('newGroupDiscount', {
                      ...localData.newGroupDiscount,
                      minGroupSize: parseInt(e.target.value) || 0
                    })}
                    placeholder="Min size"
                  />
                  <Input
                    type="number"
                    value={localData.newGroupDiscount.discountPercentage}
                    onChange={(e) => handleInputChange('newGroupDiscount', {
                      ...localData.newGroupDiscount,
                      discountPercentage: parseInt(e.target.value) || 0
                    })}
                    placeholder="% off"
                  />
                  <Button onClick={addGroupDiscount} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-blue-700">
              <Users className="w-5 h-5 mr-2" />
              Booking Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Group Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minGroupSize" className="text-sm font-medium text-gray-700">
                  Min Group Size *
                </Label>
                <Input
                  id="minGroupSize"
                  type="number"
                  value={localData.minGroupSize}
                  onChange={(e) => handleInputChange('minGroupSize', parseInt(e.target.value) || 1)}
                  placeholder="1"
                  className="mt-1"
                />
                {errors.minGroupSize && (
                  <p className="text-red-500 text-sm mt-1">{errors.minGroupSize[0]}</p>
                )}
              </div>

              <div>
                <Label htmlFor="maxGroupSize" className="text-sm font-medium text-gray-700">
                  Max Group Size *
                </Label>
                <Input
                  id="maxGroupSize"
                  type="number"
                  value={localData.maxGroupSize}
                  onChange={(e) => handleInputChange('maxGroupSize', parseInt(e.target.value) || 10)}
                  placeholder="10"
                  className="mt-1"
                />
                {errors.maxGroupSize && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxGroupSize[0]}</p>
                )}
              </div>
            </div>

            {/* Advance Booking */}
            <div>
              <Label htmlFor="advanceBookingDays" className="text-sm font-medium text-gray-700">
                Advance Booking Days
              </Label>
              <Input
                id="advanceBookingDays"
                type="number"
                value={localData.advanceBookingDays}
                onChange={(e) => handleInputChange('advanceBookingDays', parseInt(e.target.value) || 7)}
                placeholder="7"
                className="mt-1"
              />
            </div>

            {/* Payment Terms */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Payment Terms
              </Label>
              <div className="space-y-2 mt-1">
                {localData.paymentTerms.map((term, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Badge variant="outline" className="flex-1 justify-start">
                      <CreditCard className="w-3 h-3 mr-1" />
                      {term}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePaymentTerm(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    value={localData.newPaymentTerm}
                    onChange={(e) => handleInputChange('newPaymentTerm', e.target.value)}
                    placeholder="Add payment term..."
                    className="flex-1"
                  />
                  <Button onClick={addPaymentTerm} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validity Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-purple-700">
            <Calendar className="w-5 h-5 mr-2" />
            Validity & Seasonal Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Validity Dates */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Package Validity
              </Label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <Label htmlFor="startDate" className="text-xs text-gray-500">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={localData.validityDates.startDate}
                    onChange={(e) => handleInputChange('validityDates', {
                      ...localData.validityDates,
                      startDate: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-xs text-gray-500">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={localData.validityDates.endDate}
                    onChange={(e) => handleInputChange('validityDates', {
                      ...localData.validityDates,
                      endDate: e.target.value
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Seasonal Pricing */}
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Seasonal Pricing
              </Label>
              <div className="space-y-3 mt-1">
                {localData.seasonalPricing.map((season, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                    <Badge variant="secondary" className="flex-1 justify-start">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {season.season}: {season.priceMultiplier}x price
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSeasonalPricing(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={localData.newSeasonalPricing.season}
                    onChange={(e) => handleInputChange('newSeasonalPricing', {
                      ...localData.newSeasonalPricing,
                      season: e.target.value
                    })}
                    placeholder="Season name"
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={localData.newSeasonalPricing.priceMultiplier}
                    onChange={(e) => handleInputChange('newSeasonalPricing', {
                      ...localData.newSeasonalPricing,
                      priceMultiplier: parseFloat(e.target.value) || 1
                    })}
                    placeholder="Price multiplier"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={localData.newSeasonalPricing.startDate}
                    onChange={(e) => handleInputChange('newSeasonalPricing', {
                      ...localData.newSeasonalPricing,
                      startDate: e.target.value
                    })}
                    placeholder="Start date"
                  />
                  <div className="flex space-x-2">
                    <Input
                      type="date"
                      value={localData.newSeasonalPricing.endDate}
                      onChange={(e) => handleInputChange('newSeasonalPricing', {
                        ...localData.newSeasonalPricing,
                        endDate: e.target.value
                      })}
                      placeholder="End date"
                    />
                    <Button onClick={addSeasonalPricing} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <motion.div 
        className="flex justify-between pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Button
          onClick={handlePrevious}
          variant="outline"
          size="lg"
          className="px-8 py-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
        >
          Next: Review & Publish
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}

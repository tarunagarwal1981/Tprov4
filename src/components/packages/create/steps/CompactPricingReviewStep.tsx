'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StepProps } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign,
  Eye,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Shield,
  CreditCard,
  Settings,
  Star,
  Clock,
  MapPin,
  FileText,
  Package as PackageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPackageTypeInfo } from '@/lib/packageTypeInfo';

const currencies = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'CAD', label: 'CAD (C$)' }
];

const cancellationPolicies = [
  { value: 'flexible', label: 'Flexible', description: 'Free cancellation up to 24 hours before' },
  { value: 'moderate', label: 'Moderate', description: 'Free cancellation up to 7 days before' },
  { value: 'strict', label: 'Strict', description: 'Free cancellation up to 30 days before' },
  { value: 'non_refundable', label: 'Non-refundable', description: 'No refunds after booking' }
];

const refundPolicies = [
  { value: 'full_refund', label: 'Full Refund', description: '100% refund for cancellations' },
  { value: 'partial_refund', label: 'Partial Refund', description: '50-90% refund based on timing' },
  { value: 'credit_only', label: 'Credit Only', description: 'Travel credit instead of refund' },
  { value: 'no_refund', label: 'No Refund', description: 'No refunds under any circumstances' }
];

export default function CompactPricingReviewStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious,
  onPublish
}: StepProps) {
  
  const [localData, setLocalData] = useState({
    // Pricing
    adultPrice: formData.adultPrice || 0,
    childPrice: formData.childPrice || 0,
    infantPrice: formData.infantPrice || 0,
    seniorCitizenPrice: formData.seniorCitizenPrice || 0,
    currency: formData.currency || 'USD',
    groupDiscounts: formData.groupDiscounts || [],
    seasonalPricing: formData.seasonalPricing || [],
    
    // Booking Policies
    minGroupSize: formData.minGroupSize || 1,
    maxGroupSize: formData.maxGroupSize || 10,
    advanceBookingDays: formData.advanceBookingDays || 7,
    cancellationPolicy: formData.cancellationPolicy || 'moderate',
    refundPolicy: formData.refundPolicy || 'partial_refund',
    
    // Additional Pricing
    taxes: formData.taxes || { gst: 0, serviceTax: 0, tourismTax: 0, other: [] },
    fees: formData.fees || { bookingFee: 0, processingFee: 0, cancellationFee: 0, other: [] }
  });

  const [activeSection, setActiveSection] = useState<'pricing' | 'policies' | 'review'>('pricing');
  const [newGroupDiscount, setNewGroupDiscount] = useState({ minPeople: '', discount: '' });
  const [newSeasonalPricing, setNewSeasonalPricing] = useState({ season: '', multiplier: '' });

  useEffect(() => {
    updateFormData(localData);
  }, [localData, updateFormData]);

  const handleInputChange = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addGroupDiscount = () => {
    if (newGroupDiscount.minPeople && newGroupDiscount.discount) {
      setLocalData(prev => ({
        ...prev,
        groupDiscounts: [...prev.groupDiscounts, {
          minPeople: parseInt(newGroupDiscount.minPeople),
          discount: parseFloat(newGroupDiscount.discount)
        }]
      }));
      setNewGroupDiscount({ minPeople: '', discount: '' });
    }
  };

  const removeGroupDiscount = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      groupDiscounts: prev.groupDiscounts.filter((_, i) => i !== index)
    }));
  };

  const addSeasonalPricing = () => {
    if (newSeasonalPricing.season && newSeasonalPricing.multiplier) {
      setLocalData(prev => ({
        ...prev,
        seasonalPricing: [...prev.seasonalPricing, {
          season: newSeasonalPricing.season,
          multiplier: parseFloat(newSeasonalPricing.multiplier)
        }]
      }));
      setNewSeasonalPricing({ season: '', multiplier: '' });
    }
  };

  const removeSeasonalPricing = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      seasonalPricing: prev.seasonalPricing.filter((_, i) => i !== index)
    }));
  };

  const packageTypeInfo = formData.type ? getPackageTypeInfo(formData.type) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Pricing & Review
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Set your pricing structure, booking policies, and review your package before publishing.
        </p>
      </motion.div>

      {/* Progress Sections */}
      <div className="flex justify-center">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'policies', label: 'Policies', icon: Shield },
            { id: 'review', label: 'Review', icon: Eye }
          ].map((section) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200",
                  isActive 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing Section */}
      {activeSection === 'pricing' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Base Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  Base Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="adultPrice" className="text-sm font-medium">
                    Adult Price *
                  </Label>
                  <div className="flex space-x-2 mt-1">
                    <Select
                      value={localData.currency}
                      onValueChange={(value) => handleInputChange('currency', value)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="adultPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={localData.adultPrice}
                      onChange={(e) => handleInputChange('adultPrice', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="childPrice" className="text-sm font-medium">
                    Child Price (2-12 years)
                  </Label>
                  <Input
                    id="childPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={localData.childPrice}
                    onChange={(e) => handleInputChange('childPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="infantPrice" className="text-sm font-medium">
                    Infant Price (0-2 years)
                  </Label>
                  <Input
                    id="infantPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={localData.infantPrice}
                    onChange={(e) => handleInputChange('infantPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="seniorCitizenPrice" className="text-sm font-medium">
                    Senior Citizen Price (65+ years)
                  </Label>
                  <Input
                    id="seniorCitizenPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={localData.seniorCitizenPrice}
                    onChange={(e) => handleInputChange('seniorCitizenPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Group Discounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Group Discounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newGroupDiscount.minPeople}
                    onChange={(e) => setNewGroupDiscount(prev => ({ ...prev, minPeople: e.target.value }))}
                    placeholder="Min people"
                    type="number"
                  />
                  <Input
                    value={newGroupDiscount.discount}
                    onChange={(e) => setNewGroupDiscount(prev => ({ ...prev, discount: e.target.value }))}
                    placeholder="Discount %"
                    type="number"
                    step="0.1"
                  />
                  <Button onClick={addGroupDiscount} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {localData.groupDiscounts.length > 0 && (
                  <div className="space-y-2">
                    {localData.groupDiscounts.map((discount, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                        <span className="text-sm">
                          {discount.minPeople}+ people: {discount.discount}% off
                        </span>
                        <button
                          onClick={() => removeGroupDiscount(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seasonal Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Seasonal Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newSeasonalPricing.season}
                    onChange={(e) => setNewSeasonalPricing(prev => ({ ...prev, season: e.target.value }))}
                    placeholder="Season name"
                  />
                  <Input
                    value={newSeasonalPricing.multiplier}
                    onChange={(e) => setNewSeasonalPricing(prev => ({ ...prev, multiplier: e.target.value }))}
                    placeholder="Price multiplier"
                    type="number"
                    step="0.1"
                  />
                  <Button onClick={addSeasonalPricing} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {localData.seasonalPricing.length > 0 && (
                  <div className="space-y-2">
                    {localData.seasonalPricing.map((pricing, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <span className="text-sm">
                          {pricing.season}: {pricing.multiplier}x base price
                        </span>
                        <button
                          onClick={() => removeSeasonalPricing(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Taxes & Fees */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Taxes & Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="gst" className="text-sm font-medium">
                      GST (%)
                    </Label>
                    <Input
                      id="gst"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={localData.taxes.gst}
                      onChange={(e) => handleInputChange('taxes', { 
                        ...localData.taxes, 
                        gst: parseFloat(e.target.value) || 0 
                      })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="serviceTax" className="text-sm font-medium">
                      Service Tax (%)
                    </Label>
                    <Input
                      id="serviceTax"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={localData.taxes.serviceTax}
                      onChange={(e) => handleInputChange('taxes', { 
                        ...localData.taxes, 
                        serviceTax: parseFloat(e.target.value) || 0 
                      })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="bookingFee" className="text-sm font-medium">
                      Booking Fee
                    </Label>
                    <Input
                      id="bookingFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={localData.fees.bookingFee}
                      onChange={(e) => handleInputChange('fees', { 
                        ...localData.fees, 
                        bookingFee: parseFloat(e.target.value) || 0 
                      })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="processingFee" className="text-sm font-medium">
                      Processing Fee
                    </Label>
                    <Input
                      id="processingFee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={localData.fees.processingFee}
                      onChange={(e) => handleInputChange('fees', { 
                        ...localData.fees, 
                        processingFee: parseFloat(e.target.value) || 0 
                      })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Policies Section */}
      {activeSection === 'policies' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Booking Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minGroupSize" className="text-sm font-medium">
                      Min Group Size *
                    </Label>
                    <Input
                      id="minGroupSize"
                      type="number"
                      min="1"
                      max="100"
                      value={localData.minGroupSize}
                      onChange={(e) => handleInputChange('minGroupSize', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxGroupSize" className="text-sm font-medium">
                      Max Group Size *
                    </Label>
                    <Input
                      id="maxGroupSize"
                      type="number"
                      min="1"
                      max="100"
                      value={localData.maxGroupSize}
                      onChange={(e) => handleInputChange('maxGroupSize', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="advanceBookingDays" className="text-sm font-medium">
                    Advance Booking Required (Days)
                  </Label>
                  <Input
                    id="advanceBookingDays"
                    type="number"
                    min="0"
                    max="365"
                    value={localData.advanceBookingDays}
                    onChange={(e) => handleInputChange('advanceBookingDays', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cancellation & Refund Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Cancellation & Refund
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Cancellation Policy</Label>
                  <Select
                    value={localData.cancellationPolicy}
                    onValueChange={(value) => handleInputChange('cancellationPolicy', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select cancellation policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {cancellationPolicies.map((policy) => (
                        <SelectItem key={policy.value} value={policy.value}>
                          <div>
                            <div className="font-medium">{policy.label}</div>
                            <div className="text-sm text-gray-500">{policy.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Refund Policy</Label>
                  <Select
                    value={localData.refundPolicy}
                    onValueChange={(value) => handleInputChange('refundPolicy', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select refund policy" />
                    </SelectTrigger>
                    <SelectContent>
                      {refundPolicies.map((policy) => (
                        <SelectItem key={policy.value} value={policy.value}>
                          <div>
                            <div className="font-medium">{policy.label}</div>
                            <div className="text-sm text-gray-500">{policy.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Review Section */}
      {activeSection === 'review' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Package Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PackageIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Package Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Package Type:</span>
                    <Badge variant="outline">{packageTypeInfo?.title}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Title:</span>
                    <span className="text-sm">{formData.title || 'Not set'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">{formData.duration?.days} days, {formData.duration?.nights} nights</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Group Size:</span>
                    <span className="text-sm">{formData.groupSize?.min}-{formData.groupSize?.max} people</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Difficulty:</span>
                    <Badge variant="outline">{formData.difficulty}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Category:</span>
                    <Badge variant="outline">{formData.category}</Badge>
                  </div>
                  {formData.isFeatured && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Featured:</span>
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Yes
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  Pricing Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Adult Price:</span>
                    <span className="text-sm font-semibold">{localData.currency} {localData.adultPrice}</span>
                  </div>
                  {localData.childPrice > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Child Price:</span>
                      <span className="text-sm">{localData.currency} {localData.childPrice}</span>
                    </div>
                  )}
                  {localData.infantPrice > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Infant Price:</span>
                      <span className="text-sm">{localData.currency} {localData.infantPrice}</span>
                    </div>
                  )}
                  {localData.seniorCitizenPrice > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Senior Price:</span>
                      <span className="text-sm">{localData.currency} {localData.seniorCitizenPrice}</span>
                    </div>
                  )}
                  {localData.groupDiscounts.length > 0 && (
                    <div className="pt-2 border-t">
                      <span className="text-sm font-medium">Group Discounts:</span>
                      <div className="mt-1 space-y-1">
                        {localData.groupDiscounts.map((discount, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            {discount.minPeople}+ people: {discount.discount}% off
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Validation Status */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                  Validation Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-600">✓ Completed Sections</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Package Type & Basic Info
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Location & Timing
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Package Details
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Inclusions & Exclusions
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Pricing Structure
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Booking Policies
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-600">📋 Package Ready</h4>
                    <p className="text-sm text-gray-600">
                      Your package has been configured with all necessary information. 
                      Review the details above and click "Publish Package" to make it live.
                    </p>
                    <div className="mt-4">
                      <Button
                        onClick={onPublish}
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Publish Package
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-8 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onPrevious}
          size="lg"
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-3">
          {activeSection === 'pricing' && (
            <Button
              onClick={() => setActiveSection('policies')}
              size="lg"
              className="flex items-center"
            >
              Next Section
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {activeSection === 'policies' && (
            <Button
              onClick={() => setActiveSection('review')}
              size="lg"
              className="flex items-center"
            >
              Next Section
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {activeSection === 'review' && (
            <Button
              onClick={onPublish}
              disabled={!isValid}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Publish Package
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

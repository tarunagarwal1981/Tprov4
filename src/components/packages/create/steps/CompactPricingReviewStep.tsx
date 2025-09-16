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
  { value: 'super_strict', label: 'Super Strict', description: 'Free cancellation up to 60 days before' }
];

const paymentMethods = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash', label: 'Cash on Arrival' },
  { value: 'crypto', label: 'Cryptocurrency' }
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
    // Pricing Structure
    basePrice: formData.basePrice || 0,
    currency: formData.currency || 'USD',
    pricePerPerson: formData.pricePerPerson || true,
    groupDiscounts: formData.groupDiscounts || [],
    seasonalPricing: formData.seasonalPricing || [],
    
    // Policies
    cancellationPolicy: formData.cancellationPolicy || 'moderate',
    refundPolicy: formData.refundPolicy || '',
    termsAndConditions: formData.termsAndConditions || '',
    
    // Payment
    paymentMethods: formData.paymentMethods || ['credit_card'],
    advanceBookingRequired: formData.advanceBookingRequired || 7,
    minimumAdvanceBooking: formData.minimumAdvanceBooking || 1,
    
    // Additional Info
    specialOffers: formData.specialOffers || [],
    additionalNotes: formData.additionalNotes || ''
  });

  const [activeSection, setActiveSection] = useState<'pricing' | 'policies' | 'review'>('pricing');
  const [newGroupDiscount, setNewGroupDiscount] = useState({ minPeople: '', discount: '' });
  const [newSeasonalPrice, setNewSeasonalPrice] = useState({ season: '', price: '' });
  const [newSpecialOffer, setNewSpecialOffer] = useState('');

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

  const addSeasonalPrice = () => {
    if (newSeasonalPrice.season && newSeasonalPrice.price) {
      setLocalData(prev => ({
        ...prev,
        seasonalPricing: [...prev.seasonalPricing, {
          season: newSeasonalPrice.season,
          price: parseFloat(newSeasonalPrice.price)
        }]
      }));
      setNewSeasonalPrice({ season: '', price: '' });
    }
  };

  const removeSeasonalPrice = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      seasonalPricing: prev.seasonalPricing.filter((_, i) => i !== index)
    }));
  };

  const addSpecialOffer = () => {
    if (newSpecialOffer.trim()) {
      setLocalData(prev => ({
        ...prev,
        specialOffers: [...prev.specialOffers, newSpecialOffer.trim()]
      }));
      setNewSpecialOffer('');
    }
  };

  const removeSpecialOffer = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      specialOffers: prev.specialOffers.filter((_, i) => i !== index)
    }));
  };

  const packageType = formData.type as PackageType;

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
          Set your pricing structure, define policies, and review your package before publishing.
        </p>
      </motion.div>

      {/* Progress Sections */}
      <div className="flex justify-center">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'pricing', label: 'Pricing Structure', icon: DollarSign },
            { id: 'policies', label: 'Policies & Terms', icon: Shield },
            { id: 'review', label: 'Review & Publish', icon: Eye }
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

      {/* Pricing Structure */}
      {activeSection === 'pricing' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Base Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="basePrice" className="text-sm font-medium">
                        Base Price *
                      </Label>
                      <Input
                        id="basePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={localData.basePrice}
                        onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Currency</Label>
                      <Select
                        value={localData.currency}
                        onValueChange={(value) => handleInputChange('currency', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="pricePerPerson"
                      checked={localData.pricePerPerson}
                      onChange={(e) => handleInputChange('pricePerPerson', e.target.checked)}
                      className="rounded border-gray-300 h-4 w-4"
                    />
                    <div>
                      <Label htmlFor="pricePerPerson" className="text-sm font-medium">
                        Price per Person
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Uncheck if this is a fixed price for the entire package
                      </p>
                    </div>
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
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm font-medium">Min People</Label>
                      <Input
                        type="number"
                        min="2"
                        value={newGroupDiscount.minPeople}
                        onChange={(e) => setNewGroupDiscount(prev => ({ ...prev, minPeople: e.target.value }))}
                        placeholder="e.g., 5"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Discount %</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={newGroupDiscount.discount}
                        onChange={(e) => setNewGroupDiscount(prev => ({ ...prev, discount: e.target.value }))}
                        placeholder="e.g., 10"
                      />
                    </div>
                  </div>
                  <Button onClick={addGroupDiscount} size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Group Discount
                  </Button>
                  
                  {localData.groupDiscounts.length > 0 && (
                    <div className="space-y-2">
                      {localData.groupDiscounts.map((discount, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <span className="text-sm">
                            {discount.minPeople}+ people: {discount.discount}% off
                          </span>
                          <button
                            onClick={() => removeGroupDiscount(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Seasonal Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Seasonal Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-sm font-medium">Season</Label>
                      <Input
                        value={newSeasonalPrice.season}
                        onChange={(e) => setNewSeasonalPrice(prev => ({ ...prev, season: e.target.value }))}
                        placeholder="e.g., Summer, Winter"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={newSeasonalPrice.price}
                        onChange={(e) => setNewSeasonalPrice(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g., 1500"
                      />
                    </div>
                  </div>
                  <Button onClick={addSeasonalPrice} size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Seasonal Price
                  </Button>
                  
                  {localData.seasonalPricing.length > 0 && (
                    <div className="space-y-2">
                      {localData.seasonalPricing.map((price, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <span className="text-sm">
                            {price.season}: {localData.currency} {price.price}
                          </span>
                          <button
                            onClick={() => removeSeasonalPrice(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Special Offers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-blue-600" />
                    Special Offers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newSpecialOffer}
                      onChange={(e) => setNewSpecialOffer(e.target.value)}
                      placeholder="Add special offer..."
                      onKeyPress={(e) => e.key === 'Enter' && addSpecialOffer()}
                    />
                    <Button onClick={addSpecialOffer} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {localData.specialOffers.length > 0 && (
                    <div className="space-y-2">
                      {localData.specialOffers.map((offer, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                          <span className="text-sm text-yellow-800">{offer}</span>
                          <button
                            onClick={() => removeSpecialOffer(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      )}

      {/* Policies & Terms */}
      {activeSection === 'policies' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Cancellation Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Policy Type</Label>
                    <Select
                      value={localData.cancellationPolicy}
                      onValueChange={(value) => handleInputChange('cancellationPolicy', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cancellationPolicies.map((policy) => (
                          <SelectItem key={policy.value} value={policy.value}>
                            <div>
                              <div className="font-medium">{policy.label}</div>
                              <div className="text-xs text-gray-500">{policy.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="refundPolicy" className="text-sm font-medium">
                      Refund Policy Details
                    </Label>
                    <Textarea
                      id="refundPolicy"
                      value={localData.refundPolicy}
                      onChange={(e) => handleInputChange('refundPolicy', e.target.value)}
                      placeholder="Detailed refund policy..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    Payment Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Accepted Payment Methods</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {paymentMethods.map((method) => (
                        <div key={method.value} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={method.value}
                            checked={localData.paymentMethods.includes(method.value)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('paymentMethods', [...localData.paymentMethods, method.value]);
                              } else {
                                handleInputChange('paymentMethods', localData.paymentMethods.filter(m => m !== method.value));
                              }
                            }}
                            className="rounded border-gray-300 h-4 w-4"
                          />
                          <Label htmlFor={method.value} className="text-sm">
                            {method.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="advanceBookingRequired" className="text-sm font-medium">
                        Advance Booking Required (Days)
                      </Label>
                      <Input
                        id="advanceBookingRequired"
                        type="number"
                        min="1"
                        max="365"
                        value={localData.advanceBookingRequired}
                        onChange={(e) => handleInputChange('advanceBookingRequired', parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minimumAdvanceBooking" className="text-sm font-medium">
                        Minimum Advance Booking (Days)
                      </Label>
                      <Input
                        id="minimumAdvanceBooking"
                        type="number"
                        min="1"
                        max="30"
                        value={localData.minimumAdvanceBooking}
                        onChange={(e) => handleInputChange('minimumAdvanceBooking', parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Terms & Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="termsAndConditions" className="text-sm font-medium">
                      Terms and Conditions
                    </Label>
                    <Textarea
                      id="termsAndConditions"
                      value={localData.termsAndConditions}
                      onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                      placeholder="Enter terms and conditions..."
                      className="mt-1"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      )}

      {/* Review & Publish */}
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
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Package Type:</span>
                    <Badge variant="secondary">{packageType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Title:</span>
                    <span className="text-sm">{formData.title || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Duration:</span>
                    <span className="text-sm">{formData.duration?.days || 0} days, {formData.duration?.nights || 0} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Group Size:</span>
                    <span className="text-sm">{formData.groupSize?.min || 0} - {formData.groupSize?.max || 0} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Base Price:</span>
                    <span className="text-sm font-bold">{localData.currency} {localData.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cancellation:</span>
                    <span className="text-sm">{localData.cancellationPolicy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="additionalNotes" className="text-sm font-medium">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    value={localData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional notes or special instructions..."
                    className="mt-1"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Validation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {isValid ? (
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                )}
                Validation Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isValid ? (
                <div className="text-green-700 bg-green-50 p-4 rounded-lg">
                  <p className="font-medium">✅ Package is ready to publish!</p>
                  <p className="text-sm mt-1">All required fields have been completed and validated.</p>
                </div>
              ) : (
                <div className="text-red-700 bg-red-50 p-4 rounded-lg">
                  <p className="font-medium">❌ Please complete all required fields</p>
                  <p className="text-sm mt-1">Check the form for any missing or invalid information.</p>
                </div>
              )}
            </CardContent>
          </Card>
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
          {activeSection !== 'review' && (
            <Button
              onClick={() => {
                const sections = ['pricing', 'policies', 'review'];
                const currentIndex = sections.indexOf(activeSection);
                if (currentIndex < sections.length - 1) {
                  setActiveSection(sections[currentIndex + 1] as any);
                }
              }}
              size="lg"
              className="flex items-center"
            >
              Next Section
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          
          {activeSection === 'review' && (
            <div className="flex space-x-3">
              <Button
                onClick={onNext}
                size="lg"
                variant="outline"
                className="flex items-center"
              >
                Save as Draft
              </Button>
              <Button
                onClick={onPublish}
                disabled={!isValid}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Publish Package
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
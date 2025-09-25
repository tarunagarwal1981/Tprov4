'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { PackageType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from '@/components/ui/DatePicker';
import { Button } from '@/components/ui/button';

export interface PricingInfo {
  adultPrice: number;
  childPrice: number;
  infantPrice?: number;
  seniorPrice?: number;
  validFrom: Date | null;
  validTo: Date | null;
  notes?: string;
  packageVariant?: string;
  minGuests?: number;
  maxGuests?: number;
}

interface PricingSectionProps {
  pricing: PricingInfo[];
  onChange: (pricing: PricingInfo[]) => void;
  packageType: PackageType;
  showInfantPrice?: boolean;
  showSeniorPrice?: boolean;
  showGroupDiscounts?: boolean;
  showSeasonalPricing?: boolean;
  showPackageVariants?: boolean;
  showFixedPricing?: boolean;
  currency?: string;
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  pricing,
  onChange,
  packageType,
  showInfantPrice = false,
  showSeniorPrice = false,
  showGroupDiscounts = false,
  showSeasonalPricing = false,
  showPackageVariants = false,
  showFixedPricing = false,
  currency = 'INR',
  className = ''
}) => {
  const addPricing = () => {
    onChange([
      ...(pricing || []),
      { 
        adultPrice: 0, 
        childPrice: 0, 
        infantPrice: 0,
        seniorPrice: 0,
        validFrom: null, 
        validTo: null 
      }
    ]);
  };

  const updatePricing = (index: number, field: keyof PricingInfo, value: any) => {
    const updated = [...(pricing || [])];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removePricing = (index: number) => {
    onChange((pricing || []).filter((_, i) => i !== index));
  };

  const getPricingTitle = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'Activity Pricing';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'Package Pricing';
      case PackageType.TRANSFERS:
        return 'Transfer Pricing';
      default:
        return 'Pricing Information';
    }
  };

  const getAddButtonText = () => {
    if (showPackageVariants) return 'Add Package Variant';
    if (showSeasonalPricing) return 'Add Seasonal Pricing';
    return 'Add Price Slab';
  };

  return (
    <div className={`pricing-section ${className}`}>
      <div className="pricing-header">
        <h4 className="pricing-title">{getPricingTitle()}</h4>
        <button
          onClick={addPricing}
          className="pricing-add-button"
        >
          <Plus className="w-4 h-4" />
          {getAddButtonText()}
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {(pricing || []).map((price, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pricing-card"
            >
              <div className="pricing-card-header">
                <h4 className="pricing-card-title">
                  {showPackageVariants ? `Package Variant ${index + 1}` : `Price Slab ${index + 1}`}
                </h4>
                {(pricing || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePricing(index)}
                    className="pricing-card-remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="pricing-grid">
                {/* Package Variant Name */}
                {showPackageVariants && (
                  <div className="pricing-field">
                    <label className="pricing-label">Package Name</label>
                    <Input
                      placeholder="e.g., General Admission"
                      value={price.packageVariant || ''}
                      onChange={(e) => updatePricing(index, 'packageVariant', e.target.value)}
                    />
                  </div>
                )}

                {/* Adult Price */}
                <div className="pricing-field">
                  <label className="pricing-label">Adult Price ({currency})</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={price.adultPrice?.toString() || ''}
                    onChange={(e) => updatePricing(index, 'adultPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>

                {/* Child Price */}
                <div className="pricing-field">
                  <label className="pricing-label">Child Price ({currency})</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={price.childPrice?.toString() || ''}
                    onChange={(e) => updatePricing(index, 'childPrice', parseFloat(e.target.value) || 0)}
                  />
                </div>

                {/* Infant Price */}
                {showInfantPrice && (
                  <div className="pricing-field">
                    <label className="pricing-label">Infant Price ({currency})</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={price.infantPrice?.toString() || ''}
                      onChange={(e) => updatePricing(index, 'infantPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}

                {/* Senior Price */}
                {showSeniorPrice && (
                  <div className="pricing-field">
                    <label className="pricing-label">Senior Price ({currency})</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={price.seniorPrice?.toString() || ''}
                      onChange={(e) => updatePricing(index, 'seniorPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}

                {/* Min/Max Guests for Package Variants */}
                {showPackageVariants && (
                  <>
                    <div className="pricing-field">
                      <label className="pricing-label">Min Guests</label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={price.minGuests?.toString() || ''}
                        onChange={(e) => updatePricing(index, 'minGuests', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="pricing-field">
                      <label className="pricing-label">Max Guests</label>
                      <Input
                        type="number"
                        placeholder="50"
                        value={price.maxGuests?.toString() || ''}
                        onChange={(e) => updatePricing(index, 'maxGuests', parseInt(e.target.value) || 50)}
                      />
                    </div>
                  </>
                )}

                {/* Validity Dates */}
                <div className="pricing-field">
                  <label className="pricing-label">Valid From</label>
                  <DatePicker
                    value={price.validFrom}
                    onChange={(date) => updatePricing(index, 'validFrom', date)}
                    placeholder="Select start date"
                  />
                </div>

                <div className="pricing-field">
                  <label className="pricing-label">Valid To</label>
                  <DatePicker
                    value={price.validTo}
                    onChange={(date) => updatePricing(index, 'validTo', date)}
                    placeholder="Select end date"
                  />
                </div>

                {/* Notes */}
                <div className="pricing-field col-span-2">
                  <label className="pricing-label">Notes</label>
                  <Input
                    placeholder="Any additional pricing notes..."
                    value={price.notes || ''}
                    onChange={(e) => updatePricing(index, 'notes', e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {(!pricing || pricing.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No pricing added yet. Click "Add Price Slab" to start.</p>
          </div>
        )}
      </div>
    </div>
  );
};

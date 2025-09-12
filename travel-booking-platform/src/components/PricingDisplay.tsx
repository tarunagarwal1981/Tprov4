import React from 'react';
import { cn } from '@/lib/utils';
import { PackagePricing, GroupDiscount, SeasonalPricing } from '@/lib/types';

interface PricingDisplayProps {
  pricing: PackagePricing;
  className?: string;
  showBreakdown?: boolean;
}

export function PricingDisplay({ pricing, className, showBreakdown = false }: PricingDisplayProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: pricing.currency,
    }).format(amount);
  };

  return (
    <div className={cn('card', 'animate-scale-in', className)}>
      <div className="card-header">
        <h3 className="text-lg font-semibold text-gray-900">Pricing Details</h3>
      </div>
      
      <div className="card-body">
        <div className="space-y-4">
          {/* Base Price */}
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600">Base Price</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(pricing.basePrice)}
            </span>
          </div>
          
          {/* Price per person indicator */}
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {pricing.pricePerPerson ? 'Per Person' : 'Total Package'}
            </span>
          </div>
          
          {showBreakdown && (
            <>
              {/* Group Discounts */}
              {pricing.groupDiscounts.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Group Discounts</h4>
                  <div className="space-y-2">
                    {pricing.groupDiscounts.map((discount, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {discount.minGroupSize}+ people
                          {discount.maxGroupSize && ` (max ${discount.maxGroupSize})`}
                        </span>
                        <span className="font-medium text-green-600">
                          -{discount.discountPercentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Seasonal Pricing */}
              {pricing.seasonalPricing.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Seasonal Pricing</h4>
                  <div className="space-y-2">
                    {pricing.seasonalPricing.map((season, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{season.season}</span>
                        <span className={cn(
                          'font-medium',
                          season.priceMultiplier > 1 ? 'text-red-600' : 'text-green-600'
                        )}>
                          {season.priceMultiplier > 1 ? '+' : ''}
                          {((season.priceMultiplier - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Taxes */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(pricing.taxes.gst + pricing.taxes.serviceTax + pricing.taxes.tourismTax)}
                  </span>
                </div>
              </div>
            </>
          )}
          
          {/* Final Price */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-700">Total Price</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(pricing.basePrice)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              * Final price may vary based on group size and season
            </p>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <button className="btn btn-primary w-full">
          Get Quote
        </button>
      </div>
    </div>
  );
}

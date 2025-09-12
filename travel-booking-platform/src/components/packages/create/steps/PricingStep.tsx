'use client';

import { useState } from 'react';
import { StepProps } from '@/lib/types/wizard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function PricingStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext, 
  onPrevious 
}: StepProps) {
  const [basePrice, setBasePrice] = useState(formData.pricing?.basePrice || 0);

  const handlePriceChange = (value: string) => {
    const price = parseFloat(value) || 0;
    setBasePrice(price);
    updateFormData({
      pricing: {
        ...formData.pricing,
        basePrice: price,
        currency: 'USD',
        pricePerPerson: true,
        groupDiscounts: [],
        seasonalPricing: [],
        inclusions: [],
        taxes: { gst: 0, serviceTax: 0, tourismTax: 0, other: [] },
        fees: { bookingFee: 0, processingFee: 0, cancellationFee: 0, other: [] }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pricing & Commission
        </h2>
        <p className="text-gray-600">
          Set your package pricing and commission structure
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Base Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="basePrice">Base Price (USD) *</Label>
            <Input
              id="basePrice"
              type="number"
              min="0"
              step="0.01"
              value={basePrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="Enter base price"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              This is the base price per person for your package
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={basePrice <= 0}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue to Media
        </Button>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabasePackageWizard } from '@/hooks/useSupabasePackageWizard';
import { WizardStep, StepProps } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  X,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  FileText,
  DollarSign,
  Clock,
  Users,
  MapPin,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompactPackageWizardProps {
  className?: string;
}

// Package types for selection
const packageTypes = [
  { value: PackageType.ACTIVITY, label: 'Activity', description: 'Single or multiple activities' },
  { value: PackageType.TRANSFERS, label: 'Transfers', description: 'Transportation services' },
  { value: PackageType.MULTI_CITY_PACKAGE, label: 'Multi City Package', description: 'Multi-day tours without accommodation' },
  { value: PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL, label: 'Multi City Package with Hotel', description: 'Complete packages with accommodation' },
  { value: PackageType.FIXED_DEPARTURE_WITH_FLIGHT, label: 'Fixed Departure with Flight', description: 'Pre-scheduled group tours with flights' }
];

// Simple step components embedded directly
function PackageTypeStep({ formData, updateFormData, onNext }: StepProps) {
  const [selectedType, setSelectedType] = useState<PackageType>(formData.type || PackageType.ACTIVITY);

  const handleTypeChange = (type: PackageType) => {
    setSelectedType(type);
    updateFormData({ ...formData, type });
  };

  const handleNext = () => {
    updateFormData({ ...formData, type: selectedType });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Package Type</h2>
        <p className="text-lg text-gray-600">Select the type of package you want to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packageTypes.map((pkgType) => (
          <Card
            key={pkgType.value}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:shadow-lg',
              selectedType === pkgType.value
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            )}
            onClick={() => handleTypeChange(pkgType.value)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">{pkgType.label}</h3>
                {selectedType === pkgType.value && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-600">{pkgType.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function BasicInfoStep({ formData, updateFormData, onNext, onPrevious }: StepProps) {
  const [localData, setLocalData] = useState({
    title: formData.title || '',
    description: formData.description || '',
    shortDescription: formData.shortDescription || '',
    place: formData.place || '',
    duration: formData.duration || { days: 1, nights: 0 },
    groupSize: formData.groupSize || { min: 1, max: 10, ideal: 4 }
  });

  useEffect(() => {
    updateFormData({ ...formData, ...localData });
  }, [localData, updateFormData]);

  const handleNext = () => {
    updateFormData({ ...formData, ...localData });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Package Information</h2>
        <p className="text-lg text-gray-600">Provide basic details about your package</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Package Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Package Title *</Label>
              <Input
                id="title"
                value={localData.title}
                onChange={(e) => setLocalData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter package title..."
              />
            </div>
            <div>
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                value={localData.shortDescription}
                onChange={(e) => setLocalData(prev => ({ ...prev, shortDescription: e.target.value }))}
                placeholder="Brief description..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                value={localData.description}
                onChange={(e) => setLocalData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location & Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="place">Primary Location *</Label>
              <Input
                id="place"
                value={localData.place}
                onChange={(e) => setLocalData(prev => ({ ...prev, place: e.target.value }))}
                placeholder="e.g., Bali, Indonesia"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="days">Days *</Label>
                <Input
                  id="days"
                  type="number"
                  min="1"
                  value={localData.duration.days}
                  onChange={(e) => setLocalData(prev => ({ 
                    ...prev, 
                    duration: { ...prev.duration, days: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="nights">Nights *</Label>
                <Input
                  id="nights"
                  type="number"
                  min="0"
                  value={localData.duration.nights}
                  onChange={(e) => setLocalData(prev => ({ 
                    ...prev, 
                    duration: { ...prev.duration, nights: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="minGroup">Min Group</Label>
                <Input
                  id="minGroup"
                  type="number"
                  min="1"
                  value={localData.groupSize.min}
                  onChange={(e) => setLocalData(prev => ({ 
                    ...prev, 
                    groupSize: { ...prev.groupSize, min: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="maxGroup">Max Group</Label>
                <Input
                  id="maxGroup"
                  type="number"
                  min="1"
                  value={localData.groupSize.max}
                  onChange={(e) => setLocalData(prev => ({ 
                    ...prev, 
                    groupSize: { ...prev.groupSize, max: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="idealGroup">Ideal Group</Label>
                <Input
                  id="idealGroup"
                  type="number"
                  min="1"
                  value={localData.groupSize.ideal}
                  onChange={(e) => setLocalData(prev => ({ 
                    ...prev, 
                    groupSize: { ...prev.groupSize, ideal: parseInt(e.target.value) || 0 }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function LocationTimingStep({ formData, updateFormData, onNext, onPrevious }: StepProps) {
  const [localData, setLocalData] = useState({
    place: formData.place || '',
    pickupPoints: formData.pickupPoints || [''],
    durationHours: formData.durationHours || 0,
    startTime: formData.startTime || '',
    endTime: formData.endTime || '',
    timingNotes: formData.timingNotes || ''
  });

  useEffect(() => {
    updateFormData({ ...formData, ...localData });
  }, [localData, updateFormData]);

  const handleNext = () => {
    updateFormData({ ...formData, ...localData });
    onNext();
  };

  const addPickupPoint = () => {
    setLocalData(prev => ({
      ...prev,
      pickupPoints: [...prev.pickupPoints, '']
    }));
  };

  const removePickupPoint = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      pickupPoints: prev.pickupPoints.filter((_, i) => i !== index)
    }));
  };

  const updatePickupPoint = (index: number, value: string) => {
    setLocalData(prev => ({
      ...prev,
      pickupPoints: prev.pickupPoints.map((point, i) => i === index ? value : point)
    }));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Location & Timing</h2>
        <p className="text-lg text-gray-600">Set the location and timing details for your activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="place">Primary Location *</Label>
              <Input
                id="place"
                value={localData.place}
                onChange={(e) => setLocalData(prev => ({ ...prev, place: e.target.value }))}
                placeholder="e.g., Bali, Indonesia"
              />
            </div>
            
            <div>
              <Label>Pickup Points *</Label>
              {localData.pickupPoints.map((point, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={point}
                    onChange={(e) => updatePickupPoint(index, e.target.value)}
                    placeholder={`Pickup point ${index + 1}`}
                  />
                  {localData.pickupPoints.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePickupPoint(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPickupPoint}
                className="w-full"
              >
                + Add Pickup Point
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timing Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="durationHours">Duration (Hours) *</Label>
              <Input
                id="durationHours"
                type="number"
                min="1"
                value={localData.durationHours}
                onChange={(e) => setLocalData(prev => ({ ...prev, durationHours: parseInt(e.target.value) || 0 }))}
                placeholder="e.g., 4"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={localData.startTime}
                  onChange={(e) => setLocalData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={localData.endTime}
                  onChange={(e) => setLocalData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="timingNotes">Timing Notes *</Label>
              <Textarea
                id="timingNotes"
                value={localData.timingNotes}
                onChange={(e) => setLocalData(prev => ({ ...prev, timingNotes: e.target.value }))}
                placeholder="Additional timing information..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function DetailedPlanningStep({ formData, updateFormData, onNext, onPrevious }: StepProps) {
  const [localData, setLocalData] = useState({
    vehicleType: formData.vehicleType || '',
    acNonAc: formData.acNonAc || '',
    fuelInclusion: formData.fuelInclusion || false,
    difficulty: formData.difficulty || 'MODERATE'
  });

  useEffect(() => {
    updateFormData({ ...formData, ...localData });
  }, [localData, updateFormData]);

  const handleNext = () => {
    updateFormData({ ...formData, ...localData });
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Detailed Planning</h2>
        <p className="text-lg text-gray-600">Configure transportation and activity details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transportation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select
                value={localData.vehicleType}
                onValueChange={(value) => setLocalData(prev => ({ ...prev, vehicleType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="boat">Boat</SelectItem>
                  <SelectItem value="bicycle">Bicycle</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="acNonAc">AC/Non-AC *</Label>
              <Select
                value={localData.acNonAc}
                onValueChange={(value) => setLocalData(prev => ({ ...prev, acNonAc: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AC option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ac">AC</SelectItem>
                  <SelectItem value="non-ac">Non-AC</SelectItem>
                  <SelectItem value="both">Both Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fuelInclusion"
                checked={localData.fuelInclusion}
                onChange={(e) => setLocalData(prev => ({ ...prev, fuelInclusion: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="fuelInclusion">Fuel Included</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="difficulty">Difficulty Level *</Label>
              <Select
                value={localData.difficulty}
                onValueChange={(value) => setLocalData(prev => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MODERATE">Moderate</SelectItem>
                  <SelectItem value="CHALLENGING">Challenging</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Activity Information</h4>
              <p className="text-sm text-blue-800">
                This activity package includes transportation and basic planning. 
                Additional details can be added in the next steps.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function InclusionsExclusionsStep({ formData, updateFormData, onNext, onPrevious }: StepProps) {
  const [localData, setLocalData] = useState({
    tourInclusions: formData.tourInclusions || [''],
    mealInclusions: formData.mealInclusions || [''],
    entryTickets: formData.entryTickets || [''],
    guideServices: formData.guideServices || [''],
    tourExclusions: formData.tourExclusions || [''],
    personalExpenses: formData.personalExpenses || [''],
    optionalActivities: formData.optionalActivities || ['']
  });

  useEffect(() => {
    updateFormData({ ...formData, ...localData });
  }, [localData, updateFormData]);

  const handleNext = () => {
    updateFormData({ ...formData, ...localData });
    onNext();
  };

  const addItem = (field: keyof typeof localData) => {
    setLocalData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeItem = (field: keyof typeof localData, index: number) => {
    setLocalData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateItem = (field: keyof typeof localData, index: number, value: string) => {
    setLocalData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const renderListField = (field: keyof typeof localData, label: string, placeholder: string) => (
    <div>
      <Label>{label} *</Label>
      {localData[field].map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <Input
            value={item}
            onChange={(e) => updateItem(field, index, e.target.value)}
            placeholder={placeholder}
          />
          {localData[field].length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(field, index)}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addItem(field)}
        className="w-full"
      >
        + Add {label.slice(0, -1)}
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Inclusions & Exclusions</h2>
        <p className="text-lg text-gray-600">Define what's included and excluded in your activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>What's Included</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderListField('tourInclusions', 'Tour Inclusions', 'e.g., Transportation, Guide')}
            {renderListField('mealInclusions', 'Meal Inclusions', 'e.g., Breakfast, Lunch')}
            {renderListField('entryTickets', 'Entry Tickets', 'e.g., Museum entry, Park fees')}
            {renderListField('guideServices', 'Guide Services', 'e.g., Professional guide, Local expert')}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What's Excluded</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderListField('tourExclusions', 'Tour Exclusions', 'e.g., Personal expenses, Tips')}
            {renderListField('personalExpenses', 'Personal Expenses', 'e.g., Shopping, Personal items')}
            {renderListField('optionalActivities', 'Optional Activities', 'e.g., Additional tours, Upgrades')}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext}>
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

function PricingStep({ formData, updateFormData, onNext, onPrevious, onPublish }: StepProps) {
  const [localData, setLocalData] = useState({
    basePrice: formData.basePrice || 0,
    currency: formData.currency || 'USD',
    cancellationPolicy: formData.cancellationPolicy || 'moderate'
  });

  useEffect(() => {
    updateFormData({ ...formData, ...localData });
  }, [localData, updateFormData]);

  const handlePublish = async () => {
    updateFormData({ ...formData, ...localData });
    await onPublish();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Pricing & Review</h2>
        <p className="text-lg text-gray-600">Set your pricing and review your package</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="basePrice">Base Price *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={localData.basePrice}
                  onChange={(e) => setLocalData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={localData.currency}
                  onValueChange={(value) => setLocalData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <Select
                value={localData.cancellationPolicy}
                onValueChange={(value) => setLocalData(prev => ({ ...prev, cancellationPolicy: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="strict">Strict</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{formData.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Title:</span>
                <span>{formData.title || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{formData.place || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{formData.duration?.days || 0} days, {formData.duration?.nights || 0} nights</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Group Size:</span>
                <span>{formData.groupSize?.min || 0} - {formData.groupSize?.max || 0} people</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span className="font-bold">{localData.currency} {localData.basePrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="w-4 h-4 mr-2" />
          Publish Package
        </Button>
      </div>
    </div>
  );
}

export default function CompactPackageWizard({ className }: CompactPackageWizardProps) {
  const router = useRouter();
  
  // Use the existing wizard hook
  const {
    currentStep,
    steps,
    formData,
    isDirty,
    isSaving,
    lastSaved,
    errors,
    isValid,
    actions,
    form
  } = useSupabasePackageWizard();

  const {
    goToStep,
    nextStep,
    previousStep,
    updateFormData,
    saveDraft,
    publishPackage,
    resetWizard
  } = actions;

  // Simple step mapping
  const stepComponents = {
    'package-type': PackageTypeStep,
    'basic-info': BasicInfoStep,
    'location-timing': LocationTimingStep,
    'detailed-planning': DetailedPlanningStep,
    'inclusions-exclusions': InclusionsExclusionsStep,
    'pricing-policies': PricingStep,
    'review': PricingStep
  };

  const CurrentStepComponent = stepComponents[currentStep as keyof typeof stepComponents];

  const handleNextStep = () => {
    if (nextStep) {
      nextStep();
    }
  };

  const handlePreviousStep = () => {
    if (previousStep) {
      previousStep();
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveDraft();
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handlePublishPackage = async () => {
    try {
      await publishPackage();
      router.push('/operator/packages');
    } catch (error) {
      console.error('Error publishing package:', error);
    }
  };

  const handleResetWizard = () => {
    resetWizard();
  };

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${className || ''}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Package
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create amazing travel packages with our streamlined process.
          </p>
        </motion.div>

        {/* Simple Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 'package-type', icon: Sparkles, title: 'Package Type', color: 'blue' },
              { step: 'basic-info', icon: FileText, title: 'Basic Info', color: 'green' },
              { step: 'pricing-policies', icon: DollarSign, title: 'Pricing', color: 'purple' }
            ].map((stepInfo, index) => {
              const IconComponent = stepInfo.icon;
              const isActive = currentStep === stepInfo.step;
              const isCompleted = ['package-type', 'basic-info', 'location-timing', 'detailed-planning', 'inclusions-exclusions'].includes(currentStep) && 
                                 ['package-type', 'basic-info', 'location-timing', 'detailed-planning', 'inclusions-exclusions'].indexOf(currentStep) > 
                                 ['package-type', 'basic-info', 'location-timing', 'detailed-planning', 'inclusions-exclusions'].indexOf(stepInfo.step);
              
              return (
                <div key={stepInfo.step} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive
                        ? `bg-${stepInfo.color}-600 text-white shadow-lg scale-110`
                        : isCompleted
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-200 text-gray-400"
                    )}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="mt-3 text-center">
                    <h3 className={cn(
                      "text-sm font-medium",
                      isActive ? `text-${stepInfo.color}-600` : "text-gray-600"
                    )}>
                      {stepInfo.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isDirty && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            {isSaving && (
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Clock className="w-3 h-3 mr-1" />
                Saving...
              </Badge>
            )}
            {lastSaved && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Saved {new Date(lastSaved).toLocaleTimeString()}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={isSaving || !isDirty}
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetWizard}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            {CurrentStepComponent && (
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                isValid={isValid}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
                onPublish={handlePublishPackage}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Current Step: {currentStep} • 
            {isValid ? (
              <span className="text-green-600 ml-1">Ready to continue</span>
            ) : (
              <span className="text-red-600 ml-1">Please complete required fields</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
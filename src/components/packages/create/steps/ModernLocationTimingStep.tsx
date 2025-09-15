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
import { 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  X,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Field visibility matrix based on package type
const FIELD_VISIBILITY = {
  [PackageType.ACTIVITY]: {
    place: true,
    fromLocation: false,
    toLocation: false,
    multipleDestinations: false,
    pickupPoints: true,
    durationHours: true,
    durationDays: false,
    startTime: true,
    endTime: true,
    timingNotes: true
  },
  [PackageType.TRANSFERS]: {
    place: true,
    fromLocation: true,
    toLocation: true,
    multipleDestinations: false,
    pickupPoints: true,
    durationHours: true,
    durationDays: false,
    startTime: true,
    endTime: false,
    timingNotes: true
  },
  [PackageType.LAND_PACKAGE]: {
    place: true,
    fromLocation: true,
    toLocation: true,
    multipleDestinations: true,
    pickupPoints: true,
    durationHours: false,
    durationDays: true,
    startTime: true,
    endTime: false,
    timingNotes: true
  },
  [PackageType.LAND_PACKAGE_WITH_HOTEL]: {
    place: true,
    fromLocation: true,
    toLocation: true,
    multipleDestinations: true,
    pickupPoints: true,
    durationHours: false,
    durationDays: true,
    startTime: true,
    endTime: false,
    timingNotes: true
  },
  [PackageType.FIXED_DEPARTURE_WITH_FLIGHT]: {
    place: true,
    fromLocation: true,
    toLocation: true,
    multipleDestinations: true,
    pickupPoints: true,
    durationHours: false,
    durationDays: true,
    startTime: true,
    endTime: false,
    timingNotes: true
  },
  [PackageType.DAY_TOUR]: {
    place: true,
    fromLocation: true,
    toLocation: true,
    multipleDestinations: false,
    pickupPoints: true,
    durationHours: true,
    durationDays: false,
    startTime: true,
    endTime: true,
    timingNotes: true
  },
  [PackageType.MULTI_CITY_TOUR]: {
    place: true,
    fromLocation: false,
    toLocation: false,
    multipleDestinations: true,
    pickupPoints: true,
    durationHours: false,
    durationDays: true,
    startTime: true,
    endTime: false,
    timingNotes: true
  }
};

export default function ModernLocationTimingStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  
  const [localData, setLocalData] = useState({
    place: formData.place || '',
    fromLocation: formData.fromLocation || '',
    toLocation: formData.toLocation || '',
    multipleDestinations: formData.multipleDestinations || [],
    pickupPoints: formData.pickupPoints || [],
    durationHours: formData.durationHours || 0,
    durationDays: formData.durationDays || 0,
    startTime: formData.startTime || '',
    endTime: formData.endTime || '',
    timingNotes: formData.timingNotes || '',
    newDestination: '',
    newPickupPoint: ''
  });

  const packageType = formData.type;
  const visibleFields = packageType ? FIELD_VISIBILITY[packageType] : {};

  useEffect(() => {
    updateFormData(localData);
  }, [localData]);

  const handleInputChange = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addDestination = () => {
    if (localData.newDestination.trim()) {
      setLocalData(prev => ({
        ...prev,
        multipleDestinations: [...prev.multipleDestinations, prev.newDestination.trim()],
        newDestination: ''
      }));
    }
  };

  const removeDestination = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      multipleDestinations: prev.multipleDestinations.filter((_, i) => i !== index)
    }));
  };

  const addPickupPoint = () => {
    if (localData.newPickupPoint.trim()) {
      setLocalData(prev => ({
        ...prev,
        pickupPoints: [...prev.pickupPoints, prev.newPickupPoint.trim()],
        newPickupPoint: ''
      }));
    }
  };

  const removePickupPoint = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      pickupPoints: prev.pickupPoints.filter((_, i) => i !== index)
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
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Location & Timing
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Tell us where your package takes place and when it runs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Location Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Location Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Place/Destination */}
            <div>
              <Label htmlFor="place" className="text-sm font-medium text-gray-700">
                Main Place/Destination *
              </Label>
              <Input
                id="place"
                value={localData.place}
                onChange={(e) => handleInputChange('place', e.target.value)}
                placeholder="e.g., Paris, France"
                className="mt-1"
              />
              {errors.place && (
                <p className="text-red-500 text-sm mt-1">{errors.place[0]}</p>
              )}
            </div>

            {/* From Location */}
            {visibleFields.fromLocation && (
              <div>
                <Label htmlFor="fromLocation" className="text-sm font-medium text-gray-700">
                  From Location
                </Label>
                <Input
                  id="fromLocation"
                  value={localData.fromLocation}
                  onChange={(e) => handleInputChange('fromLocation', e.target.value)}
                  placeholder="e.g., Airport, Hotel, City Center"
                  className="mt-1"
                />
              </div>
            )}

            {/* To Location */}
            {visibleFields.toLocation && (
              <div>
                <Label htmlFor="toLocation" className="text-sm font-medium text-gray-700">
                  To Location
                </Label>
                <Input
                  id="toLocation"
                  value={localData.toLocation}
                  onChange={(e) => handleInputChange('toLocation', e.target.value)}
                  placeholder="e.g., Hotel, Attraction, City Center"
                  className="mt-1"
                />
              </div>
            )}

            {/* Multiple Destinations */}
            {visibleFields.multipleDestinations && (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Multiple Destinations
                </Label>
                <div className="space-y-2 mt-1">
                  {localData.multipleDestinations.map((destination, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="secondary" className="flex-1 justify-start">
                        {destination}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDestination(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      value={localData.newDestination}
                      onChange={(e) => handleInputChange('newDestination', e.target.value)}
                      placeholder="Add destination..."
                      className="flex-1"
                    />
                    <Button onClick={addDestination} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Pickup Points */}
            {visibleFields.pickupPoints && (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Pickup Points *
                </Label>
                <div className="space-y-2 mt-1">
                  {localData.pickupPoints.map((point, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="outline" className="flex-1 justify-start">
                        {point}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePickupPoint(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      value={localData.newPickupPoint}
                      onChange={(e) => handleInputChange('newPickupPoint', e.target.value)}
                      placeholder="Add pickup point..."
                      className="flex-1"
                    />
                    <Button onClick={addPickupPoint} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {errors.pickupPoints && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupPoints[0]}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timing Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Timing Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              {visibleFields.durationHours && (
                <div>
                  <Label htmlFor="durationHours" className="text-sm font-medium text-gray-700">
                    Duration (Hours)
                  </Label>
                  <Input
                    id="durationHours"
                    type="number"
                    value={localData.durationHours}
                    onChange={(e) => handleInputChange('durationHours', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              )}
              {visibleFields.durationDays && (
                <div>
                  <Label htmlFor="durationDays" className="text-sm font-medium text-gray-700">
                    Duration (Days)
                  </Label>
                  <Input
                    id="durationDays"
                    type="number"
                    value={localData.durationDays}
                    onChange={(e) => handleInputChange('durationDays', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {/* Start Time */}
            {visibleFields.startTime && (
              <div>
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={localData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            {/* End Time */}
            {visibleFields.endTime && (
              <div>
                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={localData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            {/* Timing Notes */}
            {visibleFields.timingNotes && (
              <div>
                <Label htmlFor="timingNotes" className="text-sm font-medium text-gray-700">
                  Timing Notes *
                </Label>
                <Textarea
                  id="timingNotes"
                  value={localData.timingNotes}
                  onChange={(e) => handleInputChange('timingNotes', e.target.value)}
                  placeholder="Any special timing requirements, flexibility, or notes..."
                  className="mt-1"
                  rows={3}
                />
                {errors.timingNotes && (
                  <p className="text-red-500 text-sm mt-1">{errors.timingNotes[0]}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Package Type Specific Info */}
      {packageType && (
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
                    {packageType.replace(/_/g, ' ')} Package Requirements
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {packageType === PackageType.ACTIVITY && (
                      <p>• Specify duration in hours and exact start/end times</p>
                    )}
                    {packageType === PackageType.TRANSFERS && (
                      <p>• Include both from and to locations for point-to-point transfers</p>
                    )}
                    {packageType === PackageType.DAY_TOUR && (
                      <p>• Complete day tour with start and end times, plus duration</p>
                    )}
                    {(packageType === PackageType.LAND_PACKAGE || 
                      packageType === PackageType.LAND_PACKAGE_WITH_HOTEL || 
                      packageType === PackageType.FIXED_DEPARTURE_WITH_FLIGHT) && (
                      <p>• Multi-day packages require duration in days and multiple destinations</p>
                    )}
                    {packageType === PackageType.MULTI_CITY_TOUR && (
                      <p>• Multi-city tours focus on multiple destinations and inter-city travel</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Next: Detailed Planning
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}

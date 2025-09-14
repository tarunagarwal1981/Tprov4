'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StepProps } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Car,
  Building,
  Plane,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Star,
  Globe,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPackageTypeInfo } from '@/lib/packageTypeInfo';

export default function ModernReviewStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const packageTypeInfo = formData.type ? getPackageTypeInfo(formData.type) : null;

  const handlePrevious = () => {
    onPrevious();
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onNext(); // This will trigger the publishPackage function
    } finally {
      setIsPublishing(false);
    }
  };

  const getFieldVisibility = (packageType: PackageType) => {
    const visibility = {
      [PackageType.ACTIVITY]: {
        durationHours: true,
        durationDays: false,
        fromLocation: false,
        toLocation: false,
        multipleDestinations: false,
        hotelCategory: false,
        flightDetails: false
      },
      [PackageType.TRANSFERS]: {
        durationHours: true,
        durationDays: false,
        fromLocation: true,
        toLocation: true,
        multipleDestinations: false,
        hotelCategory: false,
        flightDetails: false
      },
      [PackageType.LAND_PACKAGE]: {
        durationHours: false,
        durationDays: true,
        fromLocation: true,
        toLocation: true,
        multipleDestinations: true,
        hotelCategory: false,
        flightDetails: false
      },
      [PackageType.LAND_PACKAGE_WITH_HOTEL]: {
        durationHours: false,
        durationDays: true,
        fromLocation: true,
        toLocation: true,
        multipleDestinations: true,
        hotelCategory: true,
        flightDetails: false
      },
      [PackageType.FIXED_DEPARTURE_WITH_FLIGHT]: {
        durationHours: false,
        durationDays: true,
        fromLocation: true,
        toLocation: true,
        multipleDestinations: true,
        hotelCategory: true,
        flightDetails: true
      },
      [PackageType.DAY_TOUR]: {
        durationHours: true,
        durationDays: false,
        fromLocation: true,
        toLocation: true,
        multipleDestinations: false,
        hotelCategory: false,
        flightDetails: false
      },
      [PackageType.MULTI_CITY_TOUR]: {
        durationHours: false,
        durationDays: true,
        fromLocation: false,
        toLocation: false,
        multipleDestinations: true,
        hotelCategory: true,
        flightDetails: false
      }
    };
    return visibility[packageType] || {};
  };

  const visibleFields = formData.type ? getFieldVisibility(formData.type) : {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Review & Publish
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Review your package details before publishing. Make sure everything looks perfect!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Package Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Package Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  packageTypeInfo ? `bg-gradient-to-r ${packageTypeInfo.gradient}` : "bg-gray-200"
                )}>
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {formData.title || 'Untitled Package'}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {packageTypeInfo?.title} Package
                  </p>
                  <p className="text-sm text-gray-500">
                    {formData.shortDescription || formData.description || 'No description provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Timing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Location & Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Main Destination</span>
                  <p className="text-gray-900">{formData.place || 'Not specified'}</p>
                </div>
                
                {visibleFields.fromLocation && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">From Location</span>
                    <p className="text-gray-900">{formData.fromLocation || 'Not specified'}</p>
                  </div>
                )}
                
                {visibleFields.toLocation && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">To Location</span>
                    <p className="text-gray-900">{formData.toLocation || 'Not specified'}</p>
                  </div>
                )}
                
                {visibleFields.durationHours && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                    <p className="text-gray-900">{formData.durationHours || 0} hours</p>
                  </div>
                )}
                
                {visibleFields.durationDays && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration</span>
                    <p className="text-gray-900">{formData.durationDays || 0} days</p>
                  </div>
                )}
                
                {formData.startTime && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Start Time</span>
                    <p className="text-gray-900">{formData.startTime}</p>
                  </div>
                )}
                
                {formData.endTime && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">End Time</span>
                    <p className="text-gray-900">{formData.endTime}</p>
                  </div>
                )}
              </div>
              
              {formData.pickupPoints && formData.pickupPoints.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Pickup Points</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.pickupPoints.map((point, index) => (
                      <Badge key={index} variant="outline">{point}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {formData.multipleDestinations && formData.multipleDestinations.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Destinations</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.multipleDestinations.map((destination, index) => (
                      <Badge key={index} variant="secondary">{destination}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transportation */}
          {(formData.vehicleType || formData.acNonAc || formData.driverDetails) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-blue-600" />
                  Transportation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.vehicleType && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Vehicle Type</span>
                      <p className="text-gray-900">{formData.vehicleType}</p>
                    </div>
                  )}
                  
                  {formData.acNonAc && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">AC/Non-AC</span>
                      <p className="text-gray-900">{formData.acNonAc}</p>
                    </div>
                  )}
                  
                  {formData.fuelInclusion && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Fuel</span>
                      <p className="text-gray-900">Included</p>
                    </div>
                  )}
                </div>
                
                {formData.driverDetails && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Driver Details</span>
                    <p className="text-gray-900">{formData.driverDetails}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Accommodation */}
          {visibleFields.hotelCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-orange-600" />
                  Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.hotelCategory && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Hotel Category</span>
                      <p className="text-gray-900">{formData.hotelCategory}</p>
                    </div>
                  )}
                  
                  {formData.roomType && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Room Type</span>
                      <p className="text-gray-900">{formData.roomType}</p>
                    </div>
                  )}
                </div>
                
                {formData.hotelNameOptions && formData.hotelNameOptions.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Hotel Options</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.hotelNameOptions.map((hotel, index) => (
                        <Badge key={index} variant="outline">{hotel}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {formData.checkInCheckOut && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Check-in/Check-out</span>
                    <p className="text-gray-900">{formData.checkInCheckOut}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Flight Details */}
          {visibleFields.flightDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plane className="w-5 h-5 mr-2 text-sky-600" />
                  Flight Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.departureAirport && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Departure Airport</span>
                      <p className="text-gray-900">{formData.departureAirport}</p>
                    </div>
                  )}
                  
                  {formData.arrivalAirport && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Arrival Airport</span>
                      <p className="text-gray-900">{formData.arrivalAirport}</p>
                    </div>
                  )}
                  
                  {formData.flightClass && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Flight Class</span>
                      <p className="text-gray-900">{formData.flightClass}</p>
                    </div>
                  )}
                  
                  {formData.airlinePreference && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Airline Preference</span>
                      <p className="text-gray-900">{formData.airlinePreference}</p>
                    </div>
                  )}
                </div>
                
                {formData.baggageAllowance && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Baggage Allowance</span>
                    <p className="text-gray-900">{formData.baggageAllowance}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
      </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Pricing Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Adult Price</span>
                <span className="font-semibold">{formData.currency} {formData.adultPrice || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Child Price</span>
                <span className="font-semibold">{formData.currency} {formData.childPrice || 0}</span>
              </div>
              {formData.infantPrice && formData.infantPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Infant Price</span>
                  <span className="font-semibold">{formData.currency} {formData.infantPrice}</span>
                </div>
              )}
              {formData.seniorCitizenPrice && formData.seniorCitizenPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Senior Price</span>
                  <span className="font-semibold">{formData.currency} {formData.seniorCitizenPrice}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Group Size */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Group Size
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Minimum</span>
                <span className="font-semibold">{formData.minGroupSize || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Maximum</span>
                <span className="font-semibold">{formData.maxGroupSize || 10}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Advance Booking</span>
                <span className="font-semibold">{formData.advanceBookingDays || 7} days</span>
              </div>
            </CardContent>
          </Card>

          {/* Validity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Validity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Start Date</span>
                <p className="font-semibold">{formData.validityDates?.startDate || 'Not set'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">End Date</span>
                <p className="font-semibold">{formData.validityDates?.endDate || 'Not set'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Inclusions Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                Key Inclusions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {formData.tourInclusions && formData.tourInclusions.slice(0, 3).map((inclusion, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{inclusion}</span>
                </div>
              ))}
              {formData.tourInclusions && formData.tourInclusions.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{formData.tourInclusions.length - 3} more inclusions
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Validation Status */}
      {Object.keys(errors).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">
                    Please fix the following issues:
                  </h3>
                  <ul className="space-y-1 text-sm text-red-700">
                    {Object.entries(errors).map(([field, messages]) => (
                      <li key={field} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {field}: {messages.join(', ')}
                      </li>
                    ))}
                  </ul>
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
          onClick={handlePublish}
          disabled={isPublishing || Object.keys(errors).length > 0}
          size="lg"
          className={cn(
            "px-8 py-3",
            isPublishing || Object.keys(errors).length > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          )}
        >
          {isPublishing ? (
            <>
              <Clock className="w-5 h-5 mr-2 animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Star className="w-5 h-5 mr-2" />
          Publish Package
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
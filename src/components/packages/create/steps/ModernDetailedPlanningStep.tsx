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
  Clock, 
  Car, 
  Building, 
  Plane, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  X,
  Info,
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Utensils
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Field visibility matrix for detailed planning
const PLANNING_FIELDS = {
  [PackageType.ACTIVITY]: {
    itinerary: false,
    activitiesPerDay: false,
    mealPlanPerDay: false,
    freeTimeLeisure: false,
    hotelCategory: false,
    roomType: false,
    hotelNameOptions: false,
    checkInCheckOut: false,
    vehicleType: true,
    acNonAc: true,
    driverDetails: false,
    fuelInclusion: true,
    departureAirport: false,
    arrivalAirport: false,
    flightClass: false,
    airlinePreference: false,
    baggageAllowance: false
  },
  [PackageType.TRANSFERS]: {
    itinerary: false,
    activitiesPerDay: false,
    mealPlanPerDay: false,
    freeTimeLeisure: false,
    hotelCategory: false,
    roomType: false,
    hotelNameOptions: false,
    checkInCheckOut: false,
    vehicleType: true,
    acNonAc: true,
    driverDetails: true,
    fuelInclusion: true,
    departureAirport: false,
    arrivalAirport: false,
    flightClass: false,
    airlinePreference: false,
    baggageAllowance: false
  },
  [PackageType.LAND_PACKAGE]: {
    itinerary: true,
    activitiesPerDay: true,
    mealPlanPerDay: true,
    freeTimeLeisure: true,
    hotelCategory: false,
    roomType: false,
    hotelNameOptions: false,
    checkInCheckOut: false,
    vehicleType: true,
    acNonAc: true,
    driverDetails: true,
    fuelInclusion: true,
    departureAirport: false,
    arrivalAirport: false,
    flightClass: false,
    airlinePreference: false,
    baggageAllowance: false
  },
  [PackageType.LAND_PACKAGE_WITH_HOTEL]: {
    itinerary: true,
    activitiesPerDay: true,
    mealPlanPerDay: true,
    freeTimeLeisure: true,
    hotelCategory: true,
    roomType: true,
    hotelNameOptions: true,
    checkInCheckOut: true,
    vehicleType: true,
    acNonAc: true,
    driverDetails: true,
    fuelInclusion: true,
    departureAirport: false,
    arrivalAirport: false,
    flightClass: false,
    airlinePreference: false,
    baggageAllowance: false
  },
  [PackageType.FIXED_DEPARTURE_WITH_FLIGHT]: {
    itinerary: true,
    activitiesPerDay: true,
    mealPlanPerDay: true,
    freeTimeLeisure: true,
    hotelCategory: true,
    roomType: true,
    hotelNameOptions: true,
    checkInCheckOut: true,
    vehicleType: true,
    acNonAc: true,
    driverDetails: true,
    fuelInclusion: true,
    departureAirport: true,
    arrivalAirport: true,
    flightClass: true,
    airlinePreference: true,
    baggageAllowance: true
  },
  [PackageType.DAY_TOUR]: {
    itinerary: true,
    activitiesPerDay: true,
    mealPlanPerDay: true,
    freeTimeLeisure: true,
    hotelCategory: false,
    roomType: false,
    hotelNameOptions: false,
    checkInCheckOut: false,
    vehicleType: true,
    acNonAc: true,
    driverDetails: true,
    fuelInclusion: true,
    departureAirport: false,
    arrivalAirport: false,
    flightClass: false,
    airlinePreference: false,
    baggageAllowance: false
  },
  [PackageType.MULTI_CITY_TOUR]: {
    itinerary: true,
    activitiesPerDay: true,
    mealPlanPerDay: true,
    freeTimeLeisure: true,
    hotelCategory: true,
    roomType: true,
    hotelNameOptions: true,
    checkInCheckOut: true,
    vehicleType: true,
    acNonAc: true,
    driverDetails: true,
    fuelInclusion: true,
    departureAirport: false,
    arrivalAirport: false,
    flightClass: false,
    airlinePreference: false,
    baggageAllowance: false
  }
};

export default function ModernDetailedPlanningStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  const [localData, setLocalData] = useState({
    itinerary: formData.itinerary || [],
    activitiesPerDay: formData.activitiesPerDay || [],
    mealPlanPerDay: formData.mealPlanPerDay || [],
    freeTimeLeisure: formData.freeTimeLeisure || [],
    hotelCategory: formData.hotelCategory || '',
    roomType: formData.roomType || '',
    hotelNameOptions: formData.hotelNameOptions || [],
    checkInCheckOut: formData.checkInCheckOut || '',
    vehicleType: formData.vehicleType || '',
    acNonAc: formData.acNonAc || '',
    driverDetails: formData.driverDetails || '',
    fuelInclusion: formData.fuelInclusion || false,
    departureAirport: formData.departureAirport || '',
    arrivalAirport: formData.arrivalAirport || '',
    flightClass: formData.flightClass || '',
    airlinePreference: formData.airlinePreference || '',
    baggageAllowance: formData.baggageAllowance || '',
    newActivity: '',
    newMeal: '',
    newFreeTime: '',
    newHotel: ''
  });

  const packageType = formData.type;
  const visibleFields = packageType ? PLANNING_FIELDS[packageType] : {};

  useEffect(() => {
    updateFormData(localData);
  }, [localData]);

  const handleInputChange = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addActivity = () => {
    if (localData.newActivity.trim()) {
      setLocalData(prev => ({
        ...prev,
        activitiesPerDay: [...prev.activitiesPerDay, prev.newActivity.trim()],
        newActivity: ''
      }));
    }
  };

  const removeActivity = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      activitiesPerDay: prev.activitiesPerDay.filter((_, i) => i !== index)
    }));
  };

  const addMeal = () => {
    if (localData.newMeal.trim()) {
      setLocalData(prev => ({
        ...prev,
        mealPlanPerDay: [...prev.mealPlanPerDay, prev.newMeal.trim()],
        newMeal: ''
      }));
    }
  };

  const removeMeal = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      mealPlanPerDay: prev.mealPlanPerDay.filter((_, i) => i !== index)
    }));
  };

  const addFreeTime = () => {
    if (localData.newFreeTime.trim()) {
      setLocalData(prev => ({
        ...prev,
        freeTimeLeisure: [...prev.freeTimeLeisure, prev.newFreeTime.trim()],
        newFreeTime: ''
      }));
    }
  };

  const removeFreeTime = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      freeTimeLeisure: prev.freeTimeLeisure.filter((_, i) => i !== index)
    }));
  };

  const addHotel = () => {
    if (localData.newHotel.trim()) {
      setLocalData(prev => ({
        ...prev,
        hotelNameOptions: [...prev.hotelNameOptions, prev.newHotel.trim()],
        newHotel: ''
      }));
    }
  };

  const removeHotel = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      hotelNameOptions: prev.hotelNameOptions.filter((_, i) => i !== index)
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
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Detailed Planning
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Plan the detailed experience for your {packageType?.replace(/_/g, ' ').toLowerCase()} package.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Itinerary & Activities */}
        {(visibleFields.itinerary || visibleFields.activitiesPerDay || visibleFields.mealPlanPerDay || visibleFields.freeTimeLeisure) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Itinerary & Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Activities per Day */}
              {visibleFields.activitiesPerDay && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Activities per Day
                  </Label>
                  <div className="space-y-2 mt-1">
                    {localData.activitiesPerDay.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Badge variant="secondary" className="flex-1 justify-start">
                          {activity}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActivity(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Input
                        value={localData.newActivity}
                        onChange={(e) => handleInputChange('newActivity', e.target.value)}
                        placeholder="Add activity..."
                        className="flex-1"
                      />
                      <Button onClick={addActivity} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Meal Plan per Day */}
              {visibleFields.mealPlanPerDay && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Meal Plan per Day
                  </Label>
                  <div className="space-y-2 mt-1">
                    {localData.mealPlanPerDay.map((meal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Badge variant="outline" className="flex-1 justify-start">
                          <Utensils className="w-3 h-3 mr-1" />
                          {meal}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMeal(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Input
                        value={localData.newMeal}
                        onChange={(e) => handleInputChange('newMeal', e.target.value)}
                        placeholder="Add meal plan..."
                        className="flex-1"
                      />
                      <Button onClick={addMeal} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Free Time/Leisure */}
              {visibleFields.freeTimeLeisure && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Free Time/Leisure Activities
                  </Label>
                  <div className="space-y-2 mt-1">
                    {localData.freeTimeLeisure.map((freeTime, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Badge variant="secondary" className="flex-1 justify-start">
                          {freeTime}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFreeTime(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Input
                        value={localData.newFreeTime}
                        onChange={(e) => handleInputChange('newFreeTime', e.target.value)}
                        placeholder="Add free time activity..."
                        className="flex-1"
                      />
                      <Button onClick={addFreeTime} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Transportation */}
        {(visibleFields.vehicleType || visibleFields.acNonAc || visibleFields.driverDetails || visibleFields.fuelInclusion) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="w-5 h-5 mr-2 text-blue-600" />
                Transportation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Type */}
              {visibleFields.vehicleType && (
                <div>
                  <Label htmlFor="vehicleType" className="text-sm font-medium text-gray-700">
                    Vehicle Type *
                  </Label>
                  <Select value={localData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="minivan">Minivan</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="coach">Coach</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="luxury">Luxury Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.vehicleType && (
                    <p className="text-red-500 text-sm mt-1">{errors.vehicleType[0]}</p>
                  )}
                </div>
              )}

              {/* AC/Non-AC */}
              {visibleFields.acNonAc && (
                <div>
                  <Label htmlFor="acNonAc" className="text-sm font-medium text-gray-700">
                    AC/Non-AC *
                  </Label>
                  <Select value={localData.acNonAc} onValueChange={(value) => handleInputChange('acNonAc', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select AC option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ac">Air Conditioned</SelectItem>
                      <SelectItem value="non-ac">Non-AC</SelectItem>
                      <SelectItem value="both">Both Available</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.acNonAc && (
                    <p className="text-red-500 text-sm mt-1">{errors.acNonAc[0]}</p>
                  )}
                </div>
              )}

              {/* Driver Details */}
              {visibleFields.driverDetails && (
                <div>
                  <Label htmlFor="driverDetails" className="text-sm font-medium text-gray-700">
                    Driver Details
                  </Label>
                  <Textarea
                    id="driverDetails"
                    value={localData.driverDetails}
                    onChange={(e) => handleInputChange('driverDetails', e.target.value)}
                    placeholder="Driver experience, languages spoken, special services..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              )}

              {/* Fuel Inclusion */}
              {visibleFields.fuelInclusion && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fuelInclusion"
                    checked={localData.fuelInclusion}
                    onChange={(e) => handleInputChange('fuelInclusion', e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="fuelInclusion" className="text-sm font-medium text-gray-700">
                    Fuel included in price
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Accommodation Section */}
      {(visibleFields.hotelCategory || visibleFields.roomType || visibleFields.hotelNameOptions || visibleFields.checkInCheckOut) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2 text-orange-600" />
              Accommodation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hotel Category */}
              {visibleFields.hotelCategory && (
                <div>
                  <Label htmlFor="hotelCategory" className="text-sm font-medium text-gray-700">
                    Hotel Category
                  </Label>
                  <Select value={localData.hotelCategory} onValueChange={(value) => handleInputChange('hotelCategory', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select hotel category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="5-star">5-Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Room Type */}
              {visibleFields.roomType && (
                <div>
                  <Label htmlFor="roomType" className="text-sm font-medium text-gray-700">
                    Room Type
                  </Label>
                  <Select value={localData.roomType} onValueChange={(value) => handleInputChange('roomType', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="twin">Twin</SelectItem>
                      <SelectItem value="triple">Triple</SelectItem>
                      <SelectItem value="quad">Quad</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Hotel Name Options */}
            {visibleFields.hotelNameOptions && (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Hotel Name/Options
                </Label>
                <div className="space-y-2 mt-1">
                  {localData.hotelNameOptions.map((hotel, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="outline" className="flex-1 justify-start">
                        <Building className="w-3 h-3 mr-1" />
                        {hotel}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeHotel(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      value={localData.newHotel}
                      onChange={(e) => handleInputChange('newHotel', e.target.value)}
                      placeholder="Add hotel option..."
                      className="flex-1"
                    />
                    <Button onClick={addHotel} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Check-in/Check-out */}
            {visibleFields.checkInCheckOut && (
              <div>
                <Label htmlFor="checkInCheckOut" className="text-sm font-medium text-gray-700">
                  Check-in/Check-out Policy
                </Label>
                <Textarea
                  id="checkInCheckOut"
                  value={localData.checkInCheckOut}
                  onChange={(e) => handleInputChange('checkInCheckOut', e.target.value)}
                  placeholder="Check-in/check-out times, policies, requirements..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Flight Details Section */}
      {(visibleFields.departureAirport || visibleFields.arrivalAirport || visibleFields.flightClass || visibleFields.airlinePreference || visibleFields.baggageAllowance) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plane className="w-5 h-5 mr-2 text-sky-600" />
              Flight Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Departure Airport */}
              {visibleFields.departureAirport && (
                <div>
                  <Label htmlFor="departureAirport" className="text-sm font-medium text-gray-700">
                    Departure Airport
                  </Label>
                  <Input
                    id="departureAirport"
                    value={localData.departureAirport}
                    onChange={(e) => handleInputChange('departureAirport', e.target.value)}
                    placeholder="e.g., JFK, LAX, Heathrow"
                    className="mt-1"
                  />
                </div>
              )}

              {/* Arrival Airport */}
              {visibleFields.arrivalAirport && (
                <div>
                  <Label htmlFor="arrivalAirport" className="text-sm font-medium text-gray-700">
                    Arrival Airport
                  </Label>
                  <Input
                    id="arrivalAirport"
                    value={localData.arrivalAirport}
                    onChange={(e) => handleInputChange('arrivalAirport', e.target.value)}
                    placeholder="e.g., CDG, FCO, Narita"
                    className="mt-1"
                  />
                </div>
              )}

              {/* Flight Class */}
              {visibleFields.flightClass && (
                <div>
                  <Label htmlFor="flightClass" className="text-sm font-medium text-gray-700">
                    Flight Class
                  </Label>
                  <Select value={localData.flightClass} onValueChange={(value) => handleInputChange('flightClass', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select flight class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy</SelectItem>
                      <SelectItem value="premium-economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="first">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Airline Preference */}
              {visibleFields.airlinePreference && (
                <div>
                  <Label htmlFor="airlinePreference" className="text-sm font-medium text-gray-700">
                    Airline Preference
                  </Label>
                  <Input
                    id="airlinePreference"
                    value={localData.airlinePreference}
                    onChange={(e) => handleInputChange('airlinePreference', e.target.value)}
                    placeholder="e.g., Emirates, Lufthansa, Air France"
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {/* Baggage Allowance */}
            {visibleFields.baggageAllowance && (
              <div>
                <Label htmlFor="baggageAllowance" className="text-sm font-medium text-gray-700">
                  Baggage Allowance
                </Label>
                <Textarea
                  id="baggageAllowance"
                  value={localData.baggageAllowance}
                  onChange={(e) => handleInputChange('baggageAllowance', e.target.value)}
                  placeholder="Checked baggage allowance, carry-on limits, weight restrictions..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>
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
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Next: Inclusions & Exclusions
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
}

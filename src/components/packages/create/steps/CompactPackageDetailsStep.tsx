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
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Settings,
  FileText,
  Utensils,
  Ticket,
  UserCheck,
  Shield,
  Car,
  Building,
  Plane
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Field visibility matrix based on package type
const FIELD_VISIBILITY = {
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
    baggageAllowance: false,
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: false,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: false
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
    baggageAllowance: false,
    tourInclusions: true,
    mealInclusions: false,
    entryTickets: false,
    guideServices: false,
    insurance: false,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: false,
    visaDocumentation: false
  },
  [PackageType.MULTI_CITY_PACKAGE]: {
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
    baggageAllowance: false,
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: true,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: true
  },
  [PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL]: {
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
    baggageAllowance: false,
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: true,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: true
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
    baggageAllowance: true,
    tourInclusions: true,
    mealInclusions: true,
    entryTickets: true,
    guideServices: true,
    insurance: true,
    tourExclusions: true,
    personalExpenses: true,
    optionalActivities: true,
    visaDocumentation: true
  }
};

const vehicleTypes = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'minivan', label: 'Minivan' },
  { value: 'bus', label: 'Bus' },
  { value: 'coach', label: 'Coach' },
  { value: 'private_car', label: 'Private Car' }
];

const hotelCategories = [
  { value: 'budget', label: 'Budget (2-3 Star)' },
  { value: 'midrange', label: 'Mid-range (3-4 Star)' },
  { value: 'luxury', label: 'Luxury (4-5 Star)' },
  { value: 'boutique', label: 'Boutique' },
  { value: 'resort', label: 'Resort' }
];

const roomTypes = [
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'twin', label: 'Twin' },
  { value: 'triple', label: 'Triple' },
  { value: 'quad', label: 'Quad' },
  { value: 'suite', label: 'Suite' }
];

const flightClasses = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First Class' }
];

export default function CompactPackageDetailsStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  
  const [localData, setLocalData] = useState({
    // Detailed Planning
    itinerary: formData.itinerary || [],
    activitiesPerDay: formData.activitiesPerDay || [],
    mealPlanPerDay: formData.mealPlanPerDay || [],
    freeTimeLeisure: formData.freeTimeLeisure || [],
    
    // Accommodation
    hotelCategory: formData.hotelCategory || '',
    roomType: formData.roomType || '',
    hotelNameOptions: formData.hotelNameOptions || [],
    checkInCheckOut: formData.checkInCheckOut || '',
    
    // Transportation
    vehicleType: formData.vehicleType || '',
    acNonAc: formData.acNonAc || 'ac',
    driverDetails: formData.driverDetails || '',
    fuelInclusion: formData.fuelInclusion || true,
    
    // Flights
    departureAirport: formData.departureAirport || '',
    arrivalAirport: formData.arrivalAirport || '',
    flightClass: formData.flightClass || '',
    airlinePreference: formData.airlinePreference || '',
    baggageAllowance: formData.baggageAllowance || '',
    
    // Inclusions & Exclusions
    tourInclusions: formData.tourInclusions || [],
    mealInclusions: formData.mealInclusions || [],
    entryTickets: formData.entryTickets || [],
    guideServices: formData.guideServices || [],
    insurance: formData.insurance || [],
    tourExclusions: formData.tourExclusions || [],
    personalExpenses: formData.personalExpenses || [],
    optionalActivities: formData.optionalActivities || [],
    visaDocumentation: formData.visaDocumentation || []
  });

  const [activeSection, setActiveSection] = useState<'planning' | 'inclusions'>('planning');
  const [newItem, setNewItem] = useState('');
  const [newHotelOption, setNewHotelOption] = useState('');

  useEffect(() => {
    updateFormData(localData);
  }, [localData, updateFormData]);

  const handleInputChange = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: string, value: string) => {
    if (value.trim()) {
      setLocalData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev], value.trim()]
      }));
      setNewItem('');
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    setLocalData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: any, i: number) => i !== index)
    }));
  };

  const addHotelOption = () => {
    if (newHotelOption.trim()) {
      setLocalData(prev => ({
        ...prev,
        hotelNameOptions: [...prev.hotelNameOptions, newHotelOption.trim()]
      }));
      setNewHotelOption('');
    }
  };

  const removeHotelOption = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      hotelNameOptions: prev.hotelNameOptions.filter((_, i) => i !== index)
    }));
  };

  const packageType = formData.type as PackageType;
  const visibleFields = FIELD_VISIBILITY[packageType] || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Package Details
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Add detailed planning information, accommodations, transportation, and define what's included and excluded in your package.
        </p>
      </motion.div>

      {/* Progress Sections */}
      <div className="flex justify-center">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'planning', label: 'Planning & Logistics', icon: Calendar },
            { id: 'inclusions', label: 'Inclusions & Exclusions', icon: CheckCircle }
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

      {/* Planning & Logistics */}
      {activeSection === 'planning' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Detailed Planning */}
              {visibleFields.itinerary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      Detailed Itinerary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add itinerary item..."
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('itinerary', newItem)}
                      />
                      <Button onClick={() => addArrayItem('itinerary', newItem)} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {localData.itinerary.length > 0 && (
                      <div className="space-y-2">
                        {localData.itinerary.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm">{item}</span>
                            <button
                              onClick={() => removeArrayItem('itinerary', index)}
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
              )}

              {/* Transportation */}
              {visibleFields.vehicleType && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Car className="w-5 h-5 mr-2 text-blue-600" />
                      Transportation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Vehicle Type</Label>
                      <Select
                        value={localData.vehicleType}
                        onValueChange={(value) => handleInputChange('vehicleType', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          {vehicleTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">AC/Non-AC</Label>
                      <Select
                        value={localData.acNonAc}
                        onValueChange={(value) => handleInputChange('acNonAc', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ac">AC</SelectItem>
                          <SelectItem value="non-ac">Non-AC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {visibleFields.driverDetails && (
                      <div>
                        <Label htmlFor="driverDetails" className="text-sm font-medium">
                          Driver Details
                        </Label>
                        <Textarea
                          id="driverDetails"
                          value={localData.driverDetails}
                          onChange={(e) => handleInputChange('driverDetails', e.target.value)}
                          placeholder="Driver information, experience, etc."
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="fuelInclusion"
                        checked={localData.fuelInclusion}
                        onChange={(e) => handleInputChange('fuelInclusion', e.target.checked)}
                        className="rounded border-gray-300 h-4 w-4"
                      />
                      <Label htmlFor="fuelInclusion" className="text-sm font-medium">
                        Fuel Included
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Accommodation */}
              {visibleFields.hotelCategory && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building className="w-5 h-5 mr-2 text-blue-600" />
                      Accommodation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Hotel Category</Label>
                      <Select
                        value={localData.hotelCategory}
                        onValueChange={(value) => handleInputChange('hotelCategory', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select hotel category" />
                        </SelectTrigger>
                        <SelectContent>
                          {hotelCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Room Type</Label>
                      <Select
                        value={localData.roomType}
                        onValueChange={(value) => handleInputChange('roomType', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Hotel Options</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          value={newHotelOption}
                          onChange={(e) => setNewHotelOption(e.target.value)}
                          placeholder="Add hotel name..."
                          onKeyPress={(e) => e.key === 'Enter' && addHotelOption()}
                        />
                        <Button onClick={addHotelOption} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {localData.hotelNameOptions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {localData.hotelNameOptions.map((hotel, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                              <span>{hotel}</span>
                              <button
                                onClick={() => removeHotelOption(index)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="checkInCheckOut" className="text-sm font-medium">
                        Check-in/Check-out Details
                      </Label>
                      <Textarea
                        id="checkInCheckOut"
                        value={localData.checkInCheckOut}
                        onChange={(e) => handleInputChange('checkInCheckOut', e.target.value)}
                        placeholder="Check-in/check-out times and policies..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Flights */}
              {visibleFields.departureAirport && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plane className="w-5 h-5 mr-2 text-blue-600" />
                      Flight Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="departureAirport" className="text-sm font-medium">
                          Departure Airport
                        </Label>
                        <Input
                          id="departureAirport"
                          value={localData.departureAirport}
                          onChange={(e) => handleInputChange('departureAirport', e.target.value)}
                          placeholder="e.g., JFK"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="arrivalAirport" className="text-sm font-medium">
                          Arrival Airport
                        </Label>
                        <Input
                          id="arrivalAirport"
                          value={localData.arrivalAirport}
                          onChange={(e) => handleInputChange('arrivalAirport', e.target.value)}
                          placeholder="e.g., LAX"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Flight Class</Label>
                      <Select
                        value={localData.flightClass}
                        onValueChange={(value) => handleInputChange('flightClass', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select flight class" />
                        </SelectTrigger>
                        <SelectContent>
                          {flightClasses.map((flightClass) => (
                            <SelectItem key={flightClass.value} value={flightClass.value}>
                              {flightClass.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="airlinePreference" className="text-sm font-medium">
                        Airline Preference
                      </Label>
                      <Input
                        id="airlinePreference"
                        value={localData.airlinePreference}
                        onChange={(e) => handleInputChange('airlinePreference', e.target.value)}
                        placeholder="e.g., Emirates, Singapore Airlines"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="baggageAllowance" className="text-sm font-medium">
                        Baggage Allowance
                      </Label>
                      <Input
                        id="baggageAllowance"
                        value={localData.baggageAllowance}
                        onChange={(e) => handleInputChange('baggageAllowance', e.target.value)}
                        placeholder="e.g., 23kg checked, 7kg carry-on"
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Inclusions & Exclusions */}
      {activeSection === 'inclusions' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inclusions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {visibleFields.tourInclusions && (
                  <div>
                    <Label className="text-sm font-medium">Tour Inclusions</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add inclusion..."
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('tourInclusions', newItem)}
                      />
                      <Button onClick={() => addArrayItem('tourInclusions', newItem)} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {localData.tourInclusions.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {localData.tourInclusions.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                            <span className="text-sm text-green-800">{item}</span>
                            <button
                              onClick={() => removeArrayItem('tourInclusions', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {visibleFields.mealInclusions && (
                  <div>
                    <Label className="text-sm font-medium">Meal Inclusions</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add meal inclusion..."
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('mealInclusions', newItem)}
                      />
                      <Button onClick={() => addArrayItem('mealInclusions', newItem)} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {localData.mealInclusions.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {localData.mealInclusions.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                            <span className="text-sm text-green-800">{item}</span>
                            <button
                              onClick={() => removeArrayItem('mealInclusions', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {visibleFields.entryTickets && (
                  <div>
                    <Label className="text-sm font-medium">Entry Tickets</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add entry ticket..."
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('entryTickets', newItem)}
                      />
                      <Button onClick={() => addArrayItem('entryTickets', newItem)} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {localData.entryTickets.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {localData.entryTickets.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                            <span className="text-sm text-green-800">{item}</span>
                            <button
                              onClick={() => removeArrayItem('entryTickets', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {visibleFields.guideServices && (
                  <div>
                    <Label className="text-sm font-medium">Guide Services</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add guide service..."
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('guideServices', newItem)}
                      />
                      <Button onClick={() => addArrayItem('guideServices', newItem)} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {localData.guideServices.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {localData.guideServices.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                            <span className="text-sm text-green-800">{item}</span>
                            <button
                              onClick={() => removeArrayItem('guideServices', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {visibleFields.insurance && (
                  <div>
                    <Label className="text-sm font-medium">Insurance</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add insurance coverage..."
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('insurance', newItem)}
                      />
                      <Button onClick={() => addArrayItem('insurance', newItem)} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {localData.insurance.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {localData.insurance.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                            <span className="text-sm text-green-800">{item}</span>
                            <button
                              onClick={() => removeArrayItem('insurance', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exclusions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  What's Not Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Tour Exclusions</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Add exclusion..."
                      onKeyPress={(e) => e.key === 'Enter' && addArrayItem('tourExclusions', newItem)}
                    />
                    <Button onClick={() => addArrayItem('tourExclusions', newItem)} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {localData.tourExclusions.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {localData.tourExclusions.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                          <span className="text-sm text-red-800">{item}</span>
                          <button
                            onClick={() => removeArrayItem('tourExclusions', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium">Personal Expenses</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Add personal expense..."
                      onKeyPress={(e) => e.key === 'Enter' && addArrayItem('personalExpenses', newItem)}
                    />
                    <Button onClick={() => addArrayItem('personalExpenses', newItem)} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {localData.personalExpenses.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {localData.personalExpenses.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                          <span className="text-sm text-red-800">{item}</span>
                          <button
                            onClick={() => removeArrayItem('personalExpenses', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {visibleFields.optionalActivities && (
                  <div>
                    <Label className="text-sm font-medium">Optional Activities</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add optional activity..."
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('optionalActivities', newItem)}
                      />
                      <Button onClick={() => addArrayItem('optionalActivities', newItem)} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {localData.optionalActivities.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {localData.optionalActivities.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                            <span className="text-sm text-red-800">{item}</span>
                            <button
                              onClick={() => removeArrayItem('optionalActivities', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {visibleFields.visaDocumentation && (
                  <div>
                    <Label className="text-sm font-medium">Visa & Documentation</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Add visa/documentation requirement..."
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('visaDocumentation', newItem)}
                      />
                      <Button onClick={() => addArrayItem('visaDocumentation', newItem)} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {localData.visaDocumentation.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {localData.visaDocumentation.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                            <span className="text-sm text-red-800">{item}</span>
                            <button
                              onClick={() => removeArrayItem('visaDocumentation', index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
          {activeSection !== 'inclusions' && (
            <Button
              onClick={() => {
                const sections = ['planning', 'inclusions'];
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
          
          {activeSection === 'inclusions' && (
            <Button
              onClick={onNext}
              disabled={!isValid}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 flex items-center"
            >
              Continue to Pricing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
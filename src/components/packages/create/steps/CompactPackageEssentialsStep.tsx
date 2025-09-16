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
import MultiSelect from '@/components/ui/MultiSelect';
import { 
  Sparkles,
  FileText,
  MapPin,
  Clock,
  Users,
  Target,
  Tag,
  Star,
  Check,
  Activity,
  Car,
  Building,
  Plane,
  Settings,
  ArrowRight,
  ArrowLeft,
  Plus,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPackageTypeInfo } from '@/lib/packageTypeInfo';

const packageTypes = [
  {
    type: PackageType.ACTIVITY,
    title: 'Activity',
    description: 'Single or multiple activities and experiences',
    icon: Activity,
    color: 'green',
    popular: true,
    duration: '1-3 days',
    groupSize: '1-50 people',
    priceRange: '$50 - $500'
  },
  {
    type: PackageType.TRANSFERS,
    title: 'Transfers',
    description: 'Transportation services between locations',
    icon: Car,
    color: 'blue',
    popular: false,
    duration: 'Few hours',
    groupSize: '1-8 people',
    priceRange: '$30 - $200'
  },
  {
    type: PackageType.MULTI_CITY_PACKAGE,
    title: 'Multi City Package',
    description: 'Multi-day tours covering multiple cities without accommodation',
    icon: MapPin,
    color: 'purple',
    popular: true,
    duration: '3-14 days',
    groupSize: '2-20 people',
    priceRange: '$500 - $5000'
  },
  {
    type: PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL,
    title: 'Multi City Package with Hotel',
    description: 'Complete multi-city packages with accommodation included',
    icon: Building,
    color: 'orange',
    popular: true,
    duration: '3-14 days',
    groupSize: '2-20 people',
    priceRange: '$800 - $8000'
  },
  {
    type: PackageType.FIXED_DEPARTURE_WITH_FLIGHT,
    title: 'Fixed Departure with Flight',
    description: 'Pre-scheduled group tours with flights included',
    icon: Plane,
    color: 'sky',
    popular: false,
    duration: '5-21 days',
    groupSize: '10-40 people',
    priceRange: '$1000 - $8000'
  }
];

const difficultyOptions = [
  { value: 'EASY', label: 'Easy', description: 'Suitable for all ages', icon: '🟢' },
  { value: 'MODERATE', label: 'Moderate', description: 'Some physical activity', icon: '🟡' },
  { value: 'CHALLENGING', label: 'Challenging', description: 'Good fitness required', icon: '🟠' },
  { value: 'EXPERT', label: 'Expert', description: 'High fitness & experience', icon: '🔴' }
];

const packageCategories = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'nature', label: 'Nature' },
  { value: 'beach', label: 'Beach' },
  { value: 'city', label: 'City' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'food', label: 'Food & Wine' }
];

const destinationOptions = [
  { value: 'Bali, Indonesia', label: 'Bali, Indonesia' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Italy', label: 'Italy' },
  { value: 'France', label: 'France' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Greece', label: 'Greece' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'India', label: 'India' }
];

export default function CompactPackageEssentialsStep({ 
  formData, 
  updateFormData, 
  errors, 
  isValid, 
  onNext,
  onPrevious
}: StepProps) {
  
  const [localData, setLocalData] = useState({
    type: formData.type || PackageType.ACTIVITY,
    title: formData.title || '',
    description: formData.description || '',
    shortDescription: formData.shortDescription || '',
    destinations: formData.destinations || [],
    duration: formData.duration || { days: 1, nights: 0 },
    groupSize: formData.groupSize || { min: 1, max: 10, ideal: 4 },
    difficulty: formData.difficulty || 'EASY',
    category: formData.category || '',
    isFeatured: formData.isFeatured || false,
    place: formData.place || '',
    fromLocation: formData.fromLocation || '',
    toLocation: formData.toLocation || '',
    multipleDestinations: formData.multipleDestinations || [],
    pickupPoints: formData.pickupPoints || [],
    durationHours: formData.durationHours || 8,
    durationDays: formData.durationDays || 1,
    startTime: formData.startTime || '09:00',
    endTime: formData.endTime || '17:00',
    timingNotes: formData.timingNotes || ''
  });

  const [activeSection, setActiveSection] = useState<'type' | 'basic' | 'location'>('type');
  const [newDestination, setNewDestination] = useState('');
  const [newPickupPoint, setNewPickupPoint] = useState('');

  useEffect(() => {
    updateFormData(localData);
  }, [localData, updateFormData]);

  const handleInputChange = (field: string, value: any) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const addDestination = () => {
    if (newDestination.trim() && !localData.multipleDestinations.includes(newDestination.trim())) {
      setLocalData(prev => ({
        ...prev,
        multipleDestinations: [...prev.multipleDestinations, newDestination.trim()]
      }));
      setNewDestination('');
    }
  };

  const removeDestination = (destination: string) => {
    setLocalData(prev => ({
      ...prev,
      multipleDestinations: prev.multipleDestinations.filter(d => d !== destination)
    }));
  };

  const addPickupPoint = () => {
    if (newPickupPoint.trim() && !localData.pickupPoints.includes(newPickupPoint.trim())) {
      setLocalData(prev => ({
        ...prev,
        pickupPoints: [...prev.pickupPoints, newPickupPoint.trim()]
      }));
      setNewPickupPoint('');
    }
  };

  const removePickupPoint = (point: string) => {
    setLocalData(prev => ({
      ...prev,
      pickupPoints: prev.pickupPoints.filter(p => p !== point)
    }));
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      green: {
        border: isSelected ? 'border-green-500' : 'border-green-200',
        bg: isSelected ? 'bg-green-50' : 'bg-green-25',
        text: 'text-green-900',
        hover: 'hover:bg-green-100',
        ring: isSelected ? 'ring-2 ring-green-200' : ''
      },
      blue: {
        border: isSelected ? 'border-blue-500' : 'border-blue-200',
        bg: isSelected ? 'bg-blue-50' : 'bg-blue-25',
        text: 'text-blue-900',
        hover: 'hover:bg-blue-100',
        ring: isSelected ? 'ring-2 ring-blue-200' : ''
      },
      purple: {
        border: isSelected ? 'border-purple-500' : 'border-purple-200',
        bg: isSelected ? 'bg-purple-50' : 'bg-purple-25',
        text: 'text-purple-900',
        hover: 'hover:bg-purple-100',
        ring: isSelected ? 'ring-2 ring-purple-200' : ''
      },
      orange: {
        border: isSelected ? 'border-orange-500' : 'border-orange-200',
        bg: isSelected ? 'bg-orange-50' : 'bg-orange-25',
        text: 'text-orange-900',
        hover: 'hover:bg-orange-100',
        ring: isSelected ? 'ring-2 ring-orange-200' : ''
      },
      sky: {
        border: isSelected ? 'border-sky-500' : 'border-sky-200',
        bg: isSelected ? 'bg-sky-50' : 'bg-sky-25',
        text: 'text-sky-900',
        hover: 'hover:bg-sky-100',
        ring: isSelected ? 'ring-2 ring-sky-200' : ''
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const packageTypeInfo = localData.type ? getPackageTypeInfo(localData.type) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Package Essentials
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Let's start with the basics. Choose your package type and provide essential information that will help customers understand your offering.
        </p>
      </motion.div>

      {/* Progress Sections */}
      <div className="flex justify-center">
        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'type', label: 'Package Type', icon: Sparkles },
            { id: 'basic', label: 'Basic Info', icon: FileText },
            { id: 'location', label: 'Location & Timing', icon: MapPin }
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

      {/* Package Type Selection */}
      {activeSection === 'type' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packageTypes.map((pkgType) => {
              const IconComponent = pkgType.icon;
              const isSelected = localData.type === pkgType.type;
              const colors = getColorClasses(pkgType.color, isSelected);
              
              return (
                <Card
                  key={pkgType.type}
                  className={cn(
                    'cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1',
                    colors.border,
                    colors.bg,
                    colors.hover,
                    colors.ring,
                    isSelected && 'shadow-lg scale-105'
                  )}
                  onClick={() => handleInputChange('type', pkgType.type)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={cn(
                          'p-2 rounded-lg mr-3',
                          isSelected ? 'bg-white bg-opacity-80' : 'bg-white bg-opacity-60'
                        )}>
                          <IconComponent className={cn('w-6 h-6', colors.text)} />
                        </div>
                        <div>
                          <h3 className={cn('font-bold text-lg', colors.text)}>
                            {pkgType.title}
                          </h3>
                          {pkgType.popular && (
                            <Badge className="bg-yellow-500 text-white text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <p className={cn('text-sm mb-3', colors.text)}>
                      {pkgType.description}
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-current border-opacity-20">
                      <div className="text-center">
                        <Clock className={cn('w-3 h-3 mx-auto mb-1', colors.text)} />
                        <div className={cn('text-xs', colors.text)}>{pkgType.duration}</div>
                      </div>
                      <div className="text-center">
                        <Users className={cn('w-3 h-3 mx-auto mb-1', colors.text)} />
                        <div className={cn('text-xs', colors.text)}>{pkgType.groupSize}</div>
                      </div>
                      <div className="text-center">
                        <MapPin className={cn('w-3 h-3 mx-auto mb-1', colors.text)} />
                        <div className={cn('text-xs', colors.text)}>{pkgType.priceRange}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Basic Information */}
      {activeSection === 'basic' && (
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
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Package Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                      Package Title *
                    </Label>
                    <Input
                      id="title"
                      value={localData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter a compelling package title..."
                      className="mt-1"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title[0]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="shortDescription" className="text-sm font-medium">
                      Short Description *
                    </Label>
                    <Textarea
                      id="shortDescription"
                      value={localData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      placeholder="Brief description for listings..."
                      className="mt-1"
                      rows={3}
                    />
                    {errors.shortDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.shortDescription[0]}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium">
                      Full Description *
                    </Label>
                    <Textarea
                      id="description"
                      value={localData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Detailed description of your package..."
                      className="mt-1"
                      rows={4}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description[0]}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Destinations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MultiSelect
                    options={destinationOptions}
                    value={localData.destinations}
                    onChange={(value) => handleInputChange('destinations', value)}
                    placeholder="Select destinations..."
                    searchPlaceholder="Search destinations..."
                    maxSelections={10}
                    label="Destinations *"
                    error={errors.destinations?.[0]}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    Duration & Group Size
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="days" className="text-sm font-medium">
                        Days *
                      </Label>
                      <Input
                        id="days"
                        type="number"
                        min="1"
                        max="365"
                        value={localData.duration.days}
                        onChange={(e) => handleInputChange('duration', { 
                          ...localData.duration, 
                          days: parseInt(e.target.value) || 0 
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="nights" className="text-sm font-medium">
                        Nights *
                      </Label>
                      <Input
                        id="nights"
                        type="number"
                        min="0"
                        max="364"
                        value={localData.duration.nights}
                        onChange={(e) => handleInputChange('duration', { 
                          ...localData.duration, 
                          nights: parseInt(e.target.value) || 0 
                        })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="minGroup" className="text-sm font-medium">
                        Min *
                      </Label>
                      <Input
                        id="minGroup"
                        type="number"
                        min="1"
                        max="100"
                        value={localData.groupSize.min}
                        onChange={(e) => handleInputChange('groupSize', { 
                          ...localData.groupSize, 
                          min: parseInt(e.target.value) || 0 
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxGroup" className="text-sm font-medium">
                        Max *
                      </Label>
                      <Input
                        id="maxGroup"
                        type="number"
                        min="1"
                        max="100"
                        value={localData.groupSize.max}
                        onChange={(e) => handleInputChange('groupSize', { 
                          ...localData.groupSize, 
                          max: parseInt(e.target.value) || 0 
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="idealGroup" className="text-sm font-medium">
                        Ideal
                      </Label>
                      <Input
                        id="idealGroup"
                        type="number"
                        min="1"
                        max="100"
                        value={localData.groupSize.ideal}
                        onChange={(e) => handleInputChange('groupSize', { 
                          ...localData.groupSize, 
                          ideal: parseInt(e.target.value) || 0 
                        })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Package Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Difficulty Level</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {difficultyOptions.map((option) => (
                        <div
                          key={option.value}
                          className={cn(
                            'p-2 border rounded-lg cursor-pointer transition-all duration-200',
                            localData.difficulty === option.value
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          )}
                          onClick={() => handleInputChange('difficulty', option.value)}
                        >
                          <div className="flex items-center">
                            <span className="text-sm mr-2">{option.icon}</span>
                            <span className="text-xs font-medium">{option.label}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <Select
                      value={localData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {packageCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={localData.isFeatured}
                      onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                      className="rounded border-gray-300 h-4 w-4"
                    />
                    <div>
                      <Label htmlFor="isFeatured" className="text-sm font-medium">
                        Mark as Featured Package
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        Featured packages appear prominently in search results
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      )}

      {/* Location & Timing */}
      {activeSection === 'location' && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="place" className="text-sm font-medium">
                    Primary Location *
                  </Label>
                  <Input
                    id="place"
                    value={localData.place}
                    onChange={(e) => handleInputChange('place', e.target.value)}
                    placeholder="e.g., Bali, Indonesia"
                    className="mt-1"
                  />
                </div>

                {/* Conditional fields based on package type */}
                {localData.type === PackageType.TRANSFERS && (
                  <>
                    <div>
                      <Label htmlFor="fromLocation" className="text-sm font-medium">
                        From Location *
                      </Label>
                      <Input
                        id="fromLocation"
                        value={localData.fromLocation}
                        onChange={(e) => handleInputChange('fromLocation', e.target.value)}
                        placeholder="e.g., Airport Terminal 1"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="toLocation" className="text-sm font-medium">
                        To Location *
                      </Label>
                      <Input
                        id="toLocation"
                        value={localData.toLocation}
                        onChange={(e) => handleInputChange('toLocation', e.target.value)}
                        placeholder="e.g., Hotel in Ubud"
                        className="mt-1"
                      />
                    </div>
                  </>
                )}

                {(localData.type === PackageType.MULTI_CITY_PACKAGE || 
                  localData.type === PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL) && (
                  <div>
                    <Label className="text-sm font-medium">Multiple Destinations</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        value={newDestination}
                        onChange={(e) => setNewDestination(e.target.value)}
                        placeholder="Add destination..."
                        onKeyPress={(e) => e.key === 'Enter' && addDestination()}
                      />
                      <Button onClick={addDestination} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {localData.multipleDestinations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {localData.multipleDestinations.map((destination) => (
                          <Badge key={destination} variant="secondary" className="flex items-center space-x-1">
                            <span>{destination}</span>
                            <button
                              onClick={() => removeDestination(destination)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Pickup Points</Label>
                  <div className="flex space-x-2 mt-1">
                    <Input
                      value={newPickupPoint}
                      onChange={(e) => setNewPickupPoint(e.target.value)}
                      placeholder="Add pickup point..."
                      onKeyPress={(e) => e.key === 'Enter' && addPickupPoint()}
                    />
                    <Button onClick={addPickupPoint} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {localData.pickupPoints.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {localData.pickupPoints.map((point) => (
                        <Badge key={point} variant="secondary" className="flex items-center space-x-1">
                          <span>{point}</span>
                          <button
                            onClick={() => removePickupPoint(point)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timing Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Timing Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Duration based on package type */}
                {localData.type === PackageType.ACTIVITY && (
                  <div>
                    <Label htmlFor="durationHours" className="text-sm font-medium">
                      Duration (Hours) *
                    </Label>
                    <Input
                      id="durationHours"
                      type="number"
                      min="1"
                      max="24"
                      value={localData.durationHours}
                      onChange={(e) => handleInputChange('durationHours', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="startTime" className="text-sm font-medium">
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
                  <div>
                    <Label htmlFor="endTime" className="text-sm font-medium">
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
                </div>

                <div>
                  <Label htmlFor="timingNotes" className="text-sm font-medium">
                    Timing Notes
                  </Label>
                  <Textarea
                    id="timingNotes"
                    value={localData.timingNotes}
                    onChange={(e) => handleInputChange('timingNotes', e.target.value)}
                    placeholder="Any special timing requirements or notes..."
                    className="mt-1"
                    rows={3}
                  />
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
          {activeSection !== 'location' && (
            <Button
              onClick={() => {
                const sections = ['type', 'basic', 'location'];
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
          
          {activeSection === 'location' && (
            <Button
              onClick={onNext}
              disabled={!isValid}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 flex items-center"
            >
              Continue to Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  X,
  Upload,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Star,
  FileText,
  Package,
  Plane,
  Car,
  Building,
  CheckCircle,
  AlertCircle,
  Trash2,
  Bed
} from 'lucide-react';

// Enums - matching your original code structure
export enum PackageType {
  ACTIVITY = 'ACTIVITY',
  TRANSFERS = 'TRANSFERS',
  MULTI_CITY_PACKAGE = 'MULTI_CITY_PACKAGE',
  MULTI_CITY_PACKAGE_WITH_HOTEL = 'MULTI_CITY_PACKAGE_WITH_HOTEL',
  FIXED_DEPARTURE_WITH_FLIGHT = 'FIXED_DEPARTURE_WITH_FLIGHT'
}

// Interfaces - matching your original code structure  
interface PackageFormData {
  type: PackageType;
  
  // Common fields
  name?: string;
  title?: string;
  place?: string;
  description?: string;
  image?: File | string;
  
  // Transfer specific
  from?: string;
  to?: string;
  
  // Activity specific
  timing?: string;
  durationHours?: number;
  inclusions?: string[];
  exclusions?: string[];
  
  // Package specific
  banner?: File | string;
  additionalNotes?: string;
  tourInclusions?: string[];
  tourExclusions?: string[];
  destinations?: string[];
  days?: number;
  itinerary?: DayItinerary[];
  
  // Hotel specific
  hotels?: HotelInfo[];
  
  // Pricing
  pricing?: PricingInfo[];
}

interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  highlights: string[];
}

interface HotelInfo {
  name: string;
  location: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
}

interface PricingInfo {
  adultPrice: number;
  childPrice: number;
  validFrom: string;
  validTo: string;
  notes?: string;
}

// Package type selection component
const PackageTypeSelector = ({ onSelect }: { onSelect: (type: PackageType) => void }) => {
  const packageTypes = [
    {
      type: PackageType.TRANSFERS,
      title: 'Transfers',
      description: 'Airport pickups, city transfers, transportation services',
      icon: Car,
      color: 'blue',
      features: ['Point to point', 'Quick setup', 'Simple pricing']
    },
    {
      type: PackageType.ACTIVITY,
      title: 'Activities',
      description: 'Day trips, tours, experiences, adventure activities',
      icon: Star,
      color: 'green',
      features: ['Duration based', 'Inclusions/exclusions', 'Flexible timing']
    },
    {
      type: PackageType.MULTI_CITY_PACKAGE,
      title: 'Multi City Package',
      description: 'Multi-day tours covering multiple destinations',
      icon: Package,
      color: 'purple',
      features: ['Multiple destinations', 'Day-wise itinerary', 'Tour inclusions']
    },
    {
      type: PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL,
      title: 'Multi City + Hotels',
      description: 'Complete packages with accommodation included',
      icon: Building,
      color: 'orange',
      features: ['Hotels included', 'Full packages', 'End-to-end service']
    },
    {
      type: PackageType.FIXED_DEPARTURE_WITH_FLIGHT,
      title: 'Fixed Departure',
      description: 'Pre-scheduled group tours with fixed dates',
      icon: Plane,
      color: 'red',
      features: ['Fixed dates', 'Group tours', 'International flights']
    }
  ];

  const getColorClasses = (color: string, type: 'bg' | 'text') => {
    const colorMap = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
      red: { bg: 'bg-red-100', text: 'text-red-600' }
    };
    return colorMap[color as keyof typeof colorMap]?.[type] || 'bg-gray-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Create New Package</h1>
        <p className="text-gray-600 text-lg">Choose the type of package you want to create</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packageTypes.map((pkg) => {
          const IconComponent = pkg.icon;
          return (
            <motion.div
              key={pkg.type}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={() => onSelect(pkg.type)}
            >
              <div className={`inline-flex p-3 rounded-xl ${getColorClasses(pkg.color, 'bg')} mb-4`}>
                <IconComponent className={`w-6 h-6 ${getColorClasses(pkg.color, 'text')}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.title}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{pkg.description}</p>
              
              <div className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className={`mt-6 text-center py-2 px-4 rounded-lg ${getColorClasses(pkg.color, 'bg')} ${getColorClasses(pkg.color, 'text')} font-medium text-sm`}>
                Select {pkg.title}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Form components
const FormField = ({ label, required = false, children, error }: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700 flex items-center">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center text-red-600 text-xs mt-1">
        <AlertCircle className="w-3 h-3 mr-1" />
        {error}
      </div>
    )}
  </div>
);

const Input = ({ placeholder, value, onChange, type = "text", ...props }: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  [key: string]: any;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
    {...props}
  />
);

const Textarea = ({ placeholder, value, onChange, rows = 3 }: {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={rows}
    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
  />
);

const Select = ({ value, onChange, options, placeholder }: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-white"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const ImageUpload = ({ onUpload, preview }: {
  onUpload: (file: File) => void;
  preview?: string;
}) => (
  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
    {preview ? (
      <div className="relative">
        <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
        <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    ) : (
      <div>
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
      </div>
    )}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />
  </div>
);

const ListManager = ({ items, onChange, placeholder }: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) => {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
              <span className="text-sm text-gray-700">{item}</span>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PricingSection = ({ pricing, onChange }: {
  pricing: PricingInfo[];
  onChange: (pricing: PricingInfo[]) => void;
}) => {
  const addPricing = () => {
    onChange([
      ...pricing,
      { adultPrice: 0, childPrice: 0, validFrom: '', validTo: '' }
    ]);
  };

  const updatePricing = (index: number, field: keyof PricingInfo, value: any) => {
    const updated = [...pricing];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removePricing = (index: number) => {
    onChange(pricing.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {pricing.map((price, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Price Slab {index + 1}</h4>
            {pricing.length > 1 && (
              <button
                onClick={() => removePricing(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Adult Price" required>
              <Input
                type="number"
                placeholder="0"
                value={price.adultPrice.toString()}
                onChange={(value) => updatePricing(index, 'adultPrice', parseFloat(value) || 0)}
              />
            </FormField>
            <FormField label="Child Price">
              <Input
                type="number"
                placeholder="0"
                value={price.childPrice.toString()}
                onChange={(value) => updatePricing(index, 'childPrice', parseFloat(value) || 0)}
              />
            </FormField>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Valid From" required>
              <Input
                type="date"
                value={price.validFrom}
                onChange={(value) => updatePricing(index, 'validFrom', value)}
              />
            </FormField>
            <FormField label="Valid To" required>
              <Input
                type="date"
                value={price.validTo}
                onChange={(value) => updatePricing(index, 'validTo', value)}
              />
            </FormField>
          </div>
        </div>
      ))}
      
      <button
        onClick={addPricing}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Another Price Slab
      </button>
    </div>
  );
};

// Package type specific forms
const TransferForm = ({ data, onChange }: {
  data: PackageFormData;
  onChange: (data: Partial<PackageFormData>) => void;
}) => {
  const places = [
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'goa', label: 'Goa' },
    { value: 'kerala', label: 'Kerala' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Details</h2>
        <p className="text-gray-600">Create your transfer service</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <FormField label="Transfer Name" required>
          <Input
            placeholder="e.g., Airport to Hotel Transfer"
            value={data.name || ''}
            onChange={(value) => onChange({ name: value })}
          />
        </FormField>

        <FormField label="Place/City" required>
          <Select
            value={data.place || ''}
            onChange={(value) => onChange({ place: value })}
            options={places}
            placeholder="Select city"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="From" required>
            <Input
              placeholder="Starting location"
              value={data.from || ''}
              onChange={(value) => onChange({ from: value })}
            />
          </FormField>
          <FormField label="To" required>
            <Input
              placeholder="Destination"
              value={data.to || ''}
              onChange={(value) => onChange({ to: value })}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea
            placeholder="Describe your transfer service..."
            value={data.description || ''}
            onChange={(value) => onChange({ description: value })}
          />
        </FormField>

        <FormField label="Transfer Image">
          <ImageUpload
            onUpload={(file) => onChange({ image: file })}
            preview={data.image as string}
          />
        </FormField>

        <FormField label="Pricing" required>
          <PricingSection
            pricing={data.pricing || [{ adultPrice: 0, childPrice: 0, validFrom: '', validTo: '' }]}
            onChange={(pricing) => onChange({ pricing })}
          />
        </FormField>
      </div>
    </div>
  );
};

const ActivityForm = ({ data, onChange }: {
  data: PackageFormData;
  onChange: (data: Partial<PackageFormData>) => void;
}) => {
  const places = [
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'goa', label: 'Goa' },
    { value: 'kerala', label: 'Kerala' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Details</h2>
        <p className="text-gray-600">Create your activity or experience</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <FormField label="Activity Name" required>
          <Input
            placeholder="e.g., Mumbai City Walking Tour"
            value={data.name || ''}
            onChange={(value) => onChange({ name: value })}
          />
        </FormField>

        <FormField label="Destination" required>
          <Select
            value={data.place || ''}
            onChange={(value) => onChange({ place: value })}
            options={places}
            placeholder="Select destination"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Timing" required>
            <Input
              placeholder="e.g., 9:00 AM - 5:00 PM"
              value={data.timing || ''}
              onChange={(value) => onChange({ timing: value })}
            />
          </FormField>
          <FormField label="Duration (Hours)" required>
            <Input
              type="number"
              placeholder="8"
              value={data.durationHours?.toString() || ''}
              onChange={(value) => onChange({ durationHours: parseInt(value) || 0 })}
            />
          </FormField>
        </div>

        <FormField label="Description">
          <Textarea
            placeholder="Describe your activity..."
            value={data.description || ''}
            onChange={(value) => onChange({ description: value })}
            rows={4}
          />
        </FormField>

        <FormField label="Inclusions">
          <ListManager
            items={data.inclusions || []}
            onChange={(inclusions) => onChange({ inclusions })}
            placeholder="Add inclusion..."
          />
        </FormField>

        <FormField label="Exclusions">
          <ListManager
            items={data.exclusions || []}
            onChange={(exclusions) => onChange({ exclusions })}
            placeholder="Add exclusion..."
          />
        </FormField>

        <FormField label="Activity Image">
          <ImageUpload
            onUpload={(file) => onChange({ image: file })}
            preview={data.image as string}
          />
        </FormField>

        <FormField label="Pricing" required>
          <PricingSection
            pricing={data.pricing || [{ adultPrice: 0, childPrice: 0, validFrom: '', validTo: '' }]}
            onChange={(pricing) => onChange({ pricing })}
          />
        </FormField>
      </div>
    </div>
  );
};

const MultiCityPackageForm = ({ data, onChange }: {
  data: PackageFormData;
  onChange: (data: Partial<PackageFormData>) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'destinations' | 'itinerary' | 'pricing'>('overview');

  const addItineraryDay = () => {
    const newDay: DayItinerary = {
      day: (data.itinerary?.length || 0) + 1,
      title: '',
      description: '',
      activities: [],
      highlights: []
    };
    onChange({ itinerary: [...(data.itinerary || []), newDay] });
  };

  const updateItineraryDay = (index: number, updates: Partial<DayItinerary>) => {
    const updated = [...(data.itinerary || [])];
    updated[index] = { ...updated[index], ...updates };
    onChange({ itinerary: updated });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'pricing', label: 'Pricing', icon: DollarSign }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Multi City Package</h2>
        <p className="text-gray-600">Create your comprehensive tour package</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <FormField label="Package Title" required>
                <Input
                  placeholder="e.g., Golden Triangle Tour"
                  value={data.title || ''}
                  onChange={(value) => onChange({ title: value })}
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  placeholder="Describe your package..."
                  value={data.description || ''}
                  onChange={(value) => onChange({ description: value })}
                  rows={4}
                />
              </FormField>

              <FormField label="Additional Notes">
                <Textarea
                  placeholder="Any additional information..."
                  value={data.additionalNotes || ''}
                  onChange={(value) => onChange({ additionalNotes: value })}
                />
              </FormField>

              <FormField label="Banner Image">
                <ImageUpload
                  onUpload={(file) => onChange({ banner: file })}
                  preview={data.banner as string}
                />
              </FormField>

              <FormField label="Tour Inclusions">
                <ListManager
                  items={data.tourInclusions || []}
                  onChange={(tourInclusions) => onChange({ tourInclusions })}
                  placeholder="Add inclusion..."
                />
              </FormField>

              <FormField label="Tour Exclusions">
                <ListManager
                  items={data.tourExclusions || []}
                  onChange={(tourExclusions) => onChange({ tourExclusions })}
                  placeholder="Add exclusion..."
                />
              </FormField>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div className="space-y-6">
              <FormField label="Destinations">
                <ListManager
                  items={data.destinations || []}
                  onChange={(destinations) => onChange({ destinations })}
                  placeholder="Add destination..."
                />
              </FormField>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Day-wise Itinerary</h3>
                <button
                  onClick={addItineraryDay}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Day
                </button>
              </div>

              {(data.itinerary || []).map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Day {day.day}</h4>
                    <button
                      onClick={() => {
                        const updated = (data.itinerary || []).filter((_, i) => i !== index);
                        onChange({ itinerary: updated });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <FormField label="Day Title">
                    <Input
                      placeholder="e.g., Arrival in Delhi"
                      value={day.title}
                      onChange={(value) => updateItineraryDay(index, { title: value })}
                    />
                  </FormField>

                  <FormField label="Description">
                    <Textarea
                      placeholder="Describe the day's activities..."
                      value={day.description}
                      onChange={(value) => updateItineraryDay(index, { description: value })}
                    />
                  </FormField>

                  <FormField label="Activities">
                    <ListManager
                      items={day.activities}
                      onChange={(activities) => updateItineraryDay(index, { activities })}
                      placeholder="Add activity..."
                    />
                  </FormField>

                  <FormField label="Highlights">
                    <ListManager
                      items={day.highlights}
                      onChange={(highlights) => updateItineraryDay(index, { highlights })}
                      placeholder="Add highlight..."
                    />
                  </FormField>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <FormField label="Package Pricing" required>
                <PricingSection
                  pricing={data.pricing || [{ adultPrice: 0, childPrice: 0, validFrom: '', validTo: '' }]}
                  onChange={(pricing) => onChange({ pricing })}
                />
              </FormField>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MultiCityPackageWithHotelForm = ({ data, onChange }: {
  data: PackageFormData;
  onChange: (data: Partial<PackageFormData>) => void;
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'destinations' | 'itinerary' | 'hotels' | 'pricing'>('overview');

  const addHotel = () => {
    const newHotel: HotelInfo = {
      name: '',
      location: '',
      checkIn: '',
      checkOut: '',
      roomType: ''
    };
    onChange({ hotels: [...(data.hotels || []), newHotel] });
  };

  const updateHotel = (index: number, updates: Partial<HotelInfo>) => {
    const updated = [...(data.hotels || [])];
    updated[index] = { ...updated[index], ...updates };
    onChange({ hotels: updated });
  };

  const addItineraryDay = () => {
    const newDay: DayItinerary = {
      day: (data.itinerary?.length || 0) + 1,
      title: '',
      description: '',
      activities: [],
      highlights: []
    };
    onChange({ itinerary: [...(data.itinerary || []), newDay] });
  };

  const updateItineraryDay = (index: number, updates: Partial<DayItinerary>) => {
    const updated = [...(data.itinerary || [])];
    updated[index] = { ...updated[index], ...updates };
    onChange({ itinerary: updated });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'hotels', label: 'Hotels', icon: Bed },
    { id: 'pricing', label: 'Pricing', icon: DollarSign }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Multi City Package + Hotels</h2>
        <p className="text-gray-600">Create your complete package with accommodation</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <FormField label="Package Title" required>
                <Input
                  placeholder="e.g., Golden Triangle Tour with Luxury Hotels"
                  value={data.title || ''}
                  onChange={(value) => onChange({ title: value })}
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  placeholder="Describe your package..."
                  value={data.description || ''}
                  onChange={(value) => onChange({ description: value })}
                  rows={4}
                />
              </FormField>

              <FormField label="Banner Image">
                <ImageUpload
                  onUpload={(file) => onChange({ banner: file })}
                  preview={data.banner as string}
                />
              </FormField>

              <FormField label="Tour Inclusions">
                <ListManager
                  items={data.tourInclusions || []}
                  onChange={(tourInclusions) => onChange({ tourInclusions })}
                  placeholder="Add inclusion..."
                />
              </FormField>

              <FormField label="Tour Exclusions">
                <ListManager
                  items={data.tourExclusions || []}
                  onChange={(tourExclusions) => onChange({ tourExclusions })}
                  placeholder="Add exclusion..."
                />
              </FormField>
            </div>
          )}

          {activeTab === 'destinations' && (
            <div className="space-y-6">
              <FormField label="Destinations">
                <ListManager
                  items={data.destinations || []}
                  onChange={(destinations) => onChange({ destinations })}
                  placeholder="Add destination..."
                />
              </FormField>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Day-wise Itinerary</h3>
                <button
                  onClick={addItineraryDay}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Day
                </button>
              </div>

              {(data.itinerary || []).map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Day {day.day}</h4>
                    <button
                      onClick={() => {
                        const updated = (data.itinerary || []).filter((_, i) => i !== index);
                        onChange({ itinerary: updated });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <FormField label="Day Title">
                    <Input
                      placeholder="e.g., Arrival in Delhi"
                      value={day.title}
                      onChange={(value) => updateItineraryDay(index, { title: value })}
                    />
                  </FormField>

                  <FormField label="Description">
                    <Textarea
                      placeholder="Describe the day's activities..."
                      value={day.description}
                      onChange={(value) => updateItineraryDay(index, { description: value })}
                    />
                  </FormField>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'hotels' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Hotel Details</h3>
                <button
                  onClick={addHotel}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Hotel
                </button>
              </div>

              {(data.hotels || []).map((hotel, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Hotel {index + 1}</h4>
                    <button
                      onClick={() => {
                        const updated = (data.hotels || []).filter((_, i) => i !== index);
                        onChange({ hotels: updated });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Hotel Name" required>
                      <Input
                        placeholder="e.g., Taj Palace Hotel"
                        value={hotel.name}
                        onChange={(value) => updateHotel(index, { name: value })}
                      />
                    </FormField>
                    <FormField label="Location" required>
                      <Input
                        placeholder="e.g., New Delhi"
                        value={hotel.location}
                        onChange={(value) => updateHotel(index, { location: value })}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Check-in" required>
                      <Input
                        type="date"
                        value={hotel.checkIn}
                        onChange={(value) => updateHotel(index, { checkIn: value })}
                      />
                    </FormField>
                    <FormField label="Check-out" required>
                      <Input
                        type="date"
                        value={hotel.checkOut}
                        onChange={(value) => updateHotel(index, { checkOut: value })}
                      />
                    </FormField>
                    <FormField label="Room Type" required>
                      <Input
                        placeholder="e.g., Deluxe Room"
                        value={hotel.roomType}
                        onChange={(value) => updateHotel(index, { roomType: value })}
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <FormField label="Package Pricing (Including Hotels)" required>
                <PricingSection
                  pricing={data.pricing || [{ adultPrice: 0, childPrice: 0, validFrom: '', validTo: '' }]}
                  onChange={(pricing) => onChange({ pricing })}
                />
              </FormField>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FixedDepartureForm = ({ data, onChange }: {
  data: PackageFormData;
  onChange: (data: Partial<PackageFormData>) => void;
}) => {
  const addDestination = () => {
    onChange({ destinations: [...(data.destinations || []), ''] });
  };

  const updateDestination = (index: number, value: string) => {
    const updated = [...(data.destinations || [])];
    updated[index] = value;
    onChange({ destinations: updated });
  };

  const removeDestination = (index: number) => {
    const updated = (data.destinations || []).filter((_, i) => i !== index);
    onChange({ destinations: updated });
  };

  const addItineraryDay = () => {
    const newDay: DayItinerary = {
      day: (data.itinerary?.length || 0) + 1,
      title: '',
      description: '',
      activities: [],
      highlights: []
    };
    onChange({ itinerary: [...(data.itinerary || []), newDay] });
  };

  const updateItineraryDay = (index: number, updates: Partial<DayItinerary>) => {
    const updated = [...(data.itinerary || [])];
    updated[index] = { ...updated[index], ...updates };
    onChange({ itinerary: updated });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fixed Departure Package</h2>
        <p className="text-gray-600">Create your pre-scheduled group tour</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <FormField label="Package Title" required>
          <Input
            placeholder="e.g., 15-Day Incredible India Tour"
            value={data.title || ''}
            onChange={(value) => onChange({ title: value })}
          />
        </FormField>

        <FormField label="Package Image">
          <ImageUpload
            onUpload={(file) => onChange({ image: file })}
            preview={data.image as string}
          />
        </FormField>

        <FormField label="Number of Days" required>
          <Input
            type="number"
            placeholder="15"
            value={data.days?.toString() || ''}
            onChange={(value) => onChange({ days: parseInt(value) || 0 })}
          />
        </FormField>

        <FormField label="Destinations">
          <div className="space-y-3">
            {(data.destinations || []).map((destination, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Add destination"
                  value={destination}
                  onChange={(value) => updateDestination(index, value)}
                />
                <button
                  onClick={() => removeDestination(index)}
                  className="px-3 py-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addDestination}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors w-full justify-center"
            >
              <Plus className="w-4 h-4" />
              Add Destination
            </button>
          </div>
        </FormField>

        <FormField label="Day-wise Itinerary">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Itinerary Planning</h4>
              <button
                onClick={addItineraryDay}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Day
              </button>
            </div>

            {(data.itinerary || []).map((day, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium text-gray-900">Day {day.day}</h5>
                  <button
                    onClick={() => {
                      const updated = (data.itinerary || []).filter((_, i) => i !== index);
                      onChange({ itinerary: updated });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Input
                  placeholder="Day summary/title"
                  value={day.title}
                  onChange={(value) => updateItineraryDay(index, { title: value })}
                />

                <Textarea
                  placeholder="Day details and activities"
                  value={day.description}
                  onChange={(value) => updateItineraryDay(index, { description: value })}
                  rows={3}
                />
              </div>
            ))}
          </div>
        </FormField>

        <FormField label="Package Pricing" required>
          <PricingSection
            pricing={data.pricing || [{ adultPrice: 0, childPrice: 0, validFrom: '', validTo: '' }]}
            onChange={(pricing) => onChange({ pricing })}
          />
        </FormField>
      </div>
    </div>
  );
};

// Main wizard component
export default function ModernPackageWizard() {
  const router = useRouter();
  const [step, setStep] = useState<'type' | 'form'>('type');
  const [selectedType, setSelectedType] = useState<PackageType | null>(null);
  const [formData, setFormData] = useState<PackageFormData>({} as PackageFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleTypeSelect = (type: PackageType) => {
    setSelectedType(type);
    setFormData({ 
      type, 
      pricing: [{ adultPrice: 0, childPrice: 0, validFrom: '', validTo: '' }],
      inclusions: [],
      exclusions: [],
      tourInclusions: [],
      tourExclusions: [],
      destinations: [],
      itinerary: [],
      hotels: []
    });
    setStep('form');
  };

  const updateFormData = (updates: Partial<PackageFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name && !formData.title) {
      newErrors.name = 'Name/Title is required';
    }

    // Type-specific validation
    if (formData.type === PackageType.TRANSFERS) {
      if (!formData.place) newErrors.place = 'Place is required';
      if (!formData.from) newErrors.from = 'Starting location is required';
      if (!formData.to) newErrors.to = 'Destination is required';
    }

    if (formData.type === PackageType.ACTIVITY) {
      if (!formData.place) newErrors.place = 'Destination is required';
      if (!formData.timing) newErrors.timing = 'Timing is required';
      if (!formData.durationHours) newErrors.duration = 'Duration is required';
    }

    if (formData.type === PackageType.FIXED_DEPARTURE_WITH_FLIGHT) {
      if (!formData.days) newErrors.days = 'Number of days is required';
      if (!formData.destinations || formData.destinations.length === 0) {
        newErrors.destinations = 'At least one destination is required';
      }
    }

    // Pricing validation
    if (!formData.pricing || formData.pricing.length === 0) {
      newErrors.pricing = 'At least one pricing slab is required';
    } else {
      formData.pricing.forEach((price, index) => {
        if (!price.adultPrice || price.adultPrice <= 0) {
          newErrors[`pricing_${index}_adult`] = 'Adult price is required';
        }
        if (!price.validFrom) {
          newErrors[`pricing_${index}_from`] = 'Valid from date is required';
        }
        if (!price.validTo) {
          newErrors[`pricing_${index}_to`] = 'Valid to date is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Saving package:', formData);
      
      // Show success message
      alert('Package created successfully!');
      
      // Redirect to packages list
      router.push('/operator/packages');
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Error saving package. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderForm = () => {
    switch (selectedType) {
      case PackageType.TRANSFERS:
        return <TransferForm data={formData} onChange={updateFormData} />;
      case PackageType.ACTIVITY:
        return <ActivityForm data={formData} onChange={updateFormData} />;
      case PackageType.MULTI_CITY_PACKAGE:
        return <MultiCityPackageForm data={formData} onChange={updateFormData} />;
      case PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL:
        return <MultiCityPackageWithHotelForm data={formData} onChange={updateFormData} />;
      case PackageType.FIXED_DEPARTURE_WITH_FLIGHT:
        return <FixedDepartureForm data={formData} onChange={updateFormData} />;
      default:
        return <div>Form for {selectedType} coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {step === 'type' && (
          <motion.div
            key="type"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-12"
          >
            <PackageTypeSelector onSelect={handleTypeSelect} />
          </motion.div>
        )}

        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-8"
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setStep('type')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Package Types
                </button>
                
                <div className="flex items-center gap-4">
                  {Object.keys(errors).length > 0 && (
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Please fix errors before saving
                    </div>
                  )}
                  
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Package
                      </>
                    )}
                  </button>
                </div>
              </div>

              {renderForm()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
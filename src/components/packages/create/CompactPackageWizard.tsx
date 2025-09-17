import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Plus, 
  X, 
  Upload,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Calendar,
  FileText,
  Image as ImageIcon,
  Star,
  Info,
  ChevronDown,
  Save,
  Eye,
  AlertCircle
} from 'lucide-react';

// Package Types
const PACKAGE_TYPES = [
  {
    id: 'TRANSFERS',
    title: 'Transfers',
    description: 'Airport pickups, city transfers, transportation services',
    icon: '🚗',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    id: 'ACTIVITY',
    title: 'Activities',
    description: 'Day trips, tours, experiences, adventure activities',
    icon: '🎯',
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  {
    id: 'MULTI_CITY_PACKAGE',
    title: 'Combo Itinerary',
    description: 'Multi-day tours with activities and experiences',
    icon: '🗺️',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  {
    id: 'FIXED_DEPARTURE_WITH_FLIGHT',
    title: 'Fixed Itinerary',
    description: 'Pre-planned tours with fixed schedules',
    icon: '✈️',
    color: 'bg-orange-50 border-orange-200 text-orange-700'
  }
];

// Common Components
const FormField = ({ label, required, children, error, hint }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
    {error && (
      <div className="flex items-center gap-1 text-red-600 text-xs">
        <AlertCircle className="w-3 h-3" />
        {error}
      </div>
    )}
  </div>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${className}`}
    {...props}
  />
);

const Textarea = ({ className = '', ...props }) => (
  <textarea
    className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${className}`}
    {...props}
  />
);

const Select = ({ children, className = '', ...props }) => (
  <div className="relative">
    <select
      className={`w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white ${className}`}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

const ImageUpload = ({ onUpload, preview, label = "Upload Image" }) => (
  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
    {preview ? (
      <div className="relative">
        <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
        <button
          onClick={() => onUpload(null)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ) : (
      <div className="space-y-2">
        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
      </div>
    )}
  </div>
);

const PricingField = ({ pricing, onChange, showChild = true }) => (
  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
    <h4 className="font-medium text-gray-900">Pricing Details</h4>
    <div className="grid grid-cols-2 gap-4">
      <FormField label="Adult Price" required>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="number"
            className="pl-10"
            placeholder="0.00"
            value={pricing.adult || ''}
            onChange={(e) => onChange({ ...pricing, adult: e.target.value })}
          />
        </div>
      </FormField>
      {showChild && (
        <FormField label="Child Price" required>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="number"
              className="pl-10"
              placeholder="0.00"
              value={pricing.child || ''}
              onChange={(e) => onChange({ ...pricing, child: e.target.value })}
            />
          </div>
        </FormField>
      )}
    </div>
    <FormField label="Valid Until" required>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="date"
          className="pl-10"
          value={pricing.validUntil || ''}
          onChange={(e) => onChange({ ...pricing, validUntil: e.target.value })}
        />
      </div>
    </FormField>
  </div>
);

const ListInput = ({ items, onChange, placeholder, addLabel }) => (
  <div className="space-y-2">
    {items.map((item, index) => (
      <div key={index} className="flex gap-2">
        <Input
          value={item}
          onChange={(e) => {
            const newItems = [...items];
            newItems[index] = e.target.value;
            onChange(newItems);
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => onChange(items.filter((_, i) => i !== index))}
          className="px-3 py-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => onChange([...items, ''])}
      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
    >
      <Plus className="w-4 h-4" />
      {addLabel}
    </button>
  </div>
);

// Package Type Specific Forms
const TransferForm = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="text-4xl mb-2">🚗</div>
      <h2 className="text-2xl font-bold text-gray-900">Transfer Service</h2>
      <p className="text-gray-600">Create your transportation service</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <FormField label="Service Name" required error={errors.name}>
          <Input
            placeholder="e.g., Airport to Hotel Transfer"
            value={data.name || ''}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        </FormField>

        <FormField label="Location/City" required error={errors.place}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Select
              className="pl-10"
              value={data.place || ''}
              onChange={(e) => onChange({ ...data, place: e.target.value })}
            >
              <option value="">Select city...</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="goa">Goa</option>
            </Select>
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Pick-up Location" required error={errors.from}>
            <Input
              placeholder="e.g., Airport"
              value={data.from || ''}
              onChange={(e) => onChange({ ...data, from: e.target.value })}
            />
          </FormField>
          <FormField label="Drop-off Location" required error={errors.to}>
            <Input
              placeholder="e.g., Hotel"
              value={data.to || ''}
              onChange={(e) => onChange({ ...data, to: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Description" required error={errors.description}>
          <Textarea
            rows={3}
            placeholder="Describe your transfer service..."
            value={data.description || ''}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
          />
        </FormField>
      </div>

      <div className="space-y-6">
        <FormField label="Service Image">
          <ImageUpload
            preview={data.image}
            onUpload={(image) => onChange({ ...data, image })}
          />
        </FormField>

        <PricingField
          pricing={data.pricing || {}}
          onChange={(pricing) => onChange({ ...data, pricing })}
        />
      </div>
    </div>
  </div>
);

const ActivityForm = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="text-4xl mb-2">🎯</div>
      <h2 className="text-2xl font-bold text-gray-900">Activity Experience</h2>
      <p className="text-gray-600">Create an exciting activity for travelers</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <FormField label="Activity Name" required error={errors.name}>
          <Input
            placeholder="e.g., City Walking Tour"
            value={data.name || ''}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
          />
        </FormField>

        <FormField label="Destination" required error={errors.place}>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Select
              className="pl-10"
              value={data.place || ''}
              onChange={(e) => onChange({ ...data, place: e.target.value })}
            >
              <option value="">Select destination...</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="bangalore">Bangalore</option>
              <option value="goa">Goa</option>
            </Select>
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Duration" required error={errors.duration}>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="number"
                className="pl-10"
                placeholder="Hours"
                value={data.duration || ''}
                onChange={(e) => onChange({ ...data, duration: e.target.value })}
              />
            </div>
          </FormField>
          <FormField label="Start Time" required error={errors.timing}>
            <Input
              type="time"
              value={data.timing || ''}
              onChange={(e) => onChange({ ...data, timing: e.target.value })}
            />
          </FormField>
        </div>

        <FormField label="Description" required error={errors.description}>
          <Textarea
            rows={3}
            placeholder="Describe what makes this activity special..."
            value={data.description || ''}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
          />
        </FormField>
      </div>

      <div className="space-y-6">
        <FormField label="Activity Image">
          <ImageUpload
            preview={data.image}
            onUpload={(image) => onChange({ ...data, image })}
          />
        </FormField>

        <FormField label="What's Included">
          <ListInput
            items={data.inclusions || ['']}
            onChange={(inclusions) => onChange({ ...data, inclusions })}
            placeholder="e.g., Professional guide"
            addLabel="Add inclusion"
          />
        </FormField>

        <FormField label="What's Not Included">
          <ListInput
            items={data.exclusions || ['']}
            onChange={(exclusions) => onChange({ ...data, exclusions })}
            placeholder="e.g., Personal expenses"
            addLabel="Add exclusion"
          />
        </FormField>

        <PricingField
          pricing={data.pricing || {}}
          onChange={(pricing) => onChange({ ...data, pricing })}
        />
      </div>
    </div>
  </div>
);

const ComboItineraryForm = ({ data, onChange, errors, currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'pricing', label: 'Pricing', icon: DollarSign }
  ];

  const TabContent = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <FormField label="Package Title" required error={errors.title}>
              <Input
                placeholder="e.g., Golden Triangle Tour"
                value={data.title || ''}
                onChange={(e) => onChange({ ...data, title: e.target.value })}
              />
            </FormField>

            <FormField label="Banner Image">
              <ImageUpload
                preview={data.banner}
                onUpload={(banner) => onChange({ ...data, banner })}
                label="Upload package banner"
              />
            </FormField>

            <FormField label="Package Description" required error={errors.description}>
              <Textarea
                rows={4}
                placeholder="Describe your complete package experience..."
                value={data.description || ''}
                onChange={(e) => onChange({ ...data, description: e.target.value })}
              />
            </FormField>

            <FormField label="Additional Notes">
              <Textarea
                rows={3}
                placeholder="Any special notes or instructions..."
                value={data.notes || ''}
                onChange={(e) => onChange({ ...data, notes: e.target.value })}
              />
            </FormField>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField label="Tour Inclusions">
                <ListInput
                  items={data.inclusions || ['']}
                  onChange={(inclusions) => onChange({ ...data, inclusions })}
                  placeholder="e.g., All meals included"
                  addLabel="Add inclusion"
                />
              </FormField>

              <FormField label="Tour Exclusions">
                <ListInput
                  items={data.exclusions || ['']}
                  onChange={(exclusions) => onChange({ ...data, exclusions })}
                  placeholder="e.g., International flights"
                  addLabel="Add exclusion"
                />
              </FormField>
            </div>
          </div>
        );

      case 'destinations':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Package Destinations</h3>
              <p className="text-gray-600">Add all cities and places covered in this tour</p>
            </div>

            <FormField label="Destinations">
              <ListInput
                items={data.destinations || ['']}
                onChange={(destinations) => onChange({ ...data, destinations })}
                placeholder="e.g., Delhi, Agra, Jaipur"
                addLabel="Add destination"
              />
            </FormField>
          </div>
        );

      case 'itinerary':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Day-wise Itinerary</h3>
              <FormField label="Total Days">
                <Input
                  type="number"
                  min="1"
                  className="w-20"
                  value={data.totalDays || ''}
                  onChange={(e) => {
                    const days = parseInt(e.target.value) || 0;
                    const itinerary = Array.from({ length: days }, (_, i) => 
                      data.itinerary?.[i] || { day: i + 1, title: '', activities: '' }
                    );
                    onChange({ ...data, totalDays: days, itinerary });
                  }}
                />
              </FormField>
            </div>

            {(data.itinerary || []).map((day, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                    {day.day}
                  </div>
                  Day {day.day}
                </h4>
                
                <FormField label="Day Title">
                  <Input
                    placeholder="e.g., Arrival in Delhi"
                    value={day.title || ''}
                    onChange={(e) => {
                      const newItinerary = [...(data.itinerary || [])];
                      newItinerary[index] = { ...day, title: e.target.value };
                      onChange({ ...data, itinerary: newItinerary });
                    }}
                  />
                </FormField>

                <FormField label="Activities & Highlights">
                  <Textarea
                    rows={3}
                    placeholder="Describe the day's activities..."
                    value={day.activities || ''}
                    onChange={(e) => {
                      const newItinerary = [...(data.itinerary || [])];
                      newItinerary[index] = { ...day, activities: e.target.value };
                      onChange({ ...data, itinerary: newItinerary });
                    }}
                  />
                </FormField>
              </div>
            ))}
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <PricingField
              pricing={data.pricing || {}}
              onChange={(pricing) => onChange({ ...data, pricing })}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🗺️</div>
        <h2 className="text-2xl font-bold text-gray-900">Combo Itinerary Package</h2>
        <p className="text-gray-600">Create a comprehensive multi-day tour experience</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <TabContent />
    </div>
  );
};

const FixedItineraryForm = ({ data, onChange, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <div className="text-4xl mb-2">✈️</div>
      <h2 className="text-2xl font-bold text-gray-900">Fixed Itinerary Package</h2>
      <p className="text-gray-600">Create a pre-planned tour with fixed schedule</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <FormField label="Package Title" required error={errors.title}>
          <Input
            placeholder="e.g., 10-Day India Discovery Tour"
            value={data.title || ''}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
          />
        </FormField>

        <FormField label="Duration (Days)" required error={errors.days}>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="number"
              min="1"
              className="pl-10"
              placeholder="Number of days"
              value={data.days || ''}
              onChange={(e) => onChange({ ...data, days: e.target.value })}
            />
          </div>
        </FormField>

        <FormField label="Destinations Covered">
          <ListInput
            items={data.destinations || ['']}
            onChange={(destinations) => onChange({ ...data, destinations })}
            placeholder="e.g., Mumbai, Goa, Kerala"
            addLabel="Add destination"
          />
        </FormField>

        <FormField label="Package Description" required error={errors.description}>
          <Textarea
            rows={4}
            placeholder="Describe this fixed itinerary package..."
            value={data.description || ''}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
          />
        </FormField>
      </div>

      <div className="space-y-6">
        <FormField label="Package Image">
          <ImageUpload
            preview={data.image}
            onUpload={(image) => onChange({ ...data, image })}
            label="Upload package image"
          />
        </FormField>

        <PricingField
          pricing={data.pricing || {}}
          onChange={(pricing) => onChange({ ...data, pricing })}
        />
      </div>
    </div>

    {/* Day-wise Plan */}
    {data.days && (
      <div className="space-y-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900">Day-wise Plan</h3>
        {Array.from({ length: parseInt(data.days) || 0 }, (_, index) => {
          const dayData = data.dayPlans?.[index] || {};
          return (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </div>
                Day {index + 1}
              </h4>
              
              <FormField label="Day Summary">
                <Input
                  placeholder="e.g., Arrival & City Tour"
                  value={dayData.summary || ''}
                  onChange={(e) => {
                    const newDayPlans = [...(data.dayPlans || [])];
                    newDayPlans[index] = { ...dayData, summary: e.target.value };
                    onChange({ ...data, dayPlans: newDayPlans });
                  }}
                />
              </FormField>

              <FormField label="Day Details">
                <Textarea
                  rows={2}
                  placeholder="Detailed plan for this day..."
                  value={dayData.details || ''}
                  onChange={(e) => {
                    const newDayPlans = [...(data.dayPlans || [])];
                    newDayPlans[index] = { ...dayData, details: e.target.value };
                    onChange({ ...data, dayPlans: newDayPlans });
                  }}
                />
              </FormField>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

// Main Wizard Component
export default function ModernPackageWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentTab, setCurrentTab] = useState('overview');

  const steps = selectedType ? ['type', 'details', 'preview'] : ['type'];

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedType) return false;

    switch (selectedType) {
      case 'TRANSFERS':
        if (!formData.name) newErrors.name = 'Service name is required';
        if (!formData.place) newErrors.place = 'Location is required';
        if (!formData.from) newErrors.from = 'Pick-up location is required';
        if (!formData.to) newErrors.to = 'Drop-off location is required';
        if (!formData.description) newErrors.description = 'Description is required';
        break;
      
      case 'ACTIVITY':
        if (!formData.name) newErrors.name = 'Activity name is required';
        if (!formData.place) newErrors.place = 'Destination is required';
        if (!formData.duration) newErrors.duration = 'Duration is required';
        if (!formData.timing) newErrors.timing = 'Start time is required';
        if (!formData.description) newErrors.description = 'Description is required';
        break;
      
      case 'MULTI_CITY_PACKAGE':
        if (!formData.title) newErrors.title = 'Package title is required';
        if (!formData.description) newErrors.description = 'Description is required';
        break;
      
      case 'FIXED_DEPARTURE_WITH_FLIGHT':
        if (!formData.title) newErrors.title = 'Package title is required';
        if (!formData.days) newErrors.days = 'Duration is required';
        if (!formData.description) newErrors.description = 'Description is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && selectedType) {
      setCurrentStep(1);
    } else if (currentStep === 1 && validateForm()) {
      setCurrentStep(2);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  const handlePublish = () => {
    alert('Package created successfully! 🎉');
    // Reset form
    setCurrentStep(0);
    setSelectedType(null);
    setFormData({});
    setErrors({});
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Your Package</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose the type of travel package you want to create. Each type is optimized for different services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {PACKAGE_TYPES.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedType === type.id
                      ? type.color
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center space-y-4">
                    <div className="text-4xl">{type.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
                      <p className="text-gray-600">{type.description}</p>
                    </div>
                    {selectedType === type.id && (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            {selectedType === 'TRANSFERS' && (
              <TransferForm data={formData} onChange={setFormData} errors={errors} />
            )}
            {selectedType === 'ACTIVITY' && (
              <ActivityForm data={formData} onChange={setFormData} errors={errors} />
            )}
            {selectedType === 'MULTI_CITY_PACKAGE' && (
              <ComboItineraryForm 
                data={formData} 
                onChange={setFormData} 
                errors={errors}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}
            {selectedType === 'FIXED_DEPARTURE_WITH_FLIGHT' && (
              <FixedItineraryForm data={formData} onChange={setFormData} errors={errors} />
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Review Your Package</h2>
              <p className="text-lg text-gray-600">
                Please review all details before publishing your package
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {formData.name || formData.title || 'Untitled Package'}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {formData.place || 'Location not specified'}
                      </div>
                      {formData.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formData.duration} hours
                        </div>
                      )}
                      {formData.days && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formData.days} days
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${formData.pricing?.adult || '0'}
                    </div>
                    <div className="text-sm text-gray-600">per adult</div>
                  </div>
                </div>

                {formData.image && (
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={formData.image} 
                      alt="Package preview" 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}

                <div className="prose max-w-none">
                  <p className="text-gray-700">{formData.description}</p>
                </div>

                {formData.inclusions && formData.inclusions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What's Included</h4>
                    <ul className="space-y-1">
                      {formData.inclusions.filter(Boolean).map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.exclusions && formData.exclusions.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">What's Not Included</h4>
                    <ul className="space-y-1">
                      {formData.exclusions.filter(Boolean).map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <X className="w-4 h-4 text-red-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pricing Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Pricing Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Adult Price:</span>
                      <span className="font-medium">${formData.pricing?.adult || '0'}</span>
                    </div>
                    {formData.pricing?.child && (
                      <div className="flex justify-between text-sm">
                        <span>Child Price:</span>
                        <span className="font-medium">${formData.pricing.child}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Valid Until:</span>
                      <span className="font-medium">
                        {formData.pricing?.validUntil ? 
                          new Date(formData.pricing.validUntil).toLocaleDateString() : 
                          'Not specified'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        {selectedType && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      index <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 transition-colors ${
                        index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          {selectedType && (
            <div className="bg-gray-50 px-8 py-4 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center space-x-4">
                {currentStep > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {currentStep < 2 && (
                  <button
                    onClick={() => {
                      // Save as draft logic
                      alert('Draft saved! 💾');
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Draft
                  </button>
                )}

                {currentStep < 2 ? (
                  <button
                    onClick={handleNext}
                    disabled={currentStep === 0 && !selectedType}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        // Preview logic
                        alert('Opening preview... 👀');
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={handlePublish}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Publish Package
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
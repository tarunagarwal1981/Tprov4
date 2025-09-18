'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageService } from '@/lib/services/packageService';
import { PackageFormData } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
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
import { cn } from '@/lib/utils';

// Reuse components from the creation wizard
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
  pricing: Array<{
    adultPrice: number;
    childPrice: number;
    validFrom: string;
    validTo: string;
  }>;
  onChange: (pricing: typeof pricing) => void;
}) => {
  const addPricing = () => {
    onChange([
      ...pricing,
      { adultPrice: 0, childPrice: 0, validFrom: '', validTo: '' }
    ]);
  };

  const updatePricing = (index: number, field: string, value: any) => {
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

export default function PackageEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packageData, setPackageData] = useState<PackageFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'itinerary' | 'pricing'>('basic');

  const packageId = searchParams.get('id');

  useEffect(() => {
    const fetchPackage = async () => {
      if (!packageId) {
        setError('No package ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await PackageService.getPackageById(packageId);
        
        if (response.error) {
          setError('Failed to load package details');
          console.error('Error fetching package:', response.error);
        } else {
          setPackageData(response.data);
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  const updatePackageData = (updates: Partial<PackageFormData>) => {
    setPackageData(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleSave = async () => {
    if (!packageData || !packageId) return;
    
    try {
      setSaving(true);
      const response = await PackageService.updatePackage(packageId, packageData);
      
      if (response.error) {
        setError('Failed to save package');
        console.error('Error updating package:', response.error);
      } else {
        router.push(`/operator/packages/view?id=${packageId}`);
      }
    } catch (err) {
      setError('An unexpected error occurred while saving');
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/operator/packages/view?id=${packageId}`);
  };

  const handleView = () => {
    router.push(`/operator/packages/view?id=${packageId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Package Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The package you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/operator/packages')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Packages
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'details', label: 'Details', icon: Package },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'pricing', label: 'Pricing', icon: DollarSign }
  ];

  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'ARCHIVED', label: 'Archived' }
  ];

  const typeOptions = [
    { value: PackageType.TRANSFERS, label: 'Transfers' },
    { value: PackageType.ACTIVITY, label: 'Activities' },
    { value: PackageType.MULTI_CITY_PACKAGE, label: 'Multi City Package' },
    { value: PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL, label: 'Multi City + Hotels' },
    { value: PackageType.FIXED_DEPARTURE_WITH_FLIGHT, label: 'Fixed Departure' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Package</h1>
                <p className="text-gray-600">{packageData.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleView}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Package
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors",
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <FormField label="Package Title" required>
                    <Input
                      placeholder="Enter package title"
                      value={packageData.title || ''}
                      onChange={(value) => updatePackageData({ title: value })}
                    />
                  </FormField>

                  <FormField label="Description">
                    <Textarea
                      placeholder="Describe your package..."
                      value={packageData.description || ''}
                      onChange={(value) => updatePackageData({ description: value })}
                      rows={4}
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Package Type" required>
                      <Select
                        value={packageData.type || ''}
                        onChange={(value) => updatePackageData({ type: value as PackageType })}
                        options={typeOptions}
                        placeholder="Select type"
                      />
                    </FormField>

                    <FormField label="Status" required>
                      <Select
                        value={packageData.status || ''}
                        onChange={(value) => updatePackageData({ status: value })}
                        options={statusOptions}
                        placeholder="Select status"
                      />
                    </FormField>
                  </div>

                  {packageData.type === PackageType.TRANSFERS && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="From Location" required>
                        <Input
                          placeholder="Starting location"
                          value={packageData.from || ''}
                          onChange={(value) => updatePackageData({ from: value })}
                        />
                      </FormField>
                      <FormField label="To Location" required>
                        <Input
                          placeholder="Destination"
                          value={packageData.to || ''}
                          onChange={(value) => updatePackageData({ to: value })}
                        />
                      </FormField>
                    </div>
                  )}

                  {packageData.type === PackageType.ACTIVITY && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Timing" required>
                        <Input
                          placeholder="e.g., 9:00 AM - 5:00 PM"
                          value={packageData.timing || ''}
                          onChange={(value) => updatePackageData({ timing: value })}
                        />
                      </FormField>
                      <FormField label="Duration (Hours)" required>
                        <Input
                          type="number"
                          placeholder="8"
                          value={packageData.durationHours?.toString() || ''}
                          onChange={(value) => updatePackageData({ durationHours: parseInt(value) || 0 })}
                        />
                      </FormField>
                    </div>
                  )}

                  <FormField label="Location/Place">
                    <Input
                      placeholder="Package location"
                      value={packageData.place || ''}
                      onChange={(value) => updatePackageData({ place: value })}
                    />
                  </FormField>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <FormField label="Destinations">
                    <ListManager
                      items={packageData.destinations || []}
                      onChange={(destinations) => updatePackageData({ destinations })}
                      placeholder="Add destination..."
                    />
                  </FormField>

                  <FormField label="Inclusions">
                    <ListManager
                      items={packageData.inclusions || []}
                      onChange={(inclusions) => updatePackageData({ inclusions })}
                      placeholder="Add inclusion..."
                    />
                  </FormField>

                  <FormField label="Exclusions">
                    <ListManager
                      items={packageData.exclusions || []}
                      onChange={(exclusions) => updatePackageData({ exclusions })}
                      placeholder="Add exclusion..."
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Duration (Days)">
                      <Input
                        type="number"
                        placeholder="7"
                        value={packageData.days?.toString() || ''}
                        onChange={(value) => updatePackageData({ days: parseInt(value) || 0 })}
                      />
                    </FormField>
                    <FormField label="Max Group Size">
                      <Input
                        type="number"
                        placeholder="15"
                        value={packageData.maxGroupSize?.toString() || ''}
                        onChange={(value) => updatePackageData({ maxGroupSize: parseInt(value) || 0 })}
                      />
                    </FormField>
                  </div>
                </motion.div>
              )}

              {activeTab === 'itinerary' && (
                <motion.div
                  key="itinerary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Day-wise Itinerary</h3>
                    <button
                      onClick={() => {
                        const newDay = {
                          day: (packageData.itinerary?.length || 0) + 1,
                          title: '',
                          description: '',
                          activities: []
                        };
                        updatePackageData({
                          itinerary: [...(packageData.itinerary || []), newDay]
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Day
                    </button>
                  </div>

                  {(packageData.itinerary || []).map((day, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">Day {day.day}</h4>
                        <button
                          onClick={() => {
                            const updated = (packageData.itinerary || []).filter((_, i) => i !== index);
                            updatePackageData({ itinerary: updated });
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
                          onChange={(value) => {
                            const updated = [...(packageData.itinerary || [])];
                            updated[index] = { ...updated[index], title: value };
                            updatePackageData({ itinerary: updated });
                          }}
                        />
                      </FormField>

                      <FormField label="Description">
                        <Textarea
                          placeholder="Describe the day's activities..."
                          value={day.description}
                          onChange={(value) => {
                            const updated = [...(packageData.itinerary || [])];
                            updated[index] = { ...updated[index], description: value };
                            updatePackageData({ itinerary: updated });
                          }}
                        />
                      </FormField>

                      <FormField label="Activities">
                        <ListManager
                          items={day.activities || []}
                          onChange={(activities) => {
                            const updated = [...(packageData.itinerary || [])];
                            updated[index] = { ...updated[index], activities };
                            updatePackageData({ itinerary: updated });
                          }}
                          placeholder="Add activity..."
                        />
                      </FormField>
                    </div>
                  ))}

                  {(!packageData.itinerary || packageData.itinerary.length === 0) && (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No itinerary added yet. Click "Add Day" to start planning.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'pricing' && (
                <motion.div
                  key="pricing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <FormField label="Package Pricing" required>
                    <PricingSection
                      pricing={packageData.pricing || [{ adultPrice: 0, childPrice: 0, validFrom: '', validTo: '' }]}
                      onChange={(pricing) => updatePackageData({ pricing })}
                    />
                  </FormField>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Floating Save Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
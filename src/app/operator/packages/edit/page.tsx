'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageService } from '@/lib/services/packageService';
import { PackageWithDetails } from '@/lib/supabase-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Star,
  Clock,
  Globe,
  Camera,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PackageEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packageData, setPackageData] = useState<PackageWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          // Debug the loaded data
          if (response.data) {
            console.log('PackageData loaded in edit page:', {
              title: typeof response.data?.title,
              description: typeof response.data?.description,
              status: typeof response.data?.status,
              type: typeof response.data?.type,
              pricing: typeof response.data?.pricing,
              duration: typeof response.data?.duration,
              group_size: typeof response.data?.group_size,
              destinations: Array.isArray(response.data?.destinations),
              itinerary: Array.isArray(response.data?.itinerary),
              reviews: Array.isArray(response.data?.reviews),
              images: Array.isArray(response.data?.images),
              tour_operator: typeof response.data?.tour_operator,
            });
          }
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

  const handleSave = async () => {
    if (!packageData || !packageId) return;
    
    try {
      setSaving(true);
      const response = await PackageService.updatePackage(packageId, {
        title: packageData.title,
        description: packageData.description,
        pricing: packageData.pricing,
        duration: packageData.duration,
        group_size: packageData.group_size,
        destinations: packageData.destinations,
        status: packageData.status,
        type: packageData.type,
        itinerary: packageData.itinerary,
        inclusions: packageData.inclusions,
        exclusions: packageData.exclusions,
        terms_and_conditions: packageData.terms_and_conditions,
        cancellation_policy: packageData.cancellation_policy,
        images: packageData.images,
        difficulty: packageData.difficulty,
        tags: packageData.tags,
        is_featured: packageData.is_featured,
        rating: packageData.rating,
        review_count: packageData.review_count,
      });
      
      if (response.error) {
        setError('Failed to save package');
        console.error('Error updating package:', response.error);
      } else {
        // Redirect to package detail page
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Eye className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Package Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The package you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/operator/packages')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  const safeRender = (value: any, fallback: string = 'Not specified'): string => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') {
      console.warn('Attempting to render object:', value);
      return fallback;
    }
    return String(value);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Not specified';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(dateObj);
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Package</h1>
                <p className="text-gray-600">{safeRender(packageData.title, 'Untitled Package')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleView}
                className="flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Package
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Title
                  </label>
                  <input
                    type="text"
                    value={safeRender(packageData.title, '')}
                    onChange={(e) => setPackageData({...packageData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={safeRender(packageData.description, '')}
                    onChange={(e) => setPackageData({...packageData, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (USD)
                    </label>
                    <input
                      type="number"
                      value={packageData.pricing && typeof packageData.pricing === 'object' && 'basePrice' in packageData.pricing 
                        ? (packageData.pricing as any).basePrice 
                        : 0}
                      onChange={(e) => setPackageData({
                        ...packageData, 
                        pricing: {
                          ...(packageData.pricing as any || {}),
                          basePrice: parseFloat(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      value={packageData.duration && typeof packageData.duration === 'object' && 'days' in packageData.duration 
                        ? (packageData.duration as any).days 
                        : 0}
                      onChange={(e) => setPackageData({
                        ...packageData, 
                        duration: {
                          ...(packageData.duration as any || {}),
                          days: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Group Size
                    </label>
                    <input
                      type="number"
                      value={packageData.group_size && typeof packageData.group_size === 'object' && 'min' in packageData.group_size 
                        ? (packageData.group_size as any).min 
                        : 0}
                      onChange={(e) => setPackageData({
                        ...packageData, 
                        group_size: {
                          ...(packageData.group_size as any || {}),
                          min: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Group Size
                    </label>
                    <input
                      type="number"
                      value={packageData.group_size && typeof packageData.group_size === 'object' && 'max' in packageData.group_size 
                        ? (packageData.group_size as any).max 
                        : 0}
                      onChange={(e) => setPackageData({
                        ...packageData, 
                        group_size: {
                          ...(packageData.group_size as any || {}),
                          max: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinations (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={safeRender(packageData.destinations?.join(', '), '')}
                    onChange={(e) => setPackageData({
                      ...packageData, 
                      destinations: e.target.value.split(',').map(d => d.trim()).filter(d => d)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Paris, London, Rome"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={safeRender(packageData.status, 'DRAFT')}
                      onChange={(e) => setPackageData({...packageData, status: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Type
                    </label>
                    <select
                      value={safeRender(packageData.type, 'ADVENTURE')}
                      onChange={(e) => setPackageData({...packageData, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ADVENTURE">Adventure</option>
                      <option value="CULTURAL">Cultural</option>
                      <option value="RELAXATION">Relaxation</option>
                      <option value="BUSINESS">Business</option>
                      <option value="LUXURY">Luxury</option>
                      <option value="BUDGET">Budget</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packageData.itinerary && packageData.itinerary.length > 0 ? (
                    packageData.itinerary.map((day, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Day {String(day.day || index + 1)}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newItinerary = packageData.itinerary?.filter((_, i) => i !== index);
                              setPackageData({...packageData, itinerary: newItinerary});
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                        <textarea
                          value={safeRender(day.description, '')}
                          onChange={(e) => {
                            const newItinerary = [...(packageData.itinerary || [])];
                            newItinerary[index] = {...day, description: e.target.value};
                            setPackageData({...packageData, itinerary: newItinerary});
                          }}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No itinerary added yet.</p>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newDay = {
                        day: (packageData.itinerary?.length || 0) + 1,
                        description: '',
                        activities: []
                      };
                      setPackageData({
                        ...packageData, 
                        itinerary: [...(packageData.itinerary || []), newDay]
                      });
                    }}
                    className="w-full"
                  >
                    Add Day
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package Info */}
            <Card>
              <CardHeader>
                <CardTitle>Package Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Price per person</p>
                    <p className="text-lg font-semibold">{formatPrice(packageData.price)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">{safeRender(packageData.duration, '0')} days</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Group Size</p>
                    <p className="font-semibold">
                      {safeRender(packageData.minGroupSize, '0')} - {safeRender(packageData.maxGroupSize, '0')} people
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Destinations</p>
                    <p className="font-semibold">{safeRender(packageData.destinations?.join(', '), 'Not specified')}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-semibold">{formatDate(packageData.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={handleSave} disabled={saving} className="w-full justify-start">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={handleView} className="w-full justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  View Package
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

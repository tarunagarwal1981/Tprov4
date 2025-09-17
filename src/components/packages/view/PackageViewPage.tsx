'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageService } from '@/lib/services/packageService';
import { PackageWithDetails } from '@/lib/supabase-types';
import { PackageFormData } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { convertDbPackageToFormData, getPackageTypeSpecificFields } from '@/lib/utils/packageDataConverter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
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

export default function PackageViewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packageData, setPackageData] = useState<PackageFormData | null>(null);
  const [loading, setLoading] = useState(true);
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
          const formData = convertDbPackageToFormData(response.data);
          setPackageData(formData);
          // Debug the loaded data
          if (response.data) {
            console.log('PackageData loaded:', {
              title: typeof formData?.title,
              description: typeof formData?.description,
              status: typeof formData?.status,
              type: typeof formData?.type,
              adultPrice: typeof formData?.adultPrice,
              durationDays: typeof formData?.durationDays,
              minGroupSize: typeof formData?.minGroupSize,
              maxGroupSize: typeof formData?.maxGroupSize,
              multipleDestinations: Array.isArray(formData?.multipleDestinations),
              itinerary: Array.isArray(formData?.itinerary),
              tourInclusions: Array.isArray(formData?.tourInclusions),
              tourExclusions: Array.isArray(formData?.tourExclusions),
              images: Array.isArray(formData?.images),
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

  const handleEdit = () => {
    router.push(`/operator/packages/edit?id=${packageId}`);
  };

  const handleBack = () => {
    router.push('/operator/packages');
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
          <Button onClick={handleBack} variant="outline">
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

  // Debug function to check packageData structure (call manually if needed)
  const debugPackageData = () => {
    if (!packageData) return;
    
    console.log('PackageData structure:', {
      title: typeof packageData?.title,
      description: typeof packageData?.description,
      status: typeof packageData?.status,
      type: typeof packageData?.type,
      pricing: typeof packageData?.pricing,
      duration: typeof packageData?.duration,
      group_size: typeof packageData?.group_size,
      destinations: Array.isArray(packageData?.destinations),
      itinerary: Array.isArray(packageData?.itinerary),
      reviews: Array.isArray(packageData?.reviews),
      images: Array.isArray(packageData?.images),
      tour_operator: typeof packageData?.tour_operator,
    });
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
                <h1 className="text-2xl font-bold text-gray-900">{safeRender(packageData.title, 'Untitled Package')}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={cn(
                    packageData.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  )}>
                    {safeRender(packageData.status, 'UNKNOWN')}
                  </Badge>
                  <Badge variant="outline">{safeRender(packageData.type, 'UNKNOWN')}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={handleEdit} className="flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                Edit Package
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Images */}
            {packageData.images && packageData.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Package Images
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {packageData.images.map((image, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={typeof image === 'string' ? image : (image as any)?.url || ''}
                          alt={`${safeRender(packageData.title, 'Package')} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {safeRender(packageData.description, 'No description provided.')}
                </p>
              </CardContent>
            </Card>

            {/* Itinerary */}
            {packageData.itinerary && (
              <Card>
                <CardHeader>
                  <CardTitle>Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900">Day {String(day.day || index + 1)}</h4>
                        <p className="text-gray-700 mt-1">{String(day.description || 'No description')}</p>
                        {day.activities && Array.isArray(day.activities) && day.activities.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="text-sm text-gray-600">
                                • {String(activity || '')}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inclusions */}
            {packageData.tourInclusions && packageData.tourInclusions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Inclusions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {packageData.tourInclusions.map((inclusion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Exclusions */}
            {packageData.tourExclusions && packageData.tourExclusions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Exclusions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {packageData.tourExclusions.map((exclusion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">✗</span>
                        <span className="text-gray-700">{exclusion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Package Type Specific Fields */}
            {packageData && (
              <Card>
                <CardHeader>
                  <CardTitle>Package Type Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Show type-specific fields based on package type */}
                    {packageData.type === PackageType.ACTIVITY && (
                      <>
                        {packageData.startTime && (
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">Start Time</p>
                              <p className="font-semibold">{packageData.startTime}</p>
                            </div>
                          </div>
                        )}
                        {packageData.endTime && (
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-500">End Time</p>
                              <p className="font-semibold">{packageData.endTime}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {packageData.type === PackageType.TRANSFERS && (
                      <>
                        {packageData.fromLocation && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="text-sm text-gray-500">From Location</p>
                              <p className="font-semibold">{packageData.fromLocation}</p>
                            </div>
                          </div>
                        )}
                        {packageData.toLocation && (
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="text-sm text-gray-500">To Location</p>
                              <p className="font-semibold">{packageData.toLocation}</p>
                            </div>
                          </div>
                        )}
                        {packageData.vehicleType && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="text-sm text-gray-500">Vehicle Type</p>
                              <p className="font-semibold">{packageData.vehicleType}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {packageData.type === PackageType.MULTI_CITY_PACKAGE && (
                      <>
                        {packageData.fromLocation && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">From Location</p>
                              <p className="font-semibold">{packageData.fromLocation}</p>
                            </div>
                          </div>
                        )}
                        {packageData.toLocation && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">To Location</p>
                              <p className="font-semibold">{packageData.toLocation}</p>
                            </div>
                          </div>
                        )}
                        {packageData.vehicleType && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">Vehicle Type</p>
                              <p className="font-semibold">{packageData.vehicleType}</p>
                            </div>
                          </div>
                        )}
                        {packageData.acNonAc && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-500">AC/Non-AC</p>
                              <p className="font-semibold">{packageData.acNonAc}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {packageData.type === PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL && (
                      <>
                        {packageData.hotelCategory && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="text-sm text-gray-500">Hotel Category</p>
                              <p className="font-semibold">{packageData.hotelCategory}</p>
                            </div>
                          </div>
                        )}
                        {packageData.roomType && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="text-sm text-gray-500">Room Type</p>
                              <p className="font-semibold">{packageData.roomType}</p>
                            </div>
                          </div>
                        )}
                        {packageData.fromLocation && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="text-sm text-gray-500">From Location</p>
                              <p className="font-semibold">{packageData.fromLocation}</p>
                            </div>
                          </div>
                        )}
                        {packageData.toLocation && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-orange-600" />
                            <div>
                              <p className="text-sm text-gray-500">To Location</p>
                              <p className="font-semibold">{packageData.toLocation}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    {packageData.type === PackageType.FIXED_DEPARTURE_WITH_FLIGHT && (
                      <>
                        {packageData.departureAirport && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-sky-600" />
                            <div>
                              <p className="text-sm text-gray-500">Departure Airport</p>
                              <p className="font-semibold">{packageData.departureAirport}</p>
                            </div>
                          </div>
                        )}
                        {packageData.arrivalAirport && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-sky-600" />
                            <div>
                              <p className="text-sm text-gray-500">Arrival Airport</p>
                              <p className="font-semibold">{packageData.arrivalAirport}</p>
                            </div>
                          </div>
                        )}
                        {packageData.flightClass && (
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-sky-600" />
                            <div>
                              <p className="text-sm text-gray-500">Flight Class</p>
                              <p className="font-semibold">{packageData.flightClass}</p>
                        </div>
                      </div>
                        )}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

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
                    <p className="text-sm text-gray-500">Adult Price</p>
                    <p className="text-lg font-semibold">
                      {packageData.adultPrice ? formatPrice(packageData.adultPrice) : 'Price not set'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">
                      {packageData.durationDays ? `${packageData.durationDays} days` : 
                       packageData.durationHours ? `${packageData.durationHours} hours` : 
                       'Duration not set'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Group Size</p>
                    <p className="font-semibold">
                      {packageData.minGroupSize && packageData.maxGroupSize 
                        ? `${packageData.minGroupSize} - ${packageData.maxGroupSize} people`
                        : 'Group size not set'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Destinations</p>
                    <p className="font-semibold">
                      {packageData.multipleDestinations?.length 
                        ? packageData.multipleDestinations.join(', ')
                        : 'No destinations specified'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-semibold">{formatDate(packageData.created_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tour Operator Info */}
            {packageData.tour_operator && (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Operator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">{String(packageData.tour_operator.company_name || 'Unknown Company')}</p>
                      <p className="text-sm text-gray-600">{String(packageData.tour_operator.description || 'No description')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {String(packageData.tour_operator.website || 'No website')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={handleEdit} className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Package
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Bookings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

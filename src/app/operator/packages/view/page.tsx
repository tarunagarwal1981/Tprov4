'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageService } from '@/lib/services/packageService';
import { PackageWithDetails } from '@/lib/types';
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

export default function PackageDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packageData, setPackageData] = useState<PackageWithDetails | null>(null);
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
          setPackageData(response.data);
          // Debug the loaded data
          if (response.data) {
            console.log('PackageData loaded:', {
              title: typeof response.data?.title,
              description: typeof response.data?.description,
              status: typeof response.data?.status,
              type: typeof response.data?.type,
              price: typeof response.data?.price,
              duration: typeof response.data?.duration,
              minGroupSize: typeof response.data?.minGroupSize,
              maxGroupSize: typeof response.data?.maxGroupSize,
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
      price: typeof packageData?.price,
      duration: typeof packageData?.duration,
      minGroupSize: typeof packageData?.minGroupSize,
      maxGroupSize: typeof packageData?.maxGroupSize,
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
                          src={safeRender(image.url, '')}
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

            {/* Reviews */}
            {packageData.reviews && packageData.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    Reviews ({safeRender(packageData.reviews.length, '0')})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {packageData.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{String(review.customerName || 'Anonymous')}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < (Number(review.rating) || 0) 
                                      ? "text-yellow-400 fill-current" 
                                      : "text-gray-300"
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">{String(review.comment || 'No comment')}</p>
                      </div>
                    ))}
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

            {/* Tour Operator Info */}
            {packageData.tour_operator && (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Operator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">{String(packageData.tour_operator.companyName || 'Unknown Company')}</p>
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

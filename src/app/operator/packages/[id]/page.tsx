'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<PackageWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const packageId = params.id as string;

  useEffect(() => {
    const fetchPackage = async () => {
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

    if (packageId) {
      fetchPackage();
    }
  }, [packageId]);

  const handleEdit = () => {
    router.push(`/operator/packages/${packageId}/edit`);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
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
                <h1 className="text-2xl font-bold text-gray-900">{packageData.title}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={cn(
                    packageData.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  )}>
                    {packageData.status}
                  </Badge>
                  <Badge variant="outline">{packageData.type}</Badge>
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
                          src={image.url}
                          alt={`${packageData.title} - Image ${index + 1}`}
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
                  {packageData.description || 'No description provided.'}
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
                        <h4 className="font-semibold text-gray-900">Day {day.day}</h4>
                        <p className="text-gray-700 mt-1">{day.description}</p>
                        {day.activities && day.activities.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex} className="text-sm text-gray-600">
                                • {activity}
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
                    Reviews ({packageData.reviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {packageData.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{review.customerName}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < (review.rating || 0) 
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
                        <p className="text-gray-700">{review.comment}</p>
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
                    <p className="font-semibold">{packageData.duration} days</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500">Group Size</p>
                    <p className="font-semibold">
                      {packageData.minGroupSize} - {packageData.maxGroupSize} people
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">Destinations</p>
                    <p className="font-semibold">{packageData.destinations?.join(', ') || 'Not specified'}</p>
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
                      <p className="font-semibold">{packageData.tour_operator.companyName}</p>
                      <p className="text-sm text-gray-600">{packageData.tour_operator.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {packageData.tour_operator.website || 'No website'}
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

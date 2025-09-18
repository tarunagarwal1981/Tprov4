'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageService } from '@/lib/services/packageService';
import { PackageFormData } from '@/lib/types/wizard';
import { PackageType } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Share2, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Calendar,
  Star,
  CheckCircle,
  X,
  Camera,
  Globe,
  Plane,
  Car,
  Building,
  Bed,
  Trophy,
  Eye,
  BarChart3,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PackageTypeIcon = ({ type }: { type: PackageType }) => {
  const iconMap = {
    [PackageType.TRANSFERS]: Car,
    [PackageType.ACTIVITY]: Star,
    [PackageType.MULTI_CITY_PACKAGE]: Package,
    [PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL]: Building,
    [PackageType.FIXED_DEPARTURE_WITH_FLIGHT]: Plane
  };
  const IconComponent = iconMap[type] || Package;
  return <IconComponent className="w-5 h-5" />;
};

const Badge = ({ children, variant = 'default', className = '' }: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

const ImageGallery = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
        <Camera className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
        <img
          src={images[selectedImage]}
          alt="Package image"
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                index === selectedImage ? "border-blue-500" : "border-transparent"
              )}
            >
              <img
                src={image}
                alt={`Package image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ title, children, icon: Icon }: {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-100 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    {children}
  </div>
);

const ItineraryDay = ({ day, isLast = false }: {
  day: { day: number; title: string; description: string; activities?: string[] };
  isLast?: boolean;
}) => (
  <div className="relative">
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
          {day.day}
        </div>
        {!isLast && <div className="w-0.5 h-16 bg-gray-200 mt-2" />}
      </div>
      <div className="flex-1 pb-8">
        <h4 className="font-semibold text-gray-900 mb-2">{day.title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">{day.description}</p>
        {day.activities && day.activities.length > 0 && (
          <div className="space-y-1">
            {day.activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-500">
                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                {activity}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

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

  const handleEdit = () => {
    router.push(`/operator/packages/edit?id=${packageId}`);
  };

  const handleBack = () => {
    router.push('/operator/packages');
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
            <Eye className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Package Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The package you are looking for does not exist.'}</p>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Packages
          </button>
        </motion.div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { variant: 'success' as const, label: 'Active' },
      DRAFT: { variant: 'warning' as const, label: 'Draft' },
      INACTIVE: { variant: 'danger' as const, label: 'Inactive' },
      ARCHIVED: { variant: 'default' as const, label: 'Archived' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatPrice = (price: number | undefined | null) => {
    if (!price) return 'Price not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

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
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <PackageTypeIcon type={packageData.type} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{packageData.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(packageData.status)}
                    <Badge variant="info">{packageData.type.replace(/_/g, ' ')}</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Package
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            {packageData.images && (
              <ImageGallery images={packageData.images} />
            )}

            {/* Description */}
            {packageData.description && (
              <InfoCard title="Description" icon={Globe}>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {packageData.description}
                </p>
              </InfoCard>
            )}

            {/* Itinerary */}
            {packageData.itinerary && packageData.itinerary.length > 0 && (
              <InfoCard title="Day-wise Itinerary" icon={Calendar}>
                <div className="space-y-4">
                  {packageData.itinerary.map((day, index) => (
                    <ItineraryDay 
                      key={index} 
                      day={day} 
                      isLast={index === packageData.itinerary.length - 1} 
                    />
                  ))}
                </div>
              </InfoCard>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6">
              {packageData.inclusions && packageData.inclusions.length > 0 && (
                <InfoCard title="Inclusions" icon={CheckCircle}>
                  <div className="space-y-3">
                    {packageData.inclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}

              {packageData.exclusions && packageData.exclusions.length > 0 && (
                <InfoCard title="Exclusions" icon={X}>
                  <div className="space-y-3">
                    {packageData.exclusions.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}
            </div>

            {/* Type-Specific Details */}
            <InfoCard title="Package Details" icon={Package}>
              <div className="grid md:grid-cols-2 gap-6">
                {packageData.type === PackageType.TRANSFERS && (
                  <>
                    {packageData.from && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">From</label>
                        <p className="text-gray-900">{packageData.from}</p>
                      </div>
                    )}
                    {packageData.to && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">To</label>
                        <p className="text-gray-900">{packageData.to}</p>
                      </div>
                    )}
                  </>
                )}

                {packageData.type === PackageType.ACTIVITY && (
                  <>
                    {packageData.timing && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Timing</label>
                        <p className="text-gray-900">{packageData.timing}</p>
                      </div>
                    )}
                    {packageData.durationHours && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Duration</label>
                        <p className="text-gray-900">{packageData.durationHours} hours</p>
                      </div>
                    )}
                  </>
                )}

                {packageData.destinations && packageData.destinations.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Destinations</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {packageData.destinations.map((dest, index) => (
                        <Badge key={index} variant="info">{dest}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </InfoCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Package Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Starting Price</p>
                    <p className="font-semibold text-lg text-green-600">
                      {formatPrice(packageData.adultPrice)}
                    </p>
                  </div>
                </div>

                {packageData.durationDays && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold">{packageData.durationDays} days</p>
                    </div>
                  </div>
                )}

                {(packageData.minGroupSize || packageData.maxGroupSize) && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Group Size</p>
                      <p className="font-semibold">
                        {packageData.minGroupSize}-{packageData.maxGroupSize} people
                      </p>
                    </div>
                  </div>
                )}

                {packageData.place && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{packageData.place}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Details */}
            {packageData.pricing && packageData.pricing.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Pricing Tiers</h3>
                <div className="space-y-4">
                  {packageData.pricing.map((tier, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Tier {index + 1}</span>
                        <Badge variant="info">
                          {tier.validFrom} - {tier.validTo}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Adult:</span>
                          <span className="font-semibold ml-2">${tier.adultPrice}</span>
                        </div>
                        {tier.childPrice > 0 && (
                          <div>
                            <span className="text-gray-500">Child:</span>
                            <span className="font-semibold ml-2">${tier.childPrice}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleEdit}
                  className="w-full flex items-center justify-start gap-3 px-4 py-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Package
                </button>
                <button className="w-full flex items-center justify-start gap-3 px-4 py-3 text-left bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  View Analytics
                </button>
                <button className="w-full flex items-center justify-start gap-3 px-4 py-3 text-left bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Trophy className="w-4 h-4" />
                  Manage Bookings
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
import { 
  User, 
  UserRole, 
  Package, 
  PackageType, 
  PackageStatus, 
  DifficultyLevel,
  PackageDuration,
  GroupSize,
  PackagePricing,
  GroupDiscount,
  SeasonalPricing,
  TaxBreakdown,
  FeeBreakdown,
  CancellationPolicy,
  RefundPolicy,
  ItineraryDay
} from './types';

// Additional interfaces for mock data
export interface Booking {
  id: string;
  packageId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelAgentId?: string;
  travelAgentName?: string;
  bookingDate: Date;
  travelDate: Date;
  numberOfTravelers: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelAgent {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  location: string;
  specialties: string[];
  commissionRate: number;
  totalBookings: number;
  totalRevenue: number;
  rating: number;
  isActive: boolean;
  joinedDate: Date;
  lastBookingDate?: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'inquiry' | 'system' | 'promotion';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface ActivityFeedItem {
  id: string;
  type: 'booking' | 'payment' | 'inquiry' | 'package_update' | 'agent_joined';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  totalPackages: number;
  activeBookings: number;
  totalRevenue: number;
  totalAgents: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
  averageRating: number;
  totalCustomers: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
  packages: number;
}

export interface PackageAnalytics {
  packageId: string;
  packageName: string;
  views: number;
  bookings: number;
  revenue: number;
  conversionRate: number;
  averageRating: number;
  reviews: number;
}

// Mock Tour Operator Profile
export const mockTourOperator: User = {
  id: 'op-001',
  email: 'operator@travelpro.com',
  name: 'Adventure World Tours',
  role: UserRole.TOUR_OPERATOR,
  profile: {
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1-555-0123',
    bio: 'Passionate about creating unforgettable travel experiences with over 10 years in the industry.',
    address: {
      street: '123 Adventure Street',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      postalCode: '94102'
    },
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  createdAt: new Date('2020-01-15'),
  updatedAt: new Date('2024-01-10'),
  isActive: true,
  lastLoginAt: new Date('2024-01-12T10:30:00Z')
};

// Mock Travel Agents
export const mockTravelAgents: TravelAgent[] = [
  {
    id: 'ta-001',
    name: 'Emily Rodriguez',
    email: 'emily@wanderlusttravel.com',
    company: 'Wanderlust Travel Agency',
    phone: '+1-555-0101',
    location: 'New York, NY',
    specialties: ['Adventure Travel', 'Luxury Tours', 'Group Travel'],
    commissionRate: 12.5,
    totalBookings: 45,
    totalRevenue: 125000,
    rating: 4.8,
    isActive: true,
    joinedDate: new Date('2023-03-15'),
    lastBookingDate: new Date('2024-01-10')
  },
  {
    id: 'ta-002',
    name: 'Michael Chen',
    email: 'michael@globetrotter.com',
    company: 'Globetrotter Adventures',
    phone: '+1-555-0102',
    location: 'Los Angeles, CA',
    specialties: ['Cultural Tours', 'Photography Tours', 'Solo Travel'],
    commissionRate: 10.0,
    totalBookings: 32,
    totalRevenue: 89000,
    rating: 4.6,
    isActive: true,
    joinedDate: new Date('2023-06-20'),
    lastBookingDate: new Date('2024-01-08')
  },
  {
    id: 'ta-003',
    name: 'Jessica Williams',
    email: 'jessica@dreamdestinations.com',
    company: 'Dream Destinations',
    phone: '+1-555-0103',
    location: 'Miami, FL',
    specialties: ['Beach Vacations', 'Honeymoon Packages', 'Family Travel'],
    commissionRate: 15.0,
    totalBookings: 28,
    totalRevenue: 156000,
    rating: 4.9,
    isActive: true,
    joinedDate: new Date('2023-01-10'),
    lastBookingDate: new Date('2024-01-12')
  }
];

// Mock Packages Data
export const mockPackages: Package[] = [
  {
    id: 'pkg-001',
    tourOperatorId: 'op-001',
    title: 'Bali Adventure Package',
    description: 'Experience the beauty of Bali with our comprehensive adventure package including cultural tours, beach activities, and mountain hiking. Perfect for adventure seekers and culture enthusiasts.',
    type: PackageType.LAND_PACKAGE,
    status: PackageStatus.ACTIVE,
    pricing: {
      basePrice: 1299,
      currency: 'USD',
      pricePerPerson: true,
      groupDiscounts: [
        { minGroupSize: 4, maxGroupSize: 8, discountPercentage: 10 },
        { minGroupSize: 9, discountPercentage: 15 }
      ],
      seasonalPricing: [
        { season: 'Peak Season', startDate: new Date('2024-06-01'), endDate: new Date('2024-08-31'), priceMultiplier: 1.3, reason: 'High demand period' },
        { season: 'Low Season', startDate: new Date('2024-11-01'), endDate: new Date('2024-02-28'), priceMultiplier: 0.8, reason: 'Off-peak period' }
      ],
      inclusions: ['Accommodation', 'Meals', 'Transportation', 'Guide', 'Activities'],
      taxes: {
        gst: 50,
        serviceTax: 25,
        tourismTax: 15,
        other: []
      },
      fees: {
        bookingFee: 30,
        processingFee: 20,
        cancellationFee: 100,
        other: []
      }
    } as PackagePricing,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali',
        description: 'Welcome to Bali! Airport pickup and transfer to hotel. Evening cultural show.',
        activities: ['Airport pickup', 'Hotel check-in', 'Cultural show'],
        meals: ['Dinner'],
        accommodation: 'Luxury Resort in Ubud'
      },
      {
        day: 2,
        title: 'Ubud Cultural Tour',
        description: 'Explore the cultural heart of Bali with temple visits and traditional markets.',
        activities: ['Temple visits', 'Market tour', 'Traditional cooking class'],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Luxury Resort in Ubud'
      }
    ],
    inclusions: ['Accommodation', 'Meals', 'Transportation', 'Guide', 'Activities', 'Cultural shows'],
    exclusions: ['Flights', 'Personal expenses', 'Travel insurance', 'Optional activities'],
    termsAndConditions: ['Valid for 6 months', 'Non-refundable', 'Minimum 2 travelers'],
    cancellationPolicy: {
      freeCancellationDays: 7,
      cancellationFees: [],
      refundPolicy: {
        refundable: true,
        refundPercentage: 80,
        processingDays: 14,
        conditions: []
      },
      forceMajeurePolicy: 'Full refund in case of natural disasters'
    },
    images: [
      'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop'
    ],
    destinations: ['Bali', 'Indonesia'],
    duration: { days: 7, nights: 6 } as PackageDuration,
    groupSize: { min: 2, max: 12, ideal: 6 } as GroupSize,
    difficulty: DifficultyLevel.MODERATE,
    tags: ['adventure', 'culture', 'beach', 'mountains'],
    isFeatured: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'pkg-002',
    tourOperatorId: 'op-001',
    title: 'European Grand Tour',
    description: 'Discover the best of Europe with this comprehensive 14-day tour covering major cities, historical sites, and cultural experiences.',
    type: PackageType.LAND_PACKAGE,
    status: PackageStatus.ACTIVE,
    pricing: {
      basePrice: 2499,
      currency: 'USD',
      pricePerPerson: true,
      groupDiscounts: [
        { minGroupSize: 6, maxGroupSize: 10, discountPercentage: 8 },
        { minGroupSize: 11, discountPercentage: 12 }
      ],
      seasonalPricing: [
        { season: 'Summer Peak', startDate: new Date('2024-06-01'), endDate: new Date('2024-08-31'), priceMultiplier: 1.4, reason: 'Peak tourist season' }
      ],
      inclusions: ['Accommodation', 'Meals', 'Transportation', 'Guide', 'Museum entries'],
      taxes: {
        gst: 100,
        serviceTax: 50,
        tourismTax: 30,
        other: []
      },
      fees: {
        bookingFee: 50,
        processingFee: 30,
        cancellationFee: 200,
        other: []
      }
    } as PackagePricing,
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Paris',
        description: 'Welcome to the City of Light! Airport pickup and city orientation.',
        activities: ['Airport pickup', 'City tour', 'Eiffel Tower visit'],
        meals: ['Dinner'],
        accommodation: 'Boutique Hotel in Paris'
      }
    ],
    inclusions: ['Accommodation', 'Meals', 'Transportation', 'Guide', 'Museum entries', 'City tours'],
    exclusions: ['Flights', 'Personal expenses', 'Travel insurance', 'Optional activities'],
    termsAndConditions: ['Valid for 12 months', 'Non-refundable', 'Minimum 4 travelers'],
    cancellationPolicy: {
      freeCancellationDays: 14,
      cancellationFees: [],
      refundPolicy: {
        refundable: true,
        refundPercentage: 75,
        processingDays: 21,
        conditions: []
      },
      forceMajeurePolicy: 'Full refund in case of travel restrictions'
    },
    images: [
      'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop'
    ],
    destinations: ['Paris', 'Rome', 'Barcelona', 'Amsterdam'],
    duration: { days: 14, nights: 13 } as PackageDuration,
    groupSize: { min: 4, max: 20, ideal: 12 } as GroupSize,
    difficulty: DifficultyLevel.EASY,
    tags: ['culture', 'history', 'cities', 'museums'],
    isFeatured: true,
    createdAt: new Date('2023-11-15'),
    updatedAt: new Date('2024-01-08')
  }
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
  {
    id: 'bk-001',
    packageId: 'pkg-001',
    customerId: 'cust-001',
    customerName: 'John Doe',
    customerEmail: 'john.doe@email.com',
    customerPhone: '+1-555-0201',
    travelAgentId: 'ta-001',
    travelAgentName: 'Emily Rodriguez',
    bookingDate: new Date('2024-01-10'),
    travelDate: new Date('2024-03-15'),
    numberOfTravelers: 2,
    totalAmount: 2598,
    status: 'confirmed',
    paymentStatus: 'paid',
    specialRequests: 'Vegetarian meals preferred',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'bk-002',
    packageId: 'pkg-002',
    customerId: 'cust-002',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah.wilson@email.com',
    customerPhone: '+1-555-0202',
    travelAgentId: 'ta-002',
    travelAgentName: 'Michael Chen',
    bookingDate: new Date('2024-01-08'),
    travelDate: new Date('2024-05-20'),
    numberOfTravelers: 4,
    totalAmount: 9996,
    status: 'pending',
    paymentStatus: 'pending',
    specialRequests: 'Wheelchair accessible room needed',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'New Booking Received',
    message: 'John Doe booked your Bali Adventure Package for March 15, 2024',
    type: 'booking',
    isRead: false,
    createdAt: new Date('2024-01-12T10:30:00Z'),
    actionUrl: '/operator/bookings/bk-001'
  },
  {
    id: 'notif-002',
    title: 'Payment Confirmed',
    message: 'Payment of $2,598 received for Bali Adventure Package booking',
    type: 'payment',
    isRead: false,
    createdAt: new Date('2024-01-12T11:15:00Z'),
    actionUrl: '/operator/bookings/bk-001'
  },
  {
    id: 'notif-003',
    title: 'Agent Inquiry',
    message: 'Jessica Williams requested information about your European Grand Tour',
    type: 'inquiry',
    isRead: true,
    createdAt: new Date('2024-01-11T14:20:00Z'),
    actionUrl: '/operator/packages/pkg-002'
  }
];

// Mock Activity Feed
export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: 'activity-001',
    type: 'booking',
    title: 'New Booking: Bali Adventure Package',
    description: 'John Doe booked Bali Adventure Package for 2 travelers',
    timestamp: new Date('2024-01-12T10:30:00Z'),
    userId: 'cust-001',
    userName: 'John Doe',
    metadata: { packageId: 'pkg-001', amount: 2598 }
  },
  {
    id: 'activity-002',
    type: 'payment',
    title: 'Payment Received',
    description: 'Payment of $2,598 confirmed for booking BK-001',
    timestamp: new Date('2024-01-12T11:15:00Z'),
    metadata: { bookingId: 'bk-001', amount: 2598 }
  },
  {
    id: 'activity-003',
    type: 'agent_joined',
    title: 'New Travel Agent Joined',
    description: 'Jessica Williams from Dream Destinations joined your network',
    timestamp: new Date('2024-01-10T09:00:00Z'),
    userId: 'ta-003',
    userName: 'Jessica Williams'
  }
];

// Mock Dashboard Statistics
export const mockDashboardStats: DashboardStats = {
  totalPackages: 24,
  activeBookings: 156,
  totalRevenue: 245800,
  totalAgents: 42,
  monthlyRevenue: 18500,
  monthlyGrowth: 15.2,
  averageRating: 4.8,
  totalCustomers: 89
};

// Mock Revenue Data
export const mockRevenueData: RevenueData[] = [
  { month: 'Jan 2023', revenue: 12000, bookings: 45, packages: 18 },
  { month: 'Feb 2023', revenue: 13500, bookings: 52, packages: 20 },
  { month: 'Mar 2023', revenue: 15800, bookings: 61, packages: 22 },
  { month: 'Apr 2023', revenue: 14200, bookings: 48, packages: 19 },
  { month: 'May 2023', revenue: 16800, bookings: 67, packages: 24 },
  { month: 'Jun 2023', revenue: 19200, bookings: 78, packages: 26 },
  { month: 'Jul 2023', revenue: 22100, bookings: 89, packages: 28 },
  { month: 'Aug 2023', revenue: 19800, bookings: 72, packages: 25 },
  { month: 'Sep 2023', revenue: 17500, bookings: 65, packages: 23 },
  { month: 'Oct 2023', revenue: 18900, bookings: 71, packages: 24 },
  { month: 'Nov 2023', revenue: 16200, bookings: 58, packages: 21 },
  { month: 'Dec 2023', revenue: 20100, bookings: 76, packages: 27 }
];

// Mock Package Analytics
export const mockPackageAnalytics: PackageAnalytics[] = [
  {
    packageId: 'pkg-001',
    packageName: 'Bali Adventure Package',
    views: 234,
    bookings: 45,
    revenue: 58455,
    conversionRate: 19.2,
    averageRating: 4.8,
    reviews: 23
  },
  {
    packageId: 'pkg-002',
    packageName: 'European Grand Tour',
    views: 189,
    bookings: 32,
    revenue: 79968,
    conversionRate: 16.9,
    averageRating: 4.6,
    reviews: 18
  }
];

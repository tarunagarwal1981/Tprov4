import { PackageType } from './types';

export interface PackageTypeInfo {
  type: PackageType;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradient: string;
  bgGradient: string;
  popular: boolean;
  features: string[];
  tips: string[];
  examples: string[];
  pricingTips: string[];
  mediaTips: string[];
}

export const packageTypeInfo: Record<PackageType, PackageTypeInfo> = {
  [PackageType.ACTIVITY]: {
    type: PackageType.ACTIVITY,
    title: 'Activity',
    subtitle: 'Single activity/experience',
    description: 'Perfect for single-day experiences, tours, and activities that don\'t require overnight stays.',
    icon: 'Activity',
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'from-emerald-50 to-teal-50',
    popular: true,
    features: [
      'Single-day experiences',
      'No accommodation needed',
      'Perfect for local tours',
      'Easy to manage'
    ],
    tips: [
      'Include detailed activity descriptions',
      'Specify duration and difficulty level',
      'Mention what\'s included (equipment, guide, etc.)',
      'Highlight unique selling points'
    ],
    examples: [
      'City walking tours',
      'Cooking classes',
      'Adventure activities',
      'Cultural experiences',
      'Food tours'
    ],
    pricingTips: [
      'Price per person',
      'Include all equipment costs',
      'Consider group discounts',
      'Factor in guide fees'
    ],
    mediaTips: [
      'Show the activity in action',
      'Include equipment and setup',
      'Show happy participants',
      'Highlight the experience'
    ]
  },
  [PackageType.TRANSFERS]: {
    type: PackageType.TRANSFERS,
    title: 'Transfers',
    subtitle: 'Point-to-point transportation',
    description: 'Transportation services between locations, airports, hotels, or attractions.',
    icon: 'Car',
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    popular: false,
    features: [
      'Airport transfers',
      'Hotel pickups',
      'City transportation',
      'Private or shared options'
    ],
    tips: [
      'Specify vehicle type and capacity',
      'Include pickup/dropoff locations',
      'Mention waiting time policies',
      'Detail luggage allowances'
    ],
    examples: [
      'Airport to hotel transfers',
      'City center transportation',
      'Inter-city transfers',
      'Tourist attraction shuttles'
    ],
    pricingTips: [
      'Price per vehicle or per person',
      'Include fuel and toll costs',
      'Consider distance-based pricing',
      'Offer round-trip discounts'
    ],
    mediaTips: [
      'Show vehicle interiors',
      'Include luggage space',
      'Show comfortable seating',
      'Highlight safety features'
    ]
  },
  [PackageType.MULTI_CITY_PACKAGE]: {
    type: PackageType.MULTI_CITY_PACKAGE,
    title: 'Multi City Package',
    subtitle: 'Multi-day tour without accommodation',
    description: 'Comprehensive ground-based tours covering multiple cities and destinations with activities and services, without accommodation included.',
    icon: 'Map',
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    popular: true,
    features: [
      'Multi-city itineraries',
      'Multiple destinations',
      'Comprehensive services',
      'No accommodation included',
      'Flexible routing'
    ],
    tips: [
      'Plan city-to-city logistics',
      'Include inter-city transportation',
      'Create detailed day-by-day itineraries',
      'Specify transportation details',
      'Mention group size limits'
    ],
    examples: [
      'European city hopping',
      'Asian multi-country tours',
      'Cultural heritage tours',
      'Adventure expeditions',
      'Educational tours'
    ],
    pricingTips: [
      'Include all transportation costs',
      'Consider city-specific pricing',
      'Break down costs by category',
      'Offer early bird discounts',
      'Consider seasonal pricing'
    ],
    mediaTips: [
      'Show diverse city highlights',
      'Include transportation between cities',
      'Show diverse destinations',
      'Include activity photos',
      'Show group activities'
    ]
  },
  [PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL]: {
    type: PackageType.MULTI_CITY_PACKAGE_WITH_HOTEL,
    title: 'Multi City Package with Hotel',
    subtitle: 'Multi-city tour with accommodation',
    description: 'Complete multi-city packages that include both tour activities and hotel accommodations across multiple destinations.',
    icon: 'Building',
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-50 to-red-50',
    popular: true,
    features: [
      'Multi-city tour + accommodation',
      'Hotel partnerships',
      'Convenient packages',
      'Flexible options',
      'Complete travel arrangements'
    ],
    tips: [
      'Specify hotel categories for each city',
      'Include room types available',
      'Mention hotel amenities',
      'Detail check-in/out policies',
      'Plan city-to-city logistics'
    ],
    examples: [
      'European city break packages',
      'Asian multi-country tours',
      'Beach resort tours',
      'Mountain retreat packages',
      'Spa and wellness tours'
    ],
    pricingTips: [
      'Include accommodation costs',
      'Consider room upgrade options',
      'Factor in hotel taxes',
      'Offer package discounts',
      'Include all transportation costs'
    ],
    mediaTips: [
      'Show hotel exteriors and rooms',
      'Include hotel amenities',
      'Show tour activities',
      'Highlight package value',
      'Show diverse city highlights'
    ]
  },
  [PackageType.FIXED_DEPARTURE_WITH_FLIGHT]: {
    type: PackageType.FIXED_DEPARTURE_WITH_FLIGHT,
    title: 'Fixed Departure with Flight',
    subtitle: 'Complete package with flights',
    description: 'Pre-scheduled group tours that include flights and complete travel arrangements with fixed departure dates.',
    icon: 'Plane',
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    popular: false,
    features: [
      'Fixed departure dates',
      'Group tours',
      'Flight included',
      'Complete travel package',
      'Pre-scheduled itineraries'
    ],
    tips: [
      'Set clear departure dates',
      'Specify group size limits',
      'Include flight details',
      'Mention booking deadlines',
      'Detail accommodation arrangements'
    ],
    examples: [
      'International group tours',
      'Cultural expeditions',
      'Adventure group trips',
      'Educational group tours',
      'Religious pilgrimage tours'
    ],
    pricingTips: [
      'Include all flight costs',
      'Consider group flight discounts',
      'Factor in baggage fees',
      'Offer payment plans',
      'Include accommodation costs'
    ],
    mediaTips: [
      'Show destination highlights',
      'Include group photos',
      'Show flight and accommodation',
      'Highlight group benefits',
      'Show complete package value'
    ]
  }
};

export function getPackageTypeInfo(type: PackageType): PackageTypeInfo {
  return packageTypeInfo[type];
}

export function getPackageTypeTips(type: PackageType, category: 'tips' | 'pricingTips' | 'mediaTips'): string[] {
  return packageTypeInfo[type][category];
}

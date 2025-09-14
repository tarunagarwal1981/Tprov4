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
    subtitle: 'Day trips & experiences',
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
    subtitle: 'Transportation only',
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
  [PackageType.LAND_PACKAGE]: {
    type: PackageType.LAND_PACKAGE,
    title: 'Land Package',
    subtitle: 'Complete ground tour',
    description: 'Comprehensive ground-based tours with multiple destinations, activities, and services.',
    icon: 'Package',
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    popular: true,
    features: [
      'Multi-day itineraries',
      'Multiple destinations',
      'Comprehensive services',
      'All-inclusive options'
    ],
    tips: [
      'Create detailed day-by-day itineraries',
      'Include all meals and activities',
      'Specify accommodation standards',
      'Mention group size limits'
    ],
    examples: [
      'Cultural heritage tours',
      'Adventure expeditions',
      'Wellness retreats',
      'Educational tours',
      'Photography workshops'
    ],
    pricingTips: [
      'Break down costs by category',
      'Include all inclusions clearly',
      'Offer early bird discounts',
      'Consider seasonal pricing'
    ],
    mediaTips: [
      'Show diverse destinations',
      'Include accommodation photos',
      'Show group activities',
      'Highlight unique experiences'
    ]
  },
  [PackageType.HOTEL]: {
    type: PackageType.HOTEL,
    title: 'Land Package with Hotel',
    subtitle: 'Tour + accommodation',
    description: 'Complete packages that include both tour activities and hotel accommodations.',
    icon: 'Building',
    gradient: 'from-orange-500 to-red-600',
    bgGradient: 'from-orange-50 to-red-50',
    popular: true,
    features: [
      'Tour + accommodation',
      'Convenient packages',
      'Hotel partnerships',
      'Flexible options'
    ],
    tips: [
      'Specify hotel categories',
      'Include room types available',
      'Mention hotel amenities',
      'Detail check-in/out policies'
    ],
    examples: [
      'City break packages',
      'Beach resort tours',
      'Mountain retreat packages',
      'Spa and wellness tours'
    ],
    pricingTips: [
      'Include accommodation costs',
      'Consider room upgrade options',
      'Factor in hotel taxes',
      'Offer package discounts'
    ],
    mediaTips: [
      'Show hotel exteriors and rooms',
      'Include hotel amenities',
      'Show tour activities',
      'Highlight package value'
    ]
  },
  [PackageType.FLIGHT]: {
    type: PackageType.FLIGHT,
    title: 'Fixed Departure with Flight',
    subtitle: 'Group tours with flights',
    description: 'Pre-scheduled group tours that include flights and complete travel arrangements.',
    icon: 'Plane',
    gradient: 'from-sky-500 to-blue-600',
    bgGradient: 'from-sky-50 to-blue-50',
    popular: false,
    features: [
      'Fixed departure dates',
      'Group tours',
      'Flight included',
      'Complete travel package'
    ],
    tips: [
      'Set clear departure dates',
      'Specify group size limits',
      'Include flight details',
      'Mention booking deadlines'
    ],
    examples: [
      'International group tours',
      'Cultural expeditions',
      'Adventure group trips',
      'Educational group tours'
    ],
    pricingTips: [
      'Include all flight costs',
      'Consider group flight discounts',
      'Factor in baggage fees',
      'Offer payment plans'
    ],
    mediaTips: [
      'Show destination highlights',
      'Include group photos',
      'Show flight and accommodation',
      'Highlight group benefits'
    ]
  },
  [PackageType.CRUISE]: {
    type: PackageType.CRUISE,
    title: 'Cruise Package',
    subtitle: 'Cruise + shore excursions',
    description: 'Cruise packages with included shore excursions and onboard activities.',
    icon: 'Ship',
    gradient: 'from-cyan-500 to-blue-600',
    bgGradient: 'from-cyan-50 to-blue-50',
    popular: false,
    features: [
      'Cruise accommodation',
      'Shore excursions',
      'Onboard activities',
      'All-inclusive dining'
    ],
    tips: [
      'Specify cruise line and ship',
      'Detail cabin categories',
      'Include shore excursion options',
      'Mention onboard amenities'
    ],
    examples: [
      'Mediterranean cruises',
      'Caribbean cruises',
      'Alaska cruises',
      'River cruises'
    ],
    pricingTips: [
      'Include cruise and excursion costs',
      'Consider cabin upgrade options',
      'Factor in port fees',
      'Offer early booking discounts'
    ],
    mediaTips: [
      'Show ship exteriors and cabins',
      'Include shore excursion photos',
      'Show onboard activities',
      'Highlight cruise amenities'
    ]
  },
  [PackageType.COMBO]: {
    type: PackageType.COMBO,
    title: 'Combo Package',
    subtitle: 'Multiple package types',
    description: 'Combination packages that include multiple types of experiences and services.',
    icon: 'Layers',
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
    popular: false,
    features: [
      'Multiple experiences',
      'Flexible combinations',
      'Customizable options',
      'Value packages'
    ],
    tips: [
      'Clearly define what\'s included',
      'Offer customization options',
      'Specify package combinations',
      'Highlight value proposition'
    ],
    examples: [
      'Activity + Transfer combos',
      'Hotel + Tour packages',
      'Multi-city experiences',
      'Seasonal packages'
    ],
    pricingTips: [
      'Show savings vs individual prices',
      'Offer combo discounts',
      'Include all service costs',
      'Provide flexible payment options'
    ],
    mediaTips: [
      'Show all included services',
      'Highlight combination benefits',
      'Include diverse experiences',
      'Show value proposition'
    ]
  },
  [PackageType.CUSTOM]: {
    type: PackageType.CUSTOM,
    title: 'Custom Package',
    subtitle: 'Tailored experiences',
    description: 'Fully customized packages designed specifically for individual or group needs.',
    icon: 'Settings',
    gradient: 'from-gray-500 to-slate-600',
    bgGradient: 'from-gray-50 to-slate-50',
    popular: false,
    features: [
      'Fully customizable',
      'Personalized service',
      'Flexible itineraries',
      'Tailored experiences'
    ],
    tips: [
      'Gather detailed requirements',
      'Offer consultation services',
      'Provide flexible options',
      'Set clear customization limits'
    ],
    examples: [
      'Private group tours',
      'Corporate retreats',
      'Special occasion packages',
      'Bespoke experiences'
    ],
    pricingTips: [
      'Provide detailed quotes',
      'Include consultation fees',
      'Offer package tiers',
      'Set minimum group sizes'
    ],
    mediaTips: [
      'Show customization process',
      'Include consultation photos',
      'Show diverse custom options',
      'Highlight personalization'
    ]
  }
};

export function getPackageTypeInfo(type: PackageType): PackageTypeInfo {
  return packageTypeInfo[type];
}

export function getPackageTypeTips(type: PackageType, category: 'tips' | 'pricingTips' | 'mediaTips'): string[] {
  return packageTypeInfo[type][category];
}

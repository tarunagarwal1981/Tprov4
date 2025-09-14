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
  [PackageType.LAND_PACKAGE]: {
    type: PackageType.LAND_PACKAGE,
    title: 'Land Package',
    subtitle: 'Multi-day tour without accommodation',
    description: 'Comprehensive ground-based tours with multiple destinations, activities, and services without accommodation.',
    icon: 'Package',
    gradient: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    popular: true,
    features: [
      'Multi-day itineraries',
      'Multiple destinations',
      'Comprehensive services',
      'No accommodation included'
    ],
    tips: [
      'Create detailed day-by-day itineraries',
      'Include all meals and activities',
      'Specify transportation details',
      'Mention group size limits'
    ],
    examples: [
      'Cultural heritage tours',
      'Adventure expeditions',
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
      'Include activity photos',
      'Show group activities',
      'Highlight unique experiences'
    ]
  },
  [PackageType.LAND_PACKAGE_WITH_HOTEL]: {
    type: PackageType.LAND_PACKAGE_WITH_HOTEL,
    title: 'Land Package with Hotel',
    subtitle: 'Multi-day tour with accommodation',
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
  [PackageType.FIXED_DEPARTURE_WITH_FLIGHT]: {
    type: PackageType.FIXED_DEPARTURE_WITH_FLIGHT,
    title: 'Fixed Departure with Flight',
    subtitle: 'Complete package with flights',
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
  [PackageType.DAY_TOUR]: {
    type: PackageType.DAY_TOUR,
    title: 'Day Tour',
    subtitle: 'Single day complete tour',
    description: 'Complete single-day tours that include activities, transportation, and meals.',
    icon: 'Sun',
    gradient: 'from-yellow-500 to-orange-600',
    bgGradient: 'from-yellow-50 to-orange-50',
    popular: true,
    features: [
      'Single day complete experience',
      'All-inclusive day tours',
      'Transportation included',
      'Perfect for day trips'
    ],
    tips: [
      'Specify start and end times',
      'Include all activities and meals',
      'Mention pickup points',
      'Detail what\'s included'
    ],
    examples: [
      'City sightseeing tours',
      'Nature day trips',
      'Cultural day experiences',
      'Adventure day tours'
    ],
    pricingTips: [
      'All-inclusive pricing',
      'Include transportation costs',
      'Consider meal inclusions',
      'Offer group discounts'
    ],
    mediaTips: [
      'Show day itinerary highlights',
      'Include transportation photos',
      'Show meal experiences',
      'Highlight day tour value'
    ]
  },
  [PackageType.MULTI_CITY_TOUR]: {
    type: PackageType.MULTI_CITY_TOUR,
    title: 'Multi-City Tour',
    subtitle: 'Multiple cities/destinations',
    description: 'Extended tours covering multiple cities and destinations with comprehensive travel arrangements.',
    icon: 'Map',
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50',
    popular: false,
    features: [
      'Multiple cities/destinations',
      'Extended itineraries',
      'Comprehensive travel',
      'Flexible routing'
    ],
    tips: [
      'Plan city-to-city logistics',
      'Include inter-city transportation',
      'Specify accommodation in each city',
      'Detail city-specific activities'
    ],
    examples: [
      'European city hopping',
      'Asian multi-country tours',
      'American coast-to-coast',
      'African safari circuits'
    ],
    pricingTips: [
      'Include all transportation costs',
      'Consider city-specific pricing',
      'Factor in visa requirements',
      'Offer flexible payment options'
    ],
    mediaTips: [
      'Show diverse city highlights',
      'Include transportation between cities',
      'Show accommodation variety',
      'Highlight multi-city value'
    ]
  }
};

export function getPackageTypeInfo(type: PackageType): PackageTypeInfo {
  return packageTypeInfo[type];
}

export function getPackageTypeTips(type: PackageType, category: 'tips' | 'pricingTips' | 'mediaTips'): string[] {
  return packageTypeInfo[type][category];
}

// =============================================
// OPTIMIZED PACKAGE TYPES
// Production-ready, scalable, and type-safe
// =============================================

import { Database } from './database.types'

// Re-export existing types from your current types.ts
export * from './types'

// =============================================
// SUPABASE-SPECIFIC TYPES
// =============================================

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// =============================================
// DATABASE TABLE TYPES
// =============================================

export type DbUser = Tables<'users'>
export type DbTourOperator = Tables<'tour_operators'>
export type DbPackage = Tables<'packages'>
export type DbPackageDestination = Tables<'package_destinations'>
export type DbPackageInclusion = Tables<'package_inclusions'>
export type DbPackageExclusion = Tables<'package_exclusions'>
export type DbPackageItinerary = Tables<'package_itinerary'>
export type DbPackageTypeDetail = Tables<'package_type_details'>
export type DbPackageCancellationPolicy = Tables<'package_cancellation_policies'>
export type DbPackageImage = Tables<'package_images'>
export type DbBooking = Tables<'bookings'>
export type DbBookingTraveler = Tables<'booking_travelers'>
export type DbReview = Tables<'reviews'>
export type DbDestination = Tables<'destinations'>

// =============================================
// INSERT TYPES
// =============================================

export type DbUserInsert = Database['public']['Tables']['users']['Insert']
export type DbTourOperatorInsert = Database['public']['Tables']['tour_operators']['Insert']
export type DbPackageInsert = Database['public']['Tables']['packages']['Insert']
export type DbPackageDestinationInsert = Database['public']['Tables']['package_destinations']['Insert']
export type DbPackageInclusionInsert = Database['public']['Tables']['package_inclusions']['Insert']
export type DbPackageExclusionInsert = Database['public']['Tables']['package_exclusions']['Insert']
export type DbPackageItineraryInsert = Database['public']['Tables']['package_itinerary']['Insert']
export type DbPackageTypeDetailInsert = Database['public']['Tables']['package_type_details']['Insert']
export type DbPackageCancellationPolicyInsert = Database['public']['Tables']['package_cancellation_policies']['Insert']
export type DbPackageImageInsert = Database['public']['Tables']['package_images']['Insert']
export type DbBookingInsert = Database['public']['Tables']['bookings']['Insert']
export type DbBookingTravelerInsert = Database['public']['Tables']['booking_travelers']['Insert']
export type DbReviewInsert = Database['public']['Tables']['reviews']['Insert']

// =============================================
// UPDATE TYPES
// =============================================

export type DbUserUpdate = Database['public']['Tables']['users']['Update']
export type DbTourOperatorUpdate = Database['public']['Tables']['tour_operators']['Update']
export type DbPackageUpdate = Database['public']['Tables']['packages']['Update']
export type DbPackageDestinationUpdate = Database['public']['Tables']['package_destinations']['Update']
export type DbPackageInclusionUpdate = Database['public']['Tables']['package_inclusions']['Update']
export type DbPackageExclusionUpdate = Database['public']['Tables']['package_exclusions']['Update']
export type DbPackageItineraryUpdate = Database['public']['Tables']['package_itinerary']['Update']
export type DbPackageTypeDetailUpdate = Database['public']['Tables']['package_type_details']['Update']
export type DbPackageCancellationPolicyUpdate = Database['public']['Tables']['package_cancellation_policies']['Update']
export type DbPackageImageUpdate = Database['public']['Tables']['package_images']['Update']
export type DbBookingUpdate = Database['public']['Tables']['bookings']['Update']
export type DbBookingTravelerUpdate = Database['public']['Tables']['booking_travelers']['Update']
export type DbReviewUpdate = Database['public']['Tables']['reviews']['Update']

// =============================================
// EXTENDED TYPES WITH RELATIONSHIPS
// =============================================

export interface PackageWithDetails extends DbPackage {
  tour_operator: DbTourOperator & {
    user: DbUser
  }
  destinations: DbPackageDestination[]
  inclusions: DbPackageInclusion[]
  exclusions: DbPackageExclusion[]
  itinerary: DbPackageItinerary[]
  type_details: DbPackageTypeDetail[]
  cancellation_policies: DbPackageCancellationPolicy[]
  images: DbPackageImage[]
  reviews: DbReview[]
}

export interface BookingWithDetails extends DbBooking {
  package: PackageWithDetails
  user: DbUser
  travel_agent?: DbUser
  travelers: DbBookingTraveler[]
}

export interface ReviewWithDetails extends DbReview {
  user: DbUser
  package: DbPackage
}

// =============================================
// OPTIMIZED PACKAGE FORM DATA
// =============================================

export interface OptimizedPackageFormData {
  // Basic info
  title: string
  description: string
  short_description?: string
  type: PackageType
  status: PackageStatus
  
  // Pricing
  adult_price: number
  child_price: number
  currency: string
  
  // Duration and group
  duration_days: number
  duration_hours: number
  min_group_size: number
  max_group_size: number
  
  // Basic package info
  difficulty: DifficultyLevel
  tags: string[]
  
  // SEO
  slug?: string
  meta_title?: string
  meta_description?: string
  
  // Destinations
  destinations: {
    destination_id: string
    is_primary: boolean
    order_index: number
  }[]
  
  // Inclusions and exclusions
  inclusions: string[]
  exclusions: string[]
  
  // Itinerary
  itinerary: {
    day_number: number
    title: string
    description: string
    activities: string[]
    meals_included: string[]
    accommodation?: string
    transportation?: string
    order_index: number
  }[]
  
  // Type-specific details
  type_details: {
    field_name: string
    field_value: string
    field_type: 'text' | 'number' | 'boolean' | 'date'
  }[]
  
  // Cancellation policies
  cancellation_policies: {
    days_before_departure: number
    cancellation_fee_percentage: number
    description?: string
  }[]
  
  // Images
  images: {
    url: string
    alt_text: string
    caption?: string
    is_primary: boolean
    order_index: number
  }[]
}

// =============================================
// SERVICE RESPONSE TYPES
// =============================================

export interface ServiceResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// =============================================
// FILTER AND SEARCH TYPES
// =============================================

export interface PackageFilters {
  type?: PackageType
  status?: PackageStatus
  difficulty?: DifficultyLevel
  priceRange?: {
    min: number
    max: number
  }
  destinations?: string[]
  tags?: string[]
  featured?: boolean
  rating?: {
    min: number
    max: number
  }
  duration?: {
    min: number
    max: number
  }
  groupSize?: {
    min: number
    max: number
  }
}

export interface PackageSearchParams {
  query?: string
  filters?: PackageFilters
  sortBy?: 'title' | 'price' | 'createdAt' | 'rating' | 'duration'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// =============================================
// BOOKING TYPES
// =============================================

export interface BookingFormData {
  package_id: string
  adult_count: number
  child_count: number
  departure_date: string
  return_date?: string
  special_requests: string[]
  notes?: string
  travelers: {
    first_name: string
    last_name: string
    email: string
    phone?: string
    date_of_birth?: string
    passport_number?: string
    passport_expiry?: string
    dietary_requirements: string[]
    medical_conditions: string[]
    emergency_contact_name?: string
    emergency_contact_phone?: string
  }[]
}

// =============================================
// REVIEW TYPES
// =============================================

export interface ReviewFormData {
  package_id: string
  booking_id?: string
  rating: number
  title: string
  comment: string
  pros: string[]
  cons: string[]
}

// =============================================
// UTILITY TYPES
// =============================================

export interface PackageStats {
  total_packages: number
  active_packages: number
  draft_packages: number
  total_bookings: number
  total_revenue: number
  average_rating: number
  packages_by_type: Record<PackageType, number>
  packages_by_status: Record<PackageStatus, number>
}

export interface TourOperatorStats {
  total_packages: number
  active_packages: number
  total_bookings: number
  total_revenue: number
  average_rating: number
  verification_status: boolean
}

// =============================================
// API RESPONSE TYPES
// =============================================

export interface SupabaseResponse<T> {
  data: T | null
  error: any | null
}

export interface SupabaseListResponse<T> {
  data: T[] | null
  error: any | null
  count?: number | null
}

// =============================================
// TYPE GUARDS
// =============================================

export function isPackageType(type: string): type is PackageType {
  return ['ACTIVITY', 'TRANSFERS', 'MULTI_CITY_PACKAGE', 'MULTI_CITY_PACKAGE_WITH_HOTEL', 'FIXED_DEPARTURE_WITH_FLIGHT'].includes(type)
}

export function isPackageStatus(status: string): status is PackageStatus {
  return ['DRAFT', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'ARCHIVED'].includes(status)
}

export function isDifficultyLevel(difficulty: string): difficulty is DifficultyLevel {
  return ['EASY', 'MODERATE', 'CHALLENGING', 'EXPERT'].includes(difficulty)
}

// =============================================
// CONSTANTS
// =============================================

export const PACKAGE_TYPES = {
  ACTIVITY: 'ACTIVITY',
  TRANSFERS: 'TRANSFERS',
  MULTI_CITY_PACKAGE: 'MULTI_CITY_PACKAGE',
  MULTI_CITY_PACKAGE_WITH_HOTEL: 'MULTI_CITY_PACKAGE_WITH_HOTEL',
  FIXED_DEPARTURE_WITH_FLIGHT: 'FIXED_DEPARTURE_WITH_FLIGHT'
} as const

export const PACKAGE_STATUSES = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  ARCHIVED: 'ARCHIVED'
} as const

export const DIFFICULTY_LEVELS = {
  EASY: 'EASY',
  MODERATE: 'MODERATE',
  CHALLENGING: 'CHALLENGING',
  EXPERT: 'EXPERT'
} as const

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  INR: 'INR'
} as const

export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date'
} as const

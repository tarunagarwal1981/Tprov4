import { Database } from './database.types'

// Re-export existing types from your current types.ts
export * from './types'

// Supabase-specific types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Database table types
export type DbUser = Tables<'users'>
export type DbTourOperator = Tables<'tour_operators'>
export type DbPackage = Tables<'packages'>
export type DbBooking = Tables<'bookings'>
export type DbReview = Tables<'reviews'>
export type DbPackageImage = Tables<'package_images'>
export type DbDestination = Tables<'destinations'>

// Insert types
export type DbUserInsert = Database['public']['Tables']['users']['Insert']
export type DbTourOperatorInsert = Database['public']['Tables']['tour_operators']['Insert']
export type DbPackageInsert = Database['public']['Tables']['packages']['Insert']
export type DbBookingInsert = Database['public']['Tables']['bookings']['Insert']
export type DbReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type DbPackageImageInsert = Database['public']['Tables']['package_images']['Insert']

// Update types
export type DbUserUpdate = Database['public']['Tables']['users']['Update']
export type DbTourOperatorUpdate = Database['public']['Tables']['tour_operators']['Update']
export type DbPackageUpdate = Database['public']['Tables']['packages']['Update']
export type DbBookingUpdate = Database['public']['Tables']['bookings']['Update']
export type DbReviewUpdate = Database['public']['Tables']['reviews']['Update']

// Extended types with relationships
export interface PackageWithDetails extends DbPackage {
  tour_operator: DbTourOperator & {
    user: DbUser
  }
  images: DbPackageImage[]
  reviews: DbReview[]
  destinations: DbDestination[]
}

export interface BookingWithDetails extends DbBooking {
  package: PackageWithDetails
  user: DbUser
  travel_agent?: DbUser
}

export interface ReviewWithDetails extends DbReview {
  user: DbUser
  package: DbPackage
}

// Supabase response types
export interface SupabaseResponse<T> {
  data: T | null
  error: any | null
}

export interface SupabaseListResponse<T> {
  data: T[] | null
  error: any | null
  count?: number | null
}

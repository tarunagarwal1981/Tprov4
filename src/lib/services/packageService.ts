import { supabase, supabaseAdmin } from './supabase'
import { 
  DbPackage, 
  DbPackageInsert, 
  DbPackageUpdate, 
  PackageWithDetails,
  SupabaseResponse,
  SupabaseListResponse 
} from './supabase-types'
import { Package, PackageStatus, PackageType } from './types'

export class PackageService {
  // Create a new package
  static async createPackage(packageData: DbPackageInsert): Promise<SupabaseResponse<DbPackage>> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert(packageData)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating package:', error)
      return { data: null, error }
    }
  }

  // Get package by ID with full details
  static async getPackageById(id: string): Promise<SupabaseResponse<PackageWithDetails>> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          tour_operator:tour_operators(
            *,
            user:users(*)
          ),
          images:package_images(*),
          reviews:reviews(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error fetching package:', error)
      return { data: null, error }
    }
  }

  // Get packages with filtering and pagination
  static async getPackages(options: {
    status?: PackageStatus
    type?: PackageType
    tourOperatorId?: string
    featured?: boolean
    limit?: number
    offset?: number
    search?: string
    destinations?: string[]
    tags?: string[]
  } = {}): Promise<SupabaseListResponse<PackageWithDetails>> {
    try {
      let query = supabase
        .from('packages')
        .select(`
          *,
          tour_operator:tour_operators(
            *,
            user:users(*)
          ),
          images:package_images(*),
          reviews:reviews(*)
        `, { count: 'exact' })

      // Apply filters
      if (options.status) {
        query = query.eq('status', options.status)
      }
      
      if (options.type) {
        query = query.eq('type', options.type)
      }
      
      if (options.tourOperatorId) {
        query = query.eq('tour_operator_id', options.tourOperatorId)
      }
      
      if (options.featured !== undefined) {
        query = query.eq('is_featured', options.featured)
      }
      
      if (options.search) {
        query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`)
      }
      
      if (options.destinations && options.destinations.length > 0) {
        query = query.overlaps('destinations', options.destinations)
      }
      
      if (options.tags && options.tags.length > 0) {
        query = query.overlaps('tags', options.tags)
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit)
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      // Order by created_at desc by default
      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error
      return { data, error: null, count }
    } catch (error) {
      console.error('Error fetching packages:', error)
      return { data: null, error, count: null }
    }
  }

  // Update package
  static async updatePackage(id: string, updates: DbPackageUpdate): Promise<SupabaseResponse<DbPackage>> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error updating package:', error)
      return { data: null, error }
    }
  }

  // Delete package
  static async deletePackage(id: string): Promise<SupabaseResponse<void>> {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      console.error('Error deleting package:', error)
      return { data: null, error }
    }
  }

  // Update package status
  static async updatePackageStatus(id: string, status: PackageStatus): Promise<SupabaseResponse<DbPackage>> {
    return this.updatePackage(id, { status })
  }

  // Get packages by tour operator
  static async getPackagesByTourOperator(tourOperatorId: string): Promise<SupabaseListResponse<PackageWithDetails>> {
    return this.getPackages({ tourOperatorId })
  }

  // Get featured packages
  static async getFeaturedPackages(limit: number = 10): Promise<SupabaseListResponse<PackageWithDetails>> {
    return this.getPackages({ featured: true, status: 'ACTIVE', limit })
  }

  // Search packages
  static async searchPackages(searchTerm: string, limit: number = 20): Promise<SupabaseListResponse<PackageWithDetails>> {
    return this.getPackages({ search: searchTerm, status: 'ACTIVE', limit })
  }

  // Get packages by destination
  static async getPackagesByDestination(destination: string, limit: number = 20): Promise<SupabaseListResponse<PackageWithDetails>> {
    return this.getPackages({ destinations: [destination], status: 'ACTIVE', limit })
  }

  // Get packages by tags
  static async getPackagesByTags(tags: string[], limit: number = 20): Promise<SupabaseListResponse<PackageWithDetails>> {
    return this.getPackages({ tags, status: 'ACTIVE', limit })
  }

  // Convert database package to app package format
  static convertToAppPackage(dbPackage: PackageWithDetails): Package {
    return {
      id: dbPackage.id,
      tourOperatorId: dbPackage.tour_operator_id,
      title: dbPackage.title,
      description: dbPackage.description,
      type: dbPackage.type as PackageType,
      status: dbPackage.status as PackageStatus,
      pricing: dbPackage.pricing as any,
      itinerary: dbPackage.itinerary as any,
      inclusions: dbPackage.inclusions,
      exclusions: dbPackage.exclusions,
      termsAndConditions: dbPackage.terms_and_conditions,
      cancellationPolicy: dbPackage.cancellation_policy as any,
      images: dbPackage.images,
      destinations: dbPackage.destinations,
      duration: dbPackage.duration as any,
      groupSize: dbPackage.group_size as any,
      difficulty: dbPackage.difficulty as any,
      tags: dbPackage.tags,
      isFeatured: dbPackage.is_featured,
      rating: dbPackage.rating,
      reviewCount: dbPackage.review_count,
      createdAt: new Date(dbPackage.created_at),
      updatedAt: new Date(dbPackage.updated_at)
    }
  }

  // Convert app package to database format
  static convertToDbPackage(appPackage: Partial<Package>): DbPackageInsert {
    return {
      tour_operator_id: appPackage.tourOperatorId!,
      title: appPackage.title!,
      description: appPackage.description!,
      type: appPackage.type!,
      status: appPackage.status || 'DRAFT',
      pricing: appPackage.pricing as any,
      itinerary: appPackage.itinerary as any,
      inclusions: appPackage.inclusions || [],
      exclusions: appPackage.exclusions || [],
      terms_and_conditions: appPackage.termsAndConditions || [],
      cancellation_policy: appPackage.cancellationPolicy as any,
      images: appPackage.images || [],
      destinations: appPackage.destinations || [],
      duration: appPackage.duration as any,
      group_size: appPackage.groupSize as any,
      difficulty: appPackage.difficulty || 'EASY',
      tags: appPackage.tags || [],
      is_featured: appPackage.isFeatured || false,
      rating: appPackage.rating || 0,
      review_count: appPackage.reviewCount || 0
    }
  }
}
import { supabase } from '../supabase'
import { 
  DbPackage, 
  DbPackageInsert, 
  DbPackageUpdate, 
  PackageWithDetails,
  OptimizedPackageFormData,
  ServiceResponse,
  PaginatedResponse,
  PackageFilters,
  PackageSearchParams,
  SupabaseResponse,
  SupabaseListResponse 
} from '../optimized-supabase-types'
import { Package, PackageStatus, PackageType } from '../types'

// =============================================
// OPTIMIZED PACKAGE SERVICE
// Production-ready, scalable, and efficient
// =============================================

export class OptimizedPackageService {
  
  // =============================================
  // PACKAGE CRUD OPERATIONS
  // =============================================
  
  async createPackage(packageData: OptimizedPackageFormData): Promise<ServiceResponse<Package>> {
    try {
      const { data: packageResult, error: packageError } = await supabase
        .from('packages')
        .insert({
          title: packageData.title,
          description: packageData.description,
          short_description: packageData.short_description,
          type: packageData.type,
          status: packageData.status,
          adult_price: packageData.adult_price,
          child_price: packageData.child_price,
          currency: packageData.currency,
          duration_days: packageData.duration_days,
          duration_hours: packageData.duration_hours,
          min_group_size: packageData.min_group_size,
          max_group_size: packageData.max_group_size,
          difficulty: packageData.difficulty,
          tags: packageData.tags,
          meta_title: packageData.meta_title,
          meta_description: packageData.meta_description
        })
        .select()
        .single()

      if (packageError) throw packageError

      const packageId = packageResult.id

      // Insert related data in parallel for better performance
      await Promise.all([
        this.insertPackageDestinations(packageId, packageData.destinations),
        this.insertPackageInclusions(packageId, packageData.inclusions),
        this.insertPackageExclusions(packageId, packageData.exclusions),
        this.insertPackageItinerary(packageId, packageData.itinerary),
        this.insertPackageTypeDetails(packageId, packageData.type_details),
        this.insertPackageCancellationPolicies(packageId, packageData.cancellation_policies),
        this.insertPackageImages(packageId, packageData.images)
      ])

      const fullPackage = await this.getPackageById(packageId)
      
      return {
        data: this.convertToAppPackage(fullPackage.data),
        success: true,
        message: 'Package created successfully'
      }
    } catch (error) {
      console.error('Error creating package:', error)
      return {
        data: {} as Package,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async updatePackage(id: string, packageData: Partial<OptimizedPackageFormData>): Promise<ServiceResponse<Package>> {
    try {
      // Update main package data
      const { error: packageError } = await supabase
        .from('packages')
        .update({
          title: packageData.title,
          description: packageData.description,
          short_description: packageData.short_description,
          type: packageData.type,
          status: packageData.status,
          adult_price: packageData.adult_price,
          child_price: packageData.child_price,
          currency: packageData.currency,
          duration_days: packageData.duration_days,
          duration_hours: packageData.duration_hours,
          min_group_size: packageData.min_group_size,
          max_group_size: packageData.max_group_size,
          difficulty: packageData.difficulty,
          tags: packageData.tags,
          meta_title: packageData.meta_title,
          meta_description: packageData.meta_description
        })
        .eq('id', id)

      if (packageError) throw packageError

      // Update related data if provided
      if (packageData.destinations) {
        await this.updatePackageDestinations(id, packageData.destinations)
      }
      if (packageData.inclusions) {
        await this.updatePackageInclusions(id, packageData.inclusions)
      }
      if (packageData.exclusions) {
        await this.updatePackageExclusions(id, packageData.exclusions)
      }
      if (packageData.itinerary) {
        await this.updatePackageItinerary(id, packageData.itinerary)
      }
      if (packageData.type_details) {
        await this.updatePackageTypeDetails(id, packageData.type_details)
      }
      if (packageData.cancellation_policies) {
        await this.updatePackageCancellationPolicies(id, packageData.cancellation_policies)
      }
      if (packageData.images) {
        await this.updatePackageImages(id, packageData.images)
      }

      const fullPackage = await this.getPackageById(id)
      
      return {
        data: this.convertToAppPackage(fullPackage.data),
        success: true,
        message: 'Package updated successfully'
      }
    } catch (error) {
      console.error('Error updating package:', error)
      return {
        data: {} as Package,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getPackageById(id: string): Promise<ServiceResponse<PackageWithDetails>> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          tour_operator:tour_operators(
            *,
            user:users(*)
          ),
          destinations:package_destinations(
            *,
            destination:destinations(*)
          ),
          inclusions:package_inclusions(*),
          exclusions:package_exclusions(*),
          itinerary:package_itinerary(*),
          type_details:package_type_details(*),
          cancellation_policies:package_cancellation_policies(*),
          images:package_images(*),
          reviews:reviews(*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return {
        data: data as PackageWithDetails,
        success: true
      }
    } catch (error) {
      console.error('Error fetching package:', error)
      return {
        data: {} as PackageWithDetails,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async deletePackage(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {
        data: true,
        success: true,
        message: 'Package deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting package:', error)
      return {
        data: false,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // =============================================
  // PACKAGE SEARCH AND FILTERING
  // =============================================
  
  async searchPackages(params: PackageSearchParams): Promise<PaginatedResponse<Package>> {
    try {
      let query = supabase
        .from('packages')
        .select(`
          *,
          tour_operator:tour_operators(
            *,
            user:users(*)
          ),
          destinations:package_destinations(
            *,
            destination:destinations(*)
          ),
          images:package_images(*)
        `, { count: 'exact' })

      // Apply filters
      if (params.filters) {
        const { filters } = params
        
        if (filters.type) {
          query = query.eq('type', filters.type)
        }
        
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        
        if (filters.difficulty) {
          query = query.eq('difficulty', filters.difficulty)
        }
        
        if (filters.priceRange) {
          query = query.gte('adult_price', filters.priceRange.min)
          query = query.lte('adult_price', filters.priceRange.max)
        }
        
        if (filters.rating) {
          query = query.gte('rating', filters.rating.min)
          query = query.lte('rating', filters.rating.max)
        }
        
        if (filters.duration) {
          query = query.gte('duration_days', filters.duration.min)
          query = query.lte('duration_days', filters.duration.max)
        }
        
        if (filters.groupSize) {
          query = query.gte('min_group_size', filters.groupSize.min)
          query = query.lte('max_group_size', filters.groupSize.max)
        }
        
        if (filters.featured !== undefined) {
          query = query.eq('is_featured', filters.featured)
        }
        
        if (filters.tags && filters.tags.length > 0) {
          query = query.overlaps('tags', filters.tags)
        }
        
        if (filters.destinations && filters.destinations.length > 0) {
          query = query.in('destinations.destination_id', filters.destinations)
        }
      }

      // Apply text search
      if (params.query) {
        query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%,short_description.ilike.%${params.query}%`)
      }

      // Apply sorting
      if (params.sortBy) {
        const sortOrder = params.sortOrder || 'desc'
        query = query.order(params.sortBy, { ascending: sortOrder === 'asc' })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      // Apply pagination
      const page = params.page || 1
      const limit = params.limit || 20
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      const packages = data?.map(pkg => this.convertToAppPackage(pkg)) || []
      const total = count || 0
      const totalPages = Math.ceil(total / limit)

      return {
        data: packages,
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    } catch (error) {
      console.error('Error searching packages:', error)
      return {
        data: [],
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    }
  }

  // =============================================
  // HELPER METHODS FOR RELATED DATA
  // =============================================
  
  private async insertPackageDestinations(packageId: string, destinations: any[]) {
    if (destinations.length === 0) return
    
    const { error } = await supabase
      .from('package_destinations')
      .insert(destinations.map(dest => ({
        package_id: packageId,
        destination_id: dest.destination_id,
        is_primary: dest.is_primary,
        order_index: dest.order_index
      })))

    if (error) throw error
  }

  private async insertPackageInclusions(packageId: string, inclusions: string[]) {
    if (inclusions.length === 0) return
    
    const { error } = await supabase
      .from('package_inclusions')
      .insert(inclusions.map((inclusion, index) => ({
        package_id: packageId,
        inclusion,
        order_index: index
      })))

    if (error) throw error
  }

  private async insertPackageExclusions(packageId: string, exclusions: string[]) {
    if (exclusions.length === 0) return
    
    const { error } = await supabase
      .from('package_exclusions')
      .insert(exclusions.map((exclusion, index) => ({
        package_id: packageId,
        exclusion,
        order_index: index
      })))

    if (error) throw error
  }

  private async insertPackageItinerary(packageId: string, itinerary: any[]) {
    if (itinerary.length === 0) return
    
    const { error } = await supabase
      .from('package_itinerary')
      .insert(itinerary.map(item => ({
        package_id: packageId,
        day_number: item.day_number,
        title: item.title,
        description: item.description,
        activities: item.activities,
        meals_included: item.meals_included,
        accommodation: item.accommodation,
        transportation: item.transportation,
        order_index: item.order_index
      })))

    if (error) throw error
  }

  private async insertPackageTypeDetails(packageId: string, typeDetails: any[]) {
    if (typeDetails.length === 0) return
    
    const { error } = await supabase
      .from('package_type_details')
      .insert(typeDetails.map(detail => ({
        package_id: packageId,
        field_name: detail.field_name,
        field_value: detail.field_value,
        field_type: detail.field_type
      })))

    if (error) throw error
  }

  private async insertPackageCancellationPolicies(packageId: string, policies: any[]) {
    if (policies.length === 0) return
    
    const { error } = await supabase
      .from('package_cancellation_policies')
      .insert(policies.map(policy => ({
        package_id: packageId,
        days_before_departure: policy.days_before_departure,
        cancellation_fee_percentage: policy.cancellation_fee_percentage,
        description: policy.description
      })))

    if (error) throw error
  }

  private async insertPackageImages(packageId: string, images: any[]) {
    if (images.length === 0) return
    
    const { error } = await supabase
      .from('package_images')
      .insert(images.map(image => ({
        package_id: packageId,
        url: image.url,
        alt_text: image.alt_text,
        caption: image.caption,
        is_primary: image.is_primary,
        order_index: image.order_index
      })))

    if (error) throw error
  }

  // Update methods for related data
  private async updatePackageDestinations(packageId: string, destinations: any[]) {
    // Delete existing and insert new
    await supabase.from('package_destinations').delete().eq('package_id', packageId)
    await this.insertPackageDestinations(packageId, destinations)
  }

  private async updatePackageInclusions(packageId: string, inclusions: string[]) {
    await supabase.from('package_inclusions').delete().eq('package_id', packageId)
    await this.insertPackageInclusions(packageId, inclusions)
  }

  private async updatePackageExclusions(packageId: string, exclusions: string[]) {
    await supabase.from('package_exclusions').delete().eq('package_id', packageId)
    await this.insertPackageExclusions(packageId, exclusions)
  }

  private async updatePackageItinerary(packageId: string, itinerary: any[]) {
    await supabase.from('package_itinerary').delete().eq('package_id', packageId)
    await this.insertPackageItinerary(packageId, itinerary)
  }

  private async updatePackageTypeDetails(packageId: string, typeDetails: any[]) {
    await supabase.from('package_type_details').delete().eq('package_id', packageId)
    await this.insertPackageTypeDetails(packageId, typeDetails)
  }

  private async updatePackageCancellationPolicies(packageId: string, policies: any[]) {
    await supabase.from('package_cancellation_policies').delete().eq('package_id', packageId)
    await this.insertPackageCancellationPolicies(packageId, policies)
  }

  private async updatePackageImages(packageId: string, images: any[]) {
    await supabase.from('package_images').delete().eq('package_id', packageId)
    await this.insertPackageImages(packageId, images)
  }

  // =============================================
  // DATA CONVERSION METHODS
  // =============================================
  
  private convertToAppPackage(dbPackage: PackageWithDetails): Package {
    // Convert type-specific details to a more usable format
    const typeDetailsMap = dbPackage.type_details.reduce((acc, detail) => {
      acc[detail.field_name] = detail.field_value
      return acc
    }, {} as Record<string, string>)

    return {
      id: dbPackage.id,
      tourOperatorId: dbPackage.tour_operator_id,
      title: dbPackage.title,
      description: dbPackage.description,
      type: dbPackage.type as PackageType,
      status: dbPackage.status as PackageStatus,
      pricing: {
        adultPrice: dbPackage.adult_price,
        childPrice: dbPackage.child_price,
        currency: dbPackage.currency
      },
      duration: {
        days: dbPackage.duration_days,
        hours: dbPackage.duration_hours
      },
      groupSize: {
        min: dbPackage.min_group_size,
        max: dbPackage.max_group_size
      },
      difficulty: dbPackage.difficulty,
      tags: dbPackage.tags,
      destinations: dbPackage.destinations.map(d => d.destination),
      inclusions: dbPackage.inclusions.map(i => i.inclusion),
      exclusions: dbPackage.exclusions.map(e => e.exclusion),
      itinerary: dbPackage.itinerary.map(item => ({
        day: item.day_number,
        title: item.title,
        description: item.description,
        activities: item.activities,
        meals: item.meals_included,
        accommodation: item.accommodation,
        transportation: item.transportation
      })),
      typeDetails: typeDetailsMap,
      cancellationPolicies: dbPackage.cancellation_policies.map(policy => ({
        daysBeforeDeparture: policy.days_before_departure,
        feePercentage: policy.cancellation_fee_percentage,
        description: policy.description
      })),
      images: dbPackage.images.map(img => ({
        url: img.url,
        alt: img.alt_text,
        caption: img.caption,
        isPrimary: img.is_primary
      })),
      isFeatured: dbPackage.is_featured,
      rating: dbPackage.rating,
      reviewCount: dbPackage.review_count,
      createdAt: dbPackage.created_at,
      updatedAt: dbPackage.updated_at
    }
  }
}

// Export singleton instance
export const optimizedPackageService = new OptimizedPackageService()

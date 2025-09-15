import { supabase } from '../supabase'
import { 
  DbPackage, 
  DbPackageInsert, 
  DbPackageUpdate, 
  PackageWithDetails,
  SupabaseResponse,
  SupabaseListResponse 
} from '../supabase-types'
import { Package, PackageStatus, PackageType } from '../types'

// Service response interfaces to match existing code
export interface ServiceResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PackageFilters {
  type?: PackageType;
  status?: PackageStatus;
  difficulty?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  destinations?: string[];
  tags?: string[];
  featured?: boolean;
}

export interface PackageSearchParams {
  query?: string;
  filters?: PackageFilters;
  sortBy?: 'title' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class PackageService {
  // Create a new package
  async createPackage(packageData: DbPackageInsert): Promise<ServiceResponse<DbPackage>> {
    try {
      const { data, error } = await PackageService.createPackageStatic(packageData);
      
      if (error) {
        return { data: null as any, success: false, error: error.message || 'Failed to create package' };
      }
      
      return { data, success: true, message: 'Package created successfully' };
    } catch (error) {
      return { 
        data: null as any, 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create package' 
      };
    }
  }

  // Get packages with filtering and pagination (compatible with existing interface)
  async getPackages(params: PackageSearchParams = {}): Promise<ServiceResponse<PaginatedResponse<Package>>> {
    try {
      const { data, error, count } = await PackageService.getPackages({
        status: params.filters?.status || 'ACTIVE',
        type: params.filters?.type,
        featured: params.filters?.featured,
        search: params.query,
        limit: params.limit || 12,
        offset: ((params.page || 1) - 1) * (params.limit || 12)
      });

      if (error) {
        return { 
          data: null as any, 
          success: false, 
          error: error.message || 'Failed to fetch packages' 
        };
      }

      // Convert to app packages
      const packages = data?.map(pkg => PackageService.convertToAppPackage(pkg)) || [];
      
      const totalPages = count ? Math.ceil(count / (params.limit || 12)) : 0;
      const currentPage = params.page || 1;

      return {
        data: {
          data: packages,
          page: currentPage,
          limit: params.limit || 12,
          total: count || 0,
          totalPages,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        },
        success: true
      };
    } catch (error) {
      return { 
        data: null as any, 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch packages' 
      };
    }
  }

  // Get package by ID
  async getPackageById(id: string): Promise<ServiceResponse<Package>> {
    try {
      const { data, error } = await PackageService.getPackageById(id);
      
      if (error) {
        return { data: null as any, success: false, error: error.message || 'Failed to fetch package' };
      }
      
      if (!data) {
        return { data: null as any, success: false, error: 'Package not found' };
      }

      const packageData = PackageService.convertToAppPackage(data);
      return { data: packageData, success: true };
    } catch (error) {
      return { 
        data: null as any, 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch package' 
      };
    }
  }

  // Update package
  async updatePackage(id: string, updates: DbPackageUpdate): Promise<ServiceResponse<Package>> {
    try {
      const { data, error } = await PackageService.updatePackage(id, updates);
      
      if (error) {
        return { data: null as any, success: false, error: error.message || 'Failed to update package' };
      }
      
      if (!data) {
        return { data: null as any, success: false, error: 'Package not found' };
      }

      const packageData = PackageService.convertToAppPackage(data);
      return { data: packageData, success: true, message: 'Package updated successfully' };
    } catch (error) {
      return { 
        data: null as any, 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update package' 
      };
    }
  }

  // Delete package
  async deletePackage(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const { data, error } = await PackageService.deletePackage(id);
      
      if (error) {
        return { data: false, success: false, error: error.message || 'Failed to delete package' };
      }
      
      return { data: true, success: true, message: 'Package deleted successfully' };
    } catch (error) {
      return { 
        data: false, 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete package' 
      };
    }
  }

  // Get package statistics
  async getPackageStats(): Promise<ServiceResponse<{
    totalPackages: number;
    activePackages: number;
    totalRevenue: number;
    averageRating: number;
  }>> {
    try {
      // Get all packages for stats
      const { data: packages, error } = await PackageService.getPackages({ limit: 1000 });
      
      if (error) {
        return { 
          data: { totalPackages: 0, activePackages: 0, totalRevenue: 0, averageRating: 0 }, 
          success: false, 
          error: error.message || 'Failed to fetch package statistics' 
        };
      }

      const totalPackages = packages?.length || 0;
      const activePackages = packages?.filter(pkg => pkg.status === 'ACTIVE').length || 0;
      
      // Calculate total revenue (mock calculation - you'd need booking data for real revenue)
      const totalRevenue = packages?.reduce((sum, pkg) => {
        const basePrice = (pkg.pricing as any)?.basePrice || 0;
        return sum + basePrice * 10; // Mock: assume 10 bookings per package
      }, 0) || 0;
      
      // Calculate average rating
      const averageRating = packages?.reduce((sum, pkg) => sum + (pkg.rating || 0), 0) / totalPackages || 0;

      return {
        data: {
          totalPackages,
          activePackages,
          totalRevenue,
          averageRating
        },
        success: true
      };
    } catch (error) {
      return { 
        data: { totalPackages: 0, activePackages: 0, totalRevenue: 0, averageRating: 0 }, 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch package statistics' 
      };
    }
  }

  // Get featured packages
  async getFeaturedPackages(limit: number = 10): Promise<ServiceResponse<Package[]>> {
    try {
      const { data, error } = await PackageService.getFeaturedPackages(limit);
      
      if (error) {
        return { data: [], success: false, error: error.message || 'Failed to fetch featured packages' };
      }
      
      const packages = data?.map(pkg => PackageService.convertToAppPackage(pkg)) || [];
      return { data: packages, success: true };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch featured packages' 
      };
    }
  }

  // Search packages
  async searchPackages(query: string, limit: number = 20): Promise<ServiceResponse<Package[]>> {
    try {
      const { data, error } = await PackageService.searchPackages(query, limit);
      
      if (error) {
        return { data: [], success: false, error: error.message || 'Failed to search packages' };
      }
      
      const packages = data?.map(pkg => PackageService.convertToAppPackage(pkg)) || [];
      return { data: packages, success: true };
    } catch (error) {
      return { 
        data: [], 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to search packages' 
      };
    }
  }

  // Static methods from the original PackageService (for backward compatibility)
  static async createPackageStatic(packageData: DbPackageInsert): Promise<SupabaseResponse<DbPackage>> {
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

  static async getFeaturedPackages(limit: number = 10): Promise<SupabaseListResponse<PackageWithDetails>> {
    return this.getPackages({ featured: true, status: 'ACTIVE', limit })
  }

  static async searchPackages(searchTerm: string, limit: number = 20): Promise<SupabaseListResponse<PackageWithDetails>> {
    return this.getPackages({ search: searchTerm, status: 'ACTIVE', limit })
  }

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

// Export singleton instance
export const packageService = new PackageService();
import { Package, PackageType, PackageStatus, DifficultyLevel } from '../types';
import { 
  mockPackages, 
  mockPackageAnalytics, 
  PackageAnalytics,
  Booking,
  mockBookings
} from '../mockData';

// Service response interfaces
export interface ServiceResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PackageFilters {
  type?: PackageType;
  status?: PackageStatus;
  difficulty?: DifficultyLevel;
  minPrice?: number;
  maxPrice?: number;
  destination?: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface PackageSearchParams {
  query?: string;
  filters?: PackageFilters;
  sortBy?: 'title' | 'price' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Mock delay function to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Package Service Class
export class PackageService {
  private packages: Package[] = [...mockPackages];
  private analytics: PackageAnalytics[] = [...mockPackageAnalytics];

  // Get all packages with optional filtering and pagination
  async getPackages(params: PackageSearchParams = {}): Promise<ServiceResponse<PaginatedResponse<Package>>> {
    try {
      await delay(500); // Simulate API delay

      let filteredPackages = [...this.packages];
      const { query, filters, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = params;

      // Apply search query
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredPackages = filteredPackages.filter(pkg => 
          pkg.title.toLowerCase().includes(searchTerm) ||
          pkg.description.toLowerCase().includes(searchTerm) ||
          pkg.destinations.some(dest => dest.toLowerCase().includes(searchTerm)) ||
          pkg.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Apply filters
      if (filters) {
        if (filters.type) {
          filteredPackages = filteredPackages.filter(pkg => pkg.type === filters.type);
        }
        if (filters.status) {
          filteredPackages = filteredPackages.filter(pkg => pkg.status === filters.status);
        }
        if (filters.difficulty) {
          filteredPackages = filteredPackages.filter(pkg => pkg.difficulty === filters.difficulty);
        }
        if (filters.minPrice !== undefined) {
          filteredPackages = filteredPackages.filter(pkg => pkg.pricing.basePrice >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          filteredPackages = filteredPackages.filter(pkg => pkg.pricing.basePrice <= filters.maxPrice!);
        }
        if (filters.destination) {
          filteredPackages = filteredPackages.filter(pkg => 
            pkg.destinations.some(dest => dest.toLowerCase().includes(filters.destination!.toLowerCase()))
          );
        }
        if (filters.tags && filters.tags.length > 0) {
          filteredPackages = filteredPackages.filter(pkg => 
            filters.tags!.some(tag => pkg.tags.includes(tag))
          );
        }
        if (filters.isFeatured !== undefined) {
          filteredPackages = filteredPackages.filter(pkg => pkg.isFeatured === filters.isFeatured);
        }
      }

      // Apply sorting
      filteredPackages.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortBy) {
          case 'title':
            aValue = a.title;
            bValue = b.title;
            break;
          case 'price':
            aValue = a.pricing.basePrice;
            bValue = b.pricing.basePrice;
            break;
          case 'createdAt':
            aValue = a.createdAt;
            bValue = b.createdAt;
            break;
          case 'rating':
            // Mock rating calculation
            aValue = 4.5;
            bValue = 4.3;
            break;
          default:
            aValue = a.createdAt;
            bValue = b.createdAt;
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      // Apply pagination
      const total = filteredPackages.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredPackages.slice(startIndex, endIndex);

      return {
        data: {
          data: paginatedData,
          total,
          page,
          limit,
          totalPages
        },
        success: true
      };
    } catch (error) {
      return {
        data: {
          data: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        },
        success: false,
        error: 'Failed to fetch packages'
      };
    }
  }

  // Get single package by ID
  async getPackageById(id: string): Promise<ServiceResponse<Package | null>> {
    try {
      await delay(300);
      
      const packageData = this.packages.find(pkg => pkg.id === id);
      
      if (!packageData) {
        return {
          data: null,
          success: false,
          error: 'Package not found'
        };
      }

      return {
        data: packageData,
        success: true
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        error: 'Failed to fetch package'
      };
    }
  }

  // Create new package
  async createPackage(packageData: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceResponse<Package>> {
    try {
      await delay(800);

      const newPackage: Package = {
        ...packageData,
        id: `pkg-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.packages.push(newPackage);

      // Add analytics entry
      this.analytics.push({
        packageId: newPackage.id,
        packageName: newPackage.title,
        views: 0,
        bookings: 0,
        revenue: 0,
        conversionRate: 0,
        averageRating: 0,
        reviews: 0
      });

      return {
        data: newPackage,
        success: true,
        message: 'Package created successfully'
      };
    } catch (error) {
      return {
        data: {} as Package,
        success: false,
        error: 'Failed to create package'
      };
    }
  }

  // Update existing package
  async updatePackage(id: string, updates: Partial<Package>): Promise<ServiceResponse<Package | null>> {
    try {
      await delay(600);

      const packageIndex = this.packages.findIndex(pkg => pkg.id === id);
      
      if (packageIndex === -1) {
        return {
          data: null,
          success: false,
          error: 'Package not found'
        };
      }

      const updatedPackage: Package = {
        ...this.packages[packageIndex],
        ...updates,
        updatedAt: new Date()
      };

      this.packages[packageIndex] = updatedPackage;

      // Update analytics if name changed
      const analyticsIndex = this.analytics.findIndex(analytics => analytics.packageId === id);
      if (analyticsIndex !== -1 && updates.title) {
        this.analytics[analyticsIndex].packageName = updates.title;
      }

      return {
        data: updatedPackage,
        success: true,
        message: 'Package updated successfully'
      };
    } catch (error) {
      return {
        data: null,
        success: false,
        error: 'Failed to update package'
      };
    }
  }

  // Delete package
  async deletePackage(id: string): Promise<ServiceResponse<boolean>> {
    try {
      await delay(400);

      const packageIndex = this.packages.findIndex(pkg => pkg.id === id);
      
      if (packageIndex === -1) {
        return {
          data: false,
          success: false,
          error: 'Package not found'
        };
      }

      this.packages.splice(packageIndex, 1);

      // Remove analytics entry
      const analyticsIndex = this.analytics.findIndex(analytics => analytics.packageId === id);
      if (analyticsIndex !== -1) {
        this.analytics.splice(analyticsIndex, 1);
      }

      return {
        data: true,
        success: true,
        message: 'Package deleted successfully'
      };
    } catch (error) {
      return {
        data: false,
        success: false,
        error: 'Failed to delete package'
      };
    }
  }

  // Get package analytics
  async getPackageAnalytics(packageId?: string): Promise<ServiceResponse<PackageAnalytics[]>> {
    try {
      await delay(300);

      let analyticsData = [...this.analytics];

      if (packageId) {
        analyticsData = analyticsData.filter(analytics => analytics.packageId === packageId);
      }

      return {
        data: analyticsData,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to fetch package analytics'
      };
    }
  }

  // Get package statistics
  async getPackageStats(): Promise<ServiceResponse<{
    totalPackages: number;
    activePackages: number;
    totalRevenue: number;
    averageRating: number;
    totalBookings: number;
  }>> {
    try {
      await delay(200);

      const activePackages = this.packages.filter(pkg => pkg.status === PackageStatus.ACTIVE).length;
      const totalRevenue = this.analytics.reduce((sum, analytics) => sum + analytics.revenue, 0);
      const totalBookings = this.analytics.reduce((sum, analytics) => sum + analytics.bookings, 0);
      const averageRating = this.analytics.length > 0 
        ? this.analytics.reduce((sum, analytics) => sum + analytics.averageRating, 0) / this.analytics.length 
        : 0;

      return {
        data: {
          totalPackages: this.packages.length,
          activePackages,
          totalRevenue,
          averageRating,
          totalBookings
        },
        success: true
      };
    } catch (error) {
      return {
        data: {
          totalPackages: 0,
          activePackages: 0,
          totalRevenue: 0,
          averageRating: 0,
          totalBookings: 0
        },
        success: false,
        error: 'Failed to fetch package statistics'
      };
    }
  }

  // Search packages
  async searchPackages(query: string, limit: number = 10): Promise<ServiceResponse<Package[]>> {
    try {
      await delay(400);

      const searchTerm = query.toLowerCase();
      const results = this.packages.filter(pkg => 
        pkg.title.toLowerCase().includes(searchTerm) ||
        pkg.description.toLowerCase().includes(searchTerm) ||
        pkg.destinations.some(dest => dest.toLowerCase().includes(searchTerm)) ||
        pkg.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      ).slice(0, limit);

      return {
        data: results,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to search packages'
      };
    }
  }

  // Get featured packages
  async getFeaturedPackages(limit: number = 6): Promise<ServiceResponse<Package[]>> {
    try {
      await delay(300);

      const featuredPackages = this.packages
        .filter(pkg => pkg.isFeatured)
        .slice(0, limit);

      return {
        data: featuredPackages,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to fetch featured packages'
      };
    }
  }

  // Get packages by destination
  async getPackagesByDestination(destination: string): Promise<ServiceResponse<Package[]>> {
    try {
      await delay(300);

      const packages = this.packages.filter(pkg => 
        pkg.destinations.some(dest => dest.toLowerCase().includes(destination.toLowerCase()))
      );

      return {
        data: packages,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        error: 'Failed to fetch packages by destination'
      };
    }
  }
}

// Export singleton instance
export const packageService = new PackageService();

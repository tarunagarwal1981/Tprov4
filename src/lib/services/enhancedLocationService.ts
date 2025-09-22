import { Location, LocationSearchParams, LocationSearchResult } from '../types/location';
import { locationService } from './locationService';
import { SupabaseLocationService } from './supabaseLocationService';

/**
 * Enhanced Location Service that combines API and database sources
 * Provides fallback mechanisms and intelligent caching
 */
export class EnhancedLocationService {
  private static instance: EnhancedLocationService;
  private cache = new Map<string, { data: Location[]; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): EnhancedLocationService {
    if (!EnhancedLocationService.instance) {
      EnhancedLocationService.instance = new EnhancedLocationService();
    }
    return EnhancedLocationService.instance;
  }

  /**
   * Search locations with optimized fallback strategies for speed
   */
  public async searchLocations(params: LocationSearchParams): Promise<LocationSearchResult> {
    const { query, country = 'India', limit = 10 } = params;
    
    if (!query || query.length < 2) {
      return { locations: [], total: 0, hasMore: false };
    }

    const cacheKey = `search-${query}-${country}-${limit}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return {
        locations: cached.slice(0, limit),
        total: cached.length,
        hasMore: cached.length > limit
      };
    }

    // Strategy 1: Get immediate static results for instant feedback
    const staticResults = await this.getStaticResults(query, country, limit);
    
    // Strategy 2: Try API in parallel for enhanced results
    const apiPromise = this.tryApiSearch(params).catch(() => []);
    
    // Strategy 3: Try database in parallel for additional results
    const dbPromise = this.tryDatabaseSearch(params).catch(() => []);

    // Wait for all parallel searches to complete
    const [apiResults, dbResults] = await Promise.all([apiPromise, dbPromise]);

    // Merge results intelligently
    let finalResults = [...staticResults];
    const existingIds = new Set(finalResults.map(r => r.id));

    // Add API results (highest priority)
    if (apiResults.length > 0) {
      const newApiResults = apiResults.filter(r => !existingIds.has(r.id));
      finalResults = [...finalResults, ...newApiResults];
      newApiResults.forEach(r => existingIds.add(r.id));
    }

    // Add database results (medium priority)
    if (dbResults.length > 0) {
      const newDbResults = dbResults.filter(r => !existingIds.has(r.id));
      finalResults = [...finalResults, ...newDbResults];
    }

    // Sort by relevance and popularity
    finalResults = this.sortResultsByRelevance(finalResults, query);

    // Cache the results
    this.setCache(cacheKey, finalResults);

    return {
      locations: finalResults.slice(0, limit),
      total: finalResults.length,
      hasMore: finalResults.length > limit
    };
  }

  /**
   * Get popular cities with caching
   */
  public async getPopularCities(country: string = 'India', limit: number = 20): Promise<Location[]> {
    const cacheKey = `popular-${country}-${limit}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    let results: Location[] = [];

    try {
      // Try API first
      results = await locationService.getPopularCities(country);
    } catch (error) {
      console.warn('API popular cities failed, using database:', error);
      
      try {
        // Fallback to database
        results = await SupabaseLocationService.getPopularCities(country, limit);
      } catch (dbError) {
        console.error('Database popular cities failed:', dbError);
      }
    }

    // Cache the results
    this.setCache(cacheKey, results);

    return results.slice(0, limit);
  }

  /**
   * Get countries with caching
   */
  public async getCountries(): Promise<{ code: string; name: string }[]> {
    const cacheKey = 'countries';
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached as any;
    }

    let results: { code: string; name: string }[] = [];

    try {
      // Try API first
      results = await locationService.getCountries();
    } catch (error) {
      console.warn('API countries failed, using database:', error);
      
      try {
        // Fallback to database
        results = await SupabaseLocationService.getCountries();
      } catch (dbError) {
        console.error('Database countries failed:', dbError);
      }
    }

    // Cache the results
    this.setCache(cacheKey, results);

    return results;
  }

  /**
   * Get location by ID with multiple sources
   */
  public async getLocationById(id: string): Promise<Location | null> {
    try {
      // Try API first
      const apiResult = await locationService.getLocationById(id);
      if (apiResult) {
        return apiResult;
      }
    } catch (error) {
      console.warn('API get by ID failed, trying database:', error);
    }

    try {
      // Fallback to database
      return await SupabaseLocationService.getCityById(id);
    } catch (error) {
      console.error('All get by ID strategies failed:', error);
      return null;
    }
  }

  /**
   * Add a new city (admin function)
   */
  public async addCity(cityData: {
    name: string;
    country: string;
    state?: string;
    coordinates?: { lat: number; lng: number };
    population?: number;
    isPopular?: boolean;
  }): Promise<Location | null> {
    try {
      const result = await SupabaseLocationService.addCity(cityData);
      if (result) {
        // Clear relevant caches
        this.clearCache();
      }
      return result;
    } catch (error) {
      console.error('Failed to add city:', error);
      return null;
    }
  }

  /**
   * Update city popularity (admin function)
   */
  public async updateCityPopularity(cityId: string, isPopular: boolean): Promise<boolean> {
    try {
      const result = await SupabaseLocationService.updateCityPopularity(cityId, isPopular);
      if (result) {
        // Clear relevant caches
        this.clearCache();
      }
      return result;
    } catch (error) {
      console.error('Failed to update city popularity:', error);
      return false;
    }
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; keys: string[]; hitRate: number } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: 0 // Could implement hit rate tracking if needed
    };
  }

  /**
   * Clear all caches
   */
  public clearCache(): void {
    this.cache.clear();
  }

  // Private helper methods for optimized search
  private async getStaticResults(query: string, country: string, limit: number): Promise<Location[]> {
    try {
      const staticResults = await locationService.searchLocations({
        query,
        country,
        limit,
        includeCoordinates: true
      });
      return staticResults.locations;
    } catch (error) {
      console.warn('Static search failed:', error);
      return [];
    }
  }

  private async tryApiSearch(params: LocationSearchParams): Promise<Location[]> {
    try {
      const apiResults = await locationService.searchLocations(params);
      if (apiResults.locations.length > 0) {
        console.log(`✅ API search successful: Found ${apiResults.locations.length} locations`);
        return apiResults.locations;
      }
    } catch (error) {
      console.warn('❌ API search failed:', error.message);
    }
    return [];
  }

  private async tryDatabaseSearch(params: LocationSearchParams): Promise<Location[]> {
    try {
      const dbResults = await SupabaseLocationService.searchCities(params);
      if (dbResults.locations.length > 0) {
        console.log(`✅ Database search successful: Found ${dbResults.locations.length} locations`);
        return dbResults.locations;
      }
    } catch (error) {
      console.warn('❌ Database search failed:', error.message);
    }
    return [];
  }

  private sortResultsByRelevance(results: Location[], query: string): Location[] {
    const lowerQuery = query.toLowerCase();
    
    return results.sort((a, b) => {
      // Prioritize exact matches
      const aExact = a.name.toLowerCase().startsWith(lowerQuery);
      const bExact = b.name.toLowerCase().startsWith(lowerQuery);
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Prioritize popular cities
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      
      // Sort by name
      return a.name.localeCompare(b.name);
    });
  }

  // Private cache methods
  private getFromCache(key: string): Location[] | null {
    const cached = this.cache.get(key);
    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCache(key: string, data: Location[]): void {
    // Simple LRU eviction if cache gets too large
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

// Export singleton instance
export const enhancedLocationService = EnhancedLocationService.getInstance();

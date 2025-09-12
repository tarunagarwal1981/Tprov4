'use client';

import { useState, useEffect, useCallback } from 'react';
import { Package, PackageType, PackageStatus, DifficultyLevel } from '@/lib/types';
import { PackageService, PackageSearchParams, PackageFilters } from '@/lib/services/packageService';
import PackageGrid from '@/components/packages/PackageGrid';
import PackageFilters from '@/components/packages/PackageFilters';
import PackageSearch from '@/components/packages/PackageSearch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3, 
  List, 
  Plus, 
  Filter, 
  SortAsc, 
  SortDesc,
  Package as PackageIcon,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const packageService = new PackageService();

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'title' | 'price' | 'rating' | 'popular';

const sortOptions = [
  { value: 'newest', label: 'Newest First', icon: SortDesc },
  { value: 'oldest', label: 'Oldest First', icon: SortAsc },
  { value: 'title', label: 'Alphabetical', icon: PackageIcon },
  { value: 'price', label: 'Price (Low to High)', icon: DollarSign },
  { value: 'rating', label: 'Highest Rated', icon: TrendingUp },
  { value: 'popular', label: 'Most Popular', icon: TrendingUp },
];

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<PackageFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
    totalRevenue: 0,
    averageRating: 0,
  });

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Load packages
  const loadPackages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const searchParams: PackageSearchParams = {
        query: debouncedSearchQuery || undefined,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        sortBy: getSortField(sortBy),
        sortOrder: getSortOrder(sortBy),
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await packageService.getPackages(searchParams);
      
      if (response.success) {
        setPackages(response.data.data);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages,
        });
      } else {
        setError(response.error || 'Failed to load packages');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading packages:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, filters, sortBy, pagination.page, pagination.limit]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const response = await packageService.getPackageStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Load data on mount and when dependencies change
  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Helper functions
  const getSortField = (sort: SortOption): 'title' | 'price' | 'createdAt' | 'rating' => {
    switch (sort) {
      case 'title': return 'title';
      case 'price': return 'price';
      case 'rating': return 'rating';
      default: return 'createdAt';
    }
  };

  const getSortOrder = (sort: SortOption): 'asc' | 'desc' => {
    switch (sort) {
      case 'oldest':
      case 'title':
      case 'price': return 'asc';
      default: return 'desc';
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFiltersChange = (newFilters: PackageFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleCreatePackage = () => {
    // Navigate to create package page
    window.location.href = '/operator/packages/create';
  };

  const getFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
                <p className="mt-2 text-gray-600">
                  Manage your travel packages, view analytics, and track performance
                </p>
              </div>
              <Button 
                onClick={handleCreatePackage}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Package
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <PackageIcon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Packages</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.totalPackages}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Active Packages</p>
                      <p className="text-2xl font-semibold text-gray-900">{stats.activePackages}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${stats.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {stats.averageRating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <PackageSearch 
                onSearch={handleSearch}
                placeholder="Search packages..."
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {getFilterCount() > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {getFilterCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <PackageFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClose={() => setShowFilters(false)}
              />
            </div>
          )}

          {/* Packages Grid */}
          <div className="flex-1">
            <PackageGrid
              packages={packages}
              loading={loading}
              error={error}
              viewMode={viewMode}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

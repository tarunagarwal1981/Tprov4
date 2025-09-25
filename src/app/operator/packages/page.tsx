'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, PackageType, PackageStatus, DifficultyLevel } from '@/lib/types';
import { PackageService, PackageSearchParams, PackageFilters as PackageFiltersType } from '@/lib/services/packageService';
import PackageGrid from '@/components/packages/PackageGrid';
import PackageFilters from '@/components/packages/PackageFilters';
import PackageSearch from '@/components/packages/PackageSearch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModernOperatorLayout } from '@/components/dashboard/ModernOperatorLayout';
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
import { useDebounce, useLoadingState } from '@/hooks';

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
  const { isLoading: loading, error, startLoading, stopLoading, setError, clearError } = useLoadingState(30000, true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filters, setFilters] = useState<PackageFiltersType>({
    status: PackageStatus.ACTIVE // Default to showing active packages
  });
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
      startLoading();
      clearError();

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
        stopLoading(); // Explicitly stop loading on success
      } else {
        setError(response.error || 'Failed to load packages');
      }
    } catch (err) {
      console.error('Error loading packages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load packages');
    }
  }, [debouncedSearchQuery, filters, sortBy, pagination.page, pagination.limit, startLoading, stopLoading, setError, clearError]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      console.log('🔄 Loading package stats...');
      const response = await packageService.getPackageStats();
      console.log('📊 Package stats response:', response);
      
      if (response.success) {
        console.log('✅ Package stats loaded successfully:', response.data);
        setStats(response.data);
      } else {
        console.error('❌ Failed to load package stats:', response.error);
        // Set fallback values
        setStats({
          totalPackages: 0,
          activePackages: 0,
          totalRevenue: 0,
          averageRating: 0,
        });
      }
    } catch (err) {
      console.error('❌ Error loading package stats:', err);
      // Set fallback values
      setStats({
        totalPackages: 0,
        activePackages: 0,
        totalRevenue: 0,
        averageRating: 0,
      });
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

  const handleFiltersChange = (newFilters: PackageFiltersType) => {
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
    <ModernOperatorLayout breadcrumbs={[{ label: 'Packages' }]}>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-300/10 to-orange-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-br from-violet-400/10 to-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="modern-card p-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Package Management 📦
              </h1>
              <p className="text-gray-600 text-lg">
                Manage your travel packages, view analytics, and track performance
              </p>
            </div>
            <motion.button
              onClick={handleCreatePackage}
              className="modern-btn modern-btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              Create Package
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="modern-stats-card"
            >
              <div className="modern-stats-icon bg-gradient-to-br from-blue-50 to-blue-100">
                <PackageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="modern-stats-value">
                {stats.totalPackages > 0 ? stats.totalPackages : '0'}
              </div>
              <div className="modern-stats-label">Total Packages</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="modern-stats-card"
            >
              <div className="modern-stats-icon bg-gradient-to-br from-green-50 to-green-100">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
              <div className="modern-stats-value">
                {stats.activePackages > 0 ? stats.activePackages : '0'}
              </div>
              <div className="modern-stats-label">Active Packages</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="modern-stats-card"
            >
              <div className="modern-stats-icon bg-gradient-to-br from-emerald-50 to-emerald-100">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="modern-stats-value">
                ${stats.totalRevenue > 0 ? stats.totalRevenue.toLocaleString() : '0'}
              </div>
              <div className="modern-stats-label">Total Revenue</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="modern-stats-card"
            >
              <div className="modern-stats-icon bg-gradient-to-br from-yellow-50 to-yellow-100">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="modern-stats-value">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="modern-stats-label">Avg Rating</div>
            </motion.div>
          </div>
        </motion.div>
        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="modern-card p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <PackageSearch 
                onSearch={handleSearch}
                placeholder="Search packages..."
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={filters.status || 'ALL'}
                  onChange={(e) => {
                    const newFilters = { ...filters };
                    if (e.target.value === 'ALL') {
                      delete newFilters.status;
                    } else {
                      newFilters.status = e.target.value as PackageStatus;
                    }
                    handleFiltersChange(newFilters);
                  }}
                  className="modern-input modern-select"
                >
                  <option value="ALL">All Packages</option>
                  <option value={PackageStatus.DRAFT}>Draft</option>
                  <option value={PackageStatus.ACTIVE}>Active</option>
                  <option value={PackageStatus.INACTIVE}>Inactive</option>
                  <option value={PackageStatus.SUSPENDED}>Suspended</option>
                  <option value={PackageStatus.ARCHIVED}>Archived</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="modern-input modern-select"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggle */}
              <div className="flex items-center modern-card p-1">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'modern-btn-primary' 
                      : 'text-gray-600 hover:bg-gray-100/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'modern-btn-primary' 
                      : 'text-gray-600 hover:bg-gray-100/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Filters Toggle */}
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="modern-btn modern-btn-secondary relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {getFilterCount() > 0 && (
                  <span className="modern-badge modern-badge-error ml-2">
                    {getFilterCount()}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-80 flex-shrink-0"
              >
                <PackageFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClose={() => setShowFilters(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Packages Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex-1"
          >
            <PackageGrid
              packages={packages}
              loading={loading}
              error={error}
              viewMode={viewMode}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </motion.div>
        </div>
      </div>
    </ModernOperatorLayout>
  );
}

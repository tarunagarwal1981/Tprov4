// Export all services
export { packageService, PackageService } from './packageService';
export { dashboardService, DashboardService } from './dashboardService';

// Export service types
export type {
  ServiceResponse,
  PaginatedResponse,
  PackageFilters,
  PackageSearchParams
} from './packageService';

export type {
  DashboardOverview,
  PerformanceMetrics,
  TimeRange
} from './dashboardService';

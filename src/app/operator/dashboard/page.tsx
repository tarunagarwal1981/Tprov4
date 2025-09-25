'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign,
  Eye,
  Star,
  Clock,
  Plus,
  ArrowRight,
  Activity,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock3,
  MapPin,
  Plane,
  Car,
  Building,
  Bed,
  Utensils,
  Camera,
  Mountain,
  Waves,
  Zap,
  Globe,
  Shield,
  Award,
  Target
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentBookings } from '@/components/dashboard/RecentBookings';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { TopPackages } from '@/components/dashboard/TopPackages';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ModernOperatorLayout } from '@/components/dashboard/ModernOperatorLayout';
import { dashboardService } from '@/lib/services/dashboardService';
import { DashboardStats } from '@/lib/mockData';

// Define roles outside component to prevent re-creation on every render
const OPERATOR_ROLES = [UserRole.TOUR_OPERATOR];

function OperatorDashboard() {
  const { state } = useImprovedAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalPackages: 0,
    activeBookings: 0,
    totalAgents: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0,
    averageRating: 0,
    totalCustomers: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  console.log('🏢 OperatorDashboard component loaded:', {
    user: state.user,
    isLoading: state.isLoading
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardStats();
    setIsRefreshing(false);
  };

  const loadDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await dashboardService.getRealDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Load stats on component mount
  useEffect(() => {
    loadDashboardStats();
  }, []);

  const stats = [
    {
      title: 'Total Packages',
      value: isLoadingStats ? '-' : dashboardStats.totalPackages.toString(),
      change: isLoadingStats ? '' : '+12%',
      changeType: 'positive' as const,
      icon: Package,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
    },
    {
      title: 'Active Bookings',
      value: isLoadingStats ? '-' : dashboardStats.activeBookings.toString(),
      change: isLoadingStats ? '' : '+8%',
      changeType: 'positive' as const,
      icon: Calendar,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-100',
    },
    {
      title: 'Travel Agents',
      value: isLoadingStats ? '-' : dashboardStats.totalAgents.toString(),
      change: isLoadingStats ? '' : '+15%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'purple',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-100',
    },
    {
      title: 'Total Revenue',
      value: isLoadingStats ? '-' : `$${(dashboardStats.totalRevenue / 1000).toFixed(1)}k`,
      change: isLoadingStats ? '' : `+${dashboardStats.monthlyGrowth}%`,
      changeType: dashboardStats.monthlyGrowth >= 0 ? 'positive' as const : 'negative' as const,
      icon: DollarSign,
      color: 'green',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100',
    },
  ];

  const quickActions = [
    {
      title: 'Create New Package',
      description: 'Add a new travel package to your inventory',
      icon: Plus,
      color: 'blue',
      href: '/operator/packages/create',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'View Bookings',
      description: 'Manage and track all your bookings',
      icon: Calendar,
      color: 'emerald',
      href: '/operator/bookings',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Agent Network',
      description: 'Connect with travel agents worldwide',
      icon: Users,
      color: 'purple',
      href: '/operator/agents',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Analytics',
      description: 'View detailed business insights',
      icon: BarChart3,
      color: 'orange',
      href: '/operator/analytics',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const recentBookings = [
    {
      id: '1',
      packageName: 'Golden Triangle Tour',
      customerName: 'Sarah Johnson',
      amount: 2500,
      status: 'confirmed',
      date: '2024-01-15'
    },
    {
      id: '2',
      packageName: 'Kerala Backwaters',
      customerName: 'Michael Chen',
      amount: 1800,
      status: 'pending',
      date: '2024-01-14'
    },
    {
      id: '3',
      packageName: 'Rajasthan Heritage',
      customerName: 'Emma Wilson',
      amount: 3200,
      status: 'confirmed',
      date: '2024-01-13'
    }
  ];

  const topPackages = [
    {
      id: '1',
      title: 'Golden Triangle Tour',
      rating: 4.8,
      totalBookings: 156,
      revenue: 390000,
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      title: 'Kerala Backwaters Experience',
      rating: 4.9,
      totalBookings: 98,
      revenue: 176400,
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      title: 'Rajasthan Heritage Tour',
      rating: 4.7,
      totalBookings: 124,
      revenue: 396800,
      image: '/api/placeholder/300/200'
    }
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'booking',
      message: 'New booking received for Golden Triangle Tour',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: Calendar,
      color: 'green'
    },
    {
      id: '2',
      type: 'package',
      message: 'Kerala Backwaters package updated',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: Package,
      color: 'blue'
    },
    {
      id: '3',
      type: 'agent',
      message: 'New agent joined your network',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      icon: Users,
      color: 'purple'
    }
  ];

  return (
    <ModernOperatorLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-pink-400/20 to-rose-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-blue-500/10 border border-white/20 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1 
                    className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Welcome back, {state.user?.firstName || 'Partner'} ✨
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-gray-600 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Here's what's happening with your travel business today
                  </motion.p>
                  <motion.div 
                    className="flex items-center gap-6 text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Last updated: {new Date().toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Global Operations
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="px-6 py-3 bg-white/80 hover:bg-white/90 rounded-2xl shadow-lg shadow-blue-500/20 border border-blue-200/50 text-gray-700 font-medium transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </motion.button>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/30">
                    <Shield className="w-5 h-5 text-white" />
                    <span className="text-white font-medium text-sm">Pro Plan</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02, 
                  y: -8,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="relative group"
              >
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-gray-500/10 border border-white/20 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                  {/* Icon Container */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                  </div>
                  
                  {/* Stats Content */}
                  <div className="space-y-2">
                    <h3 className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                      {stat.title}
                    </h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </span>
                      {stat.change && (
                        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          stat.changeType === 'positive' 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-red-700 bg-red-100'
                        }`}>
                          {stat.change}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Bookings - Takes 2 columns */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 border border-white/20 p-8 h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
                      <p className="text-gray-600">Latest customer reservations</p>
                    </div>
                  </div>
                  <Link
                    href="/operator/bookings"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentBookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="flex items-center justify-between p-6 bg-white/50 rounded-2xl border border-gray-200/50 hover:bg-white/80 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.packageName}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>{booking.customerName}</span>
                            <span>•</span>
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${booking.amount.toLocaleString()}</div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                            booking.status === 'confirmed' 
                              ? 'text-green-700 bg-green-100' 
                              : 'text-yellow-700 bg-yellow-100'
                          }`}>
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Activity Feed - Takes 1 column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 border border-white/20 p-8 h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                    <p className="text-gray-600">Latest updates</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/50 transition-colors duration-200"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-${activity.color}-100 flex items-center justify-center`}>
                        <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-sm">{activity.message}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mb-8"
          >
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 border border-white/20 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                  <p className="text-gray-600">Common tasks and shortcuts</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -4,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                  >
                    <Link href={action.href} className="block">
                      <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300 group">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="w-7 h-7 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
                        <p className="text-gray-600 text-sm">{action.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Packages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Top Performing Packages</h3>
                    <p className="text-gray-600">Your best-selling travel experiences</p>
                  </div>
                </div>
                <Link
                  href="/operator/packages"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Manage All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 + index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -8,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    className="bg-white/50 rounded-2xl overflow-hidden border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{pkg.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">{pkg.title}</h4>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Bookings</span>
                          <p className="font-bold text-gray-900">{pkg.totalBookings}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Revenue</span>
                          <p className="font-bold text-gray-900">${(pkg.revenue / 1000).toFixed(0)}k</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ModernOperatorLayout>
  );
}

export default function OperatorDashboardPage() {
  console.log('📄 OperatorDashboardPage wrapper loaded');
  
  return (
    <ProtectedRoute requiredRoles={OPERATOR_ROLES}>
      <OperatorDashboard />
    </ProtectedRoute>
  );
}
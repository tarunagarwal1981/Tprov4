'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign,
  Eye,
  Star,
  Clock
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { useAuth } from '@/context/SupabaseAuthContext';

function OperatorDashboard() {
  const { state } = useAuth();
  
  console.log('🏢 OperatorDashboard component loaded:', {
    user: state.user,
    isLoading: state.isLoading
  });

  const stats = [
    {
      title: 'Total Packages',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Active Bookings',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: Calendar,
      color: 'green',
    },
    {
      title: 'Travel Agents',
      value: '42',
      change: '+5%',
      changeType: 'positive',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Revenue',
      value: '$24,580',
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'orange',
    },
  ];

  const recentBookings = [
    {
      id: 'BK001',
      customer: 'John Doe',
      package: 'Bali Adventure Package',
      date: '2024-01-15',
      amount: '$1,299',
      status: 'confirmed',
    },
    {
      id: 'BK002',
      customer: 'Sarah Wilson',
      package: 'Mountain Trek Experience',
      date: '2024-01-14',
      amount: '$899',
      status: 'pending',
    },
    {
      id: 'BK003',
      customer: 'Mike Johnson',
      package: 'Cultural Heritage Tour',
      date: '2024-01-13',
      amount: '$1,599',
      status: 'confirmed',
    },
  ];

  const topPackages = [
    {
      name: 'Bali Adventure Package',
      bookings: 45,
      revenue: '$58,455',
      rating: 4.8,
      views: 234,
    },
    {
      name: 'Mountain Trek Experience',
      bookings: 32,
      revenue: '$28,768',
      rating: 4.6,
      views: 189,
    },
    {
      name: 'Cultural Heritage Tour',
      bookings: 28,
      revenue: '$44,772',
      rating: 4.9,
      views: 156,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tour Operator Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {state.user?.profile?.firstName || state.user?.name || 'User'}! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100' :
                  stat.color === 'green' ? 'bg-green-100' :
                  stat.color === 'purple' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <p className="text-sm text-gray-600 mt-1">Latest customer bookings</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer}</p>
                      <p className="text-sm text-gray-600">{booking.package}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{booking.amount}</p>
                    <p className={`text-sm ${
                      booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {booking.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all bookings →
              </button>
            </div>
          </div>
        </motion.div>

        {/* Top Packages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Top Packages</h2>
            <p className="text-sm text-gray-600 mt-1">Your best performing packages</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topPackages.map((pkg, index) => (
                <motion.div
                  key={pkg.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{pkg.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {pkg.bookings} bookings
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {pkg.views} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{pkg.revenue}</p>
                    <div className="flex items-center text-sm text-yellow-600">
                      <Star className="w-4 h-4 mr-1" />
                      {pkg.rating}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all packages →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-medium">Create Package</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">Add Agent</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-medium">View Analytics</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700 font-medium">Schedule Tour</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OperatorDashboardPage() {
  console.log('📄 OperatorDashboardPage wrapper loaded');
  
  return (
    <ProtectedRoute requiredRoles={[UserRole.TOUR_OPERATOR]}>
      <OperatorDashboard />
    </ProtectedRoute>
  );
}
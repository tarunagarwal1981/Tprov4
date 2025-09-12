'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { 
  TrendingUp, 
  BarChart3, 
  Calendar,
  Users,
  Package,
  MessageSquare
} from 'lucide-react';

export default function OperatorDashboard() {
  const { state } = useAuth();
  const userName = state.user?.profile?.firstName || 'Tour Operator';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              Here's what's happening with your travel business today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Today's Overview</p>
                <p className="text-2xl font-bold">$2,450</p>
                <p className="text-xs text-green-300">+12% from yesterday</p>
              </div>
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Business Overview</h2>
          <p className="text-gray-600 mt-1">Key metrics and performance indicators</p>
        </div>
        <StatsGrid />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions - Takes 2 columns on large screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <QuickActions />
        </motion.div>

        {/* Recent Activity - Takes 1 column on large screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <RecentActivity />
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-xl border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
            <p className="text-sm text-gray-600 mt-1">Quick insights into your business performance</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">View Analytics</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Top Package',
              value: 'Bali Adventure',
              subtitle: '45 bookings this month',
              icon: Package,
              color: 'text-blue-600 bg-blue-100'
            },
            {
              title: 'Best Agent',
              value: 'Emily Rodriguez',
              subtitle: '$125K in revenue',
              icon: Users,
              color: 'text-green-600 bg-green-100'
            },
            {
              title: 'Conversion Rate',
              value: '18.7%',
              subtitle: '+3% from last month',
              icon: TrendingUp,
              color: 'text-purple-600 bg-purple-100'
            },
            {
              title: 'Response Time',
              value: '2.4 hours',
              subtitle: 'Average inquiry response',
              icon: MessageSquare,
              color: 'text-orange-600 bg-orange-100'
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-lg font-bold text-gray-900">{item.value}</p>
                  <p className="text-xs text-gray-600">{item.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Pro Tip</h3>
            <p className="text-gray-700 mt-1">
              Your Bali Adventure Package is performing exceptionally well with a 19.2% conversion rate. 
              Consider creating similar adventure packages to capitalize on this trend.
            </p>
            <div className="mt-3 flex space-x-3">
              <button className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors duration-200">
                Create Similar Package →
              </button>
              <button className="text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors duration-200">
                View Analytics →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

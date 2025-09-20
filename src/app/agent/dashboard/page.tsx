'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  MapPin, 
  Package, 
  Calendar, 
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
  Target,
  Percent,
  Sparkles,
  Zap
} from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';
import { AgentStatsGrid } from '@/components/dashboard/AgentStatsCard';
import { RecentLeads } from '@/components/dashboard/RecentLeads';
import { RecentItineraries } from '@/components/dashboard/RecentItineraries';
import { AgentQuickActions } from '@/components/dashboard/AgentQuickActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { agentService } from '@/lib/services/agentService';
import { AgentDashboardData } from '@/lib/types/agent';

// Define roles outside component to prevent re-creation on every render
const AGENT_ROLES = [UserRole.TRAVEL_AGENT];

function AgentDashboard() {
  const { state } = useImprovedAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState<AgentDashboardData | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  console.log('👤 AgentDashboard component loaded:', {
    user: state.user,
    isLoading: state.isLoading
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
  };

  const loadDashboardData = async () => {
    try {
      setIsLoadingStats(true);
      const response = await agentService.getDashboardData(state.user?.id || 'agent-001');
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Create New Itinerary',
      description: 'Start building an itinerary from a lead',
      icon: MapPin,
      href: '/agent/itineraries/create',
      color: 'from-blue-500 to-purple-600',
      primary: true
    },
    {
      title: 'Browse Packages',
      description: 'Find packages from tour operators',
      icon: Package,
      href: '/agent/packages',
      color: 'from-green-500 to-emerald-600',
      primary: false
    },
    {
      title: 'Manage Leads',
      description: 'View and update your leads',
      icon: Users,
      href: '/agent/leads',
      color: 'from-orange-500 to-red-600',
      primary: false
    },
    {
      title: 'View Analytics',
      description: 'Track your performance',
      icon: BarChart3,
      href: '/agent/analytics',
      color: 'from-purple-500 to-pink-600',
      primary: false
    }
  ];

  const recentActivity = dashboardData?.recentActivity || [];
  const topPackages = dashboardData?.topPackages || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {state.user?.profile?.firstName || state.user?.name || 'Agent'}! 👋
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your travel business today
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {state.user?.role}
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {dashboardData && (
          <AgentStatsGrid 
            stats={dashboardData.stats} 
            className="mb-8"
          />
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Leads */}
          <RecentLeads
            leads={dashboardData?.recentLeads || []}
            viewAllLink="/agent/leads"
            className="lg:col-span-1"
          />

          {/* Recent Itineraries */}
          <RecentItineraries
            itineraries={dashboardData?.recentItineraries || []}
            viewAllLink="/agent/itineraries"
            className="lg:col-span-1"
          />

          {/* Quick Actions */}
          <AgentQuickActions className="lg:col-span-1" />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed - Using custom component for agent activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Packages - Using custom component for agent packages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-600" />
                <span>Popular Packages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topPackages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No packages available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {topPackages.map((pkg, index) => (
                    <div key={pkg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{pkg.name}</p>
                        <p className="text-sm text-gray-600">{pkg.destination}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500">{pkg.rating}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{pkg.bookings} bookings</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">${pkg.price.toLocaleString()}</p>
                        <Button size="sm" variant="outline" className="mt-1">
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-xl font-bold">Performance Insights</h3>
              </div>
              <Zap className="w-5 h-5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">64.3%</div>
                <div className="text-blue-100 text-sm">Conversion Rate</div>
                <div className="text-green-300 text-xs mt-1">↑ +5.2% this month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">4.9</div>
                <div className="text-blue-100 text-sm">Average Rating</div>
                <div className="text-green-300 text-xs mt-1">↑ +0.2 this month</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">$8,750</div>
                <div className="text-blue-100 text-sm">Monthly Commission</div>
                <div className="text-green-300 text-xs mt-1">↑ +15.8% this month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentDashboardPage() {
  return (
    <ProtectedRoute requiredRoles={AGENT_ROLES}>
      <AgentDashboard />
    </ProtectedRoute>
  );
}

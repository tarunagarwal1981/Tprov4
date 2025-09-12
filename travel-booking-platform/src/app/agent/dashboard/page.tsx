'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

function AgentDashboard() {
  const { state } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Travel Agent Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {state.user?.profile.firstName}!</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                {state.user?.role}
              </span>
              <button className="btn btn-secondary">Profile</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">45</div>
              <div className="text-sm text-gray-600">Active Bookings</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">128</div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">$8,750</div>
              <div className="text-sm text-gray-600">Monthly Commission</div>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.9</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Recent Bookings</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Bali Adventure - $1,299</p>
                  </div>
                  <span className="text-sm text-gray-500">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mike Chen</p>
                    <p className="text-sm text-gray-600">European Tour - $2,499</p>
                  </div>
                  <span className="text-sm text-gray-500">3 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emily Davis</p>
                    <p className="text-sm text-gray-600">Mountain Hiking - $899</p>
                  </div>
                  <span className="text-sm text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Top Packages</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Adventure Packages</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Best Seller</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cultural Tours</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">Popular</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Beach Holidays</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">Seasonal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>City Breaks</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Trending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn btn-primary">Create New Booking</button>
                <button className="btn btn-secondary">Browse Packages</button>
                <button className="btn btn-secondary">Customer Management</button>
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
    <ProtectedRoute requiredRoles={[UserRole.TRAVEL_AGENT]}>
      <AgentDashboard />
    </ProtectedRoute>
  );
}

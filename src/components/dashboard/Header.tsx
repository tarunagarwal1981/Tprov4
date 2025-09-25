'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  Home,
  Building2
} from 'lucide-react';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle: () => void;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ onMenuToggle, breadcrumbs = [] }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state, signOut } = useImprovedAuth();
  const router = useRouter();

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  const mockNotifications = [
    {
      id: 1,
      title: 'New Booking Received',
      message: 'John Doe booked your Bali Adventure Package',
      time: '2 minutes ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Payment Confirmed',
      message: 'Payment of $2,499 received for Mountain Trek Package',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Agent Inquiry',
      message: 'Sarah Wilson requested information about your Europe Tour',
      time: '3 hours ago',
      unread: false,
    },
    {
      id: 4,
      title: 'Package Update',
      message: 'Your Summer Beach Package has been approved',
      time: '1 day ago',
      unread: false,
    },
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between h-16 relative z-50 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* Breadcrumbs */}
        <nav className="breadcrumb hidden sm:flex">
          <Link href="/operator/dashboard" className="breadcrumb-item">
            <Home className="w-4 h-4" />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span className="breadcrumb-separator">/</span>
              {crumb.href ? (
                <Link href={crumb.href} className="breadcrumb-item">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-item active">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center Section - Search */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search packages, bookings, agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10"
            aria-label="Search packages, bookings, and agents"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {isNotificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg border border-gray-200 shadow-lg z-[70]"
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        'p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200',
                        notification.unread && 'bg-primary-50'
                      )}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={cn(
                          'w-2 h-2 rounded-full mt-2',
                          notification.unread ? 'bg-primary-500' : 'bg-gray-300'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <Link
                    href="/operator/notifications"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="User profile menu"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {state.user?.profile?.firstName} {state.user?.profile?.lastName}
              </p>
              <p className="text-xs text-gray-600">Tour Operator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-700" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-lg z-[70]"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {state.user?.profile?.firstName} {state.user?.profile?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{state.user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <Link
                    href="/operator/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </Link>
                  <Link
                    href="/operator/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

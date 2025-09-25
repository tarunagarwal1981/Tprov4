'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Building,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Plus,
  Eye,
  DollarSign,
  Star,
  Bell
} from 'lucide-react';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/operator/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'packages',
    label: 'Packages',
    href: '/operator/packages',
    icon: Package,
    badge: 12,
  },
  {
    id: 'agents',
    label: 'Travel Agents',
    href: '/operator/agents',
    icon: Users,
    badge: 8,
  },
  {
    id: 'bookings',
    label: 'Bookings',
    href: '/operator/bookings',
    icon: Calendar,
    badge: 5,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/operator/analytics',
    icon: BarChart3,
  },
  {
    id: 'communication',
    label: 'Messages',
    href: '/operator/communication',
    icon: MessageSquare,
    badge: 3,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/operator/settings',
    icon: Settings,
  },
];

export function OperatorSidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { state, signOut } = useImprovedAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="modern-operator-sidebar"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(226,232,240,0.3)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
      }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200/30">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3"
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    boxShadow: '0 12px 30px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                  }}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Building className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">TravelPro</h2>
                  <p className="text-xs text-gray-500 font-medium">Operator Portal</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={onToggle}
            className="p-2.5 rounded-2xl hover:bg-white/60 transition-all duration-300 backdrop-blur-sm shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)',
              border: '1px solid rgba(226,232,240,0.4)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
            }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link key={item.id} href={item.href}>
              <motion.div 
                className={cn(
                  "sidebar-nav-item group relative",
                  isActive ? "active" : ""
                )}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn(
                  "flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300",
                  isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg" : "hover:bg-white/50"
                )}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.08) 100%)',
                  boxShadow: '0 4px 20px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
                } : {}}
                >
                  <div className={cn(
                    "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
                    isActive 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg" 
                      : "bg-gray-100/60 text-gray-600 group-hover:bg-blue-100/60 group-hover:text-blue-600"
                  )}
                  style={isActive ? {
                    boxShadow: '0 8px 25px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                  } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ delay: 0.1 }}
                        className="flex-1 flex items-center justify-between"
                      >
                        <span className={cn(
                          "font-medium text-sm transition-colors duration-200",
                          isActive ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                        )}>
                          {item.label}
                        </span>
                        {item.badge && (
                          <motion.span 
                            className="badge badge-primary text-xs"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{
                              background: 'linear-gradient(135deg, rgba(59,130,246,0.8) 0%, rgba(99,102,241,0.8) 100%)',
                              boxShadow: '0 2px 8px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                            }}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {isCollapsed && item.badge && (
                    <div 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
                      style={{
                        boxShadow: '0 4px 12px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                      }}
                    >
                      {item.badge}
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-4"
          >
            <div 
              className="p-4 rounded-2xl border border-gray-200/50"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.6)'
              }}
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/operator/packages/create">
                  <motion.div 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700 font-medium">Create Package</span>
                  </motion.div>
                </Link>
                <Link href="/operator/agents/invite">
                  <motion.div 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50/50 transition-all duration-200 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-700 font-medium">Invite Agent</span>
                  </motion.div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Section */}
      <div className="p-6 border-t border-gray-200/50">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              boxShadow: '0 8px 25px rgba(107,114,128,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            }}
          >
            <User className="w-5 h-5 text-white" />
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: 0.1 }}
                className="flex-1"
              >
                <p className="text-sm font-semibold text-gray-900">
                  {state.user?.profile?.firstName || state.user?.name || 'Operator'}
                </p>
                <p className="text-xs text-gray-500">Tour Operator</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-red-50/50 transition-all duration-200 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(226,232,240,0.3)'
            }}
          >
            <LogOut className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OperatorSidebar } from '@/components/dashboard/OperatorSidebar';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';

interface ModernOperatorLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function ModernOperatorLayout({ children, breadcrumbs = [] }: ModernOperatorLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { state, signOut } = useImprovedAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="modern-operator-dashboard-layout">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarCollapsed || !mobileMenuOpen) && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden lg:block"
          >
            <OperatorSidebar 
              isCollapsed={sidebarCollapsed} 
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden"
            >
              <OperatorSidebar 
                isCollapsed={false} 
                onToggle={() => setMobileMenuOpen(false)} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div 
        className={`modern-dashboard-content ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
      >
        {/* Header */}
        <motion.header 
          className="modern-dashboard-header"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(226,232,240,0.2)'
          }}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="modern-dashboard-header-content">
            <div className="modern-dashboard-header-inner">
              {/* Left Section */}
              <div className="modern-dashboard-header-left">
                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setMobileMenuOpen(true)}
                  className="modern-header-btn mobile-menu-btn"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)',
                    border: '1px solid rgba(226,232,240,0.4)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
                  }}
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </motion.button>

                {/* Desktop Sidebar Toggle */}
                <motion.button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="modern-header-btn desktop-menu-btn"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)',
                    border: '1px solid rgba(226,232,240,0.4)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
                  }}
                >
                  <Menu className="w-5 h-5 text-gray-700" />
                </motion.button>

                {/* Breadcrumbs */}
                <nav className="modern-breadcrumbs">
                  <span className="breadcrumb-text">Operator Portal</span>
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={index}>
                      <ChevronDown className="w-4 h-4 text-gray-400 rotate-[-90deg]" />
                      <span className="text-sm text-gray-700 font-medium">
                        {crumb.label}
                      </span>
                    </React.Fragment>
                  ))}
                </nav>
              </div>

              {/* Center Section - Search */}
              <div className="flex-1 max-w-md mx-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <motion.input
                    type="text"
                    placeholder="Search packages, bookings, agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200/40 focus:border-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-400/10 transition-all duration-300 backdrop-blur-sm shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
                    }}
                    whileFocus={{ scale: 1.02 }}
                    aria-label="Search packages, bookings, and agents"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <motion.button
                  className="relative p-2.5 rounded-2xl hover:bg-white/60 transition-all duration-300 backdrop-blur-sm shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)',
                    border: '1px solid rgba(226,232,240,0.4)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
                  }}
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  <motion.span 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-pink-600 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      boxShadow: '0 4px 12px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  >
                    3
                  </motion.span>
                </motion.button>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      boxShadow: '0 8px 25px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                    }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">
                      {state.user?.profile?.firstName || state.user?.name || 'Operator'}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Tour Operator</p>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="p-2.5 rounded-2xl hover:bg-red-50/50 transition-all duration-300 backdrop-blur-sm shadow-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(248,250,252,0.8) 100%)',
                      border: '1px solid rgba(226,232,240,0.4)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
                    }}
                  >
                    <LogOut className="w-4 h-4 text-gray-700" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

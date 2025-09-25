'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useImprovedAuth } from '@/context/ImprovedAuthContext';
import { UserRole } from '@/lib/types';
import { cn } from '@/lib/utils';

export function Header() {
  const { state, signOut } = useImprovedAuth();

  const handleLogout = () => {
    signOut();
  };

  const getDashboardUrl = () => {
    if (!state.user) return '/auth/login';
    
    switch (state.user.role) {
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        return '/admin/dashboard';
      case UserRole.TOUR_OPERATOR:
        return '/operator/dashboard';
      case UserRole.TRAVEL_AGENT:
        return '/agent/dashboard';
      default:
        return '/';
    }
  };

  return (
    <motion.header 
      className="landing-header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <div className="nav-container">
          {/* Logo */}
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="logo-icon">T</div>
            <span>TravelPro</span>
          </motion.div>

          {/* Navigation */}
          <nav className="nav-links">
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#stats" className="nav-link">Stats</Link>
            <Link href="#about" className="nav-link">About</Link>
            <Link href="#contact" className="nav-link">Contact</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="auth-buttons">
            {state.user ? (
              <>
                <span className="user-role">
                  {state.user?.role.replace('_', ' ')}
                </span>
                <Link href={getDashboardUrl()}>
                  <motion.button 
                    className="btn btn-primary btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dashboard
                  </motion.button>
                </Link>
                <motion.button 
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <motion.button 
                    className="btn btn-secondary btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/auth/register">
                  <motion.button 
                    className="btn btn-primary btn-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="mobile-menu-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

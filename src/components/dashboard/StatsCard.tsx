'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  delay?: number;
  className?: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    iconBg: 'bg-blue-500',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-700',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-600'
  },
  green: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    iconBg: 'bg-green-500',
    iconColor: 'text-green-600',
    textColor: 'text-green-700',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-600'
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    iconBg: 'bg-purple-500',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-700',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-600'
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
    iconBg: 'bg-orange-500',
    iconColor: 'text-orange-600',
    textColor: 'text-orange-700',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-600'
  },
  red: {
    bg: 'bg-gradient-to-br from-red-50 to-red-100',
    iconBg: 'bg-red-500',
    iconColor: 'text-red-600',
    textColor: 'text-red-700',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-600'
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    iconBg: 'bg-indigo-500',
    iconColor: 'text-indigo-600',
    textColor: 'text-indigo-700',
    trendPositive: 'text-green-600',
    trendNegative: 'text-red-600'
  }
};

export const StatsCard = memo(function StatsCard({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  color, 
  delay = 0,
  className 
}: StatsCardProps) {
  const colors = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      }}
      className={cn(
        'relative overflow-hidden rounded-lg border border-gray-200/50 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md',
        className
      )}
    >
      {/* Background gradient */}
      <div className={cn('absolute inset-0 opacity-5', colors.bg)} />
      
      {/* Content */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
            
            {trend && (
              <div className="mt-2 flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: delay + 0.2 }}
                  className={cn(
                    'flex items-center text-sm font-medium',
                    trend.isPositive ? colors.trendPositive : colors.trendNegative
                  )}
                >
                  <svg
                    className={cn(
                      'mr-1 h-4 w-4',
                      trend.isPositive ? 'rotate-0' : 'rotate-180'
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {Math.abs(trend.value)}%
                </motion.div>
                <span className="ml-2 text-xs text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.1 }}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              colors.iconBg
            )}
          >
            <Icon className={cn('h-5 w-5', colors.iconColor)} />
          </motion.div>
        </div>
      </div>
      
      {/* Hover effect overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent"
      />
    </motion.div>
  );
});

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  gradient: string;
  bgGradient: string;
  index: number;
}

export function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  gradient,
  bgGradient,
  index
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="stats-card hover-lift"
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="stats-label">{title}</div>
          <div className="stats-value">{value}</div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-success' : 'text-error'
            }`}>
              {change}
            </span>
            <span className="text-xs text-muted">from last month</span>
          </div>
        </div>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${bgGradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-8 h-8 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );
}
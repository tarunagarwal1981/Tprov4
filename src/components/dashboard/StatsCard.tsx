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
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      cyan: 'from-cyan-500 to-cyan-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      className="modern-stats-card-animated"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
        border: '1px solid rgba(226,232,240,0.4)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      {/* Background Gradient Overlay */}
      <div 
        className="stats-card-overlay"
        style={{
          background: `linear-gradient(135deg, ${bgGradient})`
        }}
      />
      
      <div className="stats-card-content">
        {/* Icon */}
        <motion.div 
          className="stats-card-icon"
          style={{
            background: `linear-gradient(135deg, ${getColorClasses(color)})`,
            boxShadow: `0 20px 40px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 0 1px rgba(255,255,255,0.1)`
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Value */}
        <motion.div 
          className="stats-card-value"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {value}
        </motion.div>

        {/* Title */}
        <div className="stats-card-title">
          {title}
        </div>

        {/* Change Indicator */}
        <motion.div 
          className={`stats-card-change ${changeType}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.4 }}
        >
          {changeType === 'positive' ? '↗' : '↘'} {change}
        </motion.div>
      </div>
    </motion.div>
  );
}
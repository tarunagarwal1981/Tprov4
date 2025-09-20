'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Calendar,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Percent
} from 'lucide-react';
import { AgentStats } from '@/lib/types/agent';
import { cn } from '@/lib/utils';

interface AgentStatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
  className?: string;
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    accent: 'bg-blue-500',
    change: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    accent: 'bg-green-500',
    change: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    accent: 'bg-purple-500',
    change: 'text-purple-600'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    accent: 'bg-orange-500',
    change: 'text-orange-600'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    accent: 'bg-red-500',
    change: 'text-red-600'
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    accent: 'bg-indigo-500',
    change: 'text-indigo-600'
  }
};

export function AgentStatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  className 
}: AgentStatsCardProps) {
  const colors = colorVariants[color];
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn('h-full', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                {change !== undefined && (
                  <div className={cn(
                    'flex items-center text-sm font-medium',
                    isPositive ? colors.change : isNegative ? 'text-red-600' : 'text-gray-500'
                  )}>
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : isNegative ? (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    ) : null}
                    {Math.abs(change)}%
                  </div>
                )}
              </div>
            </div>
            <div className={cn(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              colors.bg
            )}>
              <Icon className={cn('h-6 w-6', colors.icon)} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface AgentStatsGridProps {
  stats: AgentStats;
  className?: string;
}

export function AgentStatsGrid({ stats, className }: AgentStatsGridProps) {
  const statsCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      change: stats.leadsGrowth,
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Active Leads',
      value: stats.activeLeads,
      change: undefined,
      icon: Eye,
      color: 'green' as const
    },
    {
      title: 'Total Itineraries',
      value: stats.totalItineraries,
      change: undefined,
      icon: MapPin,
      color: 'purple' as const
    },
    {
      title: 'Booked Itineraries',
      value: stats.bookedItineraries,
      change: undefined,
      icon: Calendar,
      color: 'orange' as const
    },
    {
      title: 'Monthly Commission',
      value: `$${stats.monthlyCommission.toLocaleString()}`,
      change: stats.commissionGrowth,
      icon: DollarSign,
      color: 'green' as const
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueGrowth,
      icon: TrendingUp,
      color: 'indigo' as const
    },
    {
      title: 'Average Rating',
      value: stats.averageRating,
      change: stats.ratingGrowth,
      icon: Star,
      color: 'orange' as const
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: undefined,
      icon: Target,
      color: 'red' as const
    }
  ];

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {statsCards.map((stat, index) => (
        <AgentStatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}

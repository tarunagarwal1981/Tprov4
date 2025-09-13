'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  BarChart3, 
  MessageSquare, 
  Download,
  Package,
  Users,
  TrendingUp,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionsProps {
  className?: string;
}

interface ActionButtonProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant: 'primary' | 'secondary';
  delay?: number;
}

function ActionButton({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  variant, 
  delay = 0 
}: ActionButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-lg border transition-all duration-300',
        isPrimary
          ? 'border-transparent bg-gradient-to-br from-blue-600 to-purple-600 p-4 text-white shadow-lg hover:shadow-xl'
          : 'border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-md'
      )}
    >
      {/* Background gradient for primary */}
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      
      <div className="relative">
        <div className="flex items-start space-x-3">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-300',
            isPrimary
              ? 'bg-white/20 text-white group-hover:bg-white/30'
              : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
          )}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 text-left">
            <h3 className={cn(
              'text-base font-semibold',
              isPrimary ? 'text-white' : 'text-gray-900'
            )}>
              {title}
            </h3>
            <p className={cn(
              'mt-1 text-sm',
              isPrimary ? 'text-blue-100' : 'text-gray-600'
            )}>
              {description}
            </p>
          </div>
        </div>
        
        {/* Arrow indicator */}
        <div className={cn(
          'mt-4 flex items-center text-sm font-medium transition-colors duration-300',
          isPrimary ? 'text-white group-hover:text-blue-100' : 'text-blue-600 group-hover:text-blue-700'
        )}>
          <span>{isPrimary ? 'Get Started' : 'View Details'}</span>
          <svg
            className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}

export function QuickActions({ className }: QuickActionsProps) {
  const handleCreatePackage = () => {
    // Navigate to create package page
    window.location.href = '/operator/packages/create';
  };

  const handleViewAnalytics = () => {
    // Navigate to analytics page
    window.location.href = '/operator/analytics';
  };

  const handleMessageAgents = () => {
    // Navigate to communication page
    window.location.href = '/operator/communication';
  };

  const handleExportData = () => {
    // Trigger data export
    console.log('Exporting data...');
  };

  const actions = [
    {
      title: 'Create New Package',
      description: 'Design and publish a new travel package',
      icon: Plus,
      onClick: handleCreatePackage,
      variant: 'primary' as const,
      delay: 0
    },
    {
      title: 'View Analytics',
      description: 'Analyze performance and revenue trends',
      icon: BarChart3,
      onClick: handleViewAnalytics,
      variant: 'secondary' as const,
      delay: 0.1
    },
    {
      title: 'Message Agents',
      description: 'Communicate with your travel agent network',
      icon: MessageSquare,
      onClick: handleMessageAgents,
      variant: 'secondary' as const,
      delay: 0.2
    },
    {
      title: 'Export Data',
      description: 'Download reports and booking data',
      icon: Download,
      onClick: handleExportData,
      variant: 'secondary' as const,
      delay: 0.3
    }
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your business efficiently</p>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {actions.map((action, index) => (
          <ActionButton
            key={action.title}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onClick={action.onClick}
            variant={action.variant}
            delay={action.delay}
          />
        ))}
      </div>

      {/* Additional Quick Links */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">More Actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { name: 'Packages', icon: Package, href: '/operator/packages' },
            { name: 'Agents', icon: Users, href: '/operator/agents' },
            { name: 'Analytics', icon: TrendingUp, href: '/operator/analytics' },
            { name: 'Reports', icon: FileText, href: '/operator/reports' }
          ].map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 bg-white p-4 text-center transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
            >
              <item.icon className="h-5 w-5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">{item.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  required?: boolean;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  collapsible = false,
  defaultExpanded = true,
  required = false
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const headerContent = (
    <div className="form-section-header">
      {Icon && <Icon className="form-section-icon" />}
      <div>
        <h3 className="form-section-title">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h3>
        {description && (
          <p className="form-section-description">{description}</p>
        )}
      </div>
    </div>
  );

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {children}
    </motion.div>
  );

  if (collapsible) {
    return (
      <div className={`form-section ${className}`}>
        <div 
          className="collapsible-header"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {headerContent}
          <div className={`collapsible-icon ${isExpanded ? 'expanded' : ''}`}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6,9 12,15 18,9"></polyline>
            </svg>
          </div>
        </div>
        {isExpanded && (
          <div className="collapsible-content">
            {content}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`form-section ${className}`}>
      {headerContent}
      {content}
    </div>
  );
};

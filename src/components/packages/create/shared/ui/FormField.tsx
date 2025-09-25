'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  description?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  label, 
  required = false, 
  children, 
  error, 
  description 
}) => (
  <div className="space-y-1">
    <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 text-xs">*</span>}
    </label>
    {description && (
      <p className="text-xs text-gray-500">{description}</p>
    )}
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-red-500 text-xs"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);


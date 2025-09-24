'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { PackageType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InclusionsExclusionsProps {
  inclusions: string[];
  exclusions: string[];
  onChange: (updates: { inclusions?: string[]; exclusions?: string[] }) => void;
  packageType: PackageType;
  className?: string;
}

export const InclusionsExclusions: React.FC<InclusionsExclusionsProps> = ({
  inclusions,
  exclusions,
  onChange,
  packageType,
  className = ''
}) => {
  const addInclusion = () => {
    onChange({ inclusions: [...(inclusions || []), ''] });
  };

  const updateInclusion = (index: number, value: string) => {
    const updated = [...(inclusions || [])];
    updated[index] = value;
    onChange({ inclusions: updated });
  };

  const removeInclusion = (index: number) => {
    onChange({ inclusions: (inclusions || []).filter((_, i) => i !== index) });
  };

  const addExclusion = () => {
    onChange({ exclusions: [...(exclusions || []), ''] });
  };

  const updateExclusion = (index: number, value: string) => {
    const updated = [...(exclusions || [])];
    updated[index] = value;
    onChange({ exclusions: updated });
  };

  const removeExclusion = (index: number) => {
    onChange({ exclusions: (exclusions || []).filter((_, i) => i !== index) });
  };

  const getInclusionsTitle = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'What\'s Included';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'Package Inclusions';
      case PackageType.TRANSFERS:
        return 'Transfer Inclusions';
      default:
        return 'Inclusions';
    }
  };

  const getExclusionsTitle = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'What\'s Not Included';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'Package Exclusions';
      case PackageType.TRANSFERS:
        return 'Transfer Exclusions';
      default:
        return 'Exclusions';
    }
  };

  const getInclusionsPlaceholder = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'e.g., Entry tickets, Guide services, Equipment';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'e.g., Accommodation, Meals, Transportation';
      case PackageType.TRANSFERS:
        return 'e.g., Vehicle, Driver, Fuel';
      default:
        return 'Add what\'s included...';
    }
  };

  const getExclusionsPlaceholder = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'e.g., Personal expenses, Gratuity, Meals';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'e.g., Personal expenses, Optional activities, Tips';
      case PackageType.TRANSFERS:
        return 'e.g., Personal expenses, Tips, Additional stops';
      default:
        return 'Add what\'s not included...';
    }
  };

  return (
    <div className={`inclusions-exclusions ${className}`}>
      {/* Inclusions Section */}
      <div className="inclusions-section">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h4 className="inclusions-title">{getInclusionsTitle()}</h4>
        </div>
        
        <div className="inclusions-list">
          <AnimatePresence>
            {(inclusions || []).map((inclusion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="inclusion-item"
              >
                <Input
                  placeholder={getInclusionsPlaceholder()}
                  value={inclusion}
                  onChange={(e) => updateInclusion(index, e.target.value)}
                  className="inclusion-input"
                />
                <button
                  onClick={() => removeInclusion(index)}
                  className="inclusion-remove"
                  title="Remove inclusion"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Button
          onClick={addInclusion}
          variant="outline"
          className="inclusion-add"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Inclusion
        </Button>
      </div>

      {/* Exclusions Section */}
      <div className="exclusions-section">
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="w-5 h-5 text-red-600" />
          <h4 className="exclusions-title">{getExclusionsTitle()}</h4>
        </div>
        
        <div className="exclusions-list">
          <AnimatePresence>
            {(exclusions || []).map((exclusion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="exclusion-item"
              >
                <Input
                  placeholder={getExclusionsPlaceholder()}
                  value={exclusion}
                  onChange={(e) => updateExclusion(index, e.target.value)}
                  className="exclusion-input"
                />
                <button
                  onClick={() => removeExclusion(index)}
                  className="exclusion-remove"
                  title="Remove exclusion"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Button
          onClick={addExclusion}
          variant="outline"
          className="exclusion-add"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Exclusion
        </Button>
      </div>
    </div>
  );
};

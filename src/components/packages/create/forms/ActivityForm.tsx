'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Info, Clock, Package, FileText, Settings } from 'lucide-react';
import { PackageType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LocationInput } from '@/components/ui/LocationInput';
import { FormField } from '../shared/ui/FormField';

// Import shared components
import { FormSection } from '../shared/ui/FormSection';
import { PricingSection } from '../shared/forms/PricingSection';
import { ImageGallery } from '../shared/forms/ImageGallery';
import { TimingSchedule } from '../shared/forms/TimingSchedule';
import { InclusionsExclusions } from '../shared/forms/InclusionsExclusions';
import { PoliciesTerms } from '../shared/forms/PoliciesTerms';

interface FormProps {
  data: any;
  onChange: (updates: any) => void;
}

const ACTIVITY_TYPES = [
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'aquarium', label: 'Aquarium' },
  { value: 'museum', label: 'Museum' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'family', label: 'Family' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'nature', label: 'Nature' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'sports', label: 'Sports' },
  { value: 'wellness', label: 'Wellness' }
];

export const ActivityForm: React.FC<FormProps> = ({ data, onChange }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50/50 backdrop-blur-sm rounded-xl mb-2 border border-emerald-200/30"
        style={{
          boxShadow: '0 4px 16px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}>
          <Star className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-600 font-medium text-sm">Activity Experience</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Activity Details</h2>
        <p className="text-gray-600 text-lg">Create your activity or experience offering</p>
      </motion.div>

      {/* Basic Information Section */}
      <FormSection
        title="Basic Information"
        description="Essential details about your activity"
        icon={Info}
        required
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField 
            label="Activity Name" 
            required
            description="Give your activity a compelling name"
          >
            <Input
              placeholder="e.g., The National Aquarium"
              value={data.name || ''}
              onChange={(value) => onChange({ name: value })}
            />
          </FormField>

          <FormField 
            label="Activity Type" 
            required
            description="What category does this activity belong to?"
          >
            <Select
              value={data.activityType || ''}
              onValueChange={(value) => onChange({ activityType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>

        <FormField 
          label="Destination" 
          required
          description="Where does this activity take place?"
        >
          <LocationInput
            value={data.place || ''}
            onChange={(value) => onChange({ place: typeof value === 'string' ? value : value.name })}
            placeholder="Search for destination city..."
            mode="both"
            allowCustomInput={true}
            country="India"
            displayFormat="name-state"
          />
        </FormField>

        <FormField 
          label="Activity Description"
          description="Describe what makes this experience special"
          required
        >
          <Textarea
            placeholder="Describe your activity, what guests will experience, highlights..."
            value={data.description || ''}
            onChange={(value) => onChange({ description: value })}
            rows={4}
          />
        </FormField>
      </FormSection>

      {/* Images Section */}
      <ImageGallery
        images={data.images || []}
        onChange={(images) => onChange({ images })}
        packageType={PackageType.ACTIVITY}
        showHeroImage={true}
        showGalleryImages={true}
        maxImages={10}
      />

      {/* Timing & Schedule Section */}
      <FormSection
        title="Timing & Schedule"
        description="Set duration, operational hours, and available days"
        icon={Clock}
      >
        <TimingSchedule
          data={data}
          onChange={onChange}
          packageType={PackageType.ACTIVITY}
        />
      </FormSection>

      {/* Pricing Section */}
      <FormSection
        title="Pricing"
        description="Set competitive prices for your activity"
        icon={Package}
      >
        <PricingSection
          pricing={data.pricing || [{ adultPrice: 0, childPrice: 0, validFrom: null, validTo: null }]}
          onChange={(pricing) => onChange({ pricing })}
          packageType={PackageType.ACTIVITY}
          showInfantPrice={true}
          showSeniorPrice={true}
          showPackageVariants={true}
          currency="INR"
        />
      </FormSection>

      {/* Inclusions & Exclusions */}
      <InclusionsExclusions
        inclusions={data.inclusions || []}
        exclusions={data.exclusions || []}
        onChange={(updates) => onChange(updates)}
        packageType={PackageType.ACTIVITY}
      />

      {/* Policies & Terms */}
      <FormSection
        title="Policies & Terms"
        description="Set refund, cancellation, and operational policies"
        icon={FileText}
      >
        <PoliciesTerms
          policies={data.policies || {}}
          onChange={(policies) => onChange({ policies })}
          packageType={PackageType.ACTIVITY}
        />
      </FormSection>
    </div>
  );
};

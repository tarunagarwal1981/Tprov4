'use client';

import React from 'react';
import { FileText, Shield, AlertCircle } from 'lucide-react';
import { PackageType } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface PoliciesTermsProps {
  policies: {
    refundPolicy?: string;
    cancellationPolicy?: string;
    childPolicy?: string;
    importantInfo?: string;
    termsAndConditions?: string;
    faq?: string;
  };
  onChange: (policies: any) => void;
  packageType: PackageType;
  className?: string;
}

const REFUND_POLICY_OPTIONS = [
  { value: 'refundable', label: 'Refundable' },
  { value: 'non-refundable', label: 'Non-refundable' },
  { value: 'partial-refund', label: 'Partial Refund' },
  { value: 'custom', label: 'Custom Policy' }
];

const CANCELLATION_POLICY_OPTIONS = [
  { value: 'free-24h', label: 'Free cancellation up to 24 hours' },
  { value: 'free-48h', label: 'Free cancellation up to 48 hours' },
  { value: 'free-7d', label: 'Free cancellation up to 7 days' },
  { value: 'no-refund', label: 'No refund policy' },
  { value: 'custom', label: 'Custom Policy' }
];

export const PoliciesTerms: React.FC<PoliciesTermsProps> = ({
  policies,
  onChange,
  packageType,
  className = ''
}) => {
  const getPoliciesTitle = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'Activity Policies & Terms';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'Package Policies & Terms';
      case PackageType.TRANSFERS:
        return 'Transfer Policies & Terms';
      default:
        return 'Policies & Terms';
    }
  };

  const getPoliciesDescription = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'Set refund, cancellation, and operational policies for your activity';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'Define booking, cancellation, and travel policies';
      case PackageType.TRANSFERS:
        return 'Set transfer-specific policies and terms';
      default:
        return 'Configure policies and terms for your package';
    }
  };

  const updatePolicy = (field: string, value: string) => {
    onChange({ ...policies, [field]: value });
  };

  return (
    <div className={`policies-terms ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-5 h-5 text-purple-600" />
        <div>
          <h4 className="font-semibold text-gray-900">{getPoliciesTitle()}</h4>
          <p className="text-sm text-gray-600">{getPoliciesDescription()}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Refund Policy */}
        <div className="policy-section">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-green-600" />
            <label className="policy-title">Refund Policy</label>
          </div>
          <Select
            value={policies.refundPolicy || ''}
            onValueChange={(value) => updatePolicy('refundPolicy', value)}
          >
            <SelectTrigger className="policy-select">
              <SelectValue placeholder="Select refund policy" />
            </SelectTrigger>
            <SelectContent>
              {REFUND_POLICY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {policies.refundPolicy === 'custom' && (
            <Textarea
              placeholder="Describe your custom refund policy..."
              value={policies.refundPolicy || ''}
              onChange={(e) => updatePolicy('refundPolicy', e.target.value)}
              className="policy-textarea mt-2"
              rows={3}
            />
          )}
        </div>

        {/* Cancellation Policy */}
        <div className="policy-section">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <label className="policy-title">Cancellation Policy</label>
          </div>
          <Select
            value={policies.cancellationPolicy || ''}
            onValueChange={(value) => updatePolicy('cancellationPolicy', value)}
          >
            <SelectTrigger className="policy-select">
              <SelectValue placeholder="Select cancellation policy" />
            </SelectTrigger>
            <SelectContent>
              {CANCELLATION_POLICY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {policies.cancellationPolicy === 'custom' && (
            <Textarea
              placeholder="Describe your custom cancellation policy..."
              value={policies.cancellationPolicy || ''}
              onChange={(e) => updatePolicy('cancellationPolicy', e.target.value)}
              className="policy-textarea mt-2"
              rows={3}
            />
          )}
        </div>

        {/* Child Policy */}
        <div className="policy-section">
          <label className="policy-title">Child Policy</label>
          <Textarea
            placeholder="e.g., Children under 2 years free, 2-12 years child rate, 12+ years adult rate"
            value={policies.childPolicy || ''}
            onChange={(e) => updatePolicy('childPolicy', e.target.value)}
            className="policy-textarea"
            rows={3}
          />
        </div>

        {/* Important Information */}
        <div className="policy-section">
          <label className="policy-title">Important Information</label>
          <Textarea
            placeholder="e.g., ID requirements, accessibility information, special rules, dress code, etc."
            value={policies.importantInfo || ''}
            onChange={(e) => updatePolicy('importantInfo', e.target.value)}
            className="policy-textarea"
            rows={4}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="policy-section">
          <label className="policy-title">Terms and Conditions</label>
          <Textarea
            placeholder="Additional terms and conditions specific to your package..."
            value={policies.termsAndConditions || ''}
            onChange={(e) => updatePolicy('termsAndConditions', e.target.value)}
            className="policy-textarea"
            rows={4}
          />
        </div>

        {/* FAQ Section */}
        <div className="policy-section">
          <label className="policy-title">Frequently Asked Questions</label>
          <Textarea
            placeholder="Common questions and answers about your package..."
            value={policies.faq || ''}
            onChange={(e) => updatePolicy('faq', e.target.value)}
            className="policy-textarea"
            rows={5}
          />
        </div>
      </div>
    </div>
  );
};

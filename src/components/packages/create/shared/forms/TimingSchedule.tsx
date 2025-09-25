'use client';

import React from 'react';
import { Clock, Calendar, MapPin } from 'lucide-react';
import { PackageType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TimePicker from '@/components/ui/TimePicker';
import MultiSelect from '@/components/ui/MultiSelect';

interface TimingScheduleProps {
  data: {
    durationHours?: number;
    durationDays?: number;
    durationUnit?: 'hours' | 'minutes' | 'days';
    startTime?: string;
    endTime?: string;
    availableDays?: string[];
    operationalHours?: { start: string; end: string };
    timingNotes?: string;
    pickupTime?: string;
    reportingTime?: string;
  };
  onChange: (updates: any) => void;
  packageType: PackageType;
  className?: string;
}

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

const DURATION_UNITS = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' }
];

export const TimingSchedule: React.FC<TimingScheduleProps> = ({
  data,
  onChange,
  packageType,
  className = ''
}) => {
  const getTimingTitle = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'Activity Timing & Schedule';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'Package Duration & Schedule';
      case PackageType.TRANSFERS:
        return 'Transfer Timing & Schedule';
      default:
        return 'Timing & Schedule';
    }
  };

  const getTimingDescription = () => {
    switch (packageType) {
      case PackageType.ACTIVITY:
        return 'Set the duration, operational hours, and available days for your activity';
      case PackageType.MULTI_CITY_PACKAGE:
        return 'Define the package duration and scheduling details';
      case PackageType.TRANSFERS:
        return 'Set pickup times, duration, and operational schedule';
      default:
        return 'Configure timing and scheduling details';
    }
  };

  const handleDurationChange = (value: string, unit: 'hours' | 'minutes' | 'days') => {
    const numValue = parseInt(value) || 0;
    if (unit === 'hours') {
      onChange({ durationHours: numValue, durationUnit: 'hours' });
    } else if (unit === 'minutes') {
      onChange({ durationHours: numValue / 60, durationUnit: 'minutes' });
    } else if (unit === 'days') {
      onChange({ durationDays: numValue, durationUnit: 'days' });
    }
  };

  return (
    <div className={`timing-schedule ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-blue-600" />
        <div>
          <h4 className="font-semibold text-gray-900">{getTimingTitle()}</h4>
          <p className="text-sm text-gray-600">{getTimingDescription()}</p>
        </div>
      </div>

      <div className="timing-grid">
        {/* Duration Fields */}
        <div className="timing-field">
          <label className="timing-label">Duration</label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="2"
              value={
                data.durationUnit === 'minutes' 
                  ? (data.durationHours ? (data.durationHours * 60).toString() : '')
                  : data.durationUnit === 'days'
                  ? (data.durationDays?.toString() || '')
                  : (data.durationHours?.toString() || '')
              }
              onChange={(e) => handleDurationChange(e.target.value, data.durationUnit || 'hours')}
              className="flex-1"
            />
            <Select
              value={data.durationUnit || 'hours'}
              onValueChange={(value: 'hours' | 'minutes' | 'days') => {
                onChange({ durationUnit: value });
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_UNITS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Start Time */}
        <div className="timing-field">
          <label className="timing-label">Start Time</label>
          <TimePicker
            value={data.startTime ? new Date(`2000-01-01T${data.startTime}`) : null}
            onChange={(time) => {
              if (time) {
                const timeString = time.toTimeString().slice(0, 5);
                onChange({ startTime: timeString });
              }
            }}
            placeholder="Select start time"
            format="12h"
            minuteStep={15}
          />
        </div>

        {/* End Time */}
        <div className="timing-field">
          <label className="timing-label">End Time</label>
          <TimePicker
            value={data.endTime ? new Date(`2000-01-01T${data.endTime}`) : null}
            onChange={(time) => {
              if (time) {
                const timeString = time.toTimeString().slice(0, 5);
                onChange({ endTime: timeString });
              }
            }}
            placeholder="Select end time"
            format="12h"
            minuteStep={15}
          />
        </div>

        {/* Available Days (for Activities) */}
        {packageType === PackageType.ACTIVITY && (
          <div className="timing-field col-span-2">
            <label className="timing-label">Available Days</label>
            <MultiSelect
              options={DAYS_OF_WEEK}
              value={data.availableDays || []}
              onChange={(days) => onChange({ availableDays: days })}
              placeholder="Select available days"
              maxSelections={7}
            />
          </div>
        )}

        {/* Operational Hours (for Activities) */}
        {packageType === PackageType.ACTIVITY && (
          <>
            <div className="timing-field">
              <label className="timing-label">Operational Start Time</label>
              <TimePicker
                value={data.operationalHours?.start ? new Date(`2000-01-01T${data.operationalHours.start}`) : null}
                onChange={(time) => {
                  if (time) {
                    const timeString = time.toTimeString().slice(0, 5);
                    onChange({ 
                      operationalHours: { 
                        ...data.operationalHours, 
                        start: timeString 
                      } 
                    });
                  }
                }}
                placeholder="Select operational start"
                format="12h"
                minuteStep={15}
              />
            </div>

            <div className="timing-field">
              <label className="timing-label">Operational End Time</label>
              <TimePicker
                value={data.operationalHours?.end ? new Date(`2000-01-01T${data.operationalHours.end}`) : null}
                onChange={(time) => {
                  if (time) {
                    const timeString = time.toTimeString().slice(0, 5);
                    onChange({ 
                      operationalHours: { 
                        ...data.operationalHours, 
                        end: timeString 
                      } 
                    });
                  }
                }}
                placeholder="Select operational end"
                format="12h"
                minuteStep={15}
              />
            </div>
          </>
        )}

        {/* Pickup Time (for Transfers) */}
        {packageType === PackageType.TRANSFERS && (
          <div className="timing-field">
            <label className="timing-label">Pickup Time</label>
            <TimePicker
              value={data.pickupTime ? new Date(`2000-01-01T${data.pickupTime}`) : null}
              onChange={(time) => {
                if (time) {
                  const timeString = time.toTimeString().slice(0, 5);
                  onChange({ pickupTime: timeString });
                }
              }}
              placeholder="Select pickup time"
              format="12h"
              minuteStep={15}
            />
          </div>
        )}

        {/* Reporting Time (for Activities) */}
        {packageType === PackageType.ACTIVITY && (
          <div className="timing-field">
            <label className="timing-label">Reporting Time</label>
            <TimePicker
              value={data.reportingTime ? new Date(`2000-01-01T${data.reportingTime}`) : null}
              onChange={(time) => {
                if (time) {
                  const timeString = time.toTimeString().slice(0, 5);
                  onChange({ reportingTime: timeString });
                }
              }}
              placeholder="Select reporting time"
              format="12h"
              minuteStep={15}
            />
          </div>
        )}

        {/* Timing Notes */}
        <div className="timing-field col-span-2">
          <label className="timing-label">Timing Notes</label>
          <Input
            placeholder="Any additional timing information..."
            value={data.timingNotes || ''}
            onChange={(e) => onChange({ timingNotes: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

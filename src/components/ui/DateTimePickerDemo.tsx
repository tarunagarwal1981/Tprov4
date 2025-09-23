'use client';

import React, { useState } from 'react';
import { DatePicker, TimePicker, DateTimePicker } from '../components/ui';

const DateTimePickerDemo: React.FC = () => {
  const [dateOnly, setDateOnly] = useState<Date | null>(null);
  const [timeOnly, setTimeOnly] = useState<Date | null>(null);
  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [dateTime12h, setDateTime12h] = useState<Date | null>(null);
  const [dateTime24h, setDateTime24h] = useState<Date | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Date & Time Picker Components
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Modern, compact, and flexible date/time pickers for your applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Date Only */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Date Picker</h2>
            <DatePicker
              value={dateOnly}
              onChange={setDateOnly}
              label="Select Date"
              placeholder="Choose a date"
              description="Pick any date from the calendar"
              required
            />
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Selected:</strong> {dateOnly ? dateOnly.toLocaleDateString() : 'None'}
              </p>
            </div>
          </div>

          {/* Time Only */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Time Picker (12h)</h2>
            <TimePicker
              value={timeOnly}
              onChange={setTimeOnly}
              label="Select Time"
              placeholder="Choose a time"
              description="Pick a time with AM/PM"
              format="12h"
              minuteStep={15}
            />
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Selected:</strong> {timeOnly ? timeOnly.toLocaleTimeString() : 'None'}
              </p>
            </div>
          </div>

          {/* Date & Time Combined */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Date & Time (12h)</h2>
            <DateTimePicker
              value={dateTime12h}
              onChange={setDateTime12h}
              label="Select Date & Time"
              placeholder="Choose date and time"
              description="Pick both date and time with AM/PM"
              timeFormat="12h"
              showDate={true}
              showTime={true}
            />
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Selected:</strong> {dateTime12h ? dateTime12h.toLocaleString() : 'None'}
              </p>
            </div>
          </div>

          {/* Date & Time 24h */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Date & Time (24h)</h2>
            <DateTimePicker
              value={dateTime24h}
              onChange={setDateTime24h}
              label="Select Date & Time"
              placeholder="Choose date and time"
              description="Pick both date and time in 24-hour format"
              timeFormat="24h"
              showDate={true}
              showTime={true}
            />
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Selected:</strong> {dateTime24h ? dateTime24h.toLocaleString() : 'None'}
              </p>
            </div>
          </div>

          {/* Error States */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Error State</h2>
            <DatePicker
              value={null}
              onChange={() => {}}
              label="Required Field"
              placeholder="This field has an error"
              error={true}
              required
            />
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                This field is required and has an error state
              </p>
            </div>
          </div>

          {/* Disabled State */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Disabled State</h2>
            <TimePicker
              value={null}
              onChange={() => {}}
              label="Disabled Field"
              placeholder="This field is disabled"
              disabled={true}
            />
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This field is disabled and cannot be interacted with
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Modern Design</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Clean, modern interface with smooth animations</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Flexible Usage</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Use date only, time only, or combined</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-semibold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">12h/24h Format</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Support for both time formats</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-semibold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Validation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Built-in validation and error states</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                <span className="text-pink-600 font-semibold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Accessible</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Keyboard navigation and screen reader support</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 font-semibold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Responsive</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Works perfectly on all screen sizes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimePickerDemo;

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimePickerProps {
  value?: Date | null;
  onChange: (time: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  format?: '12h' | '24h';
  minuteStep?: number;
  className?: string;
  error?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  format = '12h',
  minuteStep = 15,
  className = "",
  error = false,
  required = false,
  label,
  description
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(value);
  const [selectedHour, setSelectedHour] = useState<number>(value ? value.getHours() : 12);
  const [selectedMinute, setSelectedMinute] = useState<number>(value ? value.getMinutes() : 0);
  const [isAM, setIsAM] = useState<boolean>(value ? value.getHours() < 12 : true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedTime(value);
      setSelectedHour(value.getHours());
      setSelectedMinute(value.getMinutes());
      setIsAM(value.getHours() < 12);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (time: Date | null): string => {
    if (!time) return '';
    
    if (format === '24h') {
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } else {
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const generateHours = (): number[] => {
    if (format === '24h') {
      return Array.from({ length: 24 }, (_, i) => i);
    } else {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    }
  };

  const generateMinutes = (): number[] => {
    const minutes = [];
    for (let i = 0; i < 60; i += minuteStep) {
      minutes.push(i);
    }
    return minutes;
  };

  const handleTimeChange = (hour: number, minute: number, am?: boolean) => {
    let finalHour = hour;
    
    if (format === '12h' && am !== undefined) {
      if (am && hour === 12) finalHour = 0;
      else if (!am && hour !== 12) finalHour = hour + 12;
    }

    const newTime = new Date();
    newTime.setHours(finalHour, minute, 0, 0);
    
    setSelectedTime(newTime);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    if (am !== undefined) setIsAM(am);
    
    onChange(newTime);
  };

  const handleHourScroll = (direction: 'up' | 'down') => {
    const hours = generateHours();
    const currentIndex = hours.indexOf(selectedHour);
    
    if (direction === 'up') {
      const nextIndex = currentIndex === hours.length - 1 ? 0 : currentIndex + 1;
      handleTimeChange(hours[nextIndex], selectedMinute, format === '12h' ? isAM : undefined);
    } else {
      const prevIndex = currentIndex === 0 ? hours.length - 1 : currentIndex - 1;
      handleTimeChange(hours[prevIndex], selectedMinute, format === '12h' ? isAM : undefined);
    }
  };

  const handleMinuteScroll = (direction: 'up' | 'down') => {
    const minutes = generateMinutes();
    const currentIndex = minutes.indexOf(selectedMinute);
    
    if (direction === 'up') {
      const nextIndex = currentIndex === minutes.length - 1 ? 0 : currentIndex + 1;
      handleTimeChange(selectedHour, minutes[nextIndex], format === '12h' ? isAM : undefined);
    } else {
      const prevIndex = currentIndex === 0 ? minutes.length - 1 : currentIndex - 1;
      handleTimeChange(selectedHour, minutes[prevIndex], format === '12h' ? isAM : undefined);
    }
  };

  const handleAMPMToggle = () => {
    handleTimeChange(selectedHour, selectedMinute, !isAM);
  };

  const setCurrentTime = () => {
    const now = new Date();
    setSelectedTime(now);
    onChange(now);
    setIsOpen(false);
  };

  const clearTime = () => {
    setSelectedTime(null);
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left text-sm border rounded-xl transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/70
          backdrop-blur-md
          ${error 
            ? 'border-red-300/70 bg-red-50/30 text-red-900' 
            : disabled
              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
              : 'border-white/40 bg-white/30 hover:bg-white/50 focus:bg-white/60 text-gray-900'
          }
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={selectedTime ? 'text-gray-900' : 'text-gray-500'}>
              {selectedTime ? formatTime(selectedTime) : placeholder}
            </span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl p-3 min-w-[240px] max-w-[280px]"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05)'
            }}
          >
            <div className="flex items-center justify-center gap-3">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleHourScroll('up')}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                </button>
                
                <div className="w-12 h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg mx-1 border border-gray-200 dark:border-gray-600">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {format === '12h' && selectedHour === 0 ? '12' : 
                     format === '12h' ? selectedHour : 
                     selectedHour.toString().padStart(2, '0')}
                  </span>
                </div>
                
                <button
                  onClick={() => handleHourScroll('down')}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Separator */}
              <div className="text-xl font-bold text-gray-400 dark:text-gray-500">:</div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleMinuteScroll('up')}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                </button>
                
                <div className="w-12 h-16 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg mx-1 border border-gray-200 dark:border-gray-600">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {selectedMinute.toString().padStart(2, '0')}
                  </span>
                </div>
                
                <button
                  onClick={() => handleMinuteScroll('down')}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <ChevronDown className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* AM/PM (only for 12h format) */}
              {format === '12h' && (
                <div className="flex flex-col items-center ml-1">
                  <button
                    onClick={() => handleAMPMToggle()}
                    className={`
                      px-2 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 border
                      ${isAM 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    AM
                  </button>
                  
                  <button
                    onClick={() => handleAMPMToggle()}
                    className={`
                      px-2 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 mt-1 border
                      ${!isAM 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    PM
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={setCurrentTime}
                className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors duration-200"
              >
                Now
              </button>
              
              <button
                onClick={clearTime}
                className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimePicker;

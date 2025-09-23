'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DateTimePickerProps {
  value?: Date | null;
  onChange: (dateTime: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  timeFormat?: '12h' | '24h';
  minuteStep?: number;
  className?: string;
  error?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  showTime?: boolean;
  showDate?: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date and time",
  disabled = false,
  minDate,
  maxDate,
  timeFormat = '12h',
  minuteStep = 15,
  className = "",
  error = false,
  required = false,
  label,
  description,
  showTime = true,
  showDate = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(value);
  const [currentMonth, setCurrentMonth] = useState(value ? value.getMonth() : new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(value ? value.getFullYear() : new Date().getFullYear());
  const [selectedHour, setSelectedHour] = useState<number>(value ? value.getHours() : 12);
  const [selectedMinute, setSelectedMinute] = useState<number>(value ? value.getMinutes() : 0);
  const [isAM, setIsAM] = useState<boolean>(value ? value.getHours() < 12 : true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSelectedDateTime(value);
      setCurrentMonth(value.getMonth());
      setCurrentYear(value.getFullYear());
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

  const formatDateTime = (dateTime: Date | null): string => {
    if (!dateTime) return '';
    
    const dateStr = dateTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    if (!showTime) return dateStr;
    
    const timeStr = timeFormat === '24h' 
      ? dateTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      : dateTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
    
    return `${dateStr} at ${timeStr}`;
  };

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDateTime) return false;
    return date.toDateString() === selectedDateTime.toDateString();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (!isDateDisabled(newDate)) {
      // Preserve existing time if available
      if (selectedDateTime) {
        newDate.setHours(selectedHour, selectedMinute, 0, 0);
      }
      setSelectedDateTime(newDate);
      onChange(newDate);
      
      // If time is shown, switch to time tab
      if (showTime) {
        setActiveTab('time');
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleTimeChange = (hour: number, minute: number, am?: boolean) => {
    let finalHour = hour;
    
    if (timeFormat === '12h' && am !== undefined) {
      if (am && hour === 12) finalHour = 0;
      else if (!am && hour !== 12) finalHour = hour + 12;
    }

    const newDateTime = selectedDateTime ? new Date(selectedDateTime) : new Date();
    newDateTime.setHours(finalHour, minute, 0, 0);
    
    setSelectedDateTime(newDateTime);
    setSelectedHour(hour);
    setSelectedMinute(minute);
    if (am !== undefined) setIsAM(am);
    
    onChange(newDateTime);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const generateHours = (): number[] => {
    if (timeFormat === '24h') {
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

  const handleHourScroll = (direction: 'up' | 'down') => {
    const hours = generateHours();
    const currentIndex = hours.indexOf(selectedHour);
    
    if (direction === 'up') {
      const nextIndex = currentIndex === hours.length - 1 ? 0 : currentIndex + 1;
      handleTimeChange(hours[nextIndex], selectedMinute, timeFormat === '12h' ? isAM : undefined);
    } else {
      const prevIndex = currentIndex === 0 ? hours.length - 1 : currentIndex - 1;
      handleTimeChange(hours[prevIndex], selectedMinute, timeFormat === '12h' ? isAM : undefined);
    }
  };

  const handleMinuteScroll = (direction: 'up' | 'down') => {
    const minutes = generateMinutes();
    const currentIndex = minutes.indexOf(selectedMinute);
    
    if (direction === 'up') {
      const nextIndex = currentIndex === minutes.length - 1 ? 0 : currentIndex + 1;
      handleTimeChange(selectedHour, minutes[nextIndex], timeFormat === '12h' ? isAM : undefined);
    } else {
      const prevIndex = currentIndex === 0 ? minutes.length - 1 : currentIndex - 1;
      handleTimeChange(selectedHour, minutes[prevIndex], timeFormat === '12h' ? isAM : undefined);
    }
  };

  const handleAMPMToggle = () => {
    handleTimeChange(selectedHour, selectedMinute, !isAM);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDateTime(today);
    onChange(today);
    setIsOpen(false);
  };

  const setCurrentTime = () => {
    const now = new Date();
    setSelectedDateTime(now);
    onChange(now);
    setIsOpen(false);
  };

  const clearDateTime = () => {
    setSelectedDateTime(null);
    onChange(null);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const today = isToday(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          disabled={disabled}
          className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
            ${disabled 
              ? 'text-muted cursor-not-allowed opacity-60' 
              : selected
                ? 'bg-blue-600 text-white shadow-lg'
                : today
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-secondary hover:bg-gray-100 hover:text-primary'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="form-label mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {description && (
        <p className="text-xs text-muted mb-2">{description}</p>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`form-input text-left ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showDate && showTime ? (
              <>
                <Calendar className="w-4 h-4 text-muted" />
                <Clock className="w-4 h-4 text-muted" />
              </>
            ) : showDate ? (
              <Calendar className="w-4 h-4 text-muted" />
            ) : (
              <Clock className="w-4 h-4 text-muted" />
            )}
            <span className={selectedDateTime ? 'text-primary' : 'text-muted'}>
              {selectedDateTime ? formatDateTime(selectedDateTime) : placeholder}
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
            className="card absolute top-full left-0 mt-2 z-50 p-3 min-w-[280px] max-w-[320px]"
          >
            {/* Tabs */}
            {showDate && showTime && (
              <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('date')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'date'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date
                </button>
                <button
                  onClick={() => setActiveTab('time')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    activeTab === 'time'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-2" />
                  Time
                </button>
              </div>
            )}

            {/* Date Picker */}
            {activeTab === 'date' && showDate && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-4 h-4 text-secondary" />
                  </button>
                  
                  <h3 className="text-lg font-semibold text-primary">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ChevronRight className="w-4 h-4 text-secondary" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {renderCalendar()}
                </div>
              </>
            )}

            {/* Time Picker */}
            {activeTab === 'time' && showTime && (
              <div className="flex items-center justify-center gap-4">
                {/* Hours */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleHourScroll('up')}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ChevronUp className="w-4 h-4 text-secondary" />
                  </button>
                  
                  <div className="w-12 h-16 flex items-center justify-center bg-white rounded-lg mx-1 border border-gray-200">
                    <span className="text-xl font-bold text-primary">
                      {timeFormat === '12h' && selectedHour === 0 ? '12' : 
                       timeFormat === '12h' ? selectedHour : 
                       selectedHour.toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleHourScroll('down')}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ChevronDown className="w-4 h-4 text-secondary" />
                  </button>
                </div>

                {/* Separator */}
                <div className="text-2xl font-bold text-muted">:</div>

                {/* Minutes */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleMinuteScroll('up')}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ChevronUp className="w-4 h-4 text-secondary" />
                  </button>
                  
                  <div className="w-12 h-16 flex items-center justify-center bg-white rounded-lg mx-1 border border-gray-200">
                    <span className="text-xl font-bold text-primary">
                      {selectedMinute.toString().padStart(2, '0')}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleMinuteScroll('down')}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <ChevronDown className="w-4 h-4 text-secondary" />
                  </button>
                </div>

                {/* AM/PM (only for 12h format) */}
                {timeFormat === '12h' && (
                  <div className="flex flex-col items-center ml-2">
                    <button
                      onClick={() => handleAMPMToggle()}
                      className={`
                        px-2 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 border
                        ${isAM 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                          : 'bg-white text-secondary border-gray-200 hover:bg-gray-50'
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
                          : 'bg-white text-secondary border-gray-200 hover:bg-gray-50'
                        }
                      `}
                    >
                      PM
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <button
                onClick={showDate ? goToToday : setCurrentTime}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                {showDate ? 'Today' : 'Now'}
              </button>
              
              <button
                onClick={clearDateTime}
                className="px-3 py-1.5 text-xs font-medium text-secondary hover:bg-gray-50 rounded-lg transition-colors duration-200"
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

export default DateTimePicker;

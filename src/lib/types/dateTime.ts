// Date and Time Picker Types
export interface BasePickerProps {
  value?: Date | null;
  onChange: (value: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
}

export interface DatePickerProps extends BasePickerProps {
  minDate?: Date;
  maxDate?: Date;
}

export interface TimePickerProps extends BasePickerProps {
  format?: '12h' | '24h';
  minuteStep?: number;
}

export interface DateTimePickerProps extends DatePickerProps, TimePickerProps {
  showTime?: boolean;
  showDate?: boolean;
}

// Validation helpers
export const validateDate = (date: Date | null, minDate?: Date, maxDate?: Date): boolean => {
  if (!date) return true; // Allow null/undefined
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
};

export const validateTime = (time: Date | null): boolean => {
  if (!time) return true; // Allow null/undefined
  return time instanceof Date && !isNaN(time.getTime());
};

export const validateDateTime = (dateTime: Date | null, minDate?: Date, maxDate?: Date): boolean => {
  if (!dateTime) return true; // Allow null/undefined
  return validateDate(dateTime, minDate, maxDate) && validateTime(dateTime);
};

// Format helpers
export const formatDate = (date: Date | null, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return '';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatTime = (time: Date | null, format: '12h' | '24h' = '12h'): string => {
  if (!time) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: format === '12h'
  };
  
  return time.toLocaleTimeString('en-US', options);
};

export const formatDateTime = (dateTime: Date | null, timeFormat: '12h' | '24h' = '12h'): string => {
  if (!dateTime) return '';
  
  const dateStr = formatDate(dateTime);
  const timeStr = formatTime(dateTime, timeFormat);
  
  return `${dateStr} at ${timeStr}`;
};

// Utility functions
export const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month, day);
};

export const createTime = (hours: number, minutes: number, seconds: number = 0): Date => {
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
};

export const createDateTime = (year: number, month: number, day: number, hours: number, minutes: number, seconds: number = 0): Date => {
  return new Date(year, month, day, hours, minutes, seconds);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.toDateString() === date2.toDateString();
};

export const isSameTime = (time1: Date, time2: Date): boolean => {
  return time1.getHours() === time2.getHours() && 
         time1.getMinutes() === time2.getMinutes();
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};

export const isPast = (date: Date): boolean => {
  const now = new Date();
  return date < now;
};

export const isFuture = (date: Date): boolean => {
  const now = new Date();
  return date > now;
};

// Time conversion helpers
export const convertTo12Hour = (hour24: number): { hour: number; isAM: boolean } => {
  if (hour24 === 0) return { hour: 12, isAM: true };
  if (hour24 < 12) return { hour: hour24, isAM: true };
  if (hour24 === 12) return { hour: 12, isAM: false };
  return { hour: hour24 - 12, isAM: false };
};

export const convertTo24Hour = (hour12: number, isAM: boolean): number => {
  if (isAM) {
    return hour12 === 12 ? 0 : hour12;
  } else {
    return hour12 === 12 ? 12 : hour12 + 12;
  }
};

// Preset time ranges
export const TIME_PRESETS = {
  MORNING: { start: 6, end: 12 },
  AFTERNOON: { start: 12, end: 18 },
  EVENING: { start: 18, end: 22 },
  NIGHT: { start: 22, end: 6 }
} as const;

export const getTimePreset = (hour: number): keyof typeof TIME_PRESETS | null => {
  if (hour >= 6 && hour < 12) return 'MORNING';
  if (hour >= 12 && hour < 18) return 'AFTERNOON';
  if (hour >= 18 && hour < 22) return 'EVENING';
  if (hour >= 22 || hour < 6) return 'NIGHT';
  return null;
};

// Common date ranges
export const DATE_RANGES = {
  TODAY: () => {
    const today = new Date();
    return { start: today, end: today };
  },
  TOMORROW: () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return { start: tomorrow, end: tomorrow };
  },
  THIS_WEEK: () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { start: startOfWeek, end: endOfWeek };
  },
  NEXT_WEEK: () => {
    const today = new Date();
    const startOfNextWeek = new Date(today);
    startOfNextWeek.setDate(today.getDate() - today.getDay() + 7);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
    return { start: startOfNextWeek, end: endOfNextWeek };
  },
  THIS_MONTH: () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return { start: startOfMonth, end: endOfMonth };
  },
  NEXT_MONTH: () => {
    const today = new Date();
    const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    return { start: startOfNextMonth, end: endOfNextMonth };
  }
} as const;

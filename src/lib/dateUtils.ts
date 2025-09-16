/**
 * Safely formats a date with proper error handling
 * @param date - Date object, string, null, or undefined
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string or fallback text
 */
export function safeFormatDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  if (!date) return 'Not specified';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return 'Invalid date';
  }
}

/**
 * Safely formats a date for short display (e.g., "Jan 15, 2024")
 */
export function safeFormatDateShort(date: Date | string | null | undefined): string {
  return safeFormatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Safely formats a date for long display (e.g., "January 15, 2024")
 */
export function safeFormatDateLong(date: Date | string | null | undefined): string {
  return safeFormatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

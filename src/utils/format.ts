import { format, parseISO, isValid } from 'date-fns';
import type { Price } from '../services/types';
import { CURRENCIES, DEFAULT_CURRENCY } from './constants';

export const formatPrice = (price: Price | null | undefined): string => {
  if (!price || typeof price.value !== 'number') {
    return '-';
  }

  const currency = CURRENCIES.find(c => c.code === price.currencyCode);
  const symbol = currency?.symbol || price.currencyCode;

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price.value).replace(/^/, symbol);
};

export const formatCurrency = (
  amount: number, 
  currencyCode: string = DEFAULT_CURRENCY
): string => {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || currencyCode;

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount).replace(/^/, symbol);
};

export const formatDate = (
  date: string | Date | null | undefined,
  formatString: string = 'MMM d, yyyy'
): string => {
  if (!date) return '-';

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return '-';
    }

    return format(dateObj, formatString);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return '-';
  }
};

export const formatAirportDisplay = (
  airport: { code: string; name: string; country?: string } | null
): string => {
  if (!airport) return '';
  
  const parts = [airport.name];
  if (airport.country && airport.country !== airport.name) {
    parts.push(airport.country);
  }
  
  return `${airport.code} - ${parts.join(', ')}`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
};

export const formatDistance = (
  distance: number | null | undefined, 
  unit: 'km' | 'mi' = 'km'
): string => {
  if (typeof distance !== 'number') return '-';
  
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(distance);
  
  return `${formatted} ${unit}`;
};

export const formatFlightNumber = (flightNumber: string): string => {
  // Ensure flight number is properly formatted (e.g., "FR1234" instead of "fr1234")
  return flightNumber.toUpperCase().replace(/^([A-Z]{2})(\d+)$/, '$1 $2');
};

export const formatPassengerCount = (count: number): string => {
  if (count === 1) return '1 Adult';
  return `${count} Adults`;
};

export const getRelativeTimeString = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInHours = Math.floor((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 0) {
      return 'Past';
    } else if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Tomorrow';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `In ${diffInDays} days`;
    }
  } catch {
    return '-';
  }
};
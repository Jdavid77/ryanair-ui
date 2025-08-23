export const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
] as const;

export const DEFAULT_CURRENCY = 'EUR';

export const PASSENGER_COUNTS = [
  { value: 1, label: '1 Adult' },
  { value: 2, label: '2 Adults' },
  { value: 3, label: '3 Adults' },
  { value: 4, label: '4 Adults' },
  { value: 5, label: '5 Adults' },
  { value: 6, label: '6 Adults' },
  { value: 7, label: '7 Adults' },
  { value: 8, label: '8 Adults' },
  { value: 9, label: '9 Adults' },
] as const;

export const TRIP_TYPES = {
  'one-way': 'One way',
  'round-trip': 'Round trip',
} as const;

export const DATE_FORMAT = 'yyyy-MM-dd';
export const DISPLAY_DATE_FORMAT = 'MMM d, yyyy';
export const SHORT_DATE_FORMAT = 'MMM d';

export const API_BASE_URL = 'https://api-ryanair.jnobrega.com';

export const QUERY_STALE_TIME = {
  VERY_SHORT: 1000 * 60 * 2, // 2 minutes
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 15, // 15 minutes
  LONG: 1000 * 60 * 30, // 30 minutes
  VERY_LONG: 1000 * 60 * 60, // 1 hour
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;
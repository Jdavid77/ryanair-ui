// API Response Types based on the Ryanair API documentation

export interface Airport {
  name: string;
  code: string;
  country: string;
  timezone: string;
}

export interface AirportSummary {
  code: string;
  name: string;
  country: string;
}

export interface AirportDetails extends Airport {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  city?: string;
  region?: string;
}

export interface ClosestAirport extends Airport {
  distance?: number;
  distanceUnit?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Destination {
  code: string;
  name: string;
  country: string;
  popular?: boolean;
}

export interface Schedule {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  frequency: string[];
  aircraft?: string;
}

export interface Route {
  origin: AirportSummary;
  destination: AirportSummary;
  distance?: number;
  duration?: string;
  frequency?: number;
}

export interface Price {
  value: number;
  currencyCode: string;
}

export interface Fare {
  departureDate: string;
  price: Price;
  outbound?: {
    departureDate: string;
    price: Price;
  };
  inbound?: {
    departureDate: string;
    price: Price;
  };
}

export interface CheapestFarePerDay {
  outbound: {
    fares: Array<{
      day: string;
      departureDate: string | null;
      arrivalDate: string | null;
      price: Price | null;
      soldOut: boolean;
      unavailable: boolean;
    }>;
    minFare: {
      day: string;
      departureDate: string;
      arrivalDate: string;
      price: Price;
      soldOut: boolean;
      unavailable: boolean;
    };
    maxFare: {
      day: string;
      departureDate: string;
      arrivalDate: string;
      price: Price;
      soldOut: boolean;
      unavailable: boolean;
    };
  };
  inbound?: {
    fares: Array<{
      day: string;
      departureDate: string | null;
      arrivalDate: string | null;
      price: Price | null;
      soldOut: boolean;
      unavailable: boolean;
    }>;
    minFare: {
      day: string;
      departureDate: string;
      arrivalDate: string;
      price: Price;
      soldOut: boolean;
      unavailable: boolean;
    };
    maxFare: {
      day: string;
      departureDate: string;
      arrivalDate: string;
      price: Price;
      soldOut: boolean;
      unavailable: boolean;
    };
  };
}

export interface DailyFareRange {
  day: string;
  arrivalDate: string;
  departureDate: string;
  price: Price;
  soldOut: boolean;
  unavailable: boolean;
}

export interface RoundTripFareOption {
  departure: {
    day: string;
    departureDate: string;
    arrivalDate: string;
    price: Price;
    soldOut: boolean;
    unavailable: boolean;
  };
  return: {
    day: string;
    departureDate: string;
    arrivalDate: string;
    price: Price;
    soldOut: boolean;
    unavailable: boolean;
  };
  totalPrice: Price;
}

export type RoundTripFare = RoundTripFareOption[];

export interface ApiError {
  error: string;
  message: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
}

// Request parameter types
export interface FareSearchParams {
  from: string;
  to: string;
  startDate: string;
  endDate?: string;
  currency?: string;
}

export interface DailyRangeParams {
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  currency?: string;
}

export interface RoundTripParams {
  from: string;
  to: string;
  outboundDate: string;
  inboundDate: string;
  currency?: string;
}

// UI-specific types
export interface FlightSearchForm {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
  returnDate: Date | null;
  tripType: 'one-way' | 'round-trip' | 'daily-fares';
  passengers: number;
  currency: string;
  // Additional fields for daily fares
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface PriceCalendarDay {
  date: Date;
  price: Price | null;
  available: boolean;
  isToday: boolean;
  isSelected: boolean;
}
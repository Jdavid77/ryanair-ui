import type {
  Airport,
  AirportDetails,
  ClosestAirport,
  Destination,
  Schedule,
  Route,
  CheapestFarePerDay,
  DailyFareRange,
  RoundTripFare,
  HealthStatus,
  FareSearchParams,
  DailyRangeParams,
  RoundTripParams,
  ApiError,
} from './types';

const API_BASE_URL = 'https://api-ryanair.jnobrega.com';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(endpoint, API_BASE_URL);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If JSON parsing fails, use the default error message
      }
      
      throw new ApiError(response.status, errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// System Health API
export const healthApi = {
  getHealth: (): Promise<HealthStatus> =>
    apiRequest<HealthStatus>('/health'),
};

// Airports API
export const airportsApi = {
  getAllActive: (): Promise<Airport[]> =>
    apiRequest<Airport[]>('/api/airports/active'),

  getByCode: (code: string): Promise<AirportDetails> =>
    apiRequest<AirportDetails>(`/api/airports/${code}`),

  getClosest: (): Promise<ClosestAirport> =>
    apiRequest<ClosestAirport>('/api/airports/closest'),

  getNearby: (): Promise<ClosestAirport[]> =>
    apiRequest<ClosestAirport[]>('/api/airports/nearby'),

  getDestinations: (code: string): Promise<Destination[]> =>
    apiRequest<Destination[]>(`/api/airports/${code}/destinations`),

  getSchedules: (code: string): Promise<Schedule[]> =>
    apiRequest<Schedule[]>(`/api/airports/${code}/schedules`),

  getRoutes: (from: string, to: string): Promise<Route> =>
    apiRequest<Route>(`/api/airports/${from}/routes/${to}`),
};

// Fares API
export const faresApi = {
  getCheapestPerDay: (params: FareSearchParams): Promise<CheapestFarePerDay> =>
    apiRequest<CheapestFarePerDay>('/api/fares/cheapest-per-day', {
      from: params.from,
      to: params.to,
      startDate: params.startDate,
      currency: params.currency || 'EUR',
    }),

  getDailyRange: (params: DailyRangeParams): Promise<DailyFareRange[]> =>
    apiRequest<DailyFareRange[]>('/api/fares/daily-range', {
      from: params.from,
      to: params.to,
      startDate: params.startDate,
      endDate: params.endDate,
      currency: params.currency || 'EUR',
    }),

  getCheapestRoundTrip: (params: RoundTripParams): Promise<RoundTripFare> =>
    apiRequest<RoundTripFare>('/api/fares/cheapest-round-trip', {
      from: params.from,
      to: params.to,
      startDate: params.outboundDate,
      endDate: params.inboundDate,
      currency: params.currency || 'EUR',
    }),
};

// Combined API object
export const api = {
  health: healthApi,
  airports: airportsApi,
  fares: faresApi,
};

export { ApiError };
export default api;
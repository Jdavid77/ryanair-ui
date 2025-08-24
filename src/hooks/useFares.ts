import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { api } from '../services/api';
import type { 
  CheapestFarePerDay, 
  DailyFareRange, 
  RoundTripFare,
  FareSearchParams,
  DailyRangeParams,
  RoundTripParams
} from '../services/types';

// Query keys for cache management
export const fareKeys = {
  all: ['fares'] as const,
  cheapestPerDay: (params: FareSearchParams) => 
    [...fareKeys.all, 'cheapest-per-day', params] as const,
  dailyRange: (params: DailyRangeParams) => 
    [...fareKeys.all, 'daily-range', params] as const,
  roundTrip: (params: RoundTripParams) => 
    [...fareKeys.all, 'round-trip', params] as const,
};

export const useCheapestFarePerDay = (
  params: FareSearchParams,
  options?: Omit<UseQueryOptions<CheapestFarePerDay, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: fareKeys.cheapestPerDay(params),
    queryFn: () => api.fares.getCheapestPerDay(params),
    enabled: !!(params.from && params.to && params.startDate && params.from !== params.to),
    staleTime: 1000 * 60 * 5, // 5 minutes (fares change frequently)
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: (failureCount, error) => {
      // Don't retry on client errors (400-499)
      if (error.message.includes('400') || error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
};

export const useDailyFareRange = (
  params: DailyRangeParams,
  options?: Omit<UseQueryOptions<DailyFareRange[], Error>, 'queryKey' | 'queryFn'>
) => {
  // Validate date range - allow up to 6 months for calendar view
  const isValidDateRange = () => {
    if (!params.startDate || !params.endDate) return false;
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + 
                         (end.getMonth() - start.getMonth());
    return start <= end && diffInMonths <= 6; // Allow up to 6 months
  };

  return useQuery({
    queryKey: fareKeys.dailyRange(params),
    queryFn: () => api.fares.getDailyRange(params),
    enabled: !!(
      params.from && 
      params.to && 
      params.startDate && 
      params.endDate &&
      params.from !== params.to &&
      isValidDateRange()
    ),
    staleTime: 1000 * 60 * 10, // 10 minutes (longer cache for calendar data)
    gcTime: 1000 * 60 * 30, // 30 minutes (keep calendar data longer)
    retry: (failureCount, error) => {
      if (error.message.includes('400') || error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
    // Enable background refetch for better UX
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

export const useRoundTripFares = (
  params: RoundTripParams,
  options?: Omit<UseQueryOptions<RoundTripFare, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: fareKeys.roundTrip(params),
    queryFn: () => api.fares.getCheapestRoundTrip(params),
    enabled: !!(
      params.from && 
      params.to && 
      params.outboundDate && 
      params.inboundDate &&
      params.from !== params.to &&
      new Date(params.outboundDate) <= new Date(params.inboundDate)
    ),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    retry: (failureCount, error) => {
      if (error.message.includes('400') || error.message.includes('404')) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
};

// Utility hook for searching fares with flexible parameters
export const useFareSearch = (searchParams: {
  from?: string;
  to?: string;
  departureDate?: string;
  returnDate?: string;
  tripType: 'one-way' | 'round-trip';
  currency?: string;
}) => {
  const { from, to, departureDate, returnDate, tripType, currency = 'EUR' } = searchParams;

  // One-way fare search
  const oneWayParams: FareSearchParams = {
    from: from || '',
    to: to || '',
    startDate: departureDate || '',
    currency,
  };

  // Round-trip fare search
  const roundTripParams: RoundTripParams = {
    from: from || '',
    to: to || '',
    outboundDate: departureDate || '',
    inboundDate: returnDate || '',
    currency,
  };

  const oneWayQuery = useCheapestFarePerDay(oneWayParams, {
    enabled: tripType === 'one-way' && !!(from && to && departureDate),
  });

  const roundTripQuery = useRoundTripFares(roundTripParams, {
    enabled: tripType === 'round-trip' && !!(from && to && departureDate && returnDate),
  });

  return {
    oneWay: oneWayQuery,
    roundTrip: roundTripQuery,
    isLoading: oneWayQuery.isLoading || roundTripQuery.isLoading,
    error: oneWayQuery.error || roundTripQuery.error,
    data: tripType === 'one-way' ? oneWayQuery.data : roundTripQuery.data,
  };
};
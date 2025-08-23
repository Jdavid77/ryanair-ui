import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { api } from '../services/api';
import type { 
  Airport, 
  AirportDetails, 
  ClosestAirport, 
  Destination, 
  Schedule, 
  Route 
} from '../services/types';

// Query keys for cache management
export const airportKeys = {
  all: ['airports'] as const,
  active: () => [...airportKeys.all, 'active'] as const,
  detail: (code: string) => [...airportKeys.all, 'detail', code] as const,
  closest: () => [...airportKeys.all, 'closest'] as const,
  nearby: () => [...airportKeys.all, 'nearby'] as const,
  destinations: (code: string) => [...airportKeys.all, 'destinations', code] as const,
  schedules: (code: string) => [...airportKeys.all, 'schedules', code] as const,
  routes: (from: string, to: string) => [...airportKeys.all, 'routes', from, to] as const,
};

export const useActiveAirports = (
  options?: Omit<UseQueryOptions<Airport[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: airportKeys.active(),
    queryFn: () => api.airports.getAllActive(),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
};

export const useAirportDetails = (
  code: string,
  options?: Omit<UseQueryOptions<AirportDetails, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: airportKeys.detail(code),
    queryFn: () => api.airports.getByCode(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
};

export const useClosestAirport = (
  options?: Omit<UseQueryOptions<ClosestAirport, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: airportKeys.closest(),
    queryFn: () => api.airports.getClosest(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's likely a geolocation permission issue
      if (error.message.includes('location') || error.message.includes('permission')) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
};

export const useNearbyAirports = (
  options?: Omit<UseQueryOptions<ClosestAirport[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: airportKeys.nearby(),
    queryFn: () => api.airports.getNearby(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's likely a geolocation permission issue
      if (error.message.includes('location') || error.message.includes('permission')) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
};

export const useAirportDestinations = (
  code: string,
  options?: Omit<UseQueryOptions<Destination[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: airportKeys.destinations(code),
    queryFn: () => api.airports.getDestinations(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
};

export const useAirportSchedules = (
  code: string,
  options?: Omit<UseQueryOptions<Schedule[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: airportKeys.schedules(code),
    queryFn: () => api.airports.getSchedules(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 15, // 15 minutes
    ...options,
  });
};

export const useAirportRoute = (
  from: string,
  to: string,
  options?: Omit<UseQueryOptions<Route, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: airportKeys.routes(from, to),
    queryFn: () => api.airports.getRoutes(from, to),
    enabled: !!(from && to && from !== to),
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
};
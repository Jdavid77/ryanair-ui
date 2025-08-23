import { useState, useRef, useEffect } from 'react';
import { Combobox } from '@headlessui/react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/solid';
import { useActiveAirports, useClosestAirport, useAirportDestinations } from '../../hooks/useAirports';
import { formatAirportDisplay } from '../../utils/format';
import type { Airport, Destination } from '../../services/types';
import { cn } from '../../utils/cn';

interface AirportSearchProps {
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  showNearby?: boolean;
  originAirport?: Airport | null; // For destination filtering
  mode?: 'origin' | 'destination';
}

export function AirportSearch({
  value,
  onChange,
  placeholder = "Select airport...",
  label,
  disabled = false,
  showNearby = true,
  originAirport = null,
  mode = 'origin'
}: AirportSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { data: airports = [], isLoading: airportsLoading } = useActiveAirports();
  const { data: closestAirport, isLoading: closestLoading } = useClosestAirport({
    enabled: showNearby && mode === 'origin'
  });
  
  // Get destinations from origin airport if this is destination mode
  const { data: destinations = [], isLoading: destinationsLoading } = useAirportDestinations(
    originAirport?.code || '',
    {
      enabled: mode === 'destination' && !!originAirport
    }
  );

  // Determine which data to use based on mode
  const sourceData = mode === 'origin' ? airports : destinations.map(dest => ({
    code: dest.code,
    name: dest.name,
    country: dest.country,
    timezone: '' // Not provided in destinations API
  }));
  
  const isLoading = mode === 'origin' ? airportsLoading : destinationsLoading;

  // Filter airports/destinations based on search query
  const filteredItems = query === ''
    ? sourceData
    : sourceData.filter((item) => {
        const searchText = `${item.code} ${item.name} ${item.country}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });

  // Show closest airport at the top if available (only for origin mode)
  const displayItems = (closestAirport && showNearby && mode === 'origin')
    ? [closestAirport, ...filteredItems.filter(a => a.code !== closestAirport.code)]
    : filteredItems;

  const handleSelect = (airport: Airport | null) => {
    onChange(airport);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <Combobox 
        value={value} 
        onChange={handleSelect}
        disabled={disabled}
        by={(a, b) => a?.code === b?.code}
      >
        <div className="relative">
          <div className="relative">
            <Combobox.Input
              ref={inputRef}
              className={cn(
                "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm",
                "focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
                "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
                "placeholder:text-gray-400"
              )}
              displayValue={(airport: Airport | null) => 
                airport ? formatAirportDisplay(airport) : ''
              }
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              autoComplete="off"
            />
            
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>

          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            {isLoading ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                  <span>Loading {mode === 'origin' ? 'airports' : 'destinations'}...</span>
                </div>
              </div>
            ) : mode === 'destination' && !originAirport ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Please select a departure airport first.
              </div>
            ) : displayItems.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                {query ? `No ${mode === 'origin' ? 'airports' : 'destinations'} found.` : `No ${mode === 'origin' ? 'airports' : 'destinations'} available.`}
              </div>
            ) : (
              displayItems.map((airport, index) => (
                <Combobox.Option
                  key={airport.code}
                  className={({ active }) =>
                    cn(
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                      active ? 'bg-primary-50 text-primary-900' : 'text-gray-900'
                    )
                  }
                  value={airport}
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex items-center">
                        {index === 0 && closestAirport?.code === airport.code && showNearby && mode === 'origin' && (
                          <MapPinIcon className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span className={cn(
                            'block truncate font-medium text-sm',
                            selected && 'font-semibold'
                          )}>
                            {airport.code}
                          </span>
                          <span className="block text-xs text-gray-500 truncate">
                            {airport.name}
                            {airport.country && ` • ${airport.country}`}
                          </span>
                        </div>
                      </div>
                      {selected && (
                        <span className={cn(
                          'absolute inset-y-0 left-0 flex items-center pl-3',
                          active ? 'text-primary-600' : 'text-primary-600'
                        )}>
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}
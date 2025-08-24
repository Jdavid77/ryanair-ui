import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { ArrowsRightLeftIcon, CalendarDaysIcon, UsersIcon } from '@heroicons/react/24/outline';
import { AirportSearch } from '../airport/AirportSearch';
import { NearbyAirportsButton } from '../airport/NearbyAirportsButton';
import { DailyFaresCalendarModal } from './DailyFaresCalendarModal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CURRENCIES, PASSENGER_COUNTS, DATE_FORMAT } from '../../utils/constants';
import type { FlightSearchForm as FlightSearchFormType } from '../../services/types';
import { cn } from '../../utils/cn';

interface FlightSearchFormProps {
  value: FlightSearchFormType;
  onChange: (value: FlightSearchFormType) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function FlightSearchForm({ value, onChange, onSubmit, loading }: FlightSearchFormProps) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const handleSwapAirports = () => {
    onChange({
      ...value,
      origin: value.destination,
      destination: value.origin,
    });
  };

  const handleFieldChange = <K extends keyof FlightSearchFormType>(
    field: K,
    fieldValue: FlightSearchFormType[K]
  ) => {
    const newValue = {
      ...value,
      [field]: fieldValue,
    };
    
    // If changing origin airport, clear destination to force reselection
    if (field === 'origin' && fieldValue !== value.origin) {
      newValue.destination = null;
    }
    
    onChange(newValue);
  };

  const handleTripTypeChange = (tripType: 'one-way' | 'round-trip' | 'daily-fares') => {
    onChange({
      ...value,
      tripType,
      returnDate: tripType === 'one-way' ? null : value.returnDate,
      // Initialize date range for daily fares
      startDate: tripType === 'daily-fares' ? value.startDate : null,
      endDate: tripType === 'daily-fares' ? value.endDate : null,
    });
  };

  const isFormValid = () => {
    const baseValid = !!(
      value.origin &&
      value.destination &&
      value.origin.code !== value.destination.code
    );

    if (value.tripType === 'daily-fares') {
      return baseValid && value.startDate && value.endDate;
    }

    return baseValid && value.departureDate && (value.tripType === 'one-way' || value.returnDate);
  };

  const today = new Date();
  const tomorrow = addDays(today, 1);

  return (
    <div className="space-y-6">
      {/* Trip Type Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => handleTripTypeChange('one-way')}
          className={cn(
            "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
            value.tripType === 'one-way'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          One way
        </button>
        <button
          type="button"
          onClick={() => handleTripTypeChange('round-trip')}
          className={cn(
            "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
            value.tripType === 'round-trip'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Round trip
        </button>
        <button
          type="button"
          onClick={() => handleTripTypeChange('daily-fares')}
          className={cn(
            "flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors",
            value.tripType === 'daily-fares'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Daily Fares
        </button>
        </div>
        
        {/* Nearby Airports Button */}
        <NearbyAirportsButton />
      </div>

      {/* Airport Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="relative">
          <AirportSearch
            label="From"
            value={value.origin}
            onChange={(airport) => handleFieldChange('origin', airport)}
            placeholder="Select departure airport"
            showNearby={true}
            mode="origin"
          />
        </div>

        <div className="relative">
          <AirportSearch
            label="To"
            value={value.destination}
            onChange={(airport) => handleFieldChange('destination', airport)}
            placeholder={value.origin ? "Select destination" : "Select departure first"}
            disabled={!value.origin}
            showNearby={false}
            mode="destination"
            originAirport={value.origin}
          />
          
          {/* Swap Button */}
          <button
            type="button"
            onClick={handleSwapAirports}
            className="absolute top-8 -left-3 lg:left-auto lg:-translate-x-1/2 lg:left-1/2 z-10 bg-white border-2 border-gray-200 rounded-full p-2 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <ArrowsRightLeftIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Date Selection */}
      {value.tripType === 'daily-fares' ? (
        // Daily Fares: Date Range Selection
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={value.startDate ? format(value.startDate, DATE_FORMAT) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleFieldChange('startDate', date);
                }}
                min={format(today, DATE_FORMAT)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <Input
                type="date"
                value={value.endDate ? format(value.endDate, DATE_FORMAT) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleFieldChange('endDate', date);
                }}
                min={value.startDate ? format(value.startDate, DATE_FORMAT) : format(tomorrow, DATE_FORMAT)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        // One-way and Round-trip: Single/Return Date Selection
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure
            </label>
            <div className="relative">
              <Input
                type="date"
                value={value.departureDate ? format(value.departureDate, DATE_FORMAT) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleFieldChange('departureDate', date);
                }}
                min={format(today, DATE_FORMAT)}
                className="pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {value.tripType === 'round-trip' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={value.returnDate ? format(value.returnDate, DATE_FORMAT) : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : null;
                    handleFieldChange('returnDate', date);
                  }}
                  min={value.departureDate ? format(value.departureDate, DATE_FORMAT) : format(tomorrow, DATE_FORMAT)}
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}


      {/* Passengers and Currency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passengers
          </label>
          <div className="relative">
            <select
              value={value.passengers}
              onChange={(e) => handleFieldChange('passengers', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
            >
              {PASSENGER_COUNTS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UsersIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <div className="relative">
            <select
              value={value.currency}
              onChange={(e) => handleFieldChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        {value.tripType === 'daily-fares' ? (
          <Button
            onClick={() => setShowCalendarModal(true)}
            disabled={!isFormValid()}
            size="lg"
            className="w-full flex items-center justify-center space-x-2"
          >
            <CalendarDaysIcon className="w-5 h-5" />
            <span>View Calendar</span>
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!isFormValid()}
            loading={loading}
            size="lg"
            className="w-full"
          >
            Search Flights
          </Button>
        )}
      </div>

      {/* Daily Fares Calendar Modal */}
      <DailyFaresCalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        origin={value.origin}
        destination={value.destination}
        selectedDate={value.tripType === 'daily-fares' ? value.startDate : value.departureDate}
        startDate={value.tripType === 'daily-fares' ? value.startDate : undefined}
        endDate={value.tripType === 'daily-fares' ? value.endDate : undefined}
        currency={value.currency}
        onDateSelect={(date) => {
          if (value.tripType === 'daily-fares') {
            // For daily fares, we don't need to select specific dates, just view the calendar
            return;
          } else {
            handleFieldChange('departureDate', date);
          }
        }}
      />
    </div>
  );
}
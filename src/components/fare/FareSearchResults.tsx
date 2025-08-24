import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { CalendarDaysIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useFareSearch } from '../../hooks/useFares';
import { DailyFaresCalendarModal } from './DailyFaresCalendarModal';
import { formatPrice, formatDate, formatCurrency } from '../../utils/format';
import type { FlightSearchForm } from '../../services/types';

interface FareSearchResultsProps {
  searchParams: FlightSearchForm;
  onSearchParamsChange: (params: FlightSearchForm) => void;
}

export function FareSearchResults({ searchParams, onSearchParamsChange }: FareSearchResultsProps) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  const { data: fareData, isLoading: fareLoading, error: fareError } = useFareSearch({
    from: searchParams.origin?.code,
    to: searchParams.destination?.code,
    departureDate: searchParams.departureDate ? format(searchParams.departureDate, 'yyyy-MM-dd') : undefined,
    returnDate: searchParams.returnDate ? format(searchParams.returnDate, 'yyyy-MM-dd') : undefined,
    tripType: searchParams.tripType,
    currency: searchParams.currency,
  });

  if (!searchParams.origin || !searchParams.destination) {
    return null;
  }

  const canShowResults = searchParams.origin && searchParams.destination && 
                        searchParams.departureDate && 
                        (searchParams.tripType === 'one-way' || searchParams.returnDate);

  if (!canShowResults) {
    return (
      <div className="text-center py-8">
        <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Complete your search</h3>
        <p className="text-gray-600">Fill in all required fields to find flights</p>
      </div>
    );
  }

  // Helper function to find fare for specific date
  const getFareForDate = (fares: any[], targetDate: Date) => {
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    return fares.find(fare => fare.day === dateStr && !fare.unavailable && fare.price);
  };

  return (
    <div className="space-y-6">
      {/* Main Fare Result */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Best Fare Found</h3>
        </CardHeader>
        <CardContent>
          {fareLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-gray-600">Searching for fares...</span>
            </div>
          ) : fareError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">Unable to find fares</p>
              <p className="text-gray-500 text-sm">
                {fareError.message || 'Please try different dates or destinations'}
              </p>
            </div>
          ) : fareData ? (
            <div className="space-y-4">
              {/* Handle round-trip vs one-way data structures */}
              {searchParams.tripType === 'round-trip' ? (
                // Round-trip: fareData is an array of RoundTripFareOption - show all options
                Array.isArray(fareData) && fareData.length > 0 && (
                  <>
                    {fareData.map((option, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-white mb-6">
                        {/* Round-trip option header with total price */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Option {index + 1} {index === 0 && <span className="text-sm font-normal text-green-600">(Best Price)</span>}
                            </h3>
                            <p className="text-sm text-gray-600">Round-trip flight</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-700">
                              {formatPrice({
                                value: option.departure.price.value + option.return.price.value,
                                currencyCode: option.departure.price.currencyCode
                              })}
                            </div>
                            <div className="text-xs text-gray-500">total per person</div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Outbound Flight */}
                          <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">FR</span>
                            </div>
                              <span className="text-sm text-gray-600">Ryanair • Outbound</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                {formatPrice(option.departure.price)}
                              </div>
                              <div className="text-xs text-gray-500">per person</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {format(new Date(option.departure.departureDate), 'HH:mm')}
                              </div>
                              <div className="text-sm text-gray-600">{searchParams.origin?.code}</div>
                              <div className="text-xs text-gray-500">{searchParams.origin?.name}</div>
                            </div>
                            
                            <div className="flex-1 px-4">
                              <div className="flex items-center">
                                <div className="flex-1 border-t-2 border-gray-300 relative">
                                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                    <PaperAirplaneIcon className="h-4 w-4 text-primary-500" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center text-xs text-gray-500 mt-1">2h 30m • Direct</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {format(new Date(option.departure.arrivalDate), 'HH:mm')}
                              </div>
                              <div className="text-sm text-gray-600">{searchParams.destination?.code}</div>
                              <div className="text-xs text-gray-500">{searchParams.destination?.name}</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-600">
                            <span>{formatDate(new Date(option.departure.day), 'EEE, MMM d, yyyy')}</span>
                            <span>Economy • 1 carry-on bag</span>
                          </div>
                        </div>

                        {/* Return Flight */}
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">FR</span>
                              </div>
                              <span className="text-sm text-gray-600">Ryanair • Return</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">
                                {formatPrice(option.return.price)}
                              </div>
                              <div className="text-xs text-gray-500">per person</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {format(new Date(option.return.departureDate), 'HH:mm')}
                              </div>
                              <div className="text-sm text-gray-600">{searchParams.destination?.code}</div>
                              <div className="text-xs text-gray-500">{searchParams.destination?.name}</div>
                            </div>
                            
                            <div className="flex-1 px-4">
                              <div className="flex items-center">
                                <div className="flex-1 border-t-2 border-gray-300 relative">
                                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                    <PaperAirplaneIcon className="h-4 w-4 text-primary-500" />
                                  </div>
                                </div>
                              </div>
                              <div className="text-center text-xs text-gray-500 mt-1">2h 35m • Direct</div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {format(new Date(option.return.arrivalDate), 'HH:mm')}
                              </div>
                              <div className="text-sm text-gray-600">{searchParams.origin?.code}</div>
                              <div className="text-xs text-gray-500">{searchParams.origin?.name}</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-600">
                            <span>{formatDate(new Date(option.return.day), 'EEE, MMM d, yyyy')}</span>
                            <span>Economy • 1 carry-on bag</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    ))}
                  </>
                )
              ) : (
                // One-way: Handle the existing logic
                'outbound' in fareData && fareData.outbound && (() => {
                // For one-way trips, find the fare for the selected date
                const selectedFare = searchParams.tripType === 'one-way' && fareData.outbound.fares && searchParams.departureDate
                  ? getFareForDate(fareData.outbound.fares, searchParams.departureDate)
                  : null;
                
                // Check if the selected date is unavailable
                const isSelectedDateUnavailable = searchParams.tripType === 'one-way' && 
                  fareData.outbound.fares && 
                  searchParams.departureDate && 
                  !selectedFare;

                // If selected date is unavailable, don't show misleading data
                if (isSelectedDateUnavailable) {
                  // Find alternative dates with available fares
                  const availableFares = fareData.outbound.fares
                    .filter(fare => !fare.unavailable && fare.price)
                    .sort((a, b) => (a.price?.value || 0) - (b.price?.value || 0))
                    .slice(0, 3); // Show top 3 alternatives

                  return (
                    <div className="space-y-4">
                      {/* No flights available message */}
                      <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                          <span className="text-sm font-medium text-orange-800">No flights available</span>
                        </div>
                        <p className="text-sm text-orange-700 mb-3">
                          No flights are available from {searchParams.origin.code} to {searchParams.destination.code} on{' '}
                          {formatDate(searchParams.departureDate, 'EEE, MMM d, yyyy')}.
                        </p>
                        
                        {/* Alternative dates */}
                        {availableFares.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-orange-800 mb-2">Available alternatives:</p>
                            <div className="space-y-2">
                              {availableFares.map((fare, index) => (
                                <button
                                  key={index}
                                  onClick={() => onSearchParamsChange({
                                    ...searchParams,
                                    departureDate: new Date(fare.day)
                                  })}
                                  className="w-full text-left p-2 bg-white rounded border border-orange-200 hover:border-orange-300 hover:bg-orange-50 transition-colors"
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {formatDate(new Date(fare.day), 'EEE, MMM d, yyyy')}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {fare.departureDate ? format(new Date(fare.departureDate), 'HH:mm') : 'N/A'} → {' '}
                                        {fare.arrivalDate ? format(new Date(fare.arrivalDate), 'HH:mm') : 'N/A'}
                                      </div>
                                    </div>
                                    <div className="text-sm font-bold text-orange-700">
                                      {formatPrice(fare.price)}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                
                // Use selected date fare if available, otherwise fallback to minFare for one-way
                const displayFare = selectedFare || (searchParams.tripType === 'one-way' ? fareData.outbound.minFare : null);
                
                if (!displayFare) {
                  return null; // This shouldn't happen but just in case
                }
                
                const departureTime = displayFare?.departureDate ? format(new Date(displayFare.departureDate), 'HH:mm') : '08:00';
                const arrivalTime = displayFare?.arrivalDate ? format(new Date(displayFare.arrivalDate), 'HH:mm') : '10:30';
                
                return (
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">FR</span>
                        </div>
                        <span className="text-sm text-gray-600">Ryanair • Outbound</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {displayFare?.price ? formatPrice(displayFare.price) : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{departureTime}</div>
                        <div className="text-sm text-gray-600">{searchParams.origin.code}</div>
                        <div className="text-xs text-gray-500">{searchParams.origin.name}</div>
                      </div>
                      
                      <div className="flex-1 px-4">
                        <div className="flex items-center">
                          <div className="flex-1 border-t-2 border-gray-300 relative">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                              <PaperAirplaneIcon className="h-4 w-4 text-primary-500" />
                            </div>
                          </div>
                        </div>
                        <div className="text-center text-xs text-gray-500 mt-1">2h 30m • Direct</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{arrivalTime}</div>
                        <div className="text-sm text-gray-600">{searchParams.destination.code}</div>
                        <div className="text-xs text-gray-500">{searchParams.destination.name}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-600">
                      <span>{formatDate(searchParams.departureDate, 'EEE, MMM d, yyyy')}</span>
                      <span>Economy • 1 carry-on bag</span>
                    </div>
                  </div>
                );
                })()
              )}
              
              {(() => {
                // Check if we have a valid fare to display
                let hasValidFare = false;
                let displayPrice = 'N/A';
                
                if (searchParams.tripType === 'round-trip' && Array.isArray(fareData) && fareData.length > 0) {
                  // Round-trip: use the best option's total price
                  const bestOption = fareData[0];
                  if (bestOption.totalPrice) {
                    hasValidFare = true;
                    const totalValue = bestOption.totalPrice.value * searchParams.passengers;
                    const currency = bestOption.totalPrice.currencyCode || 'EUR';
                    displayPrice = formatCurrency(totalValue, currency);
                  }
                } else if ('outbound' in fareData && fareData.outbound) {
                  // For one-way trips, check if selected date has fare
                  const selectedFare = searchParams.tripType === 'one-way' && fareData.outbound.fares && searchParams.departureDate
                    ? getFareForDate(fareData.outbound.fares, searchParams.departureDate)
                    : null;
                  
                  // Only show price for available flights
                  if (selectedFare?.price) {
                    hasValidFare = true;
                    const totalValue = selectedFare.price.value * searchParams.passengers;
                    const currency = selectedFare.price.currencyCode || 'EUR';
                    displayPrice = formatCurrency(totalValue, currency);
                  }
                }

                // Only render total price section if we have valid fares
                return hasValidFare ? (
                  <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Total Price</h3>
                        <p className="text-sm text-gray-600">
                          {searchParams.passengers} {searchParams.passengers === 1 ? 'passenger' : 'passengers'} • 
                          {searchParams.tripType === 'round-trip' ? ' Round trip' : ' One way'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-700">
                          {displayPrice}
                        </div>
                        <div className="text-sm text-gray-600">Includes taxes & fees</div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Find Cheaper Dates Button */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Looking for better prices?</h3>
              <p className="text-sm text-gray-600">Compare prices across multiple days</p>
            </div>
            <Button
              onClick={() => setShowCalendarModal(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <CalendarDaysIcon className="w-4 h-4" />
              <span>View Price Calendar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Fares Calendar Modal */}
      <DailyFaresCalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        origin={searchParams.origin}
        destination={searchParams.destination}
        selectedDate={searchParams.departureDate}
        currency={searchParams.currency}
        onDateSelect={(date) => {
          onSearchParamsChange({
            ...searchParams,
            departureDate: date
          });
        }}
      />
    </div>
  );
}
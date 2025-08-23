import { useState } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PaperAirplaneIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FlightSearchForm } from '../components/fare/FlightSearchForm';
import { FareSearchResults } from '../components/fare/FareSearchResults';
import type { FlightSearchForm as FlightSearchFormType } from '../services/types';

export function HomePage() {
  const [searchForm, setSearchForm] = useState<FlightSearchFormType>({
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    tripType: 'one-way',
    passengers: 1,
    currency: 'EUR',
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    console.log('Searching for flights:', searchForm);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-secondary-500 rounded-2xl">
                <PaperAirplaneIcon className="w-10 h-10 text-primary-500" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-900 mb-6">
              Find Your Perfect
              <span className="text-secondary-500 block">Ryanair Flight</span>
            </h1>
            <p className="text-xl text-primary-700 max-w-2xl mx-auto mb-8">
              Discover the best flight deals across Europe. Search, compare, and book 
              your next adventure with Europe's favourite airline.
            </p>
          </div>

          {/* Flight Search Card */}
          <Card className="max-w-4xl mx-auto shadow-soft-lg">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-4">
                <MagnifyingGlassIcon className="w-6 h-6 text-primary-500" />
                <h2 className="text-xl font-semibold text-gray-900">Search Flights</h2>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <FlightSearchForm 
                value={searchForm}
                onChange={setSearchForm}
                onSubmit={handleSearch}
              />
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">240+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">37</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">500+</div>
              <div className="text-gray-600">Aircraft</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      {hasSearched && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FareSearchResults 
              searchParams={searchForm}
              onSearchParamsChange={setSearchForm}
            />
          </div>
        </section>
      )}
    </div>
  );
}
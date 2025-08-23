import { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useActiveAirports } from '../../hooks/useAirports';

// Popular European destinations with their approximate images
const POPULAR_DESTINATIONS = [
  {
    code: 'DUB',
    name: 'Dublin',
    country: 'Ireland',
    image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=400&h=300&fit=crop&crop=faces,center',
    description: 'Historic pubs and vibrant culture'
  },
  {
    code: 'BCN',
    name: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop&crop=faces,center',
    description: 'Art, architecture and Mediterranean beaches'
  },
  {
    code: 'STN',
    name: 'London Stansted',
    country: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&crop=faces,center',
    description: 'Gateway to London and British culture'
  },
  {
    code: 'FCO',
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop&crop=faces,center',
    description: 'Ancient history and incredible cuisine'
  },
  {
    code: 'BVA',
    name: 'Paris Beauvais',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&crop=faces,center',
    description: 'City of lights and romance'
  },
  {
    code: 'BER',
    name: 'Berlin',
    country: 'Germany',
    image: 'https://images.unsplash.com/photo-1587330979470-3adf913bfe3d?w=400&h=300&fit=crop&crop=faces,center',
    description: 'History, culture and vibrant nightlife'
  }
];

export function PopularDestinations() {
  const { data: airports = [] } = useActiveAirports();
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  // Filter popular destinations to only show those available in our airport data
  const availableDestinations = POPULAR_DESTINATIONS.filter(dest =>
    airports.some(airport => airport.code === dest.code)
  );

  const handleDestinationSelect = (code: string) => {
    setSelectedDestination(code);
    // Here you could trigger a flight search or navigation
    console.log('Selected destination:', code);
  };

  if (availableDestinations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading destinations...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableDestinations.map((destination) => (
        <Card
          key={destination.code}
          className="group cursor-pointer overflow-hidden hover:shadow-soft-lg transition-shadow duration-300"
          onClick={() => handleDestinationSelect(destination.code)}
        >
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={destination.image}
                alt={`${destination.name}, ${destination.country}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{destination.name}</h3>
                  <p className="text-sm text-gray-200">{destination.country}</p>
                </div>
                <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded">
                  {destination.code}
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 mb-3">
              {destination.description}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full group-hover:bg-primary-50 group-hover:border-primary-200 group-hover:text-primary-700"
            >
              Find Flights
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
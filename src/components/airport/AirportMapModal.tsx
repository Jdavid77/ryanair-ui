import { MapPinIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useClosestAirport, useNearbyAirports } from '../../hooks/useAirports';
import { LeafletMap } from './LeafletMap';

interface AirportMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AirportMapModal({ isOpen, onClose }: AirportMapModalProps) {
  const { data: closestAirport, isLoading: closestLoading } = useClosestAirport();
  const { data: nearbyAirports, isLoading: nearbyLoading } = useNearbyAirports();

  if (!isOpen) return null;

  const isLoading = closestLoading || nearbyLoading;
  
  // Calculate map bounds and center
  const allAirports = [
    ...(closestAirport ? [closestAirport] : []),
    ...(nearbyAirports || [])
  ].filter(airport => airport.coordinates);

  const center = allAirports.length > 0 
    ? {
        lat: allAirports.reduce((sum, airport) => sum + (airport.coordinates?.latitude || 0), 0) / allAirports.length,
        lng: allAirports.reduce((sum, airport) => sum + (airport.coordinates?.longitude || 0), 0) / allAirports.length
      }
    : { lat: 32.6942, lng: -16.7781 }; // Default to Madeira

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <PaperAirplaneIcon className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Nearby Airports</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-gray-600">Finding nearby airports...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Real Geographic Map */}
              <LeafletMap 
                closestAirport={closestAirport}
                nearbyAirports={nearbyAirports}
              />

              {/* Airport List */}
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">Airport Details</h3>
                  <div className="text-xs text-gray-500">
                    {closestAirport ? '1' : '0'} closest • {nearbyAirports?.length || 0} nearby
                  </div>
                </div>
                
                {/* Closest Airport */}
                {closestAirport && (
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{closestAirport.code}</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Closest</span>
                      </div>
                      <p className="text-sm text-gray-600">{closestAirport.name}, {closestAirport.country}</p>
                      {closestAirport.distance && (
                        <p className="text-xs text-gray-500">
                          {closestAirport.distance} {closestAirport.distanceUnit || 'km'} away
                        </p>
                      )}
                    </div>
                    <MapPinIcon className="w-4 h-4 text-green-600" />
                  </div>
                )}

                {/* Nearby Airports */}
                {nearbyAirports?.map((airport) => {
                  // Skip if it's the same as closest airport
                  if (closestAirport && airport.code === closestAirport.code) return null;
                  
                  return (
                    <div key={airport.code} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{airport.code}</span>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Nearby</span>
                        </div>
                        <p className="text-sm text-gray-600">{airport.name}, {airport.country}</p>
                        {airport.distance && (
                          <p className="text-xs text-gray-500">
                            {airport.distance} {airport.distanceUnit || 'km'} away
                          </p>
                        )}
                      </div>
                      <MapPinIcon className="w-4 h-4 text-yellow-600" />
                    </div>
                  );
                })}
              </div>

              {(!closestAirport && (!nearbyAirports || nearbyAirports.length === 0)) && !isLoading && (
                <div className="text-center py-8">
                  <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Unable to find nearby airports</p>
                  <p className="text-sm text-gray-400">Location services may not be available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
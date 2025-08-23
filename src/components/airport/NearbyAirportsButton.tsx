import { useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { AirportMapModal } from './AirportMapModal';

export function NearbyAirportsButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors group border border-gray-300 hover:border-gray-400"
        title="View nearby airports"
        aria-label="Show nearby airports map"
      >
        <MapPinIcon className="w-4 h-4 text-gray-600 group-hover:text-primary-600 transition-colors" />
      </button>
      
      <AirportMapModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
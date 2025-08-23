import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { ClosestAirport } from '../../services/types';

interface LeafletMapProps {
  closestAirport?: ClosestAirport;
  nearbyAirports?: ClosestAirport[];
}

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export function LeafletMap({ closestAirport, nearbyAirports }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Default center (Madeira as fallback)
    const defaultCenter: [number, number] = [32.6942, -16.7781];
    
    // Calculate center from airports if available
    let center = defaultCenter;
    if (closestAirport?.coordinates) {
      center = [closestAirport.coordinates.latitude, closestAirport.coordinates.longitude];
    }

    // Create map
    const map = L.map(mapRef.current, {
      center,
      zoom: 8,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles (free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Custom green icon for closest airport
    const greenIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          width: 20px; 
          height: 20px; 
          background-color: #10b981; 
          border: 3px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        </style>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Custom yellow icon for nearby airports
    const yellowIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          width: 16px; 
          height: 16px; 
          background-color: #eab308; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Add closest airport marker
    if (closestAirport?.coordinates) {
      L.marker(
        [closestAirport.coordinates.latitude, closestAirport.coordinates.longitude], 
        { icon: greenIcon }
      )
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <div class="font-semibold text-green-700">${closestAirport.code} - Closest</div>
            <div class="text-sm text-gray-600">${closestAirport.name}</div>
            <div class="text-sm text-gray-500">${closestAirport.country}</div>
            ${closestAirport.distance ? `<div class="text-xs text-gray-400">${closestAirport.distance} ${closestAirport.distanceUnit || 'km'} away</div>` : ''}
          </div>
        `);
    }

    // Add nearby airport markers
    nearbyAirports?.forEach((airport) => {
      // Skip if it's the same as closest airport
      if (closestAirport && airport.code === closestAirport.code) return;
      
      if (airport.coordinates) {
        L.marker(
          [airport.coordinates.latitude, airport.coordinates.longitude], 
          { icon: yellowIcon }
        )
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <div class="font-semibold text-yellow-700">${airport.code}</div>
              <div class="text-sm text-gray-600">${airport.name}</div>
              <div class="text-sm text-gray-500">${airport.country}</div>
              ${airport.distance ? `<div class="text-xs text-gray-400">${airport.distance} ${airport.distanceUnit || 'km'} away</div>` : ''}
            </div>
          `);
      }
    });

    // Fit map to show all airports
    const allAirports = [
      ...(closestAirport ? [closestAirport] : []),
      ...(nearbyAirports || [])
    ].filter(airport => airport.coordinates);

    if (allAirports.length > 1) {
      const group = new L.FeatureGroup(
        allAirports.map(airport => 
          L.marker([airport.coordinates!.latitude, airport.coordinates!.longitude])
        )
      );
      map.fitBounds(group.getBounds(), { padding: [20, 20] });
    } else if (allAirports.length === 1) {
      const airport = allAirports[0];
      map.setView([airport.coordinates!.latitude, airport.coordinates!.longitude], 10);
    }

  }, [closestAirport, nearbyAirports]);

  return (
    <div 
      ref={mapRef} 
      className="w-full rounded-lg overflow-hidden border-2 border-blue-300" 
      style={{ height: '300px' }}
    />
  );
}
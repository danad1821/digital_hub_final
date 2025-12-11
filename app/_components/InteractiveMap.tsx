"use client";
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import axios from 'axios'; 

// --- TYPES ---
type Destination = {
  lat: number;
  lng: number;
  name: string;
};

// Define a common Location type for consistency
export type Location = {
  _id: string; // Crucial: Use string for MongoDB ID
  name: string;
  address: string;
  lat: number;
  lng: number;
  destinations?: Destination[];
};

// Map constants
export const initialCenter: [number, number] = [35.5, 19.5]; 

// Define a clean, empty initial state object using the new _id type.
const initialActiveLocation: Location = { 
    _id: '', 
    name: '', 
    address: '', 
    lat: 0, 
    lng: 0,
    destinations: [] 
};
// --- END TYPES ---


const DynamicMap = dynamic(
  () => import('./ShippingMap'),
  { ssr: false } 
);


export default function InteractiveMap() {
  const [locations, setLocations] = useState<Location[]>([]); 
  const [activeLocation, setActiveLocation] = useState<Location>(initialActiveLocation);
  const [isLoading, setIsLoading] = useState(true); 

  // Function to fetch the location data from the API (Memoized with useCallback)
  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    try {
        const response = await axios.get('/api/locations');
        setLocations(response.data);
    } catch (err) {
        console.error("Failed to fetch map locations:", err);
    } finally {
        setIsLoading(false);
    }
  }, []); // Stable function

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // Memoized function for clearing the active location
  const clearActiveLocation = useCallback(() => {
      setActiveLocation(initialActiveLocation);
  }, []); // Stable function

  // OPTIMIZATION: Use useMemo to derive the active status based on activeLocation._id
  // This ensures the value is only recalculated if activeLocation changes.
  const isLocationActive = useMemo(() => {
    return !!(activeLocation && activeLocation._id); 
  }, [activeLocation]); 

  return (
    <div className="flex flex-col h-screen relative">
      <div className="bg-gray-800 absolute bottom-10 left-10 z-[1000] text-white p-4 shadow-md flex justify-between items-center rounded-sm">
        {/* The condition now uses the memoized value */}
        {isLocationActive ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              <b>Active Hub:</b> {activeLocation.name}
            </span>
            <button
              onClick={clearActiveLocation} // Uses memoized clear function
              className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition duration-150 font-medium"
              aria-label="Clear active shipping route"
            >
              Clear Route
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-400">
            {isLoading 
                ? 'Loading map data...' 
                : 'Click a pin on the map to view its global shipping routes.'}
          </span>
        )}
      </div>

      <div className="flex-grow z-2">
        {!isLoading && locations.length > 0 ? (
            <DynamicMap
                center={initialCenter}
                zoom={4}
                locations={locations} 
                activeLocation={activeLocation}
                // Ensure setActiveLocation is strongly typed
                setActiveLocation={setActiveLocation as (loc: Location) => void} 
            />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-700">
                {isLoading ? 'Loading Map Data...' : 'No shipping locations found.'}
            </div>
        )}
      </div>
    </div>
  );
}
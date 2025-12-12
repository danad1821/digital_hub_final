// components/InteractiveMap.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DynamicShippingMap from './DynamicShippingMap';


export default function InteractiveMap() {
  const [locations, setLocations] = useState<any[]>([]); 
  // REMOVED: activeLocation state
  const [isLoading, setIsLoading] = useState(true); 

  // Data fetching logic remains the same
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
  }, []); 

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // REMOVED: changeActiveLocation and clearActiveLocation functions entirely

  const globalPortsCount = locations.length;

  return (
    <div className="flex flex-col relative w-full aspect-[2/1] bg-gray-900 rounded-sm overflow-hidden">
      
      {/* 🚢 GLOBAL PORTS COUNT & LIVE TRACKING LABEL */}
      <div className="absolute top-4 left-4 z-10 text-white p-2">
        <span className="text-gray-400 text-sm">Global Ports</span>
        <div className="text-4xl font-light text-[#00D9FF]">{globalPortsCount}</div>
      </div>
      
      <div className="absolute top-4 right-4 z-10 text-white p-2 flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
        <span className="text-xs uppercase">Live Tracking</span>
      </div>


      <div className="flex-grow z-2">
        {!isLoading && locations.length > 0 ? (
            <DynamicShippingMap
                locations={locations} 
                // REMOVED: activeLocation, setActiveLocation, clearActiveLocation props
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
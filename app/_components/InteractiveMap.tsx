// components/InteractiveMap.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DynamicShippingMap from './DynamicShippingMap';


export default function InteractiveMap() {
  const [locations, setLocations] = useState<any[]>([]); 
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

  const globalPortsCount = locations.length;

  return (
    // ADJUSTED: Changed aspect ratio for better vertical space on small screens
    // aspect-[2/1] is fine for desktop, but aspect-[5/3] or a fixed height is better for mobile
    <div className="flex flex-col relative w-full min-h-[400px] aspect-[5/3] md:aspect-[2/1] bg-gray-900 rounded-sm overflow-hidden shadow-2xl">
      
      {/* 🚢 GLOBAL PORTS COUNT LABEL */}
      {/* ADJUSTED: Smaller padding, top position, and responsive font size */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10 text-white rounded-sm px-3 py-1 md:px-4 md:py-2 bg-white/5 backdrop-blur-sm border border-white/20 text-white">
        <span className="text-gray-400 text-xs md:text-sm">Global Ports</span>
        <div className="text-3xl md:text-4xl font-light text-[#00D9FF]">{globalPortsCount}</div>
      </div>
      
      {/* 🟢 LIVE TRACKING LABEL */}
      {/* ADJUSTED: Smaller padding, top position, and smaller text */}
      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10 rounded-sm text-white px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
        <span className="text-[10px] sm:text-xs uppercase">Live Tracking</span>
      </div>


      <div className="flex-grow z-2">
        {!isLoading && locations.length > 0 ? (
            <DynamicShippingMap
                locations={locations} 
            />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400"> {/* Changed text color for dark background */}
                {isLoading ? 'Loading Map Data...' : 'No shipping locations found.'}
            </div>
        )}
      </div>
    </div>
  );
}
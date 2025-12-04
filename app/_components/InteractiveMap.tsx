"use client";
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { shippingLocations, initialCenter } from '../../public/json/shipping_data';

// 1. Crucial: Dynamically import the map and disable server-side rendering (SSR: false)
const DynamicMap = dynamic(
  () => import('./ShippingMap'),
  { ssr: false } 
);

export default function InteractiveMap() {
  const [activeLocation, setActiveLocation] = useState<any>({name: ''});

  // Helper function to reset the active location
  const clearActiveLocation = () => setActiveLocation({name: ''});

  return (
    <div className="flex flex-col h-screen">
      {/* Information Sidebar / Header */}
      <div className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Shipping Route Tracker</h1>
        {activeLocation ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              **Active Hub:** {activeLocation.name}
            </span>
            <button
              onClick={clearActiveLocation}
              className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 rounded transition duration-150"
            >
              Clear Route
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-400">
            Click a pin to view shipping routes.
          </span>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-grow">
        <DynamicMap
          center={initialCenter}
          zoom={2}
          locations={shippingLocations}
          activeLocation={activeLocation}
          setActiveLocation={setActiveLocation}
        />
      </div>
    </div>
  );
}
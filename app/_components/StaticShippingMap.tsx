// components/StaticShippingMap.tsx
import React from 'react';

// Re-defining the types
type Destination = { lat: number; lng: number; name: string; };
export type Location = { _id: string; name: string; address: string; lat: number; lng: number; destinations?: Destination[]; }; 

type StaticShippingMapProps = {
    locations: Location[];
    activeLocation: Location;
    setActiveLocation: (location: Location) => void; 
    clearActiveLocation: () => void;
}

// 🌐 Equirectangular Projection Parameters (Estimate based on your static map image)
// These define the geographic viewport shown in your image_9f98d7.png
const MAP_BOUNDS = {
    // Latitude and Longitude limits of the visual map on screen
    latMax: 75,   // Top boundary (e.g., North of Russia)
    latMin: -55,  // Bottom boundary (e.g., South of Argentina)
    lngMax: 160,  // Right boundary (e.g., East of Australia)
    lngMin: -100, // Left boundary (e.g., West of North America)
};

// --- CORE FUNCTION FOR DYNAMIC PIN PLACEMENT ---
// Calculates the position of a lat/lng point as a percentage (0-100) 
// relative to the container using a simple Equirectangular Projection.
const getDynamicMapPosition = (lat: number, lng: number): { top: string, left: string } => {
    const { latMax, latMin, lngMax, lngMin } = MAP_BOUNDS;

    // 1. Normalize Longitude (X-axis)
    const lngRange = lngMax - lngMin;
    const normalizedLng = lng - lngMin;
    const leftPercent = (normalizedLng / lngRange) * 100;
    
    // 2. Normalize Latitude (Y-axis, often inverted for screens)
    // The top of the map (0%) corresponds to latMax, the bottom (100%) to latMin.
    const latRange = latMax - latMin;
    const normalizedLat = latMax - lat; // Invert: higher latitude -> lower Y percentage
    const topPercent = (normalizedLat / latRange) * 100;

    // Ensure values are within 0-100% to keep pins inside the map container
    const safeLeft = Math.min(100, Math.max(0, leftPercent));
    const safeTop = Math.min(100, Math.max(0, topPercent));

    return { 
        top: `${safeTop}%`, 
        left: `${safeLeft}%` 
    };
}
// --- END CORE DYNAMIC FUNCTION ---


const PortPin = ({ loc, setActiveLocation, clearActiveLocation, isActive }: { loc: Location, setActiveLocation: (loc: Location) => void, clearActiveLocation: () => void, isActive: boolean }) => {
    
    // DYNAMIC POSITIONING: Get the position based on the location's lat/lng
    const position = getDynamicMapPosition(loc.lat, loc.lng);
    
    // Fallback: Check if the calculated position is within the visible range (0-100%)
    const isVisible = parseFloat(position.top) > 0 && parseFloat(position.top) < 100 &&
                      parseFloat(position.left) > 0 && parseFloat(position.left) < 100;
    
    if (!isVisible) return null; // Do not render if the location is outside the map boundaries

    return (
        <div
            className="absolute z-10 cursor-pointer"
            style={{ 
                top: position.top, 
                left: position.left, 
            }}
            onMouseEnter={() => setActiveLocation(loc)}
            onMouseLeave={clearActiveLocation}
        >
            {/* 🌊 Wave Effect (Pulsing Rings) - Assumes custom CSS classes are available */}
            <div className={`relative w-8 h-8 flex items-center justify-center transition duration-300 hover:scale-120`}>
                <div className="absolute w-7 h-7 border-2 border-blue-400 rounded-full animate-wave-1"></div>
                <div className="absolute w-9 h-9 border-2 border-blue-400 rounded-full animate-wave-2"></div>
                <div className="absolute w-11 h-11 border-2 border-blue-400 rounded-full animate-wave-3"></div>
                <div className='absolute w-5 h-5 rounded-full z-20 shadow-lg bg-white flex items-center justify-center transition duration-300 hover:scale-120'>
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full z-20"></div>
                </div>
            </div>

            {/* 📌 Info Card (Appears on hover) */}
            {isActive && (
                <div 
                    className="absolute left-1/2 mt-6 transform -translate-x-1/2 p-4 bg-white shadow-2xl rounded-sm w-56 text-gray-800 pointer-events-none z-50"
                >
                    <h3 className="font-bold text-lg mb-1">{loc.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{loc.address || 'Location Details'}</p>
                    <hr className="my-2 border-gray-200" />
                    <div className="flex items-center text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        Active Operations
                    </div>
                </div>
            )}
        </div>
    );
};


export default function StaticShippingMap({ locations, activeLocation, setActiveLocation, clearActiveLocation }: StaticShippingMapProps) {
    
    return (
        <div className="relative w-full h-full bg-gray-900 overflow-hidden">
            {/* 🗺️ Static Map Background Image */}
            <img 
                src="/images/WorldMap.png" // Your map image
                alt="Global Shipping Map" 
                className="w-full h-full object-cover opacity-70"
            />
            
            {/* 📍 Render All Location Pins */}
            {locations.map((loc: Location) => (
                <PortPin
                    key={loc._id} 
                    loc={loc}
                    setActiveLocation={setActiveLocation}
                    clearActiveLocation={clearActiveLocation}
                    isActive={activeLocation && activeLocation._id === loc._id}
                />
            ))}
        </div>
    );
}
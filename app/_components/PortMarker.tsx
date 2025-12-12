// components/PortMarker.tsx
"use client";
import React, { useState, useEffect, useRef } from 'react';
// Import Polyline for drawing routes
import { Marker, Popup, Polyline, useMap } from 'react-leaflet'; 
import L, { divIcon, LatLngExpression, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as ReactDOM from 'react-dom/client'; 

// Re-use types
type Destination = { lat: number; lng: number; name: string; };
export type Location = { 
    _id: string; 
    name: string; 
    address: string; 
    lat: number; 
    lng: number; 
    // Destinations are now optional but important for route drawing
    destinations?: Destination[]; 
}; 

// --- REACT COMPONENT FOR THE PULSING PIN CONTENT ---
// (No change needed here, it's perfect for a dynamic icon)
const PulsingPinContent: React.FC = () => (
    <div className={`relative w-8 h-8 flex items-center justify-center`}>
        {/* Pulsing rings use custom CSS classes defined in your global stylesheet */}
        
        {/* Pulsing ring 1 */}
        <div className="absolute w-7 h-7 border-2 border-blue-400 rounded-full animate-wave-1"></div>
        
        {/* Pulsing ring 2 */}
        <div className="absolute w-9 h-9 border-2 border-blue-400 rounded-full animate-wave-2"></div>

        {/* Pulsing ring 3 */}
        <div className="absolute w-11 h-11 border-2 border-blue-400 rounded-full animate-wave-3"></div>
        
        {/* Inner dot - Always visible */}
        <div className="absolute w-3 h-3 bg-blue-400 rounded-full z-20 shadow-lg"></div>
    </div>
);

// --- MARKER COMPONENT ---
type PortMarkerProps = {
    location: Location;
    setActiveLocation: (location: Location) => void;
    // Added clearActiveLocation from the parent map component (good practice)
    clearActiveLocation: () => void;
    isActive: boolean;
};

// Define the style for the shipping route Polyline
const ROUTE_OPTIONS = {
    color: '#3b82f6', // Tailwind blue-500
    weight: 3,
    opacity: 0.7,
    dashArray: '5, 10', // Dashed line for a "route" feel
};

export default function PortMarker({ location, setActiveLocation, isActive, clearActiveLocation }: PortMarkerProps) {
    const [isHovered, setIsHovered] = useState(false);
    const markerRef = useRef<L.Marker | null>(null);
    const map = useMap(); // Get access to the Leaflet map instance
    
    // ... [Pulsing Icon Definition: Unchanged] ...
    // 1. Define the DivIcon with the custom HTML template
    const pulsingIcon = divIcon({
        html: L.Util.template('<div id="pulsing-pin-{id}"></div>', { id: location._id }),
        className: 'custom-div-icon', 
        iconSize: [44, 44], 
        iconAnchor: [22, 22],
    });
    
    // ... [useEffect for mounting React content and event listeners: Unchanged] ...
    // 2. Effect to mount the React component into the Leaflet DOM
    useEffect(() => {
        const container = document.getElementById(`pulsing-pin-${location._id}`);
        let root: ReactDOM.Root | null = null;
        
        if (container) {
            root = ReactDOM.createRoot(container);
            root.render(<PulsingPinContent />);
            
            if (markerRef.current) {
                // Attach Leaflet event listeners for hover/mouseout
                markerRef.current.on('mouseover', () => setIsHovered(true));
                markerRef.current.on('mouseout', () => setIsHovered(false));
                
                // Add an event listener to clear active location on popup close
                markerRef.current.on('popupclose', () => clearActiveLocation());
            }
        }

        return () => {
            if (root) root.unmount();
            if (markerRef.current) {
                markerRef.current.off('mouseover');
                markerRef.current.off('mouseout');
                markerRef.current.off('popupclose'); // Clean up new listener
            }
        };
    }, [location._id, clearActiveLocation]); // Added clearActiveLocation dependency

    // 3. Custom Popup Content (The "Info Card")
    const InfoCard = () => (
        <div 
            className="p-4 bg-white shadow-2xl rounded-sm w-56 text-gray-800"
        >
            <h3 className="font-bold text-lg mb-1">{location.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{location.address || 'Location Details'}</p>
            <hr className="my-2 border-gray-200" />
            <div className="flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                Active Operations
            </div>
            {/* Display the number of routes/destinations */}
            {location.destinations && location.destinations.length > 0 && (
                <p className="text-xs text-blue-500 mt-2">
                    {location.destinations.length} Shipping Route(s) Available
                </p>
            )}
        </div>
    );

    // 4. Calculate Polyline Coordinates
    // This is run only when the location is active and has destinations
    const routePolylines = isActive && location.destinations 
        ? location.destinations.map((dest, index) => {
            const path: LatLngTuple[] = [
                [location.lat, location.lng], // Start point (the active port)
                [dest.lat, dest.lng]          // End point (the destination)
            ];
            return (
                <Polyline 
                    key={`${location._id}-${index}`}
                    positions={path} 
                    pathOptions={ROUTE_OPTIONS}
                />
            );
        })
        : null;

    // 5. Render the Leaflet Marker
    return (
        <>
            <Marker
                ref={markerRef}
                position={[location.lat, location.lng] as LatLngExpression}
                icon={pulsingIcon}
                eventHandlers={{
                    // When clicked, set active location and open the popup
                    click: () => {
                        setActiveLocation(location);
                        // Imperatively open the popup after setting active location
                        setTimeout(() => markerRef.current?.openPopup(), 0);
                    },
                }}
            >
                {/* Always render the Popup wrapper */}
                <Popup 
                    className="custom-info-card-popup" 
                    closeButton={true} // Changed to true so the user can close it manually
                    autoPan={true} // Changed to true to focus the map on the port when opened
                    offset={[0, -25]} 
                    // Important: The popup content will only render if opened (via click or hover)
                >
                    <InfoCard />
                </Popup>
            </Marker>
            
            {/* 🗺️ Render Shipping Routes (Polylines) */}
            {routePolylines}
        </>
    );
}
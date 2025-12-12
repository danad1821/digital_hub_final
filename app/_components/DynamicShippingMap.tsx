// components/DynamicShippingMap.tsx
import React, { useMemo, useRef } from 'react'; // Added useRef
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Added Popup
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server'; 

// --- 1. Standard Leaflet Icon Fix (Required for stability) ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: icon.src || icon,
    iconUrl: icon.src || icon,
    shadowUrl: iconShadow.src || iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});



type DynamicShippingMapProps = {
    locations: any[];
    // Removed: activeLocation, setActiveLocation, clearActiveLocation
}

// --- 3. PORT PIN CONTENT (Visual, Static HTML) ---
const PortPinContent = () => {
    return (
        <div className="w-8 h-8 flex items-center justify-center">
            {/* 🌊 Wave Effect (Pulsing Rings) */}
            <div className={`relative w-8 h-8 flex items-center justify-center transition duration-300 hover:scale-120`}>
                <div className="absolute w-7 h-7 border-2 border-blue-400 rounded-full animate-wave-1"></div>
                <div className="absolute w-9 h-9 border-2 border-blue-400 rounded-full animate-wave-2"></div>
                <div className="absolute w-11 h-11 border-2 border-blue-400 rounded-full animate-wave-3"></div>
                <div className='absolute w-5 h-5 rounded-full z-20 shadow-lg bg-white flex items-center justify-center transition duration-300 hover:scale-120'>
                    <div className="absolute w-3 h-3 bg-blue-400 rounded-full z-20"></div>
                </div>
            </div>
        </div>
    );
};

// --- 4. PORT PIN WRAPPER (Now uses Popup and Ref) ---
const PortPinWrapper = ({ loc }: { loc: any }) => { // Removed state props

    // useRef to get direct access to the Leaflet Marker instance
    const markerRef = useRef<L.Marker>(null); 

    const iconMarkup = useMemo(() => renderToStaticMarkup(<PortPinContent />), []);

    const customIcon = useMemo(() => L.divIcon({
        html: iconMarkup,
        className: 'custom-div-icon cursor-pointer', 
        iconSize: [40, 40], // Ensures hover detection
        iconAnchor: [20, 20], 
    }), [iconMarkup]);

    return (
        <Marker
            key={loc._id} 
            position={[loc.lat, loc.lng]}
            icon={customIcon} 
            ref={markerRef} // Attach ref to the Marker
            eventHandlers={{
                // ⭐️ FIX: Programmatically open the Popup on mouseover
                mouseover: () => {
                    if (markerRef.current) {
                        markerRef.current.openPopup();
                    }
                },
                // ⭐️ FIX: Programmatically close the Popup on mouseout
                mouseout: () => {
                    // Use a small delay to prevent accidental closure when mouse briefly leaves pin
                    // This creates a better UX for hover popups
                    setTimeout(() => {
                        if (markerRef.current) {
                            markerRef.current.closePopup();
                        }
                    }, 50); 
                },
            }}
        >
            {/* ⭐️ FIX: Use the built-in Popup component for the info card */}
            <Popup
                // Adjust Y offset to lift the popup above the 40x40 custom icon
                offset={[0, -20]} 
                closeButton={false} 
                autoClose={false} 
                closeOnClick={false} 
                // Add your Tailwind styles inside the popup content 
                className="custom-hover-popup" 
            >
                {/* 📌 Info Card Content (Your original HTML structure) */}
                <div className="p-1 text-gray-800">
                    <h3 className="font-bold text-lg mb-1">{loc.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{loc.description || 'Location Details'}</p>
                    <hr className="my-2 border-gray-200" />
                    <div className="flex items-center text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                        Active Operations
                    </div>
                </div>
            </Popup>
        </Marker>
    );
}

// --- 5. DynamicShippingMap component (Main Map Container) ---
export default function DynamicShippingMap({ locations }: DynamicShippingMapProps) { // Removed state props
    
    const center: [number, number] = [30, 10]; 
    const zoom = 4; 
    
    const markers = useMemo(() => {
        return locations.map((loc: any) => (
            <PortPinWrapper
                key={loc._id}
                loc={loc}
            />
        ));
    }, [locations]); 


    return (
        <MapContainer 
            center={center} 
            zoom={zoom} 
            scrollWheelZoom={true} 
            className="w-full h-full"
            minZoom={4} 
            maxBounds={[[90, -180], [-90, 180]]} 
            zoomControl={false} 
        >
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                attribution=''
                maxZoom={4} 
            />
            
            {markers}

            {/* Removed LocationHoverCard rendering logic */}

        </MapContainer>
    );
}

// Removed LocationHoverCard component entirely
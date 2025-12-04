"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ShippingRoutes from './ShippingRoutes';
import { useEffect } from 'react';

// Fix for default Leaflet icon not showing up in React/Webpack environments
// This is necessary to properly display the pin icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
  iconUrl: 'leaflet/images/marker-icon.png',
  shadowUrl: 'leaflet/images/marker-shadow.png',
});

// A custom icon for the active hub (optional but good for visibility)
const activeIcon = new L.Icon({
  iconUrl: 'leaflet/images/marker-icon-red.png', // Assuming you have a red version
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type ShippingMapProps = {
    center: any;
    zoom: Number;
    locations: any;
    activeLocation: any;
    setActiveLocation: (activeLocation: any) => void;
}

export default function ShippingMap({ center, zoom, locations, activeLocation, setActiveLocation }: ShippingMapProps) {
  
  // Optional: Pan to the active location when it changes
  // We use a component wrapper for the MapContainer to access the map instance (MapHook)
  // For simplicity, we skip MapHook here, but the effect remains a good idea.

  // The map MUST have a defined height in CSS/style.
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true}
      className="h-full w-full" // Use Tailwind to set dimensions
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* RENDER ALL LOCATION MARKERS */}
      {locations?.map((loc: any) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={activeLocation && activeLocation.id === loc.id ? activeIcon : L.Icon.Default.prototype}
          eventHandlers={{
            click: () => setActiveLocation(loc),
          }}
        >
          <Popup>
            <div className="font-bold">{loc.name}</div>
            <div className="text-sm">{loc.address}</div>
          </Popup>
        </Marker>
      ))}

      {/* RENDER SHIPPING ROUTES (Arrows/Polylines) */}
      <ShippingRoutes activeLocation={activeLocation} />

    </MapContainer>
  );
}
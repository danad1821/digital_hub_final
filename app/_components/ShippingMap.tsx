"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ShippingRoutes from './ShippingRoutes';

// Re-defining the types for clarity (or import them from InteractiveMap.tsx)
type Destination = { lat: number; lng: number; name: string; };
export type Location = { _id: string; name: string; address: string; lat: number; lng: number; destinations?: Destination[]; }; 

type ShippingMapProps = {
    center: LatLngExpression;
    zoom: number;
    locations: Location[];
    activeLocation: Location;
    setActiveLocation: (location: Location) => void; // Must accept the Location object
}


// ... (Leaflet Icon Fix and Custom Icon definitions remain the same) ...
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const activeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', 
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


export default function ShippingMap({ center, zoom, locations, activeLocation, setActiveLocation }: ShippingMapProps) {
  
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      scrollWheelZoom={true}
      className="h-full w-full items-center flex justify-center" 
      maxZoom={10} 
      minZoom={2} 
    >
      
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
        attribution='&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; <a href=\"https://carto.com/attributions\">CARTO</a>'
      />

      {/* 📍 RENDER ALL LOCATION MARKERS */}
      {locations.map((loc: Location) => (
        <Marker
          // FIX 1: Use loc._id as the key
          key={loc._id} 
          position={[loc.lat, loc.lng]}
          // FIX 2: Use loc._id for comparison to determine the active icon
          icon={activeLocation && activeLocation._id === loc._id ? activeIcon : L.Icon.Default.prototype} 
          eventHandlers={{
            // FIX 3: Pass the entire location object to the setter function
            click: () => setActiveLocation(loc),
          }}
        >
          {/* Popup Content */}
          <Popup>
            <div className="font-bold">{loc.name}</div>
            <div className="text-sm text-gray-700">{loc.address}</div>
          </Popup>
        </Marker>
      ))}
      
      {/* 🌊 RENDER ROUTES */}
      <ShippingRoutes activeLocation={activeLocation} />

    </MapContainer>
  );
}
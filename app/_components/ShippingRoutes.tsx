// components/ShippingRoutes.js
import { Polyline, Popup } from 'react-leaflet';

// Note: Leaflet doesn't natively support directional arrows 
// on Polylines. For production, you'd use a plugin like 'leaflet-ant-path' 
// or SVG manipulation for true animated arrows. This solution uses 
// simple Polylines for the core connection.

export default function ShippingRoutes({ activeLocation }: any) {
  // Do not render anything if no location is selected
  if (!activeLocation) return null;

  const startPoint = [activeLocation.lat, activeLocation.lng];

  return (
    <>
      {/* Draw a Polyline for each destination */}
      {activeLocation?.destinations?.map((destination: any, index: number) => {
        const endPoint = [destination.lat, destination.lng];
        const path = [startPoint, endPoint];

        return (
          <Polyline
            key={index}
            positions={path}
            color="#2563EB" // Blue color for routes
            weight={4}
            opacity={0.8}
            lineCap="round"
          >
            {/* Optional: Add a simple popup for the destination name */}
            <Popup>
              Destination: **{destination.name}**
            </Popup>
          </Polyline>
        );
      })}
    </>
  );
}
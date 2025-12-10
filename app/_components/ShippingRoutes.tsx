// components/ShippingRoutes.js
import { Polyline, Popup } from 'react-leaflet';

// --- NEW: Define a list of colors to use for the routes ---
const ROUTE_COLORS = [
  "#FF5733", // Red-Orange
  "#33FF57", // Bright Green
  "#3357FF", // Vibrant Blue
  "#FF33F5", // Pink/Magenta
  "#33FFF5", // Cyan
  "#F3FF33", // Yellow/Lime
  "#A233FF", // Purple
  "#FF8F33", // Orange
];
// ---------------------------------------------------------

// Helper function to calculate a SMOOTH curved path (simple arc)
const calculateCurvedPath = (start: number[], end: number[]) => {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  // 1. Find the midpoint coordinates and line distance
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));

  // 2. Define an offset magnitude for the curve.
  const offsetMagnitude = distance * 0.2; 

  // 3. Calculate the angle of the line and the perpendicular offset angle
  const angle = Math.atan2(lat2 - lat1, lng2 - lng1);
  const offsetAngle = angle + Math.PI / 2; // Perpendicular offset (90 degrees)

  // 4. Calculate the coordinates of the PEAK of the arc
  const peakLat = midLat + offsetMagnitude * Math.sin(offsetAngle);
  const peakLng = midLng + offsetMagnitude * Math.cos(offsetAngle);

  // 5. Generate multiple points (e.g., 10 intermediate points) between start, peak, and end
  const points: number[][] = [];
  const numSegments = 10; // More segments = smoother curve

  for (let i = 0; i <= numSegments; i++) {
    // Interpolation factor (t) goes from 0 to 1
    const t = i / numSegments; 

    // Use Quadratic Bezier interpolation for the curve
    const lat = 
      Math.pow(1 - t, 2) * lat1 + 
      2 * (1 - t) * t * peakLat + 
      Math.pow(t, 2) * lat2;

    const lng = 
      Math.pow(1 - t, 2) * lng1 + 
      2 * (1 - t) * t * peakLng + 
      Math.pow(t, 2) * lng2;

    points.push([lat, lng]);
  }

  return points;
};

export default function ShippingRoutes({ activeLocation }: any) {
  // Do not render anything if no location is selected
  if (!activeLocation) return null;

  const startPoint: number[] = [activeLocation.lat, activeLocation.lng];

  return (
    <>
      {/* Draw a Polyline for each destination */}
      {activeLocation?.destinations?.map((destination: any, index: number) => {
        const endPoint: number[] = [destination.lat, destination.lng];
        
        // --- KEY CHANGE: Select a color based on the index ---
        const routeColor = ROUTE_COLORS[index % ROUTE_COLORS.length];
        
        const curvedPath = calculateCurvedPath(startPoint, endPoint);

        return (
          <Polyline
            key={index}
            positions={curvedPath}
            // --- KEY CHANGE: Apply the unique color ---
            color={routeColor} 
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
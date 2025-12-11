// components/ShippingRoutes.js
import { Polyline, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet'; // 👈 1. IMPORT LatLngTuple

// --- Define a list of colors to use for the routes ---
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

/**
 * Calculates a SMOOTH curved path using Quadratic Bézier interpolation.
 * The curve direction alternates based on the provided index.
 */
// 👈 2. UPDATE RETURN TYPE: Use LatLngTuple[] instead of number[][]
const calculateCurvedPath = (start: number[], end: number[], index: number): LatLngTuple[] => {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  // 1. Find the midpoint coordinates and line distance
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2));

  // 2. Define an offset magnitude for the curve. (Adjusted to 0.15 for tighter grouping)
  const offsetMagnitude = distance * 0.15; 

  // --- KEY CHANGE: Determine the direction of the curve ---
  // If the index is even (0, 2, 4...), offset by +90 degrees (normal direction).
  // If the index is odd (1, 3, 5...), offset by -90 degrees (opposite direction).
  const directionMultiplier = index % 2 === 0 ? 1 : -1;
  // --------------------------------------------------------

  // 3. Calculate the angle of the line and the perpendicular offset angle
  const angle = Math.atan2(lat2 - lat1, lng2 - lng1);
  // Apply the direction multiplier to get the alternating offset angle
  const offsetAngle = angle + directionMultiplier * (Math.PI / 2); // +/- 90 degrees

  // 4. Calculate the coordinates of the PEAK (Control Point) of the arc
  const peakLat = midLat + offsetMagnitude * Math.sin(offsetAngle);
  const peakLng = midLng + offsetMagnitude * Math.cos(offsetAngle);

  // 5. Generate multiple points for the smooth Bézier curve
  // TypeScript will now correctly treat this array as LatLngTuple[]
  const points: LatLngTuple[] = []; 
  const numSegments = 10; 

  for (let i = 0; i <= numSegments; i++) {
    const t = i / numSegments; // Interpolation factor

    // Quadratic Bezier interpolation: P0=Start, P1=Peak (Control Point), P2=End
    const lat = 
      Math.pow(1 - t, 2) * lat1 + 
      2 * (1 - t) * t * peakLat + 
      Math.pow(t, 2) * lat2;

    const lng = 
      Math.pow(1 - t, 2) * lng1 + 
      2 * (1 - t) * t * peakLng + 
      Math.pow(t, 2) * lng2;

    // TypeScript now knows this is a tuple [number, number]
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
        
        // Use index to select a unique color and determine curve direction
        const routeColor = ROUTE_COLORS[index % ROUTE_COLORS.length];
        
        // curvedPath now has the correct type LatLngTuple[]
        const curvedPath = calculateCurvedPath(startPoint, endPoint, index);

        return (
          <Polyline
            key={index}
            positions={curvedPath} // This line will now satisfy the type checker
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
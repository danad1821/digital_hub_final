// components/DynamicShippingMap.tsx
import React, { useMemo, useRef, useState, useEffect } from "react"; // ⭐️ ADDED: useState, useEffect
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

// --- 1. Standard Leaflet Icon Fix (Required for stability) ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

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
};

// --- 3. PORT PIN CONTENT (Visual, Static HTML) ---
const PortPinContent = () => {
  return (
    <div className="w-8 h-8 flex items-center justify-center">
      {/* 🌊 Wave Effect (Pulsing Rings) */}
      <div
        className={`relative w-8 h-8 flex items-center justify-center transition duration-300 hover:scale-150`}
      >
        <div className="absolute w-7 h-7 border-2 border-[#00D9FF] rounded-full animate-wave-1 flex items-center justify-center"></div>
        <div className="absolute w-9 h-9 border-2 border-[#00D9FF] rounded-full animate-wave-2 flex items-center justify-center"></div>
        <div className="absolute w-11 h-11 border-2 border-[#00D9FF] rounded-full animate-wave-3 flex items-center justify-center"></div>
        <div className="absolute w-6 h-6 rounded-full z-20 shadow-lg bg-white flex items-center justify-center transition duration-300">
          <div className="absolute w-4 h-4 bg-[#00D9FF] rounded-full z-20"></div>
        </div>
      </div>
    </div>
  );
};

const PortPinWrapper = ({ loc }: { loc: any }) => {
  // Removed state props

  // useRef to get direct access to the Leaflet Marker instance
  const markerRef = useRef<L.Marker>(null);

  const iconMarkup = useMemo(
    () => renderToStaticMarkup(<PortPinContent />),
    []
  );

  const customIcon = useMemo(
    () =>
      L.divIcon({
        html: iconMarkup,
        className: "custom-div-icon cursor-pointer",
        iconSize: [40, 40], // Ensures hover detection
        iconAnchor: [20, 20],
      }),
    [iconMarkup]
  );

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
      {/* ⭐️ Updated Popup: Using Tailwind classes to achieve the new look */}
      <Popup
        // Adjust Y offset to lift the popup above the 40x40 custom icon
        offset={[0, -20]}
        
        closeButton={false}
        autoClose={false}
        closeOnClick={false}
        // We will rely on CSS to style the Leaflet container itself
        className="rcustom-popup"
      >
        {/* 📌 Updated Info Card Content: 
                  - Padding p-4 for more internal space.
                  - Text colors changed to match the image.
                */}
        <div className="p-4 text-gray-800 w-60 rounded-sm">
          {" "}
          {/* Added w-60 for a fixed width */}
          {/* Location Name (Larger and Bold) with Green Dot */}
          <h3 className="flex items-center text-xl font-semibold mb-1">
            {loc.name}
            {/* Inline Green Status Dot */}
            {loc.status === "Active Operations" ? (
              <div className="w-2 h-2 bg-green-600 rounded-full ml-2"></div>
            ) : loc.status === "Planned Operations" ? (
              <div className="w-2 h-2 bg-orange-600 rounded-full ml-2"></div>
            ) : (
              <div className="w-2 h-2 bg-red-600 rounded-full ml-2"></div>
            )}
          </h3>
          {/* Country/Region (Blue Subtitle) */}
          <p className="text-sm text-blue-500 mb-3">
            {loc.country || "Region"}{" "}
            {/* Assuming 'loc.country' exists or fallback */}
          </p>
          {/* Description (Medium Gray) */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {loc.description || "Logistics and port operations center"}
          </p>
          {/* Separator Line */}
          <hr className="my-3 border-gray-200" />
          {/* Active Operations Chip (Styled as a Light Green Badge) */}
          <div
            className={`inline-flex items-center text-xs font-medium ${loc.status === "Active Operations" ? "text-green-700 bg-green-100" : loc.status === "Planned Operations" ? "text-orange-700 bg-orange-100" : "text-red-700 bg-red-100"} px-3 py-1 rounded-full`}
          >
            {loc.status === "Active Operations" ? (
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
            ) : loc.status === "Planned Operations" ? (
              <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
            ) : (
              <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
            )}
            {loc.status}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// --- 5. DynamicShippingMap component (Main Map Container) ---
export default function DynamicShippingMap({
  locations,
}: DynamicShippingMapProps) {
  const center: [number, number] = [30, 10];
  const desktopZoom = 4;
  const mobileZoom = 1; // Target zoom for mobile devices
  const MOBILE_BREAKPOINT = 768; // Screen width threshold for mobile

  // ⭐️ New: State to hold the dynamically calculated zoom level
  const [responsiveZoom, setResponsiveZoom] = useState(desktopZoom);

  // ⭐️ New: useEffect hook to check screen size and update zoom
  useEffect(() => {
    const checkZoom = () => {
      // Check if window is defined (for environments like Next.js that might use SSR)
      if (typeof window !== "undefined") {
        if (window.innerWidth < MOBILE_BREAKPOINT) {
          setResponsiveZoom(mobileZoom);
        } else {
          setResponsiveZoom(desktopZoom);
        }
      }
    };

    // Set initial zoom level
    checkZoom();

    // Add event listener to update zoom on window resize
    window.addEventListener("resize", checkZoom);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener("resize", checkZoom);
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  const markers = useMemo(() => {
    return locations.map((loc: any) => (
      <PortPinWrapper key={loc._id} loc={loc} />
    ));
  }, [locations]);

  return (
    <MapContainer
      center={center}
      // ⭐️ UPDATE: Use the responsive zoom state
      zoom={responsiveZoom}
      scrollWheelZoom={true}
      className="w-full h-full"
      // ⭐️ UPDATE: minZoom must be set to 2 to allow the mobile zoom level
      minZoom={4}
      // ⭐️ UPDATE: maxZoom set higher to allow user interaction
      maxBounds={[
        [90, -180],
        [-90, 180],
      ]}
      zoomControl={false}
    >
      <TileLayer
        // Tile layer URL remains unchanged as requested
        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
        attribution={false as any}
        // ⭐️ UPDATE: maxZoom set higher to allow user interaction
        maxZoom={18}
      />

      {markers}

      {/* Removed LocationHoverCard rendering logic */}
    </MapContainer>
  );
}

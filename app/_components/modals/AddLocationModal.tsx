"use client";
import { useState } from "react";
import { X, Save, MapPin, Anchor, Loader, Globe, Truck, CheckCircle } from "lucide-react";

// Define the shape of the data for better type safety
interface Destination {
  lat: number;
  lng: number;
  name: string;
}

// Location now uses the MongoDB _id string type
interface Location {
  _id: string; // Use _id for MongoDB unique identifier
  name: string;
  lat: number;
  lng: number;
  address: string;
  country: string; // NEW: Required by schema
  description: string; // NEW: Required by schema
  status: 'Active Operations' | 'Planned Operations' | 'Maintenance'; // NEW: Required by schema (using enum values)
  destinations: Destination[];
}

// Define the shape of the data that the client sends to the server
interface NewLocationDataPayload {
  name: string;
  address: string;
  country: string; // NEW
  description: string; // NEW
  status: string; // NEW
  destinations: Destination[];
}

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Updated onSave signature: accepts raw data and returns a promise for error handling
  onSave: (newLocationData: NewLocationDataPayload) => Promise<boolean>; // Return boolean for success/failure
  shippingLocations: Location[]; // Use the new Location interface
}

// Enum values for the Status field, mirroring the backend schema
const STATUS_OPTIONS = ['Active Operations', 'Planned Operations', 'Maintenance'];


export default function AddLocationModal({
  isOpen,
  onClose,
  onSave,
  shippingLocations,
}: AddLocationModalProps) {
  // Existing state fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<Location[]>(
    []
  );
  
  // NEW state fields
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string>(STATUS_OPTIONS[0]); // Default to first option

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for modal-level error

  if (!isOpen) return null;

  // Toggle selection of a destination. Use _id for comparison.
  const handleDestinationToggle = (location: Location) => {
    setSelectedDestinations((prev) =>
      prev.some((dest) => dest._id === location._id)
        ? prev.filter((dest) => dest._id !== location._id)
        : [...prev, location]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // UPDATED client-side validation
    if (!name.trim() || !address.trim() || !country.trim() || !description.trim() || !status.trim()) {
      setError("Port Name, Address, Country, Description, and Status are required.");
      return;
    }

    setIsSaving(true);
    
    // The data structure to be sent to the server for processing
    const newLocationData: NewLocationDataPayload = {
        name,
        address,
        country, // NEW
        description, // NEW
        status, // NEW
        // Only pass the necessary destination fields (name, lat, lng)
        destinations: selectedDestinations.map(dest => ({
            name: dest.name,
            lat: dest.lat,
            lng: dest.lng
        })),
    }

    try {
        const success = await onSave(newLocationData);

        if (success) {
            // Reset form and close modal on success
            setName("");
            setAddress("");
            setCountry(""); // NEW: Reset
            setDescription(""); // NEW: Reset
            setStatus(STATUS_OPTIONS[0]); // NEW: Reset
            setSelectedDestinations([]);
            onClose();
        }
    } catch (err: any) {
        // Catch and display the error thrown by the parent's API call
        console.error("Error saving location:", err);
        setError(err.message || "Failed to save location.");
    } finally {
        setIsSaving(false);
    }
  };
  
  // Filter out the current location being added from the destination options
  const existingLocations = shippingLocations.filter((loc) => loc.name !== name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-2xl font-bold text-[#0A1C30]">
            Add New Shipping Location
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isSaving}
          >
            <X className="w-6 h-6" />
          </button>
        </div>


        {/* Modal Body (Scrollable) */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Display Error Message */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* New Grid Layout: Two columns for general info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Location Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                <Anchor className="w-4 h-4 mr-2 text-blue-600" /> Port/Location Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Port of Tripoli"
                required
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#00D9FF] focus:border-transparent outline-none"
              />
            </div>

            {/* 2. Address (for Geocoding) */}
            <div className="space-y-1">
              <label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-red-600" /> Full Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tripoli, Lebanon"
                required
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#00D9FF] focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for automatic Geo-location (lat/lng).
              </p>
            </div>
            
            {/* NEW: 3. Country */}
            <div className="space-y-1">
              <label htmlFor="country" className="text-sm font-medium text-gray-700 flex items-center">
                <Globe className="w-4 h-4 mr-2 text-green-600" /> Country
              </label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Lebanon"
                required
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#00D9FF] focus:border-transparent outline-none"
              />
            </div>

            {/* NEW: 4. Status (using select based on schema enum) */}
            <div className="space-y-1">
              <label htmlFor="status" className="text-sm font-medium text-gray-700 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-indigo-600" /> Operational Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#00D9FF] focus:border-transparent outline-none bg-white"
              >
                {STATUS_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* NEW: 5. Description (Full width textarea) */}
          <div className="space-y-1">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
              <Truck className="w-4 h-4 mr-2 text-yellow-600" /> Operational Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g., Major transshipment hub for the Eastern Mediterranean, specializing in container and bulk cargo."
              rows={3}
              required
              className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#00D9FF] focus:border-transparent outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
                This description appears in the map popup.
            </p>
          </div>

         
            
        </form>

        {/* Modal Footer (Remains the same) */}
        <div className="p-5 border-t flex justify-end">
          <button
            type="submit"
            onClick={handleSave}
            disabled={isSaving || !name.trim() || !address.trim() || !country.trim() || !description.trim() || !status.trim()}
            className="flex items-center px-6 py-3 border cursor-pointer border-transparent text-base font-medium rounded-sm text-[#0A1C30] bg-[#00D9FF] hover:bg-[#00D9FF]/50 transition duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Location
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
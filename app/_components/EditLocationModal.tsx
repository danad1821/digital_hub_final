// app/_components/EditLocationModal.tsx
"use client";
import { useState, useEffect } from "react";
import { X, Save, MapPin, Anchor, Loader } from "lucide-react";
import { Location } from './LocationCard'; // Import the type definition

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationToEdit: Location;
  shippingLocations: Location[]; 
  // onSave now accepts the ID and the new data, and returns a promise
  onSave: (id: string, updateData: any) => Promise<boolean>; 
}

export default function EditLocationModal({
  isOpen,
  onClose,
  locationToEdit,
  shippingLocations,
  onSave,
}: EditLocationModalProps) {
  const [name, setName] = useState(locationToEdit.name);
  const [address, setAddress] = useState(locationToEdit.address);
  const [selectedDestinations, setSelectedDestinations] = useState<Location[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up the initial state from locationToEdit when the modal opens or location changes
  useEffect(() => {
    if (isOpen) {
        setName(locationToEdit.name);
        setAddress(locationToEdit.address);
        // Find the full location objects for the destinations by matching names/IDs
        const initialDestinations = locationToEdit.destinations.map(d => 
            shippingLocations.find(loc => loc.name === d.name)
        ).filter((loc): loc is Location => loc !== undefined);
        
        setSelectedDestinations(initialDestinations);
        setError(null);
    }
  }, [isOpen, locationToEdit, shippingLocations]);

  if (!isOpen) return null;

  // Toggle selection of a destination. Use _id for comparison.
  const handleDestinationToggle = (location: Location) => {
    setSelectedDestinations((prev) =>
      prev.some((dest) => dest._id === location._id)
        ? prev.filter((dest) => dest._id !== location._id)
        : [...prev, location]
    );
  };
  
  const existingLocations = shippingLocations.filter(loc => loc._id !== locationToEdit._id);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !address.trim()) {
      setError("Port Name and Address are required.");
      return;
    }

    setIsSaving(true);
    
    // Construct the update object. Only include changed fields.
    const updateData: any = {};
    if (name !== locationToEdit.name) updateData.name = name;
    if (address !== locationToEdit.address) updateData.address = address;
    
    // Always send the current set of destinations, as it's a full array replacement
    const newDestinations = selectedDestinations.map(dest => ({
        name: dest.name,
        lat: dest.lat,
        lng: dest.lng
    }));
    updateData.destinations = newDestinations;

    // Check if any actual data has changed (simple check for name/address, destinations are always included)
    if (Object.keys(updateData).length === 0) {
        setError("No changes detected.");
        setIsSaving(false);
        return;
    }

    try {
        const success = await onSave(locationToEdit._id, updateData);

        if (success) {
            onClose();
        }
    } catch (err: any) {
        console.error("Error updating location:", err);
        setError(err.message || "Failed to update location.");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-2xl font-bold text-[#0A1C30]">
            Edit Location: {locationToEdit.name}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                <Anchor className="w-4 h-4 mr-2" /> Port/Location Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Port of Tripoli"
                required
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent outline-none"
              />
            </div>

            {/* Address (for Geocoding) */}
            <div className="space-y-1">
              <label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Full Address
              </label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Tripoli, Lebanon"
                required
                className="w-full p-3 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#00FFFF] focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Changing the address will trigger **re-geocoding** on save.
              </p>
            </div>
          </div>


          {/* Destination Selection */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-[#0A1C30] border-b pb-2">
              Select Destinations (Ports this location ships *to*)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-sm">
              {existingLocations.map((loc:any) => (
                <div key={loc._id} className="flex items-center">
                  <input
                    id={`edit-dest-${loc._id}`}
                    type="checkbox"
                    checked={selectedDestinations.some(
                      (dest) => dest._id === loc._id
                    )}
                    onChange={() => handleDestinationToggle(loc)}
                    className="w-4 h-4 text-[#00FFFF] border-gray-300 rounded focus:ring-[#00FFFF]"
                  />
                  <label htmlFor={`edit-dest-${loc._id}`} className="ml-2 text-sm font-medium text-gray-700">
                    {loc.name}
                  </label>
                </div>
              ))}
            </div>
            {existingLocations.length === 0 && (
                <p className="text-sm text-gray-500">No other locations available to select as a destination.</p>
            )}
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-5 border-t flex justify-end">
          <button
            type="submit"
            onClick={handleSave}
            disabled={isSaving || !name.trim() || !address.trim()}
            className="flex items-center px-6 py-3 border cursor-pointer border-transparent text-base font-medium rounded-sm text-[#0A1C30] bg-[#00FFFF] hover:bg-[#00FFFF]/50 transition duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
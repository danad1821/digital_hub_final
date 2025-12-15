"use client";
import { useState, useEffect } from "react";
import { X, Save, MapPin, Anchor, Loader, Globe, Truck, CheckCircle } from "lucide-react";

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationToEdit: any;
  shippingLocations: any[]; 
  // onSave now accepts the ID and the new data, and returns a promise
  onSave: (id: string, updateData: any) => Promise<boolean>; 
}

// Enum values for the Status field, mirroring the backend schema
const STATUS_OPTIONS = ['Active Operations', 'Planned Operations', 'Maintenance'];


export default function EditLocationModal({
  isOpen,
  onClose,
  locationToEdit,
  shippingLocations,
  onSave,
}: EditLocationModalProps) {
  // --- EXISTING STATE ---
  const [name, setName] = useState(locationToEdit.name);
  const [address, setAddress] = useState(locationToEdit.address);

  // --- NEW STATE FIELDS (initialized from locationToEdit) ---
  const [country, setCountry] = useState(locationToEdit.country);
  const [description, setDescription] = useState(locationToEdit.description);
  const [status, setStatus] = useState(locationToEdit.status);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up the initial state from locationToEdit when the modal opens or location changes
  useEffect(() => {
    if (isOpen) {
        setName(locationToEdit.name);
        setAddress(locationToEdit.address);
        // NEW: Initialize new fields
        setCountry(locationToEdit.country);
        setDescription(locationToEdit.description);
        setStatus(locationToEdit.status);

        
        setError(null);
    }
  }, [isOpen, locationToEdit, shippingLocations]);

  if (!isOpen) return null;

  
  const existingLocations = shippingLocations.filter(loc => loc._id !== locationToEdit._id);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // UPDATED Client-side Validation for required fields
    if (!name.trim() || !address.trim() || !country.trim() || !description.trim() || !status.trim()) {
      setError("Port Name, Address, Country, Description, and Status are required.");
      return;
    }

    setIsSaving(true);
    
    // Construct the update object. ONLY include fields that have CHANGED.
    const updateData: any = {};
    if (name !== locationToEdit.name) updateData.name = name;
    if (address !== locationToEdit.address) updateData.address = address;
    
    // NEW: Check and include the new fields if they have changed
    if (country !== locationToEdit.country) updateData.country = country;
    if (description !== locationToEdit.description) updateData.description = description;
    if (status !== locationToEdit.status) updateData.status = status;
    


    // Final Check: If the updateData object is empty (and destinations didn't change), stop.
    if (Object.keys(updateData).length === 0) {
        setError("No changes detected.");
        setIsSaving(false);
        return;
    }

    try {
        // The PUT API handler will automatically re-geocode if 'address' is present in updateData.
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
                Changing the address will trigger **re-geocoding** (updates Lat/Lng, and Country).
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
                onChange={(e) => setStatus(e.target.value as 'Active Operations' | 'Planned Operations' | 'Maintenance')}
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

        {/* Modal Footer (No change, but the disabled logic is critical) */}
        <div className="p-5 border-t flex justify-end">
          <button
            type="submit"
            onClick={handleSave}
            // Disabled check now includes the new required fields
            disabled={isSaving || !name.trim() || !address.trim() || !country.trim() || !description.trim() || !status.trim()}
            className="flex items-center px-6 py-3 border cursor-pointer border-transparent text-base font-medium rounded-sm text-[#0A1C30] bg-[#00D9FF] hover:bg-[#00D9FF]/50 transition duration-300 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
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
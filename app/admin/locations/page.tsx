"use client";
import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios'; 

import AddLocationModal from '@/app/_components/modals/AddLocationModal';

import LocationCard, { Location } from '@/app/_components/cards/LocationCard'; // Import LocationCard and Location type

export default function AdminLocations() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shippingLocations, setShippingLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch the location data from the API
    const fetchLocations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/locations');
            setShippingLocations(response.data);
            return true;
        } catch (err: any) {
            console.error("Error fetching locations:", err);
            setError(err.response?.data?.message || "Failed to load locations.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    // --- CRUD Handlers ---

    // Handler for POST (Create New Location)
    const handleSaveNewLocation = async (newLocationData: any): Promise<boolean> => {
        try {
            await axios.post("/api/locations", newLocationData);
            await fetchLocations(); // Refetch
            return true; 
        } catch (err: any) {
            console.error("Error creating location:", err);
            const errorMessage = err.response?.data?.message || "Failed to create location.";
            throw new Error(errorMessage); 
        }
    };
    
    // Handler for PUT (Update Location)
    const handleUpdateLocation = async (id: string, updateData: any): Promise<boolean> => {
        try {
            // PUT /api/locations/[id]
            await axios.put(`/api/locations/${id}`, updateData);
            await fetchLocations(); // Refetch
            return true;
        } catch (err: any) {
            console.error("Error updating location:", err);
            const errorMessage = err.response?.data?.message || "Failed to update location.";
            throw new Error(errorMessage);
        }
    };
    
    // Handler for DELETE (Delete Location)
    const handleDeleteLocation = async (id: string): Promise<boolean> => {
        try {
            // DELETE /api/locations/[id]
            await axios.delete(`/api/locations/${id}`);
            await fetchLocations(); // Refetch
            return true;
        } catch (err: any) {
            console.error("Error deleting location:", err);
            const errorMessage = err.response?.data?.message || "Failed to delete location.";
            throw new Error(errorMessage);
        }
    };

    if (isLoading) {
        return <main className="p-6 text-center text-gray-600">Loading locations...</main>
    }

    return (
        <main className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#0A1C30]">Shipping Locations</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-sm text-[#0A1C30] bg-[#00D9FF] hover:bg-[#00D9FF]/50 transition duration-300 shadow-md"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Location
                </button>
            </div>
            
            {error && (
                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* RENDER THE NEW LOCATION CARD COMPONENT */}
                {shippingLocations.map((location) => (
                    <LocationCard 
                        key={location._id}
                        location={location}
                        shippingLocations={shippingLocations} // Pass all locations for the Edit Modal to use
                        onUpdate={handleUpdateLocation}
                        onDelete={handleDeleteLocation}
                    />
                ))}
            </div>

            <AddLocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                shippingLocations={shippingLocations}
                onSave={handleSaveNewLocation}
            />
        </main>
    );
}
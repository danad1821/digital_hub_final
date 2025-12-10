// app/_components/LocationCard.tsx
"use client";
import { useState } from 'react';
import { Edit, Trash2, MapPin, Anchor, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import EditLocationModal from './EditLocationModal'; // Will create this next

// Define the shape of the data for better type safety
interface Destination {
  lat: number;
  lng: number;
  name: string;
}

export interface Location {
  _id: string; // MongoDB unique identifier
  name: string;
  lat: number;
  lng: number;
  address: string;
  destinations: Destination[];
}

interface LocationCardProps {
    location: Location;
    shippingLocations: Location[]; // All locations for destination selection in the modal
    onUpdate: (id: string, updateData: any) => Promise<boolean>;
    onDelete: (id: string) => Promise<boolean>;
}

export default function LocationCard({ 
    location, 
    shippingLocations, 
    onUpdate, 
    onDelete 
}: LocationCardProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete the location: ${location.name}?`)) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);
        try {
            const success = await onDelete(location._id);
            if (!success) {
                 setDeleteError("Delete failed due to an unknown error.");
            }
        } catch (err: any) {
            setDeleteError(err.message || "Failed to delete location.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div 
            key={location._id} 
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col"
        >
            {deleteError && (
                <div className="p-3 mb-3 text-sm text-red-700 bg-red-100 rounded-lg">
                    {deleteError}
                </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold text-[#0A1C30]">{location.name}</h2>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1"/> {location.address}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-2 text-gray-500 hover:text-blue-600 transition duration-150 rounded-full hover:bg-gray-100"
                        title="Edit Location"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-gray-500 hover:text-red-600 transition duration-150 rounded-full hover:bg-red-50 disabled:opacity-50"
                        title="Delete Location"
                    >
                        {isDeleting ? (
                            <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                            <Trash2 className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
            
            <div className="text-sm space-y-1 mb-4 border-t pt-4">
                <p><strong>Latitude:</strong> {location.lat}</p>
                <p><strong>Longitude:</strong> {location.lng}</p>
            </div>
            
            <div className="mt-auto">
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full text-lg font-medium border-b pb-1 mb-2 text-gray-700 hover:text-[#0A1C30] transition duration-150"
                >
                    <span className="flex items-center">
                        <Anchor className="w-5 h-5 mr-2" />
                        Routes To ({location.destinations.length})
                    </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                
                {isExpanded && (
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2 p-2 bg-gray-50 rounded-sm max-h-40 overflow-y-auto">
                        {location.destinations.map((dest: any, index:any) => (
                            <li key={index}>{dest.name}</li>
                        ))}
                        {location.destinations.length === 0 && (
                            <li className="text-gray-400">No outgoing routes defined.</li>
                        )}
                    </ul>
                )}
            </div>

            <EditLocationModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                locationToEdit={location}
                shippingLocations={shippingLocations}
                onSave={onUpdate}
            />
        </div>
    );
}
// app/_components/LocationCard.tsx
"use client";
import { useState } from 'react';
import { 
    Edit, 
    Trash2, 
    MapPin, 
    Anchor, 
    ChevronDown, 
    ChevronUp, 
    Loader, 
    Globe,      // New icon for Country
    CheckCircle, // New icon for Status
    Truck       // New icon for Description/Operations
} from 'lucide-react';
import EditLocationModal from '../modals/EditLocationModal';

// Define the shape of the data for better type safety
interface Destination {
    lat: number;
    lng: number;
    name: string;
}

// 1. UPDATED LOCATION INTERFACE
export interface Location {
    _id: string; // MongoDB unique identifier
    name: string;
    lat: number;
    lng: number;
    address: string;
    country: string;        // NEW
    description: string;    // NEW
    status: 'Active Operations' | 'Planned Operations' | 'Maintenance'; // NEW
    destinations: Destination[];
}

interface LocationCardProps {
    location: Location;
    shippingLocations: Location[]; // All locations for destination selection in the modal
    onUpdate: (id: string, updateData: any) => Promise<boolean>;
    onDelete: (id: string) => Promise<boolean>;
}

// Helper for color coding the status
const getStatusColor = (status: string) => {
    switch (status) {
        case 'Active Operations':
            return 'bg-green-100 text-green-800';
        case 'Planned Operations':
            return 'bg-yellow-100 text-yellow-800';
        case 'Maintenance':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
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
        if (!window.confirm(`Are you sure you want to delete the location: ${location.name}? This action cannot be undone.`)) {
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
                    {/* 2. Display NEW Status Field with color coding */}
                    <span 
                        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(location.status)}`}
                    >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {location.status}
                    </span>
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
            
            {/* Display new fields (Country, Description) and Address/Coordinates */}
            <div className="text-sm space-y-3 mb-4 border-t pt-4">
                {/* Geolocation Details */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Address & Country */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-red-600"/> Address
                        </p>
                        <p className="text-gray-800 break-words">{location.address}</p>
                        <p className="text-xs font-medium text-gray-500 flex items-center mt-2">
                            <Globe className="w-4 h-4 mr-1 text-green-600"/> Country
                        </p>
                        <p className="font-semibold text-gray-800">{location.country}</p>
                    </div>

                    {/* Coordinates */}
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500">Coordinates</p>
                        <p><strong>Lat:</strong> {location.lat}</p>
                        <p><strong>Lng:</strong> {location.lng}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="border-t pt-3">
                    <p className="text-xs font-medium text-gray-500 flex items-center">
                        <Truck className="w-4 h-4 mr-1 text-yellow-600"/> Operational Description
                    </p>
                    {/* 3. Display NEW Description Field */}
                    <p className="text-gray-700 italic mt-1">{location.description}</p>
                </div>
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
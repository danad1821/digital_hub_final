'use client';

import { deleteGalleryImage } from '@/app/_actions/gallery';
import { GalleryImageDocument } from '@/app/_models/GalleryImage';
import { useState, useTransition } from 'react';
import axios from 'axios';

// Define props including the new callback function
interface GalleryImageCardProps {
    imageDoc: GalleryImageDocument;
    onDeleteComplete: () => void; // <-- New prop: A function to call after successful deletion
}

export default function GalleryImageCard({ imageDoc, onDeleteComplete }: GalleryImageCardProps) {
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    
    const imageUrl = `/api/images/${imageDoc.image.toString()}`;
    const imageId = imageDoc._id.toString();

    const handleDelete = () => {
        setIsDeleting(true);
        startTransition(async () => {
            // Call the Server Action
            const result = await deleteGalleryImage(imageId);
            
            // Check if deletion was successful
            if (result.success) {
                // Call the callback function provided by the parent (AdminGallery)
                onDeleteComplete(); 
            } else {
                // Handle failure (e.g., show a toast message)
                console.error("Deletion failed:", result.error);
                setIsDeleting(false); // Reset only if the deletion failed
            }
        });
    };

    return (
        <div className="border rounded-sm overflow-hidden shadow-lg transition duration-300 hover:shadow-xl relative">
            
            {/* Image Display */}
            <img 
                src={imageUrl} 
                alt={`Gallery item ${imageId}`} 
                className="w-full h-48 object-cover bg-gray-200"
            />

            <div className="p-4">
                <p className="text-sm text-gray-500 mb-3">
                    Added: {new Date(imageDoc.createdAt).toLocaleDateString()}
                </p>

                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    disabled={isPending || isDeleting}
                    className={`w-full p-2 rounded transition ${
                        (isPending || isDeleting) ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                >
                    {(isPending || isDeleting) ? 'Deleting...' : 'Delete Image'}
                </button>
            </div>
        </div>
    );
}
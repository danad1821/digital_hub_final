// fileName: GalleryImageCard.tsx
'use client';

import { deleteGalleryImage } from '@/app/_actions/gallery';
import { GalleryImageDocument } from '@/app/_models/GalleryImage';
import { useState, useTransition } from 'react';
// import axios from 'axios'; // No longer needed
import EditImageModal from '../modals/EditImageModal';

// Define props including the new callback function
interface GalleryImageCardProps {
    imageDoc: GalleryImageDocument;
    onDeleteComplete: () => void; // <-- A function to call after successful deletion/edit
}

export default function GalleryImageCard({ imageDoc, onDeleteComplete }: GalleryImageCardProps) {
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // <--- New state for edit modal
    
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
    
    // Handler for successful edit
    const handleEditComplete = () => {
        setIsEditing(false);
        onDeleteComplete(); // Re-use the parent's refresh function
    }

    return (
        <>
            <div className="border rounded-sm overflow-hidden shadow-lg transition duration-300 hover:shadow-xl relative">
                
                {/* Image Display */}
                <img 
                    src={imageUrl} 
                    alt={`Gallery item ${imageDoc.title}`} // Use title for alt text
                    className="w-full h-48 object-cover bg-gray-200"
                />

                <div className="p-4">
                    {/* Display Title */}
                    <h4 className="text-lg font-semibold mb-2 line-clamp-1">
                        {imageDoc.title}
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                        Added: {new Date(imageDoc.createdAt).toLocaleDateString()}
                    </p>

                    {/* Edit Button */}
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={isPending || isDeleting}
                        className={`w-full p-2 rounded font-semibold mb-2 transition ${
                            (isPending || isDeleting) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        Edit Title
                    </button>

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

            {/* Edit Modal */}
            {isEditing && (
                <EditImageModal
                    imageDoc={imageDoc}
                    onClose={() => setIsEditing(false)}
                    onEditComplete={handleEditComplete}
                />
            )}
        </>
    );
}
'use client';

import { deleteGalleryImage } from '@/app/_actions/gallery';
import { useState, useTransition } from 'react';
import EditImageModal from '../modals/EditImageModal';

interface GalleryImageCardProps {
    imageDoc: any;
    onDeleteComplete: () => void;
}

export default function GalleryImageCard({ imageDoc, onDeleteComplete }: GalleryImageCardProps) {
    const [isPending, startTransition] = useTransition();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // 🌟 GUARD CLAUSE: 
    // Since SQL rows are returned as objects, ensure imageDoc exists.
    // If imageDoc.image_ref (or whatever your SQL column is) is null, handle gracefully.
    if (!imageDoc) return null;
    console.log(imageDoc)
    // Adjusting to SQL naming conventions (usually 'id' and 'image_ref' or 'image_id')
    const imageId = imageDoc.id.toString();
    
    // In your previous components, you used /api/files/ for GridFS. 
    // Ensure this matches your SQL-linked GridFS route.
    const imageUrl =imageDoc.image_url ;

    const handleDelete = () => {
        // Confirmation is essential for destructive SQL operations
        if (!window.confirm(`Permanently delete "${imageDoc.title || 'this image'}"?`)) {
            return;
        }

        setIsDeleting(true);
        startTransition(async () => {
            try {
                const result = await deleteGalleryImage(imageId);
                
                if (result.success) {
                    onDeleteComplete(); 
                } else {
                    alert(result.error || "Failed to delete record from database.");
                    setIsDeleting(false);
                }
            } catch (err) {
                console.error("SQL Deletion Error:", err);
                alert("A connection error occurred.");
                setIsDeleting(false);
            }
        });
    };
    
    const handleEditComplete = () => {
        setIsEditing(false);
        onDeleteComplete(); 
    }

    return (
        <>
            <div className={`border rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl bg-white relative ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
                
                {/* Image Display */}
                <div className="relative h-48 w-full bg-gray-100">
                    <img 
                        src={imageUrl} 
                        alt={imageDoc.title || "Gallery Item"}
                        className="w-full h-full object-cover"
                        // Handle broken images in SQL results
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                        }}
                    />
                    {isDeleting && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                         </div>
                    )}
                </div>

                <div className="p-4">
                    <h4 className="text-md font-bold text-gray-800 mb-1 truncate">
                        {imageDoc.title || "Untitled"}
                    </h4>
                    
                    {/* SQL timestamps usually need parsing if they come back as strings */}
                    <p className="text-xs text-gray-500 mb-4">
                        Added: {imageDoc.created_at ? new Date(imageDoc.created_at).toLocaleDateString() : 'Unknown'}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={isPending || isDeleting}
                            className="text-sm py-2 px-3 rounded font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            Edit
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={isPending || isDeleting}
                            className="text-sm py-2 px-3 rounded font-medium bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                        >
                            {isDeleting ? '...' : 'Delete'}
                        </button>
                    </div>
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
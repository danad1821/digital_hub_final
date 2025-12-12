'use client'; // <-- Must be a client component to use useState and hooks

import { getAllGalleryImages } from '@/app/_actions/gallery';
import { GalleryImageDocument } from '@/app/_models/GalleryImage';
import GalleryImageCard from '@/app/_components/cards/GalleryImageCard';
import AddImageModal from '@/app/_components/modals/AddImageModal';
import { useEffect, useState, useCallback } from 'react';

export default function AdminGallery() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [images, setImages] = useState<GalleryImageDocument[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Function to fetch all images, similar to getAllMessages
    const getAllImages = useCallback(async () => {
        setIsLoading(true);
        try {
            // Using the existing server action (will run client-side via RPC)
            const fetchedImages: GalleryImageDocument[] = await getAllGalleryImages();
            setImages(fetchedImages);
        } catch (error) {
            console.error("Error fetching gallery images:", error);
            setImages([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial data fetch on mount, similar to the messages component
    useEffect(() => {
        getAllImages();
    }, [getAllImages]);

    const handleModalClose = () => {
        setIsModalOpen(false);
        // Refresh the list whenever the modal is closed (in case upload succeeded)
        getAllImages(); 
    };
    
    // The card component needs to trigger a refresh on delete completion
    const refreshImages = () => {
        getAllImages();
    };


    if(isLoading){
        return(
            <main className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-black">Gallery</h1>
                <hr className="mb-6"/>
                <p className='text-center py-10 text-gray-700'>Loading images...</p>
            </main>
        )
    }

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Gallery</h1>
                
                {/* Button to Open Modal */}
                <button
                    onClick={() => setIsModalOpen(true)}
                   className="flex items-center bg-[#00FFFF] text-[#11001C] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                >
                    + Add New Image
                </button>
            </div>

            <hr className="mb-6"/>

            {images.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No images found in the gallery.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <GalleryImageCard 
                            key={img._id.toString()}
                            imageDoc={img}
                            onDeleteComplete={refreshImages} 
                        />
                    ))}
                </div>
            )}
            
            {/* Modal Rendering */}
            {isModalOpen && <AddImageModal onClose={handleModalClose} />}
        </main>
    );
}
'use client'; // <-- Must be a client component to use useState

import { getAllGalleryImages } from '@/app/_actions/gallery';
import { GalleryImageDocument } from '@/app/_models/GalleryImage';
import GalleryImageCard from '@/app/_components/GalleryImageCard';
import AddImageModal from '@/app/_components/AddImageModal'; // <-- Import the new modal
import { useEffect, useState } from 'react';

// Define a type for the initial server-fetched data
interface AdminGalleryProps {
    initialImages: GalleryImageDocument[];
}

// Separate component for rendering the page
function AdminGalleryContent({ initialImages }: AdminGalleryProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [images, setImages] = useState(initialImages);
    
    // Function to re-fetch data after modal close/successful upload
    // In a real application, you'd use revalidatePath or a key swapper, 
    // but a full refetch is simpler for this example.
    const refreshImages = async () => {
        const newImages = await getAllGalleryImages();
        setImages(newImages);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        // Refresh the list whenever the modal is closed (in case upload succeeded)
        refreshImages(); 
    };

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">Gallery</h1>
                
                {/* Button to Open Modal */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
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
                            // The card component needs to trigger a refresh on delete completion
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

// Wrapper component to fetch initial data on the server
export default function AdminGallery() {
    // Initial fetch on the server
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    const getAllImages= async()=>{
        const initialImages:any = await getAllGalleryImages();
        setImages(initialImages);
        setIsLoading(false);
    }
    

    useEffect(()=>{
        getAllImages()
    }, []);
    
    if(isLoading){
        return(
            <main>Loading...</main>
        )
    }
    
    // Render the client component with the server-fetched data
    return <AdminGalleryContent initialImages={images} />;
}
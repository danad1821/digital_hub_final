import Header from '@/app/_components/Header';
import { getAllGalleryImages, deleteGalleryImage } from '@/app/_actions/gallery';
import { GalleryImageDocument } from '@/app/_models/GalleryImage';
import Link from 'next/link';

// Make the component 'async' to enable server-side data fetching
export default async function GalleryPage() {
    
    // 1. Fetch all images on the server side
    const images: GalleryImageDocument[] = await getAllGalleryImages();


    return(
        <>
            <Header />
            <main className="p-8">
                <h1 className="text-3xl font-bold mb-6">Gallery</h1>
                
                {/* 3. Use a form to wrap the list, enabling deletion via Server Actions */}
                <div>
                    {images.length === 0 ? (
                        <p className="text-gray-500">No images found in the gallery. Add one!</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {/* 4. Map over the fetched image documents */}
                            {images.map((img) => (
                                <div key={img._id.toString()} className="border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                                    
                                    {/* 5. Image Display: Use the dedicated API route to stream the image */}
                                    <img 
                                        // The image reference is stored in the 'image' field of the Mongoose document
                                        src={`/api/images/${img.image.toString()}`} 
                                        alt={`Gallery item ${img._id}`} 
                                        className="w-full h-48 object-cover bg-gray-200"
                                    />

                                    
                            
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
            </main>
        </>
    )
}
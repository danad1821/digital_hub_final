"use client";
import Header from "@/app/_components/Header";
import {
  getAllGalleryImages,
  deleteGalleryImage,
} from "@/app/_actions/gallery";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Make the component 'async' to enable server-side data fetching
export default function GalleryPage() {
  // 1. Fetch all images on the server side
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllImages = async () => {
    const allImages: any = await getAllGalleryImages();
    setImages(allImages);
    setIsLoading(false);
  };

  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="custom-container">
          {/* Header */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
            Gallery
          </h1>
          <p className="text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Comprehensive maritime logisitcs solutions tailored for the complex
            industrial cargo
          </p>
          {/* 3. Use a form to wrap the list, enabling deletion via Server Actions */}
          <div>
            {isLoading && (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-10 h-10 text-[#00FFFF] animate-spin" />
              </div>
            )}

            {
              <div className="flex flex-wrap items-center gap-6">
                {/* 4. Map over the fetched image documents */}
                {images.map((img: any) => (
                  <div
                    key={img._id.toString()}
                    className="rounded-sm overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
                  >
                    {/* 5. Image Display: Use the dedicated API route to stream the image */}
                    <img
                      // The image reference is stored in the 'image' field of the Mongoose document
                      src={`/api/images/${img.image.toString()}`}
                      alt={`Gallery item ${img._id}`}
                      className="w-64 h-48 object-cover bg-gray-200"
                    />
                  </div>
                ))}
              </div>
            }
          </div>
        </div>
      </main>
    </>
  );
}

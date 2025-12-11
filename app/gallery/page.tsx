"use client";
import Header from "@/app/_components/Header";
import {
  getAllGalleryImages,
  deleteGalleryImage,
} from "@/app/_actions/gallery";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react"; // Added useCallback
import axios from "axios";
import { ApiResponse, PageDocument } from "../_types/PageData";

export default function GalleryPage() {
  // 1. STATE MANAGEMENT
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [pageData, setPageData] = useState<any>(null);

  const getGalleryPageData = async () => {
    setIsLoading(true);
    try {
      // Assuming 'Gallery' is the slug for the Gallerypage
      const response =
        await axios.get<ApiResponse<PageDocument>>(`/api/pages/gallery`);
      setPageData(response.data.data);
    } catch (error) {
      console.error("Error fetching Gallery page data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // OPTIMIZATION: Memoize the fetch function using useCallback
  const getAllImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const allImages: any = await getAllGalleryImages();
      setImages(allImages);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setImages([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means the function is stable

  // 2. Data Fetching Effect
  useEffect(() => {
    // Call the stable function reference
    getAllImages();
    getGalleryPageData()
  }, [getAllImages]); // Dependency array includes the stable getAllImages function

  if (isLoading && !pageData) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="w-10 h-10 text-[#00FFFF] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="custom-container">
          {/* Header */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
            {pageData?.sections[0].title}
          </h1>
          <p className="text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            {pageData?.sections[0].subtitle}
          </p>
          {/* Content */}
          <div>
            {isLoading && (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-10 h-10 text-[#00FFFF] animate-spin" />
              </div>
            )}

            <div className="flex items-center justify-center">
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
        </div>
      </main>
    </>
  );
}

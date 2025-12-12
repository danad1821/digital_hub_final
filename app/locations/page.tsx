"use client";
import Header from "@/app/_components/Header";
import InteractiveMap from "../_components/InteractiveMap";
import { useEffect, useState } from "react";
import axios from "axios";
import { ApiResponse, PageDocument } from "../_types/PageData";
import { Loader2 } from "lucide-react";

export default function LocationsPage() {
  const [pageData, setPageData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  // --- API Functions ---
  const getLocationsPageData = async () => {
    setIsLoading(true);
    try {
      // Assuming 'Locations' is the slug for the Locationspage
      const response =
        await axios.get<ApiResponse<PageDocument>>(`/api/pages/locations`);
      setPageData(response.data.data);
    } catch (error) {
      console.error("Error fetching Locations page data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLocationsPageData();
  }, []);

  if (isLoading && !pageData) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="w-10 h-10 text-[#00FFFF] animate-spin" />

      </div>
    );
  }

  return (
    <>
      {/* Header component is assumed to be the same as used in ContactUs */}
      <Header />

      <main className="bg-gray-50 py-12 w-full min-h-screen">
        <div className="custom-container">
          {/* Centered Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
            {pageData?.sections[0].title}
          </h1>
          <div className="mt-12 p-6 bg-white rounded-sm shadow-md">
            <p className="text-lg text-gray-600">
              {pageData?.sections[0].subtitle}
            </p>
          </div>

          {/* Content Section - Similar structure to the Contact page */}
          <section className="py-8">
            {/* 1. Map Container - Takes full width */}
            <InteractiveMap />

            {/* 2. Optional: Add a section for detailed location list below the map */}
          </section>
        </div>
      </main>
    </>
  );
}

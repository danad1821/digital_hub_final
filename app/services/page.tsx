"use client";
import { Suspense, useEffect, useState } from 'react';
import { Loader2 } from "lucide-react"; // Import for fallback loading state
import Header from '../_components/Header';
import ServicesClientContent from '../_components/ServicesClientContent';
import axios from 'axios';
import { ApiResponse, PageDocument } from '../_types/PageData';

export default function ServicesPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getServicesPageData = async () => {
    setIsLoading(true);
    try {
      // Assuming 'Services' is the slug for the Servicespage
      const response =
        await axios.get<ApiResponse<PageDocument>>(`/api/pages/services`);
      setPageData(response.data.data);
    } catch (error) {
      console.error("Error fetching Services page data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    getServicesPageData();
  }, [])

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
        <div className="max-w-7xl mx-auto custom-container">
          {/* Header */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
            {pageData?.sections[0].title}
          </h1>
          <p className="text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            {pageData?.sections[0].subtitle}
          </p>

          {/* CRITICAL FIX: Wrap the Client Component in Suspense */}
          <Suspense fallback={
            <div className="flex justify-center items-center h-48">
              {/* Use the same loading spinner as your original code */}
              <Loader2 className="w-10 h-10 text-[#00FFFF] animate-spin" />
            </div>
          }>
            {/* The component that uses useSearchParams() */}
            <ServicesClientContent />
          </Suspense>

        </div>
      </main>
    </>
  );
}
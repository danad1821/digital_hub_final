import { Suspense } from 'react';
import { Loader2 } from "lucide-react"; // Import for fallback loading state
import Header from '../_components/Header';
import ServicesClientContent from '../_components/ServicesClientContent';

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto custom-container">
          {/* Header */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Comprehensive maritime logisitcs solutions tailored for the complex
            industrial cargo
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
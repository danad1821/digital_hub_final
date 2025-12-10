"use client";
import { useState, useEffect, useRef, useCallback } from "react"; // Added useCallback
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Header from "../_components/Header";
import ServiceClientCard from "../_components/ServiceClientCard";

interface ServiceItem {
  name: string;
  description: string;
}

interface Service {
  _id: string;
  category: string; 
  serviceName: string; 
  summary: string;
  description: string;
  items: ServiceItem[];
}

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); 

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedServiceName, setExpandedServiceName] = useState<string | null>(null);

  const serviceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 1. Memoize setRef using useCallback
  // This function is stable across renders, preventing ServiceClientCard from re-rendering
  // just because the parent re-rendered, assuming ServiceClientCard also uses memoization.
  const setRef = useCallback((element: HTMLDivElement | null, category: string) => {
    serviceRefs.current[category] = element;
  }, []); // Empty dependency array means it's created only once

  // 2. Memoize getAllServices using useCallback
  // This ensures the function identity is stable, which is crucial for the dependency array
  // in the first useEffect hook, guaranteeing it runs only once on mount.
  const getAllServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/services");
      // Use a functional update if setServices depended on 'services', but here it's fine.
      setServices(response.data.services || response.data); 
    } catch (error) {
      console.error("Error fetching services: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means it's created only once

  // Fetch Services (Now depends on the stable getAllServices)
  useEffect(() => {
    getAllServices();
  }, [getAllServices]); // Dependency array includes getAllServices

  // Scroll and Expansion Effect
  useEffect(() => {
    if (!isLoading && name) {
      const targetRef = serviceRefs.current[name];
      
      if (targetRef) {
        // 1. Scroll the element into view
        targetRef.scrollIntoView({ 
          behavior: "smooth", 
          block: "start"
        });
        
        // 2. Set the state to force expansion of this service card
        setExpandedServiceName(name);
      }
    } else {
        // Clear expansion state if no service name is present in the URL
        setExpandedServiceName(null);
    }
  }, [isLoading, name, services]); // Dependencies remain the same

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
          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-10 h-10 text-[#00FFFF] animate-spin" />
            </div>
          )}

          <div className="flex flex-wrap gap-5">
            {services.map((s: Service) => (
              <ServiceClientCard
                key={s._id}
                s={s}
                // Check if the current card should be expanded based on URL param
                isInitiallyExpanded={s.category === expandedServiceName} 
                // Pass the memoized setRef function. The category is closed over by the outer function.
                ref={(el: HTMLDivElement | null) => setRef(el, s.category)}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
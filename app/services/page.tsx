"use client";
import { useState, useEffect, useRef } from "react";
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
  
  // New state: Tracks which service category should be forced open/expanded
  const [expandedServiceName, setExpandedServiceName] = useState<string | null>(null);

  const serviceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setRef = (element: HTMLDivElement | null, category: string) => {
    serviceRefs.current[category] = element;
  };

  // Fetch Services
  const getAllServices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/services");
      setServices(response.data.services || response.data); 
    } catch (error) {
      console.error("Error fetching services: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

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
        // Note: We use the 'name' parameter which is the category key
        setExpandedServiceName(name);
      }
    } else {
        // Clear expansion state if no service name is present in the URL
        setExpandedServiceName(null);
    }
  }, [isLoading, name, services]); 

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
                // Pass the current service's category and the global expanded state
                isInitiallyExpanded={s.category === expandedServiceName} 
                ref={(el: HTMLDivElement | null) => setRef(el, s.category)}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
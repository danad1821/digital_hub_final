// /app/services/ServicesClientContent.tsx

"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
// Remove Loader2 and Header imports as they are used by the wrapper
import { useSearchParams } from "next/navigation";
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

// Rename the default export function to match the file name
export default function ServicesClientContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name"); 

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expandedServiceName, setExpandedServiceName] = useState<string | null>(null);

  const serviceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 1. Memoize setRef using useCallback
  const setRef = useCallback((element: HTMLDivElement | null, category: string) => {
    serviceRefs.current[category] = element;
  }, []); 

  // 2. Memoize getAllServices using useCallback
  const getAllServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/services");
      setServices(response.data.services || response.data); 
    } catch (error) {
      console.error("Error fetching services: ", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Services
  useEffect(() => {
    getAllServices();
  }, [getAllServices]);

  // Scroll and Expansion Effect
  useEffect(() => {
    if (!isLoading && name) {
      const targetRef = serviceRefs.current[name];
      
      if (targetRef) {
        targetRef.scrollIntoView({ 
          behavior: "smooth", 
          block: "start"
        });
        
        setExpandedServiceName(name);
      }
    } else {
        setExpandedServiceName(null);
    }
  }, [isLoading, name, services]); 

  // REMOVE THE HEADER AND MAIN TAGS - they are now in the parent page.tsx
  // This component now ONLY renders the dynamic content.
  return (
    <>
      {/* Loading Spinner is no longer needed here, but kept for internal logic */}
      {/* It's better to manage the loading state internally if the wrapper Suspense 
          only handles the searchParams issue, but keeping it for now is safe.
          The parent Suspense will show its own fallback until this component hydrates.
      */}
      {isLoading && (
        <div className="flex justify-center items-center h-48">
          {/* Note: Loader2 icon is not imported here, but was in the original. 
              The parent Suspense wrapper now handles the initial server-side loading state.
          */}
        </div>
      )}

      <div className="flex flex-wrap gap-5">
        {services.map((s: Service) => (
          <ServiceClientCard
            key={s._id}
            s={s}
            isInitiallyExpanded={s.category === expandedServiceName} 
            ref={(el: HTMLDivElement | null) => setRef(el, s.category)}
          />
        ))}
      </div>
    </>
  );
}
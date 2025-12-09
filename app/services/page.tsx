"use client";
import { useState, useEffect } from "react";
// import { useParams } from "next/navigation"; // Temporarily commented out due to environment resolution error
import axios from "axios";
import { Loader2, ArrowRight } from "lucide-react";
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
  description: string;
  items: ServiceItem[];
}

export default function AboutUs() {
  // 1. Get the parameter from the URL (e.g., /about/shipping or /about/1)

  const [services, setServices] = useState<Service[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

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
            {services.map((s: any) => (
              <ServiceClientCard s={s}/>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

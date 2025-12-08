"use client";
import { useState, useEffect } from "react";
// import { useParams } from "next/navigation"; // Temporarily commented out due to environment resolution error
import axios from "axios";
import { Loader2, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Header from "../_components/Header";

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
  const searchParams = useSearchParams();
  const catIndex = searchParams.get("catIndex");

  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
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

  // 2. LOGIC: Update selected category when 'catIndex' or 'services' change
  useEffect(() => {
    if (services.length > 0 && catIndex) {
      // Decode the URL parameter (handles %20 for spaces)
      const param = decodeURIComponent(catIndex).toLowerCase();

      // Strategy A: Try to find by Category Name (Case-insensitive)
      const nameMatchIndex = services.findIndex(
        (s) => s.category.toLowerCase() === param
      );

      if (nameMatchIndex !== -1) {
        setSelectedCategory(nameMatchIndex);
      } else {
        // Strategy B: Try to find by Array Index
        const numIndex = Number(param);
        if (!isNaN(numIndex) && services[numIndex]) {
          setSelectedCategory(numIndex);
        }
      }
    }
  }, [catIndex, services]);

  const activeService = services[selectedCategory];

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
          {/* 3. Navigation Tabs (Categories) */}
          {!isLoading && services.length > 0 && (
            <section className="flex flex-wrap justify-center gap-3 mb-12">
              {services.map((service, index) => {
                const isActive = index === selectedCategory;
                return (
                  <button
                    key={service._id}
                    onClick={() => setSelectedCategory(index)}
                    className={`
                        px-6 py-3 rounded-sm font-semibold text-base transition-all duration-300 shadow-sm
                        ${
                          isActive
                            ? "bg-[#00FFFF] text-[#0A1C30] scale-105 shadow-md ring-2 ring-[#0A1C30] ring-offset-2"
                            : "bg-white text-gray-600 hover:bg-gray-100 hover:text-[#0A1C30]"
                        }
                      `}
                  >
                    {service.category}
                  </button>
                );
              })}
            </section>
          )}
          {/* 4. Service Content Area */}
          {!isLoading && activeService && (
            <section className="animate-in fade-in duration-500 slide-in-from-bottom-4">
              {/* Description of the Category */}
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-[#0A1C30] mb-4">
                  {activeService.category}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {activeService.description}
                </p>
              </div>
              {/* 5. Service Items Grid with ALTERNATING COLORS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeService.items.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={`
                          p-8 rounded-sm shadow-lg transition-transform duration-300 hover:-translate-y-1 flex flex-col justify-center
                          bg-[#0A1C30] text-white
                        `}
                    >
                      <h3 className="text-2xl font-bold mb-3 flex items-center">
                        <ArrowRight
                          className={`w-6 h-6 mr-3 text-[#FF6B00]}`}
                        />
                        {item.name}
                      </h3>
                      <p className={`text-base leading-relaxed text-gray-600}`}>
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

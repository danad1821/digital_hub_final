// components/AboutUs.tsx

"use client";

import { useState, useEffect } from "react";
// Import all necessary icons from Lucide
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "../_components/Header";
import HomeInfoCard from "../_components/HomeInfoCard";

// Import the Server Action
import { getStaticPageContent } from "@/app/_actions/pages";

// Import data types (Adjust path as needed to match your project structure)
import { PageDocument, CoreValue, PageSection } from "@/app/_types/PageData";

// Placeholder for a generic local image path if no image reference is found
const FALLBACK_IMAGE_PATH = "/images/fallback_team.jpeg";

// Map string icon names from the database to actual Lucide React components
const IconMap: { [key: string]: React.ElementType } = {
  ArrowRight: ArrowRight,
  ArrowLeft: ArrowLeft,
  // Add other icons here if they are used in your data
};

// Reusable gradient title classes
const gradientTitleClasses = `
 gradient-text
 font-black
 tracking-tight
 bg-gradient-to-r
 from-[#00FFFF]
 to-[#0A1C30] pb-2
`;

// Define the Service interface expected by HomeInfoCard
interface Service {
  serviceName: string;
  summary: string;
  icon: any;
}

// Utility to find section index by type
const findSectionIndex = (data: PageDocument, type: string) =>
  data.sections.findIndex((s) => s.type === type);

export default function AboutUs() {
  // 1. STATE FOR DATA AND LOADING
  const [pageData, setPageData] = useState<PageDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching (Using Server Action) ---
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const fetchedData: any = await getStaticPageContent("about-us");

        if (!fetchedData) {
          throw new Error(
            "Failed to fetch page data or page content is empty."
          );
        }

        setPageData(fetchedData);
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(`Failed to load page content: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  // --- Loading and Error States ---
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center p-8">
          <Loader2 className="animate-spin w-8 h-8 mr-2 text-[#0A1C30]" />
          <p className="text-[#0A1C30]">Loading content...</p>
        </main>
      </>
    );
  }

  if (error || !pageData) {
    return (
      <>
        <Header />
        <main className="min-h-screen p-8 flex items-center justify-center">
          <p className="text-red-600 font-bold">
            {error || "Could not load content for this page."}
          </p>
        </main>
      </>
    );
  }

  // 2. EXTRACT DYNAMIC DATA
  const heroIndex = findSectionIndex(pageData, "hero");
  const vmIndex = findSectionIndex(pageData, "vision_mission");
  const cvIndex = findSectionIndex(pageData, "core_values");

  // Safely extract data for rendering with fallbacks, ensuring 'image_ref' is available
  const heroData = heroIndex !== -1 ? pageData.sections[heroIndex].data : {};
  const vmData =
    vmIndex !== -1
      ? pageData.sections[vmIndex].data
      : { vision: {}, mission: {}, image_ref: null };
  const cvData =
    cvIndex !== -1
      ? pageData.sections[cvIndex].data
      : {
          title: "Our Core Values",
          intro_text: "Our principles...",
          values: [],
        };

  // 🌟 IMAGE CHANGE 1: Hero Section Dynamic Image Source
  const heroImageId = heroData.image_ref;
  const heroImageSrc = heroImageId
    ? `/api/images/${heroImageId.toString()}` // CORRECT API ROUTE: /api/images/
    : FALLBACK_IMAGE_PATH;

  // 🌟 IMAGE CHANGE 2: Vision & Mission Section Dynamic Image Source
  const aboutImageId = vmData.image_ref;
  const aboutImageSrc = aboutImageId
    ? `/api/images/${aboutImageId.toString()}` // CORRECT API ROUTE: /api/images/
    : FALLBACK_IMAGE_PATH;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* 1. HERO SECTION - Dynamic Image Source */}
        <div
          className={`relative h-[50vh] overflow-hidden flex items-center justify-center`}
        >
          {/* Background Image with Overlay */}
          <Image
            src={heroImageSrc} // Dynamic or fallback source
            alt="About Us background image of a maritime operation"
            fill
            priority
            // Use unoptimized for dynamic images from your API
            unoptimized={!!heroImageId}
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60"></div>

          {/* Header Content */}
          <div className="absolute inset-0 flex flex-col justify-center custom-container z-10 text-white pt-16 md:pt-20">
            <p className="bg-gray-300/50 border border-gray-300 w-fit px-2 py-1 rounded-sm text-sm">
              OUR COMPANY STORY
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight flex flex-col">
              <span>Leading Maritime </span>
              <span className={gradientTitleClasses}>
                {heroData.headline || "Solutions Provider"}
              </span>
            </h1>
          </div>
        </div>


        {/* 2. VISION & MISSION SECTION - Dynamic Image Source */}
        <section className="flex items-center custom-container justify-between py-20 gap-x-10 flex-wrap lg:flex-nowrap">
          {/* Image placeholder with offset/rotation style */}
          <div className="relative lg:w-1/2 mt-12 lg:mt-0">
            <Image
              src={aboutImageSrc} // Dynamic or fallback source
              alt="our company"
              width={500}
              height={500}
              unoptimized={!!aboutImageId} // Use true if using the dynamic API route
              className="z-[20] w-full h-auto rounded-sm object-cover"
            />
            <div className="z-[-1] rounded-sm bg-[#00FFFF]/15 w-full absolute inset-0 rotate-3"></div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-4xl sm:text-5xl font-extrabold flex flex-col my-2 text-[#0A1C30]">
              <span>Our Vision &</span>
              <span className={gradientTitleClasses}>Mission</span>
            </h2>

            <div className="mt-8 space-y-8">
              {/* Vision Block */}
              <div className="p-6 border-l-4 border-[#00FFFF] bg-gray-50 rounded-sm">
                <h3 className="text-2xl font-bold text-[#0A1C30] mb-2">
                  {vmData.vision?.title || "Our Vision"}
                </h3>
                <p className="text-gray-700">
                  {vmData.vision?.text ||
                    "To be the global leader in heavy-lift and project logistics, setting the benchmark..."}
                </p>
              </div>

              {/* Mission Block */}
              <div className="p-6 border-l-4 border-[#00FFFF] bg-gray-50 rounded-sm">
                <h3 className="text-2xl font-bold text-[#0A1C30] mb-2">
                  {vmData.mission?.title || "Our Mission"}
                </h3>
                <p className="text-gray-700">
                  {vmData.mission?.text ||
                    "We commit to delivering tailored, end-to-end logistics solutions..."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. OUR VALUES SECTION - Dynamic Icons */}
        <section className="py-20 bg-gray-50">
          <div className="custom-container">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 text-[#0A1C30]">
              {cvData.title || "Our Core Values"}
            </h2>
            <p className="text-center mb-12 text-gray-400 max-w-2xl mx-auto">
              {cvData.intro_text ||
                "The principles that guide our decisions, operations, and commitment to our global partners."}
            </p>

            <div className="flex flex-wrap gap-5 items-stretch justify-evenly">
              {cvData.values.map((v: CoreValue) => {
                // 🌟 ICON CHANGE: Look up the icon component from the map, defaulting to ArrowRight
                const IconComponent = IconMap[v.icon] || ArrowRight;

                return (
                  <HomeInfoCard
                    key={v.key}
                    service={
                      {
                        serviceName: v.name,
                        summary: v.description,
                        icon: <IconComponent />,
                      } as Service
                    }
                    icon={<IconComponent />} // Render the dynamically selected icon
                  />
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

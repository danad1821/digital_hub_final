// components/AdminAbout.tsx (Client Component - Refactored)

"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Loader2, ArrowRight, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import ImageEditor from "@/app/_components/ImageEditor";
import CoreValuesEditor from "@/app/_components/CoreValuesEditor";
import ValueCard from "../ValueCard";

// Assuming the correct path to your types and HomeInfoCard
import {
  PageDocument,
  CoreValue,
  ApiResponse,
  PageSection,
} from "@/app/_types/PageData";
// import HomeInfoCard from "@/app/_components/HomeInfoCard";

// --- Utility Functions (Keep these the same) ---
const findSectionIndex = (data: PageDocument, type: string) =>
  data.sections.findIndex((s) => s.type === type);

// Utility for creating the gradient title class (replicated from client)
const gradientTitleClasses = `
    gradient-text
    font-black
    tracking-tight
    bg-gradient-to-r
    from-[#00FFFF]
    to-[#0A1C30] pb-2
`;

export default function AboutPageEditor() {
  const [pageData, setPageData] = useState<PageDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSectionDataChange = (
    sectionIndex: number,
    key: string,
    value: string
  ) => {
    setPageData((prevData: any) => {
      if (!prevData) return null;
      const newSections = [...prevData.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        data: { ...newSections[sectionIndex].data, [key]: value },
      };
      return { ...prevData, sections: newSections };
    });
  };

  const handleNestedSectionChange = (
    sectionIndex: number,
    primaryKey: string,
    subKey: string,
    value: string
  ) => {
    setPageData((prevData: any) => {
      if (!prevData) return null;
      const newSections = [...prevData.sections];
      const section = newSections[sectionIndex];

      newSections[sectionIndex] = {
        ...section,
        data: {
          ...section.data,
          [primaryKey]: { ...section.data[primaryKey], [subKey]: value },
        },
      };
      return { ...prevData, sections: newSections };
    });
  };

  // --- Data Fetching and Saving (Unmodified) ---
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch("/api/pages/about-us");
        const result: ApiResponse<PageDocument> = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Failed to fetch page data");
        }

        const dataWithKeys = ensureKeys(result.data);
        setPageData(dataWithKeys);
      } catch (err: any) {
        setMessage(`Error loading content: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const ensureKeys = (data: PageDocument): PageDocument => {
    const cvIndex = findSectionIndex(data, "core_values");
    if (cvIndex !== -1) {
      const values = data.sections[cvIndex].data.values;
      const updatedValues = values.map((v: CoreValue) => ({
        ...v,
        key: v.key || uuidv4(),
      }));
      data.sections[cvIndex].data.values = updatedValues;
    }
    return data;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;

    setIsSaving(true);
    setMessage("Saving changes...");

    try {
      const response = await fetch(`/api/pages/${pageData.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData),
      });

      const result: ApiResponse<PageDocument> = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || "Save failed on the server.");
      }

      setMessage("✅ Page saved successfully!");
      setPageData(ensureKeys(result.data));
    } catch (error: any) {
      setMessage(`❌ Error saving: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render Logic Setup ---
  if (loading)
    return (
      <main className="p-8">
        <Loader2 className="animate-spin w-8 h-8 mr-2 inline-block" /> Loading
        editable content...
      </main>
    );
  if (!pageData)
    return (
      <main className="p-8">
        <p>No page data found.</p>
      </main>
    );

  const heroIndex = findSectionIndex(pageData, "hero");
  const vmIndex = findSectionIndex(pageData, "vision_mission");
  const cvIndex = findSectionIndex(pageData, "core_values");

  // Default values if section is missing (to prevent crashes)
  const heroData = heroIndex !== -1 ? pageData.sections[heroIndex].data : {};
  const vmData =
    vmIndex !== -1
      ? pageData.sections[vmIndex].data
      : { vision: {}, mission: {} };
  const cvData =
    cvIndex !== -1
      ? pageData.sections[cvIndex].data
      : { title: "", intro_text: "", values: [] };

  // Determine preview image sources
  const heroImageSrc =
    heroData.image_ref && !heroData.image_ref.startsWith("/images/")
      ? `/api/files/${heroData.image_ref}`
      : "/images/image4.jpeg"; // Fallback static image path

  const vmImageSrc =
    vmData.image_ref && !vmData.image_ref.startsWith("/images/")
      ? `/api/files/${vmData.image_ref}`
      : "/images/image6.jpeg"; // Fallback static image path

  return (
    <form onSubmit={handleSave} className="min-h-screen font-sans">
      <div className="p-4 border-b border-gray-200 bg-white shadow-md sticky top-0 z-50">
        <div className="custom-container flex justify-between items-center">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 rounded-md transition-colors ${isSaving ? "bg-gray-400" : "bg-[#007bff] hover:bg-[#0066cc] text-white"}`}
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2 inline-block" />{" "}
                Saving...
              </>
            ) : (
              "Save All Changes"
            )}
          </button>
        </div>
        <p
          className={`mt-2 text-sm text-center ${message.startsWith("✅") ? "text-green-600" : message.startsWith("❌") ? "text-red-600" : "text-orange-500"}`}
        >
          {message}
        </p>
      </div>

      <section>
        {/* --- 1. HERO SECTION (Editable with ImageEditor) --- */}
        <div className="relative h-[50vh] overflow-hidden flex items-center justify-center border-4 border-dashed border-gray-500/50">
          {/* Background Image Placeholder/Editor */}
          {heroIndex !== -1 && (
            <ImageEditor
              sectionIndex={heroIndex}
              imageKey={"image_ref"}
              pageData={pageData}
              setPageData={setPageData}
              isLarge={true}
            />
          )}
          {/* Visual Placeholder (if no image is set) */}
          {!heroData.image_ref && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              No Hero Image Set
            </div>
          )}

          {/* Content Layer (unchanged text editing) */}
          <div className="absolute inset-0 flex flex-col justify-center custom-container z-10 text-white pt-16 md:pt-20 pointer-events-none">
            <p className="bg-gray-300/50 border border-gray-300 w-fit px-2 py-1 rounded-sm text-sm pointer-events-auto">
              OUR COMPANY STORY
            </p>

            <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight flex flex-col mt-2">
              <span>Leading Maritime </span>
              <span className={gradientTitleClasses}>
                <textarea
                  value={heroData.headline || "Solutions Provider"}
                  onChange={(e) =>
                    handleSectionDataChange(
                      heroIndex,
                      "headline",
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent text-white border-b-2 border-white/50 resize-none overflow-hidden h-20 pointer-events-auto"
                />
              </span>
            </h1>
          </div>
        </div>

        {/* --- 2. VISION & MISSION SECTION (Editable with ImageEditor) --- */}
        <section className="flex items-center custom-container justify-between py-20 gap-x-10 flex-wrap lg:flex-nowrap border-b border-gray-200">
          {/* Image Placeholder/Editor */}
          <div className="relative lg:w-1/2 min-h-[300px] mt-12 lg:mt-0 p-4 border-2 border-dashed border-blue-400/50">
            {vmIndex !== -1 && (
              <ImageEditor
                sectionIndex={vmIndex}
                imageKey={"image_ref"}
                pageData={pageData}
                setPageData={setPageData}
                isLarge={false}
              />
            )}
            {/* Fallback image (or the dynamically loaded one) */}
            {vmImageSrc && (
              <Image
                src={vmImageSrc}
                alt="Team at work in a modern office"
                width={500}
                height={500}
                className="z-[20] w-full h-auto rounded-sm object-cover"
              />
            )}
            <div className="z-[-1] rounded-sm bg-[#00FFFF]/15 w-full absolute inset-0 rotate-3"></div>
          </div>

          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <h2 className="text-4xl sm:text-5xl font-extrabold flex flex-col my-2 text-[#0A1C30]">
              <span>Our Vision &</span>
              <span className={gradientTitleClasses}>Mission</span>
            </h2>

            <div className="mt-8 space-y-8">
              {/* Vision Block (Editable) */}
              <div className="p-6 border-l-4 border-[#00FFFF] bg-gray-50 rounded-sm hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-[#0A1C30] mb-2">
                  <input
                    type="text"
                    value={vmData.vision?.title || "Our Vision"}
                    onChange={(e) =>
                      handleNestedSectionChange(
                        vmIndex,
                        "vision",
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full bg-transparent border-b border-gray-300"
                  />
                </h3>
                <textarea
                  value={vmData.vision?.text || "To be the global leader..."}
                  onChange={(e) =>
                    handleNestedSectionChange(
                      vmIndex,
                      "vision",
                      "text",
                      e.target.value
                    )
                  }
                  className="w-full text-gray-700 bg-white p-2 border rounded-sm min-h-[100px]"
                />
              </div>

              {/* Mission Block (Editable) */}
              <div className="p-6 border-l-4 border-[#00FFFF] bg-gray-50 rounded-sm hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-bold text-[#0A1C30] mb-2">
                  <input
                    type="text"
                    value={vmData.mission?.title || "Our Mission"}
                    onChange={(e) =>
                      handleNestedSectionChange(
                        vmIndex,
                        "mission",
                        "title",
                        e.target.value
                      )
                    }
                    className="w-full bg-transparent border-b border-gray-300"
                  />
                </h3>
                <textarea
                  value={
                    vmData.mission?.text ||
                    "We commit to delivering tailored..."
                  }
                  onChange={(e) =>
                    handleNestedSectionChange(
                      vmIndex,
                      "mission",
                      "text",
                      e.target.value
                    )
                  }
                  className="w-full text-gray-700 bg-white p-2 border rounded-sm min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. OUR CORE VALUES SECTION (Combined Editing/Viewing) --- */}
        <section className="py-20 bg-gray-50 border-b border-gray-200">
          <div className="custom-container">
            {/* Title (Editable) */}
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 text-[#0A1C30]">
              <input
                type="text"
                value={cvData.title || "Our Core Values"}
                onChange={(e) =>
                  handleSectionDataChange(cvIndex, "title", e.target.value)
                }
                className="w-full text-center bg-transparent border-b border-gray-300 p-1"
              />
            </h2>

            {/* Intro Text (Editable) */}
            <textarea
              value={
                cvData.intro_text ||
                "The principles that guide our decisions..."
              }
              onChange={(e) =>
                handleSectionDataChange(cvIndex, "intro_text", e.target.value)
              }
              className="w-full text-center mb-12 text-gray-400 max-w-2xl mx-auto block bg-white p-2 border rounded-sm min-h-[50px]"
            />

            {/* Visual Display of Current Values */}
            <h3 className="text-center text-xl font-semibold mb-4">
              Live Preview:
            </h3>
            <div className="flex flex-wrap gap-5 items-stretch justify-evenly border-b-2 border-gray-300 pb-8 mb-8">
              {/* Map over the live data for the visual preview */}
              {cvData.values.map((v: CoreValue) => (
                <ValueCard
                  key={v.key}
                  service={{
                    serviceName: v.name,
                    summary: v.description,
                    icon: <ArrowRight />,
                  }}
                />
              ))}
            </div>

            {/* Array Editor Component */}
            <h3 className="text-center text-xl font-semibold mb-4">
              Value Array Management:
            </h3>
            {cvIndex !== -1 && (
              <div className="max-w-4xl mx-auto">
                <CoreValuesEditor
                  sectionIndex={cvIndex}
                  pageData={pageData}
                  setPageData={setPageData}
                />
              </div>
            )}
          </div>
        </section>

        {/* Save button at the bottom for convenience */}
        <div className="custom-container py-10">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-3 text-xl rounded-md transition-colors ${isSaving ? "bg-gray-400" : "bg-[#007bff] hover:bg-[#0066cc] text-white"}`}
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2 inline-block" />{" "}
                Saving...
              </>
            ) : (
              "Save All Changes"
            )}
          </button>
        </div>
      </section>
    </form>
  );
}

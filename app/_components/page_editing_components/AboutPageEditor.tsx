// components/AdminAbout.tsx (Client Component - Refactored)

"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Loader2,
  Save, // Use Save from lucide-react, like in HomePageEditor
  Anchor, // Use a relevant icon for the header
  Eye, // Placeholder icon for Vision/Mission
  Layers3, // Placeholder icon for Core Values
} from "lucide-react";
import Image from "next/image";
// NOTE: Make sure the paths below are correct in your project structure
import ImageEditor from "@/app/_components/ImageEditor";
import CoreValuesEditor from "@/app/_components/CoreValuesEditor";
// NOTE: You must ensure ValueCard is imported correctly or re-implemented
// import ValueCard from "../ValueCard"; 

// Assuming the correct path to your types
import {
  PageDocument,
  CoreValue,
  ApiResponse,
  PageSection,
} from "@/app/_types/PageData";

// --- Utility Functions (Keep these the same) ---
const findSectionIndex = (data: PageDocument, type: string) =>
  data?.sections.findIndex((s) => s.type === type);

export default function AboutPageEditor() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- Theme/Style Variables from HomePageEditor ---
  const Navy = "bg-gray-800 text-white";
  const Cyan = "bg-cyan-600 hover:bg-cyan-700 text-white";
  const InputStyle =
    "p-2 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-white"; // Added text-white
  const SectionHeaderStyle =
    "text-2xl font-bold border-b border-cyan-600/50 pb-2 mb-4 text-cyan-400";
  const CardStyle =
    "p-6 bg-gray-700 rounded-lg shadow-xl border border-gray-600"; // Increased padding/shadow for better look

  // --- State Update Handlers (Centralized for consistency) ---

  const handleSectionDataChange = (
    sectionIndex: number,
    key: string,
    value: string
  ) => {
    setPageData((prevData: any) => {
      if (!prevData) return null;
      const newSections = [...prevData.sections];
      const targetSection = newSections[sectionIndex];
      
      if (!targetSection) return prevData;

      // Check if it's a direct section property (like title/subtitle in HomePageEditor)
      if (key === "title" || key === "subtitle") {
        (targetSection as any)[key] = value;
      } else {
        // Assume it's a property of the 'data' object
        targetSection.data = { ...targetSection.data, [key]: value };
      }

      return { ...prevData, sections: newSections };
    });
  };


  const handleNestedSectionChange = (
    sectionIndex: number,
    primaryKey: string, // e.g., 'vision' or 'mission'
    subKey: string, // e.g., 'title' or 'text'
    value: string
  ) => {
    setPageData((prevData: any) => {
      if (!prevData) return null;
      const newSections = [...prevData?.sections];
      const section = newSections[sectionIndex];

      // Deep copy and update the nested object (vision or mission)
      const newNestedItem = {
        ...section.data[primaryKey],
        [subKey]: value,
      };

      newSections[sectionIndex] = {
        ...section,
        data: {
          ...section.data,
          [primaryKey]: newNestedItem,
        },
      };
      return { ...prevData, sections: newSections };
    });
  };

  // --- Data Fetching and Saving (Unmodified logic) ---
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
        setMessage(`❌ Error loading content: ${err.message}`);
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
  const heroIndex = findSectionIndex(pageData as PageDocument, "hero");
  const vmIndex = findSectionIndex(
    pageData as PageDocument,
    "vision_mission"
  );
  const cvIndex = findSectionIndex(pageData as PageDocument, "core_values");

  // Default values for safety
  const heroData =
    heroIndex !== -1 ? (pageData?.sections[heroIndex].data || {}) : {};
  const vmData =
    vmIndex !== -1
      ? (pageData?.sections[vmIndex].data || { vision: {}, mission: {} })
      : { vision: {}, mission: {} };
  const cvData =
    cvIndex !== -1
      ? (pageData?.sections[cvIndex].data || {
          title: "",
          intro_text: "",
          values: [],
        })
      : { title: "", intro_text: "", values: [] };

  const getSectionTitle = (index: number) => {
    if (!pageData || index === -1) return "Section Title Missing";
    return (pageData.sections[index].title || pageData.sections[index].type)
      .replace(/_/g, ' ')
      .toUpperCase();
  };


  if (loading)
    return (
      <div className={`min-h-screen p-8 ${Navy}`}>
        <div className="flex justify-center items-center h-96">
          <Loader2 className="animate-spin w-10 h-10 text-cyan-500" />
          <span className="ml-3 text-lg text-cyan-300">
            Loading Page Data...
          </span>
        </div>
      </div>
    );
  if (!pageData)
    return (
      <div className={`min-h-screen p-8 ${Navy}`}>
        <div className="text-center p-12 text-lg text-red-400">
          Failed to load about page data. Please check the console for errors.
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen p-8 ${Navy}`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-white">
          <Anchor className="inline-block w-8 h-8 mr-2 text-cyan-400" />
          About Page Editor
        </h1>
        <button
          onClick={handleSave}
          disabled={isSaving || loading || !pageData}
          className={`flex items-center px-6 py-3 rounded-full font-semibold transition-transform duration-200 transform ${Cyan} disabled:bg-gray-500 disabled:cursor-not-allowed`}
        >
          {isSaving ? (
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </header>

      {/* Save Message (Moved into the main form structure) */}
      <p
        className={`my-4 text-center text-lg font-semibold ${
          message.startsWith("✅") ? "text-green-400" : message.startsWith("❌") ? "text-red-400" : "text-orange-400"
        }`}
      >
        {message}
      </p>

      <form onSubmit={handleSave} className="space-y-12">
        {/* --- 1. HERO SECTION --- */}
        {heroIndex !== -1 && (
          <section className={CardStyle}>
            <h2 className={SectionHeaderStyle}>
              {getSectionTitle(heroIndex)}
            </h2>
            <div className="relative mb-6 h-96">
              <ImageEditor
                sectionIndex={heroIndex}
                imageKey={"image_ref"}
                pageData={pageData}
                setPageData={setPageData}
                isLarge={true}
                slug="about-us"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="hero-headline"
                  className="font-medium text-cyan-300"
                >
                  Headline Text
                </label>
                <textarea
                  id="hero-headline"
                  className={`${InputStyle} min-h-[80px]`}
                  value={heroData.headline || ""}
                  onChange={(e) =>
                    handleSectionDataChange(
                      heroIndex,
                      "headline",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </section>
        )}

        {/* --- 2. VISION & MISSION SECTION --- */}
        {vmIndex !== -1 && (
          <section className={CardStyle}>
            <h2 className={SectionHeaderStyle}>
              {getSectionTitle(vmIndex)}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Vision Block */}
              <div className="p-4 bg-gray-800 rounded-md border border-gray-600 space-y-3">
                <h4 className="text-xl font-semibold mb-3 text-cyan-400 flex items-center">
                  <Eye className="w-5 h-5 mr-2" /> Our Vision
                </h4>
                <div>
                  <label
                    htmlFor="vision-title"
                    className="font-medium text-cyan-300"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="vision-title"
                    className={InputStyle}
                    value={vmData.vision?.title || ""}
                    onChange={(e) =>
                      handleNestedSectionChange(
                        vmIndex,
                        "vision",
                        "title",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="vision-text"
                    className="font-medium text-cyan-300"
                  >
                    Text
                  </label>
                  <textarea
                    id="vision-text"
                    className={`${InputStyle} min-h-[100px]`}
                    value={vmData.vision?.text || ""}
                    onChange={(e) =>
                      handleNestedSectionChange(
                        vmIndex,
                        "vision",
                        "text",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>

              {/* Mission Block */}
              <div className="p-4 bg-gray-800 rounded-md border border-gray-600 space-y-3">
                <h4 className="text-xl font-semibold mb-3 text-cyan-400 flex items-center">
                  <Layers3 className="w-5 h-5 mr-2" /> Our Mission
                </h4>
                <div>
                  <label
                    htmlFor="mission-title"
                    className="font-medium text-cyan-300"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="mission-title"
                    className={InputStyle}
                    value={vmData.mission?.title || ""}
                    onChange={(e) =>
                      handleNestedSectionChange(
                        vmIndex,
                        "mission",
                        "title",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="mission-text"
                    className="font-medium text-cyan-300"
                  >
                    Text
                  </label>
                  <textarea
                    id="mission-text"
                    className={`${InputStyle} min-h-[100px]`}
                    value={vmData.mission?.text || ""}
                    onChange={(e) =>
                      handleNestedSectionChange(
                        vmIndex,
                        "mission",
                        "text",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Image Editor for Vision/Mission Section */}
            <div className="relative mb-6 mt-6 h-64 border border-gray-600 rounded-lg">
                <ImageEditor
                  sectionIndex={vmIndex}
                  imageKey={"image_ref"}
                  pageData={pageData}
                  setPageData={setPageData}
                  isLarge={false}
                  slug="about-us"
                />
            </div>
          </section>
        )}

        {/* --- 3. CORE VALUES SECTION --- */}
        {cvIndex !== -1 && (
          <section className={CardStyle}>
            <h2 className={SectionHeaderStyle}>
              {getSectionTitle(cvIndex)}
            </h2>
            <div className="space-y-4 mb-6">
              {/* Title Input */}
              <div>
                <label
                  htmlFor="cv-title"
                  className="font-medium text-cyan-300"
                >
                  Section Title
                </label>
                <input
                  type="text"
                  id="cv-title"
                  className={InputStyle}
                  value={cvData.title || ""}
                  onChange={(e) =>
                    handleSectionDataChange(cvIndex, "title", e.target.value)
                  }
                />
              </div>
              {/* Intro Text Input */}
              <div>
                <label
                  htmlFor="cv-intro-text"
                  className="font-medium text-cyan-300"
                >
                  Introduction Text
                </label>
                <textarea
                  id="cv-intro-text"
                  className={`${InputStyle} min-h-[70px]`}
                  value={cvData.intro_text || ""}
                  onChange={(e) =>
                    handleSectionDataChange(
                      cvIndex,
                      "intro_text",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="p-4 bg-gray-800 rounded-md border border-gray-600">
                <h4 className="text-xl font-semibold mb-4 text-cyan-400">
                  Value Array Management
                </h4>
                {/* Note: The live preview part from the original file is removed
                    to simplify, as CoreValuesEditor handles the data array.
                    You would need to ensure the imported `CoreValuesEditor`
                    component visually aligns with the dark theme. */}
                <div className="max-w-full mx-auto">
                    <CoreValuesEditor
                    sectionIndex={cvIndex}
                    pageData={pageData}
                    setPageData={setPageData}
                    />
                </div>
            </div>
          </section>
        )}

        {/* Save button at the bottom for convenience */}
        <div className="py-10">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-3 text-xl rounded-md transition-colors ${Cyan} disabled:bg-gray-500 disabled:cursor-not-allowed`}
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
      </form>
    </div>
  );
}
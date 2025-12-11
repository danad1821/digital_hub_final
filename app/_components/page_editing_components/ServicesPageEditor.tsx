"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  Globe,
  Clock,
  Anchor,
  Ship,
  ShieldCheck,
  UserCheck,
  HelpCircle,
} from "lucide-react";
import { PageDocument, ApiResponse } from "@/app/_types/PageData";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the type for the section data change
type SectionDataKey =
  | "title"
  | "subtitle"
  | "value"
  | "label"
  | "name"
  | "description"
  | "icon"
  | "button1_text"
  | "button1_link"
  | "button2_text"
  | "button2_link";

export default function ServicesPageEditor() {
  const router = useRouter();
  const [pageData, setPageData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- API Functions ---
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageData) return;

    setIsSaving(true);
    try {
      // The PUT endpoint is /api/pages/[slug]
      await axios.put(`/api/pages/${pageData.slug}`, pageData);
      alert("Services page content saved successfully!");
    } catch (error) {
      console.error("Error saving page data:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- State Update Handler ---

  // Centralized handler for all text inputs
  const handleChange = (
    value: string,
    sectionIndex: number,
    key: SectionDataKey
  ) => {
    setPageData((prevData: any) => {
      // 1. Safety Check: If previous data is null, return null.
      if (!prevData) return null;

      // 2. Immutability: Create a shallow copy of the sections array.
      const newSections = [...prevData.sections];

      // 3. Immutability: Get the target section and create a copy of it.
      // Check if the target section exists.
      const targetSection = newSections[sectionIndex];
      if (!targetSection) return prevData;

      // Create a new, updated section object.
      const updatedSection = {
        ...targetSection,
        // Use the [key] to dynamically update the correct property (e.g., 'title' or 'subtitle')
        [key]: value,
      };

      // 4. Immutability: Replace the old section with the updated one in the new array.
      newSections[sectionIndex] = updatedSection;

      // 5. Return the new state object.
      return { ...prevData, sections: newSections };
    });
  };

  // --- Effects ---
  useEffect(() => {
    getServicesPageData();
  }, []);

  // --- Rendering ---
  const Navy = "bg-gray-800 text-white";
  const Cyan = "bg-cyan-600 hover:bg-cyan-700 text-white";
  const InputStyle =
    "p-2 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 transition duration-150";
  const SectionHeaderStyle =
    "text-2xl font-bold border-b border-cyan-600/50 pb-2 mb-4 text-cyan-400";
  const CardStyle =
    "p-4 bg-gray-700 rounded-lg shadow-lg border border-gray-600";

  return (
    <div className={`min-h-screen p-8 ${Navy}`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-white">
          <Anchor className="inline-block w-8 h-8 mr-2 text-cyan-400" />
          Services Page Editor
        </h1>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading || !pageData}
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

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="animate-spin w-10 h-10 text-cyan-500" />
          <span className="ml-3 text-lg text-cyan-300">
            Loading Page Data...
          </span>
        </div>
      ) : pageData ? (
        <form onSubmit={handleSave} className="space-y-12">
          <section className={CardStyle}>
            <h2 className={SectionHeaderStyle}>Services Section</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="services-title"
                  className="font-medium text-cyan-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="services-title"
                  className={InputStyle}
                  value={pageData.sections[0].title}
                  onChange={(e) => handleChange(e.target.value, 0, "title")}
                />
              </div>
              <div>
                <label
                  htmlFor="services-subtitle"
                  className="font-medium text-cyan-300"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  id="services-subtitle"
                  className={InputStyle}
                  value={pageData.sections[0].subtitle}
                  onChange={(e) => handleChange(e.target.value, 0, "subtitle")}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin/services")}
              className={`flex items-center px-4 py-2 rounded-md font-semibold transition-colors ${Cyan} `}
            >
              <Ship className="w-5 h-5 mr-2" />
              Edit Services
            </button>
          </section>
        </form>
      ) : (
        <div className="text-center p-12 text-lg text-red-400">
          Failed to load Services page data. Please check the console for
          errors.
        </div>
      )}
    </div>
  );
}

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
import Image from "next/image";
// NOTE: Make sure the paths below are correct in your project structure
import ImageEditor from "@/app/_components/ImageEditor";
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

export default function HomePageEditor() {
  const router = useRouter();
  const [pageData, setPageData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- API Functions ---
  const getHomePageData = async () => {
    setIsLoading(true);
    try {
      // Assuming 'home' is the slug for the homepage
      const response =
        await axios.get<ApiResponse<PageDocument>>(`/api/pages/home`);
      setPageData(response.data.data);
    } catch (error) {
      console.error("Error fetching home page data:", error);
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
      alert("Home page content saved successfully!");
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
    key: SectionDataKey,
    // Optional: for nested lists like stats_list or cards
    nestedListKey?: "stats_list" | "cards",
    nestedItemIndex?: number
  ) => {
    setPageData((prevData: any) => {
      if (!prevData) return null;

      const newSections = [...prevData.sections];
      const targetSection = newSections[sectionIndex];

      if (!targetSection) return prevData;

      if (key === "title" || key === "subtitle") {
        // Direct property of the section object
        (targetSection as any)[key] = value;
      } else if (nestedListKey !== undefined && nestedItemIndex !== undefined) {
        // Nested item update (e.g., stats_list, why_choose_us cards)
        const newNestedList = [...(targetSection.data[nestedListKey] as any[])];
        newNestedList[nestedItemIndex] = {
          ...newNestedList[nestedItemIndex],
          [key]: value,
        };
        targetSection.data[nestedListKey] = newNestedList as any;
      } else {
        // Direct property of the section's 'data' object (e.g., button texts)
        (targetSection.data as any)[key] = value;
      }

      return { ...prevData, sections: newSections };
    });
  };

  // --- Effects ---
  useEffect(() => {
    getHomePageData();
  }, []);

  // --- Rendering ---
  const Navy = "bg-gray-800 text-white";
  const Cyan = "bg-cyan-600 hover:bg-cyan-700 text-white";
  const InputStyle =
    "text-white p-2 mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md focus:ring-cyan-500 focus:border-cyan-500 transition duration-150";
  const SectionHeaderStyle =
    "text-2xl font-bold border-b border-cyan-600/50 pb-2 mb-4 text-cyan-400";
  const CardStyle =
    "p-4 bg-gray-700 rounded-lg shadow-lg border border-gray-600";

  return (
    <div className={`min-h-screen p-8 text-grey-800`}>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold ">
          <Anchor className="inline-block w-8 h-8 mr-2 text-cyan-400" />
          Home Page Editor
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
          {/* Section 0: Hero */}
          <section className={CardStyle}>
            <h2 className={SectionHeaderStyle}>Hero Section</h2>
            <div className="relative mb-6 h-96">
              {/* isLarge={true} for the hero image visual style */}
              <ImageEditor
                sectionIndex={0}
                imageKey={"image_ref"}
                pageData={pageData}
                setPageData={setPageData}
                isLarge={true}
                slug="home"
              />
            </div>

            <div className="space-y-4 text-white">
              <div>
                <label
                  htmlFor="hero-title"
                  className="font-medium text-cyan-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="hero-title"
                  className={InputStyle}
                  value={pageData.sections[0].title}
                  onChange={(e) => handleChange(e.target.value, 0, "title")}
                />
              </div>
              <div>
                <label
                  htmlFor="hero-subtitle"
                  className="font-medium text-cyan-300"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  id="hero-subtitle"
                  className={InputStyle}
                  value={pageData.sections[0].subtitle}
                  onChange={(e) => handleChange(e.target.value, 0, "subtitle")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6 text-white">
              {/* Button 1 */}
              <div className={CardStyle}>
                <h4 className="text-xl font-semibold mb-3 text-cyan-400">
                  Button 1
                </h4>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="btn1-text"
                      className="font-medium text-cyan-300"
                    >
                      Button Text
                    </label>
                    <input
                      type="text"
                      id="btn1-text"
                      className={InputStyle}
                      value={pageData.sections[0].data.button1_text}
                      onChange={(e) =>
                        handleChange(e.target.value, 0, "button1_text")
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="btn1-link"
                      className="font-medium text-cyan-300"
                    >
                      Button Link
                    </label>
                    <input
                      type="text"
                      id="btn1-link"
                      className={InputStyle}
                      value={pageData.sections[0].data.button1_link}
                      onChange={(e) =>
                        handleChange(e.target.value, 0, "button1_link")
                      }
                    />
                  </div>
                </div>
              </div>
              {/* Button 2 */}
              <div className={CardStyle}>
                <h4 className="text-xl font-semibold mb-3 text-cyan-400">
                  Button 2
                </h4>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="btn2-text"
                      className="font-medium text-cyan-300"
                    >
                      Button Text
                    </label>
                    <input
                      type="text"
                      id="btn2-text"
                      className={InputStyle}
                      value={pageData.sections[0].data.button2_text}
                      onChange={(e) =>
                        handleChange(e.target.value, 0, "button2_text")
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="btn2-link"
                      className="font-medium text-cyan-300"
                    >
                      Button Link
                    </label>
                    <input
                      type="text"
                      id="btn2-link"
                      className={InputStyle}
                      value={pageData.sections[0].data.button2_link}
                      onChange={(e) =>
                        handleChange(e.target.value, 0, "button2_link")
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 1: Stats */}
          <section className={CardStyle}>
            <h2 className={SectionHeaderStyle}>Stats Section</h2>
            <div className="space-y-4 mb-6 text-white">
              <div>
                <label
                  htmlFor="stats-title"
                  className="font-medium text-cyan-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="stats-title"
                  className={InputStyle}
                  value={pageData.sections[1].title}
                  onChange={(e) => handleChange(e.target.value, 1, "title")}
                />
              </div>
              <div>
                <label
                  htmlFor="stats-subtitle"
                  className="font-medium text-cyan-300"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  id="stats-subtitle"
                  className={InputStyle}
                  value={pageData.sections[1].subtitle}
                  onChange={(e) => handleChange(e.target.value, 1, "subtitle")}
                />
              </div>
            </div>

            <div className="p-4 bg-gray-800 rounded-md">
              <h4 className="text-xl font-semibold mb-4 text-cyan-400">
                Stats Cards
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                {pageData.sections[1].data.stats_list.map(
                  (i: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-700 rounded-lg border border-gray-600 space-y-3"
                    >
                      <h5 className="text-lg font-bold text-white">
                        Card {index + 1}
                      </h5>
                      <div>
                        <label
                          htmlFor={`stat-${index}-label`}
                          className="text-cyan-300 text-sm"
                        >
                          Label
                        </label>
                        <input
                          type="text"
                          id={`stat-${index}-label`}
                          className={InputStyle}
                          value={i.label}
                          onChange={(e) =>
                            handleChange(
                              e.target.value,
                              1,
                              "label",
                              "stats_list",
                              index
                            )
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`stat-${index}-value`}
                          className="text-cyan-300 text-sm"
                        >
                          Value
                        </label>
                        <input
                          type="text"
                          id={`stat-${index}-value`}
                          className={InputStyle}
                          value={i.value}
                          onChange={(e) =>
                            handleChange(
                              e.target.value,
                              1,
                              "value",
                              "stats_list",
                              index
                            )
                          }
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="relative mb-6 h-96 text-white">
              {/* isLarge={true} for the hero image visual style */}
              <ImageEditor
                sectionIndex={1}
                imageKey={"image_ref"}
                pageData={pageData}
                setPageData={setPageData}
                isLarge={false}
                slug="home"
              />
            </div>
          </section>

          {/* Section 2: Services (External Edit) */}
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
                  value={pageData.sections[2].title}
                  onChange={(e) => handleChange(e.target.value, 2, "title")}
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
                  value={pageData.sections[2].subtitle}
                  onChange={(e) => handleChange(e.target.value, 2, "subtitle")}
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


          {/* Section 4: Gallery (External Edit) - Index is 4 in array, 5th element */}
          <section className={CardStyle}>
            <h2 className={SectionHeaderStyle}>Gallery Section</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="gallery-title"
                  className="font-medium text-cyan-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="gallery-title"
                  className={InputStyle}
                  value={pageData.sections[3].title}
                  onChange={(e) => handleChange(e.target.value, 3, "title")}
                />
              </div>
              <div>
                <label
                  htmlFor="gallery-subtitle"
                  className="font-medium text-cyan-300"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  id="gallery-subtitle"
                  className={InputStyle}
                  value={pageData.sections[3].subtitle}
                  onChange={(e) => handleChange(e.target.value, 3, "subtitle")}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin/gallery")}
              className={`flex items-center px-4 py-2 rounded-md font-semibold transition-colors ${Cyan} `}
            >
              <Plus className="w-5 h-5 mr-2" />
              Edit Gallery 
            </button>
          </section>

          {/* Section 5: Locations (External Edit) - Index is 5 in array, 6th element */}
          <section className={CardStyle}>
            <h2 className={SectionHeaderStyle}>Global Coverage Section</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="locations-title"
                  className="font-medium text-cyan-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="locations-title"
                  className={InputStyle}
                  value={pageData.sections[4].title}
                  onChange={(e) => handleChange(e.target.value, 4, "title")}
                />
              </div>
              <div>
                <label
                  htmlFor="locations-subtitle"
                  className="font-medium text-cyan-300"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  id="locations-subtitle"
                  className={InputStyle}
                  value={pageData.sections[4].subtitle}
                  onChange={(e) => handleChange(e.target.value, 4, "subtitle")}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin/locations")}
              className={`flex items-center px-4 py-2 rounded-md font-semibold transition-colors ${Cyan} `}
            >
              <Globe className="w-5 h-5 mr-2" />
              Edit Locations 
            </button>
          </section>

          {/* Section 6: Contact (External Edit) - Index is 6 in array, 7th element */}
          <section className={CardStyle}>
            <h2 className={SectionHeaderStyle}>Contact Section</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="contact-title"
                  className="font-medium text-cyan-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="contact-title"
                  className={InputStyle}
                  value={pageData.sections[5].title}
                  onChange={(e) => handleChange(e.target.value, 5, "title")}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-subtitle"
                  className="font-medium text-cyan-300"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  id="contact-subtitle"
                  className={InputStyle}
                  value={pageData.sections[5].subtitle}
                  onChange={(e) => handleChange(e.target.value, 5, "subtitle")}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="font-medium text-cyan-300"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="contact-email"
                  className={InputStyle}
                  value={pageData.sections[5].data.email}
                  onChange={(e) => handleChange(e.target.value, 5, "email")}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-phone"
                  className="font-medium text-cyan-300"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="contact-phone"
                  className={InputStyle}
                  value={pageData.sections[5].data.phone}
                  onChange={(e) => handleChange(e.target.value, 5, "phone")}
                />
              </div>
              <div>
                <label
                  htmlFor="contact-hq"
                  className="font-medium text-cyan-300"
                >
                  Headquarters
                </label>
                <input
                  type="text"
                  id="contact-hq"
                  className={InputStyle}
                  value={pageData.sections[5].data.hq}
                  onChange={(e) => handleChange(e.target.value, 5, "hq")}
                />
              </div>
            </div>
            
            
          </section>
        </form>
      ) : (
        <div className="text-center p-12 text-lg text-red-400">
          Failed to load home page data. Please check the console for errors.
        </div>
      )}
    </div>
  );
}

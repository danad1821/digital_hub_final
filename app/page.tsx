// src/app/(root)/page.tsx

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

import axios from "axios";

import { Loader2 } from "lucide-react";

// Components

import Header from "./_components/Header";
import Footer from "./_components/Footer";

import { useScrollToSection } from "./_components/ScrollToSection";

import HeroSection from "./_components/sections/HeroSection";

import ServicesSection from "./_components/sections/ServicesSection";

import GallerySection from "./_components/sections/GallerySection";

import AboutSection from "./_components/sections/AboutSection";

import LocationsSection from "./_components/sections/LocationSection";

import ContactSection from "./_components/sections/ContactSection";

// Actions/Helpers

import { getCurrentSchedule } from "./_actions/uploadFile";

import { getAllGalleryImages } from "./_actions/gallery";

// Types

import { HomePageData, Service, Location, GalleryImage } from "./_types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [pageData, setPageData] = useState<HomePageData | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [scheduleFileId, setScheduleFileId] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  // ⭐ Use the custom scroll hook
  const {
    servicesRef,
    aboutRef,
    galleryRef,
    locationsRef,
    contactRef,
    scrollToSection,
  }: any = useScrollToSection();

  // 1. Memoized data fetching helpers
  const getAllImages = useCallback(async () => {
    const allImages: any = await getAllGalleryImages();
    setGallery(allImages);
  }, []);

  const getAllServices = useCallback(async () => {
    try {
      const response = await axios.get("/api/services");
      setServices(response.data.services || response.data);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  }, []);

  const getAllLocations = useCallback(async () => {
    try {
      const response = await axios.get("/api/locations");
      setLocations(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  }, []);

  const fetchCurrentSchedule = useCallback(async () => {
    try {
      const current = await getCurrentSchedule();
      if (current) {
        setScheduleFileId(current.id);
      }
    } catch (error) {
      console.error("Error fetching current schedule ID:", error);
    }
  }, []);

  // 2. COMBINE FETCHING LOGIC INTO A SINGLE ASYNC FUNCTION (Memoized)
  const initDataFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch critical page data first
      const pageResponse = await axios.get(`/api/pages/home`);
      setPageData(pageResponse.data.data);

      // 2. Fetch auxiliary data (parallelized)
      await Promise.all([
        getAllImages(),
        getAllServices(),
        getAllLocations(),
        fetchCurrentSchedule(),
      ]);
    } catch (error) {
      console.error("Error fetching initial page data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getAllImages, getAllServices, getAllLocations, fetchCurrentSchedule]);

  // 3. UPDATE useEffect TO CALL THE COMBINED FUNCTION
  useEffect(() => {
    initDataFetch();
  }, [initDataFetch]);

  // 4. Fallback for loading/error
  if (isLoading && !pageData) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="w-10 h-10 text-[#00D9FF] animate-spin" />
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p className="text-red-500 text-xl">
          Error loading page content. Please try again.
        </p>
      </div>
    );
  }

  // Memoized page sections for cleaner prop passing
  const sections = pageData.sections;

  // --- FIX: Derive contact data for the Footer ---
  // The ContactSection (index 5) holds the necessary email and phone
  const contactSectionData = sections[5].data;

  const contactData = {
    // These properties are available from the ContactSection's data
    email: contactSectionData.email || "info@altamaritime.com",
    phone: contactSectionData.phone || "+1 (800) MARITIME",
    // We assume the emergency phone is not stored separately but hardcoded or derived from another source.
    // Based on the original Footer.tsx, we can hardcode this value or check if it exists in data
    emergencyPhone: "+1 (800) 123-4567", 
  };
  // ----------------------------------------------


  // The rest of the page rendering
  return (
    <main className="min-h-screen">
      {/* 2. HEADER: Pass the scroll handler */}
      <Header
        scrollToSection={scrollToSection as (sectionId: string) => void}
      />

      {/* --- SECTIONS --- */}
      <HeroSection
        sectionData={sections[0]}
        scrollToSection={scrollToSection}
      />

      <AboutSection ref={aboutRef} sectionData={sections[1]} />

      <ServicesSection
        ref={servicesRef}
        sectionData={sections[2]}
        services={services}
        scheduleFileId={scheduleFileId}
      />

      {/* Sections[3] is skipped in original code, assuming it's Section[4] */}
      <GallerySection
        ref={galleryRef}
        sectionData={sections[3]}
        gallery={gallery}
      />

      <LocationsSection ref={locationsRef} sectionData={sections[4]} />

      <ContactSection
        ref={contactRef}
        sectionData={sections[5]}
        locations={locations}
      />

      {/* 5. PASS THE DYNAMICALLY CREATED contactData OBJECT */}
      <Footer contactInfo={contactData} />
    </main>
  );
}
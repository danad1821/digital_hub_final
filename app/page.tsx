"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import homeImage from "@/public/images/image4.jpeg"; // Assuming this is the ship image
import ServiceCard from "./_components/ServiceCard";
import ContactForm from "./_components/ContactForm";
import axios from "axios";

export default function Home() {
  const [services, setServices] = useState<any>([]);

  const getAllServices = async () => {
    try {
      const response = await axios.get("/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  return (
    <main className="min-h-screen">
      <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        {/* Background Image with better Next/Image usage */}
        <Image
          src={homeImage}
          alt="Large cargo ship sailing on the sea"
          fill // Fill the parent container
          priority // Load first as it's the hero image
          sizes="(max-width: 768px) 100vw, 100vw"
          className="object-cover object-center"
        />

        {/* Semi-transparent Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Hero Content (Stronger Typography & Positioning) */}
        <div className="absolute inset-0 flex flex-col justify-center custom-container z-10 text-white p-4">
          {/* Main Title: Bigger, bolder, and more distinct */}
          <h1 className="text-4xl sm:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-[#FF8C00]">Alta</span> Maritime
          </h1>

          {/* Subtitle/Mission Statement: Readable and impactful */}
          <p className="max-w-3xl text-xl sm:text-2xl font-light leading-relaxed">
            A trusted network of{" "}
            <b>shipping, forwarding, and custom clearing agencies</b>, powering
            maritime operations across the{" "}
            <b>East Mediterranean and North African regions</b>.
          </p>
        </div>
      </div>

      {/* ========================================================
        II. SERVICES SECTION - UI/UX Improvements
        ========================================================
      */}
      <section className="py-6 md:py-12 bg-gray-50">
        <div className="custom-container">
          {/* Section Header (Unchanged, already well-structured) */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Core Maritime Services
          </h2>

          {/* Services Layout: Using Flexbox for responsiveness */}
          <div className="flex flex-wrap justify-between gap-y-8">
            {/* - flex-wrap: Allows items to wrap onto the next line.
              - justify-between: Pushes the items to the edges, creating equal empty space 
                between them for a clean layout, especially for 2 or 4 items per row.
              - gap-y-8: Ensures consistent vertical spacing between wrapped rows.
              
              NOTE: Horizontal spacing will be managed by justify-between AND the 
              ServiceCard's dynamic width calculation below.
            */}
            {services.length > 0 ? services.map((service:any) => (
              <ServiceCard key={service._id} service={service} />
            )): <></>}
          </div>
        </div>
      </section>
      <section className="bg-[#0A1C30] py-16 md:py-24 text-white">
        <div className="custom-container flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Text and Call to Action (Flex Item 1) */}
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <h2 className="text-xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Explore Our Global Reach on{" "}
              <span className="text-[#FF8C00]">Our Interactive Map</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Discover the ports, offices, and strategic partners in our
              extensive network across the East Med and North Africa.
            </p>

            {/* Improved CTA Button */}
            <button className="cursor-pointer inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-[#0A1C30] bg-[#FF8C00] hover:bg-orange-500 transition duration-300 shadow-md">
              Check Our Coverage
            </button>
          </div>

          {/* Right Column: Map Image (Flex Item 2) */}
          {/* IMPROVEMENT: Increased size, used 'fill' for better responsiveness, added styling */}
          <div className="lg:w-1/2 w-full relative h-64 md:h-80 lg:h-96 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-700">
            <Image
              src="/images/world-map.jpg"
              alt="World Map showing Alta Maritime's coverage"
              fill // Fills the container, must be used with relative/fixed parent
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {/* Subtle overlay to enhance map visibility */}
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
          </div>
        </div>
      </section>
      <section className="py-6">
        <ContactForm />
      </section>
    </main>
  );
}

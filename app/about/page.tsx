"use client";
import { useState, useEffect } from "react";
// import { useParams } from "next/navigation"; // Temporarily commented out due to environment resolution error
import axios from "axios";
import { Loader2, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Header from "../_components/Header";
import HomeInfoCard from "../_components/HomeInfoCard";
import Image from "next/image"; // Import Image component

// Using the same placeholder image from the home page for a consistent visual
import homeImage from "@/public/images/image4.jpeg";

export default function AboutUs() {
  const values = [
    {
      serviceName: "Integrity",
      summary: "Upholding the highest ethical standards in every transaction.",
      icon: <ArrowRight />,
    },
    {
      serviceName: "Excellence",
      summary: "Commitment to delivering superior service and results.",
      icon: <ArrowRight />,
    },
    {
      serviceName: "Sustainability",
      summary: "Promoting environmentally responsible maritime operations.",
      icon: <ArrowRight />,
    },
    {
      serviceName: "Innovation",
      summary: "Continuously improving logistics through technology.",
      icon: <ArrowRight />,
    },
    {
      serviceName: "Safety",
      summary: "Ensuring zero-incident operations across all our sites.",
      icon: <ArrowRight />,
    },
    {
      serviceName: "Collaboration",
      summary: "Fostering strong partnerships with clients and stakeholders.",
      icon: <ArrowRight />,
    },
  ];

  // Placeholder for an internal image to match the home page's section style
  // Assuming a similar path structure for other images
  const placeholderInternalImage = "/images/image6.jpeg";

  // Reusable gradient title classes
  const gradientTitleClasses = `
    gradient-text
    font-black
    tracking-tight
    bg-gradient-to-r
    from-[#00FFFF]
    to-[#0A1C30] pb-2
  `;

  return (
    <>
      <Header />
      <main className="min-h-screen">

        {/* 1. HERO SECTION for About Us - Consistent with Home.tsx Hero */}
        <div
          className={`relative h-[50vh] overflow-hidden flex items-center justify-center`}
        >
          {/* Background Image with Overlay */}
          <Image
            src={homeImage}
            alt="About Us background image of a maritime operation"
            fill
            priority
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
                Solutions Provider
              </span>
            </h1>
          </div>
        </div>
        
        {/* --- */}

        {/* 2. VISION & MISSION SECTION - Styled similarly to the 'Industrial Cargo Expertise' section on Home */}
        <section className="flex items-center custom-container justify-between py-20 gap-x-10 flex-wrap lg:flex-nowrap">
          {/* Image placeholder with offset/rotation style */}
          <div className="relative lg:w-1/2 mt-12 lg:mt-0">
            <Image
              src={placeholderInternalImage}
              alt="Team at work in a modern office"
              width={500}
              height={500}
              className="z-[20] w-full h-auto rounded-sm object-cover"
            />
            {/* The colored offset element */}
            <div className="z-[-1] rounded-sm bg-[#00FFFF]/15 w-full absolute inset-0 rotate-3"></div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-4xl sm:text-5xl font-extrabold flex flex-col my-2 text-[#0A1C30]">
              <span>Our Vision &</span>
              <span className={gradientTitleClasses}>Mission</span>
            </h2>
            <div className="mt-8 space-y-8">
              <div className="p-6 border-l-4 border-[#00FFFF] bg-gray-50 rounded-sm">
                <h3 className="text-2xl font-bold text-[#0A1C30] mb-2">Our Vision</h3>
                <p className="text-gray-700">
                  To be the global leader in heavy-lift and project logistics,
                  setting the benchmark for safety, reliability, and innovation
                  in maritime transport.
                </p>
              </div>
              <div className="p-6 border-l-4 border-[#00FFFF] bg-gray-50 rounded-sm">
                <h3 className="text-2xl font-bold text-[#0A1C30] mb-2">Our Mission</h3>
                <p className="text-gray-700">
                  We commit to delivering tailored, end-to-end logistics solutions
                  that enable our clients to execute complex industrial projects
                  seamlessly, on time, and within budget.
                </p>
              </div>
            </div>
          </div>
          
        </section>

        {/* --- */}

        {/* 3. OUR VALUES SECTION - Consistent with Home.tsx sections (e.g., Why Choose Alta Maritime) */}
        <section className="py-20 bg-gray-50">
          <div className="custom-container">
            <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 text-[#0A1C30]">
              Our Core Values
            </h2>
            <p className="text-center mb-12 text-gray-400 max-w-2xl mx-auto">
              The principles that guide our decisions, operations, and commitment to our global partners.
            </p>
            <div className="flex flex-wrap gap-5 items-stretch justify-evenly">
              {/* Use HomeInfoCard for consistent styling */}
              {values.map((v) => (
                <HomeInfoCard key={v.serviceName} service={v} icon={v.icon} />
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
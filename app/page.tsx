// pages/index.tsx (Home.tsx)
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import homeImage from "@/public/images/image4.jpeg"; // Assuming this is the ship image
import ServiceCard from "./_components/ServiceCard";
import ContactForm from "./_components/ContactForm";
import Header from "./_components/Header"; // This is the component you want to change
import axios from "axios";
import { ArrowRight } from "lucide-react";

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
  // ...

  return (
    <main className="min-h-screen">
      {/* 2. HEADER: Rendered at the top. The Header component itself handles the sticky/scroll logic. */}
      <Header />

      {/* 3. HERO SECTION: The image needs to sit right below (or behind) the header. */}
      <div
        className={`relative mt-[-80px] h-[100vh] md:h-[100vh] overflow-hidden flex items-center justify-center`}
      >
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

        {/* Hero Content: Add padding-top to compensate for the header when transparent */}
        <div className="absolute inset-0 flex flex-col justify-center custom-container z-10 text-white pt-16 md:pt-20">
          <p className="bg-gray-300/50 border border-gray-300 w-fit px-2 py-1 rounded-sm">
            GLOBAL MARITIME LOGISTICS
          </p>
          {/* Main Title: Bigger, bolder, and more distinct */}
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight flex flex-col">
            <span>Moving the World's </span>
            <span
              className="gradient-text 
                   font-black 
                   tracking-tight 
                   bg-gradient-to-r 
                   from-[#00FFFF] 
                   to-[#0A1C30] pb-2"
            >
              Heaviest Cargo
            </span>
          </h1>

          {/* Subtitle/Mission Statement: Readable and impactful */}
          <p className="max-w-3xl text-lg sm:text-xl font-light leading-relaxed flex flex-col">
            <span>
              Expert heavy lift solutions, break bulk shipping, and project
              logistics{" "}
            </span>
            <span>delivering industrial cargo anywhere in the world.</span>
          </p>
          <div className="my-2 flex items-center gap-3">
            <button className="border border-[#00FFFF] bg-[#00FFFF] px-5 py-2 rounded-sm font-semibold whitespace-nowrap text-[#0A1C30] flex items-center gap-1">
              Explore Services <ArrowRight className="text-md" />
            </button>
            <button className="px-5 py-2 rounded-sm font-semibold whitespace-nowrap text-white border border-white">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <section className="flex items-center custom-container justify-between py-10 gap-x-10">
        <div className="">
          <p className="rounded-sm bg-[#00FFFF]/15 w-fit px-3 py-1 text-[#00FFFF] ">
            Since 1994
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold flex flex-col">
            <span>Industrial Cargo</span>
            <span
              className="gradient-text 
                   font-black 
                   tracking-tight 
                   bg-gradient-to-r 
                   from-[#00FFFF] 
                   to-[#0A1C30] pb-2"
            >
              Expertise
            </span>
          </h2>
          <p className="text-md text-gray-700 mb-4">
            Alta Maritime has been a trusted partner in global maritime
            logistics for over three decades. We specialize in moving the
            world's most challenging cargo—from heavy industrial machinery to
            complete manufacturing facilities.
          </p>
          <p className="text-md text-gray-700 mb-4">
            Our comprehensive network spans major ports worldwide, supported by
            cutting-edge equipment and a team of logistics professionals who
            understand the complexity of break bulk and project cargo.
          </p>
          <div className="flex item-center gap-5">
            <div className="py-3">
              <h3 className="text-[#00FFFF] text-3xl font-medium">30+</h3>
              <p className="text-md text-gray-500">Years Experience</p>
            </div>
            <div className="py-3">
              <h3 className="text-[#00FFFF] text-3xl font-medium">2000+</h3>
              <p className="text-md text-gray-500">Projects Delivered</p>
            </div>
            <div className="py-3">
              <h3 className="text-[#00FFFF] text-3xl font-medium">45</h3>
              <p className="text-md text-gray-500">Global Ports</p>
            </div>
          </div>
        </div>
        <div className="relative min-w-1/2 min-h-full">
          <Image
            src="/images/image2.jpeg"
            alt="industry"
            width={200}
            height={200}
            className="z-[20] w-full h-full rounded-sm "
          ></Image>
          <div className="z-[-1] rounded-sm bg-[#00FFFF]/15 w-full absolute inset-0  rotate-3"></div>
        </div>
      </section>

      {/* ========================================================
        II. SERVICES SECTION - UI/UX Improvements
        ========================================================
      */}
      {/* 4. Services Section starts immediately after the Hero. */}
      <section className="py-6 md:py-12 bg-gray-50">
        {/* ... (rest of the services section remains the same) ... */}
        <div className="custom-container">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Core Maritime Services
          </h2>
          <div className="flex flex-wrap justify-between gap-y-8">
            {services.length > 0 ? (
              services.map((service: any, index: any) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  serviceIndex={index}
                />
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </section>

      {/* ... (rest of the component remains the same) ... */}
      <section className="bg-[#0A1C30] py-16 md:py-24 text-white">
        <div className="custom-container flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 w-full text-center lg:text-left">
            <h2 className="text-xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Explore Our Global Reach on{" "}
              <span className="text-[#FF8C00]">Our Interactive Map</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Discover the ports, offices, and strategic partners in our
              extensive network across the East Med and North Africa.
            </p>
            <button className="cursor-pointer inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-[#0A1C30] bg-[#FF8C00] hover:bg-orange-500 transition duration-300 shadow-md">
              Check Our Coverage
            </button>
          </div>
          <div className="lg:w-1/2 w-full relative h-64 md:h-80 lg:h-96 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-700">
            <Image
              src="/images/world-map.jpg"
              alt="World Map showing Alta Maritime's coverage"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
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

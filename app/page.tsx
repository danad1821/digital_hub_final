// pages/index.tsx (Home.tsx)
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import homeImage from "@/public/images/image4.jpeg"; // Assuming this is the ship image
import HomeInfoCard from "./_components/HomeInfoCard";
import ContactForm from "./_components/ContactForm";
import Header from "./_components/Header"; // This is the component you want to change
import axios from "axios";
import { ArrowRight } from "lucide-react";
import {
  Ship,
  Box,
  CloudLightning,
  Shield,
  Globe,
  Anchor,
  Globe2,
  Cog,
  Construction,
  Clock,
  Mail,
  Phone,
  Pin,
} from "lucide-react";

export default function Home() {
  const [services, setServices] = useState<any>([
    {
      icon: <Construction />,
      serviceName: "Heavy Lift Cargo",
      summary:
        "Specialized equipment and expertise for oversized and heavy industrial cargo up to 1000+ tons.",
    },
    {
      icon: <Box></Box>,
      serviceName: "Break Bulk Shipping",
      summary:
        "Efficient break bulk solutions for cargo that cannot fit in standard containers.",
    },
    {
      icon: <Globe></Globe>,
      serviceName: "Project Logistics",
      summary:
        "End-to-end logistics management for complex industrial and infrastructure projects.",
    },
    {
      icon: <Anchor />,
      serviceName: "Port Operations",
      summary:
        "Comprehensive port services including loading, unloading, and storage.",
    },
    {
      icon: <Cog />,
      serviceName: "Machinery Relocation",
      summary:
        "Safe transport and installation of industrial machinery and manufacturing equipment.",
    },
    {
      icon: <Ship />,
      serviceName: "Cargo Chartering",
      summary:
        "Flexible vessel chartering options tailored to your specific cargo requirements.",
    },
  ]);

  const [gallery, setGallery] = useState([
    "/images/image1.jpeg",
    "/images/image2.jpeg",
    "/images/image3.jpeg",
    "/images/image4.jpeg",
    "/images/image5.jpeg",
    "/images/image6.jpeg",
  ]);

  const companyStrengths = [
    {
      icon: <Globe />,
      serviceName: "Global Coverage",
      summary: "Strategic presence in major ports across six continents",
    },
    {
      icon: <Clock />,
      serviceName: "On-Time Delivery",
      summary: "98% on-time performance with real-time tracking",
    },
    {
      icon: <Ship />,
      serviceName: "Heavy Lift Expertise",
      summary: "30+ years specialized in oversized cargo handling",
    },
    {
      icon: <CloudLightning />,
      serviceName: "Modern Fleet",
      summary: "State-of-the-art vessels and handling equipment",
    },
    {
      icon: <Shield />,
      serviceName: "Safety Standards",
      summary: "ISO certified with zero-incident safety record",
    },
    {
      icon: <Cog />,
      serviceName: "Expert Team",
      summary: "Dedicated logistics professionals available 24/7",
    },
  ];

  // const getAllServices = async () => {
  //   try {
  //     const response = await axios.get("/api/services");
  //     setServices(response.data);
  //   } catch (error) {
  //     console.error("Error fetching services: ", error);
  //   }
  // };

  // useEffect(() => {
  //   getAllServices();
  // }, []);
  // // ...

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
          <div className="my-2 flex items-center gap-3 flex-wrap">
            <button className="border border-[#00FFFF] bg-[#00FFFF] px-5 py-2 rounded-sm font-semibold whitespace-nowrap text-[#0A1C30] flex items-center gap-1">
              Explore Services <ArrowRight className="text-md" />
            </button>
            <button className="px-5 py-2 rounded-sm font-semibold whitespace-nowrap text-white border border-white">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <section className="flex items-center custom-container justify-between py-20 gap-x-10 flex-wrap lg:flex-nowrap">
        <div className="">
          <p className="rounded-sm bg-[#00FFFF]/15 w-fit px-3 py-1 text-[#00FFFF] ">
            Since 1994
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold flex flex-col my-2">
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

      <section className=" py-20 bg-gray-50">
        <div className="custom-container">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Our Services
          </h2>
          <p className="text-center mb-8 text-gray-400">
            Comprehensive amritime logisitcs solutions tailored for the complex
            industrial cargo
          </p>
          <div className="flex flex-wrap gap-5 items-center justify-evenly">
            {services.slice(0, 6).map((s: any) => (
              <HomeInfoCard key={s.serviceName} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className=" py-20 ">
        <div className="custom-container">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Operations Gallery
          </h2>
          <p className="text-center mb-8 text-gray-400">
            See our capabilities in action across global maritime operations
          </p>
          <div className="flex flex-wrap gap-5 items-center justify-evenly">
            {gallery.slice(0, 6).map((s: any, index: any) => (
              <Image
                key={index}
                src={s}
                alt={s}
                width={100}
                height={100}
                className="w-[300px] h-[220px] rounded-sm shadow-md 
      hover:shadow-xl 
      transition 
      duration-300 
      hover:-translate-y-1 "
              />
            ))}
          </div>
        </div>
      </section>

      <section className=" py-20 bg-gray-50">
        <div className="custom-container">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Why Choose Alta Maritime
          </h2>
          <p className="text-center mb-8 text-gray-400">
            Industry-leading capabilities backed by decades of expertise
          </p>
          <div className="flex flex-wrap gap-5 items-center justify-evenly">
            {companyStrengths.map((s: any) => (
              <HomeInfoCard key={s.serviceName} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className=" py-20 bg-[#0A1C30]">
        <div className="custom-container">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4 text-white">
            Global Coverage
          </h2>
          <p className="text-center mb-8 text-gray-400">
            Strategically positioned across six continents to serve your
            logistics needs worldwide
          </p>
          <div></div>
        </div>
      </section>

      <section className="py-20 ">
        <div className="custom-container">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-4">
            Get In Touch
          </h2>
          <p className="text-center mb-8 text-gray-400">
            Ready to discuss your project? Contact us for a consultation and
            quote
          </p>
          <div className="flex flex-wrap">
            <div className="w-1/2">
              <div className="border-b border-gray-500">
                <h3 className="font-bold text-2xl mb-4">Contact Information</h3>
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="
                    bg-gradient-to-br from-blue-300 to-indigo-600
                    text-white
                    w-12 h-12
                    flex
                    items-center
                    justify-center
                    rounded-sm
                    mb-4
                    text-2xl
                  "
                  >
                    <Mail />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email</h4>
                    <p>info@altamaritime.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="
                    bg-gradient-to-br from-blue-300 to-indigo-600
                    text-white
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    rounded-sm
                    mb-4
                    text-2xl
                  "
                  >
                    <Phone />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Phone</h4>
                    <p>+1 (800) MARITIME</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="
                    bg-gradient-to-br from-blue-300 to-indigo-600
                    text-white
                    w-12
                    h-12
                    flex
                    items-center
                    justify-center
                    rounded-sm
                    mb-4
                    text-2xl
                  "
                  >
                    <Pin />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Headquarters</h4>
                    <p>Port of Rotterdam</p>
                    <p>3011 AD, Netherlands</p>
                  </div>
                </div>
              </div>
              <div className="">
                <h3 className="text-2xl my-4 font-bold">Regional Offices</h3>
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <p className="text-black">North America</p>
                    <p className="text-gray-500">Houston, Texas</p>
                  </div>
                  <div>
                    <p className="text-black">Asia Pacific</p>
                    <p className="text-gray-500">Singapore</p>
                  </div>
                  <div>
                    <p className="text-black">Middle East</p>
                    <p className="text-gray-500">Dubai, UAE</p>
                  </div>
                  <div>
                    <p className="text-black">South America</p>
                    <p className="text-gray-500">Santos, Brazil</p>
                  </div>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* <section className="py-6">
        <ContactForm />
      </section> */}
    </main>
  );
}

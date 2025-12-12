// pages/index.tsx (Home.tsx)
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BsBoxSeam } from "react-icons/bs";
import HomeInfoCard from "./_components/cards/HomeInfoCard";
import ContactForm from "./_components/ContactForm";
import Header from "./_components/Header";
import axios from "axios";
import {
  ArrowRight,
  Loader2,
  Mail,
  Phone,
  Pin,
} from "lucide-react";
import { LuShip } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { getAllGalleryImages } from "./_actions/gallery";
import InteractiveMap from "./_components/InteractiveMap";
import { IoCalendarClearOutline } from "react-icons/io5";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<any>([]);
  const [pageData, setPageData] = useState<any>(null);

  // --- SCROLL HOOKS FOR HERO SECTION (NEW PARALLAX LOGIC) ---
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityFade = useTransform(scrollY, [0, 300], [1, 0]);

  // Icon mapping for services (Limited set - should be dynamic from API)
  const icons = [
    <BsBoxSeam key="icon-1" />,
    <LuShip key="icon-2" />,
    <IoCalendarClearOutline key="icon-3" />,
  ];

  const [gallery, setGallery] = useState<any>([]);

  const getAllImages = async () => {
    const allImages: any = await getAllGalleryImages();
    setGallery(allImages);
  };

  const getAllServices = async () => {
    try {
      const response = await axios.get("/api/services");
      setServices(response.data.services || response.data);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  // 1. COMBINE FETCHING LOGIC INTO A SINGLE ASYNC FUNCTION
  const initDataFetch = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch critical page data first
      const pageResponse = await axios.get(`/api/pages/home`);
      setPageData(pageResponse.data.data);
      console.log("Home: ", pageResponse);

      // 2. Fetch auxiliary data (can be parallelized)
      await Promise.all([getAllImages(), getAllServices()]);
    } catch (error) {
      console.error("Error fetching initial page data:", error);
    } finally {
      // 3. CRUCIAL: Set loading to false only after all async operations complete
      setIsLoading(false);
    }
  };

  // 2. UPDATE useEffect TO CALL THE COMBINED FUNCTION
  useEffect(() => {
    initDataFetch();
  }, []);

  // 3. CONDITIONAL RENDER: This check is now reliable
  if (isLoading && !pageData) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader2 className="w-10 h-10 text-[#00D9FF] animate-spin" />
      </div>
    );
  }

  // Fallback for failed fetch (pageData is null, but not loading)
  if (!pageData) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p className="text-red-500 text-xl">
          Error loading page content. Please try again.
        </p>
      </div>
    );
  }

  // Define transition props for general fade/slide in
  const viewTransition = { duration: 0.7, ease: "easeOut" };
  const viewportProps = { once: true, amount: 0.2 };

  // The rest of the page rendering remains the same, but is only executed
  // when pageData is fully loaded.
  return (
    <main className="min-h-screen">
      {/* 2. HEADER: Rendered at the top. */}
      <Header />

      {/* --- HERO SECTION (NEW PARALLAX AND FADE EFFECT) --- */}
      <section className="relative h-screen w-full overflow-hidden mt-[-100px]">
        {/* Parallax Background */}
        <motion.div
            style={{ y: yParallax }}
            className="absolute inset-0 top-0 left-0 right-0 h-[calc(100vh+150px)]"
        >
            <Image
                src={`/api/images/${pageData?.sections[0].data.image_ref}`}
                alt="Large cargo ship sailing on the sea"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
        </motion.div>
        {/* Content with Fade Out */}
        <motion.div
            style={{ opacity: opacityFade }}
            className="absolute inset-0 z-20 h-full flex items-center justify-center mt-[-80px]" // Adjust for header
        >
          <div className="custom-container">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl pt-20"
            >
              {/* ALTA MARITIME Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-6 inline-block"
              >
                <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm tracking-widest rounded-sm">
                    ALTA MARITIME
                </span>
              </motion.div>
        
              {/* Title (Mapped from pageData) */}
              <h1 className="text-white text-6xl sm:text-7xl font-bold mb-6 tracking-tight">
                {pageData?.sections[0].title.split(" ").slice(0, 3).join(" ")}{" "}
                <br />
                <span className="gradient-text font-black tracking-tight pb-3">
                  {pageData?.sections[0].title.split(" ").slice(3).join(" ")}
                </span>
              </h1>
        
              {/* Subtitle/Description (Mapped from pageData) */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-white/90 text-xl mb-10 max-w-2xl font-light leading-relaxed"
              >
                {pageData?.sections[0].subtitle}
              </motion.p>
              {/* Buttons (Mapped from pageData) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                {/* Button 1: Explore Services */}
                <button
                    className="text-md border border-[#00D9FF] bg-[#00D9FF] px-8 py-4 rounded-sm font-semibold whitespace-nowrap text-[#0A1628] flex items-center gap-1 hover:brightness-70 transition duration-300 hover:scale-[1.02]"
                    onClick={() => router.push(pageData?.sections[0].data.button1_link || "/services")}
                >
                    {pageData?.sections[0].data.button1_text || "Explore Services"} <ArrowRight className="text-md" />
                </button>
                {/* Button 2: Contact Us */}
                <button
                    className="px-8 py-4 rounded-sm font-semibold whitespace-nowrap text-white border border-white hover:bg-white hover:text-black transition duration-300 hover:scale-[1.02]"
                    onClick={() => router.push(pageData?.sections[0].data.button2_link || "/contact")}
                >
                    {pageData?.sections[0].data.button2_text || "Contact Us"}
                </button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        {/* Scroll Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* 4. ABOUT SECTION (Sections[1]) - Applied motion from App.tsx */}
      <section className="flex items-center custom-container justify-between py-24 gap-x-10 flex-wrap lg:flex-nowrap">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className=""
        >
          <p className="rounded-sm bg-[#00D9FF]/15 w-fit px-3 py-1 text-[#00D9FF] ">
            Since 1994
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold flex flex-col my-2">
            <span>
              {pageData?.sections[1].title.split(" ").slice(0, 2).join(" ")}
            </span>
            <span
              className="gradient-text 
font-black 
tracking-tight 
 pb-2 "
            >
              {pageData?.sections[1].title.split(" ").slice(2).join(" ")}
            </span>
          </h2>
          <p className="text-xl text-gray-700 mb-4">
            {pageData?.sections[1].subtitle.split(".").slice(0, 2).join(". ")}.
          </p>
          <p className="text-xl text-gray-700 mb-4">
            {pageData?.sections[1].subtitle.split(".").slice(2).join(". ")}
          </p>
          <div className="flex item-center gap-5">
            {pageData?.sections[1].data.stats_list.map((s: any) => (
              <div className="py-3" key={s.label}>
                <h3 className="text-[#00D9FF] text-3xl font-medium">
                  {s.value}
                </h3>
                <p className="text-md text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        {/* Note: App.tsx uses useScroll for image scale. We'll use a simple right slide */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative min-w-1/2 min-h-full"
        >
          <Image
            src={`/api/images/${pageData?.sections[1].data.image_ref}`}
            alt="industry"
            width={200}
            height={200}
            className="z-[20] w-full h-full rounded-sm "
          ></Image>
          <div className="z-[-1] rounded-sm bg-[#00D9FF]/15 w-full absolute inset-0 rotate-3"></div>
        </motion.div>
      </section>

      {/* 5. SERVICES SECTION (Sections[2]) - Applied motion from App.tsx */}
      <section className=" py-20 bg-gray-50">
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              {pageData?.sections[2].title}
            </h2>
            <p className="mb-8 text-gray-400 text-lg">
              {pageData?.sections[2].subtitle}
            </p>
          </motion.div>
          
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-10 h-10 text-[#00D9FF] animate-spin" />
            </div>
          )}
          <div className="flex flex-wrap gap-5 items-center justify-evenly">
            {services.slice(0, 6).map((s: any, index: any) => (
              <motion.div
                key={s.serviceName}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <HomeInfoCard
                  service={s}
                  icon={icons[index % icons.length]} // Using modulo for safety
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GALLERY SECTION (Sections[4]) - UNCOMMENTED and Applied motion from App.tsx */}
      <section className=" py-20 ">
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              {pageData?.sections[4].title}
            </h2>
            <p className="mb-8 text-gray-400 text-lg">
              {pageData?.sections[4].subtitle}
            </p>
          </motion.div>
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-10 h-10 text-[#00D9FF] animate-spin" />
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.slice(0, 6).map((img: any, index: number) => (
              <motion.div
                key={img._id.toString()}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-sm shadow-lg group cursor-pointer h-80"
              >
                <img
                  src={`/api/images/${img.image.toString()}`}
                  alt={`Gallery item ${img.title}`}
                  className="w-full h-full object-cover bg-gray-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white flex flex-col justify-end text-2xl" ><p className="py-3 px-3">{img.title}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Original Sections[3] - Omitted as per App.tsx structure, but could be added back with motion */}

      {/* 7. INTERACTIVE MAP SECTION (Sections[5]) */}
      <section className=" py-20 bg-[#0A1628]">
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              {pageData?.sections[5].title}
            </h2>
            <p className="mb-8 text-gray-400 text-lg">
              {pageData?.sections[5].subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <InteractiveMap />
          </motion.div>
        </div>
      </section>

      {/* 8. CONTACT SECTION (Sections[6]) - Applied motion from App.tsx */}
      <section className="py-20 ">
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              {pageData?.sections[6].title}
            </h2>
            <p className="mb-8 text-gray-400 text-lg">
              {pageData?.sections[6].subtitle}
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center items-center">
            {/* Contact Info (Left Side) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="min-w-1/2"
            >
              <div className="border-b border-gray-500">
                <h3 className="font-bold text-3xl mb-4">Contact Information</h3>
                <div className="flex items-start gap-3 mb-4 transition 
      duration-300 
 hover:translate-x-1">
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
                    <h4 className="font-bold text-2xl">Email</h4>
                    <a href="mailto:chartering@altamaritime.com" className="cursor-pointer hover:text-[#00D9FF]">chartering@altamaritime.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4 transition 
      duration-300 
 hover:translate-x-1">
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
                    <h4 className="font-bold text-2xl">Phone</h4>
                    <a href="tel:+1800maritime" className="cursor-pointer hover:text-[#00D9FF]">+1 (800) MARITIME</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 mb-4 transition 
      duration-300 
 hover:translate-x-1">
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
                    <h4 className="font-bold text-2xl">Headquarters</h4>
                    <p>Port of Rotterdam</p>
                    <p>3011 AD, Netherlands</p>
                  </div>
                </div>
              </div>
              <div className="">
                <h3 className="text-3xl my-4 font-bold">Regional Offices</h3>
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
            </motion.div>
            {/* Contact Form (Right Side) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="min-w-1/2"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
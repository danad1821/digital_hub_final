"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { BsBoxSeam } from "react-icons/bs";
import HomeInfoCard from "./_components/cards/HomeInfoCard";
import ContactForm from "./_components/ContactForm";
import Header from "./_components/Header";
import axios from "axios";
import { ArrowRight, Loader2, Mail, Phone, Pin } from "lucide-react";
import { LuShip } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { getAllGalleryImages } from "./_actions/gallery";
// REMOVED: import InteractiveMap from "./_components/InteractiveMap";
import { IoCalendarClearOutline } from "react-icons/io5";

import { motion, useScroll, useTransform } from "framer-motion";

// --- START: Dynamic Import for InteractiveMap (THE FIX) ---
import dynamic from "next/dynamic";

const DynamicInteractiveMap = dynamic(
  () => import('./_components/InteractiveMap'),
  {
    // THIS IS THE CRITICAL FIX: prevents the map component from running on the server
    ssr: false, 
    loading: () => (
      <div className="flex justify-center items-center w-full h-96 bg-gray-100 rounded-sm">
        <Loader2 className="w-8 h-8 text-[#0A1C30] animate-spin" />
      </div>
    ),
  }
);
// --- END: Dynamic Import ---


export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<any>([]);
  const [pageData, setPageData] = useState<any>(null);
  const [locations, setLocations] = useState<any>([]);

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

  // 1. Memoized data fetching helpers using useCallback
  const getAllImages = useCallback(async () => {
    const allImages: any = await getAllGalleryImages();
    setGallery(allImages);
  }, []); // Dependencies: None (setGallery is a stable setter)

  const getAllServices = useCallback(async () => {
    try {
      const response = await axios.get("/api/services");
      setServices(response.data.services || response.data);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  }, []); // Dependencies: None (setServices is a stable setter)

  const getAllLocations = useCallback(async () => {
    try {
      const response = await axios.get("/api/locations");
      setLocations(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching locations: ", error);
    }
  }, []); // Dependencies: None (setLocations is a stable setter)

  // 1. COMBINE FETCHING LOGIC INTO A SINGLE ASYNC FUNCTION (Memoized)
  const initDataFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch critical page data first
      const pageResponse = await axios.get(`/api/pages/home`);
      setPageData(pageResponse.data.data);
      console.log("Home: ", pageResponse);

      // 2. Fetch auxiliary data (can be parallelized)
      // Call the memoized helper functions
      await Promise.all([getAllImages(), getAllServices(), getAllLocations()]);
    } catch (error) {
      console.error("Error fetching initial page data:", error);
    } finally {
      // 3. CRUCIAL: Set loading to false only after all async operations complete
      setIsLoading(false);
    }
  }, [getAllImages, getAllServices, getAllLocations]); // Dependencies are the memoized helpers

  // 2. UPDATE useEffect TO CALL THE COMBINED FUNCTION
  useEffect(() => {
    initDataFetch();
  }, [initDataFetch]); // Dependency: The memoized function

  // 3. Memoized values for complex JSX rendering logic (string splitting)

  // Memoize Hero Section Title Split
  const heroTitleParts = useMemo(() => {
    const title = pageData?.sections[0]?.title || "";
    const words = title.split(" ");
    return {
      firstPart: words.slice(0, 3).join(" "),
      secondPart: words.slice(3).join(" "),
    };
  }, [pageData?.sections[0]?.title]);

  // Memoize About Section Title and Subtitle Split
  const aboutSectionParts = useMemo(() => {
    const title = pageData?.sections[1]?.title || "";
    const subtitle = pageData?.sections[1]?.subtitle || "";

    if (!title || !subtitle) return { titleFirstPart: "", titleSecondPart: "", subtitlePart1: "", subtitlePart2: "" };

    const titleWords = title.split(" ");
    const subtitleSentences = subtitle.split(".");

    // Reconstruct the first subtitle part and ensure it ends with a period if it was present
    const sub1 = subtitleSentences.slice(0, 2).join(". ");
    const subtitlePart1 = sub1 ? sub1 + (subtitleSentences.length > 2 ? "." : "") : "";
    const subtitlePart2 = subtitleSentences.slice(2).filter((s:any) => s.trim().length > 0).join(". ");

    return {
      titleFirstPart: titleWords.slice(0, 2).join(" "),
      titleSecondPart: titleWords.slice(2).join(" "),
      subtitlePart1: subtitlePart1,
      subtitlePart2: subtitlePart2,
    };
  }, [pageData?.sections[1]?.title, pageData?.sections[1]?.subtitle]);

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

  // The rest of the page rendering remains the same, but is only executed
  // when pageData is fully loaded.
  return (
    <main className="min-h-screen">
      {/* 2. HEADER: Rendered at the top. */}
      <Header />

      {/* --- HERO SECTION (NEW PARALLAX AND FADE EFFECT) --- */}
      {/* ADDED: min-h-screen and responsive font sizes */}
      <section className="relative h-[85vh] md:h-screen w-full overflow-hidden mt-[-100px] sm:mt-[-110px]">
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
          className="absolute z-20 h-full flex  items-center justify-center custom-container pt-10 px-4" // Added px-4 for mobile padding
        >
          <div className="">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl pt-30 "
            >
              {/* ALTA MARITIME Label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-4 inline-block" // Adjusted mb
              >
                <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm tracking-widest rounded-sm">
                  ALTA MARITIME
                </span>
              </motion.div>

              {/* Title (Using memoized parts) */}
              <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 tracking-tight max-w-2xl ">
                {" "}
                {/* Responsive font sizes */}
                {heroTitleParts.firstPart}{" "}
                <br className="block sm:hidden" />{" "}
                {/* Line break on small screens */}
                <span className="gradient-text font-black tracking-tight pb-3">
                  {heroTitleParts.secondPart}
                </span>
              </h1>

              {/* Subtitle/Description (Mapped from pageData) */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-white/90 text-md sm:text-xl mb-8 max-w-2xl font-light leading-relaxed" // Responsive font size
              >
                {pageData?.sections[0].subtitle}
              </motion.p>
              {/* Buttons (Mapped from pageData) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4" // Stack buttons on mobile
              >
                {/* Button 1: Explore Services */}
                <button
                  className="text-md border border-[#00D9FF] bg-[#00D9FF] px-6 py-3 sm:px-8 sm:py-4 rounded-sm font-semibold whitespace-nowrap text-[#0A1628] flex items-center justify-center gap-1 hover:brightness-70 transition duration-300 hover:scale-[1.02]" // Responsive padding/centering
                  onClick={() =>
                    router.push(
                      pageData?.sections[0].data.button1_link || "/services"
                    )
                  }
                >
                  {pageData?.sections[0].data.button1_text ||
                    "Explore Services"}{" "}
                  <ArrowRight className="text-md" />
                </button>
                {/* Button 2: Contact Us */}
                <button
                  className="px-6 py-3 sm:px-8 sm:py-4 rounded-sm font-semibold whitespace-nowrap text-white border border-white hover:bg-white hover:text-black transition duration-300 hover:scale-[1.02] flex items-center justify-center" // Responsive padding/centering
                  onClick={() =>
                    router.push(
                      pageData?.sections[0].data.button2_link || "/contact"
                    )
                  }
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
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:block" // Hide on small screens to save space
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* 4. ABOUT SECTION (Sections[1]) */}
      {/* CHANGED: flex-col on small screens, adjust padding and gaps */}
      <section className="flex items-center custom-container justify-between py-16 md:py-24 gap-y-12 gap-x-10 flex-col lg:flex-row">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:max-w-[50%]" // Constrain width on large screens
        >
          <p className="rounded-sm bg-[#00D9FF]/15 w-fit px-3 py-1 text-[#00D9FF] ">
            Since 1994
          </p>
          {/* Title (Using memoized parts) */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold flex flex-col my-2">
            {" "}
            {/* Responsive font size */}
            <span>
              {aboutSectionParts.titleFirstPart}
            </span>
            <span className="gradient-text font-black tracking-tight pb-2">
              {aboutSectionParts.titleSecondPart}
            </span>
          </h2>
          {/* Subtitle (Using memoized parts) */}
          <p className="text-lg text-gray-700 mb-4">
            {" "}
            {/* Responsive font size */}
            {aboutSectionParts.subtitlePart1}
          </p>
          <p className="text-lg text-gray-700 mb-6">
            {" "}
            {/* Responsive font size */}
            {aboutSectionParts.subtitlePart2}
          </p>
          <div className="flex item-center gap-5 sm:gap-10 justify-between sm:justify-start">
            {" "}
            {/* More gap on sm, justify on mobile */}
            {pageData?.sections[1].data.stats_list.map((s: any) => (
              <div className="py-3" key={s.label}>
                <h3 className="text-[#00D9FF] text-2xl sm:text-3xl font-medium">
                  {" "}
                  {/* Responsive font size */}
                  {s.value}
                </h3>
                <p className="text-sm sm:text-md text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full lg:w-[50%] min-h-full" // Changed min-w-1/2 to w-full and added lg:w-[40%]
        >
          <Image
            src={`/api/images/${pageData?.sections[1].data.image_ref}`}
            alt="industry"
            width={600} // Set a fixed width/height for better image optimization
            height={400} // Set a fixed width/height for better image optimization
            className="z-[20] w-full h-full rounded-sm object-cover aspect-[4/3] lg:aspect-auto" // Added object-cover and aspect ratio for consistency
          ></Image>
          <div className="z-[-1] rounded-sm bg-[#00D9FF]/15 w-full absolute inset-0 rotate-3"></div>
        </motion.div>
      </section>

      {/* 5. SERVICES SECTION (Sections[2]) */}
      <section className="py-16 md:py-20 bg-gray-50">
        {" "}
        {/* Responsive padding */}
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-3 sm:mb-4">
              {" "}
              {/* Responsive font size */}
              {pageData?.sections[2].title}
            </h2>
            <p className="mb-8 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {" "}
              {/* Responsive font size and centering */}
              {pageData?.sections[2].subtitle}
            </p>
          </motion.div>

          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-10 h-10 text-[#00D9FF] animate-spin" />
            </div>
          )}
          {/* CHANGED: grid layout for better service card responsiveness */}
          <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 justify-center">
            {services.slice(0, 6).map((s: any, index: any) => (
              <motion.div
                key={s.serviceName}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full flex items-center justify-center" // HomeInfoCard should handle its own width
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

      {/* 6. GALLERY SECTION (Sections[4]) */}
      <section className="py-16 md:py-20">
        {" "}
        {/* Responsive padding */}
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-3 sm:mb-4">
              {" "}
              {/* Responsive font size */}
              {pageData?.sections[4].title}
            </h2>
            <p className="mb-8 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {" "}
              {/* Responsive font size and centering */}
              {pageData?.sections[4].subtitle}
            </p>
          </motion.div>
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-10 h-10 text-[#00D9FF] animate-spin" />
            </div>
          )}
          {/* Grid layout is already good, but ensured gap is responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {gallery.slice(0, 6).map((img: any, index: number) => (
              <motion.div
                key={img._id.toString()}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-sm shadow-lg group cursor-pointer h-60 sm:h-80" // Responsive height
              >
                <img
                  src={`/api/images/${img.image.toString()}`}
                  alt={`Gallery item ${img.title}`}
                  className="w-full h-full object-cover bg-gray-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white flex flex-col justify-end text-lg sm:text-2xl">
                  <p className="py-3 px-3">{img.title}</p>
                </div>{" "}
                {/* Responsive font size and opacity */}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE MAP SECTION (Sections[5]) */}
      <section className="py-16 md:py-20 bg-[#0A1628]">
        {" "}
        {/* Responsive padding */}
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 text-white">
              {" "}
              {/* Responsive font size */}
              {pageData?.sections[5].title}
            </h2>
            <p className="mb-8 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {" "}
              {/* Responsive font size and centering */}
              {pageData?.sections[5].subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* CORRECTED: Use the dynamically imported component */}
            <DynamicInteractiveMap />
          </motion.div>
        </div>
      </section>

      {/* 8. CONTACT SECTION (Sections[6]) */}
      <section className="py-16 md:py-20">
        {" "}
        {/* Responsive padding */}
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-3 sm:mb-4">
              {" "}
              {/* Responsive font size */}
              {pageData?.sections[6].title}
            </h2>
            <p className="mb-8 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {" "}
              {/* Responsive font size and centering */}
              {pageData?.sections[6].subtitle}
            </p>
          </motion.div>
          {/* CHANGED: Stack on small screens, two columns on medium screens and up */}
          <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-12">
            {/* Contact Info (Left Side) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2" // Full width on mobile, 50% on large screens
            >
              <div className="border-b border-gray-200 pb-8 mb-8">
                {" "}
                {/* Adjusted border for cleaner look */}
                <h3 className="font-bold text-2xl sm:text-3xl mb-6">
                  Contact Information
                </h3>{" "}
                {/* Responsive font size */}
                {/* Contact Items */}
                <div className="space-y-6">
                  {/* Mail */}
                  <div className="flex items-start gap-3 transition duration-300 hover:translate-x-1">
                    <div className="bg-gradient-to-br from-blue-300 to-indigo-600 text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-sm text-xl sm:text-2xl flex-shrink-0">
                      <Mail />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl sm:text-2xl">Email</h4>
                      <a
                        href="mailto:chartering@altamaritime.com"
                        className="text-gray-600 hover:text-[#00D9FF] text-base"
                      >
                        chartering@altamaritime.com
                      </a>
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex items-start gap-3 transition duration-300 hover:translate-x-1">
                    <div className="bg-gradient-to-br from-blue-300 to-indigo-600 text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-sm text-xl sm:text-2xl flex-shrink-0">
                      <Phone />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl sm:text-2xl">Phone</h4>
                      <a
                        href="tel:+1800maritime"
                        className="text-gray-600 hover:text-[#00D9FF] text-base"
                      >
                        +1 (800) MARITIME
                      </a>
                    </div>
                  </div>
                  {/* Headquarters */}
                  <div className="flex items-start gap-3 transition duration-300 hover:translate-x-1">
                    <div className="bg-gradient-to-br from-blue-300 to-indigo-600 text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-sm text-xl sm:text-2xl flex-shrink-0">
                      <Pin />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl sm:text-2xl">
                        Headquarters
                      </h4>
                      <p className="text-gray-600 text-base">
                        Port of Rotterdam
                      </p>
                      <p className="text-gray-600 text-base">
                        3011 AD, Netherlands
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <h3 className="text-2xl sm:text-3xl my-4 font-bold">
                  Regional Offices
                </h3>{" "}
                {/* Responsive font size */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {/* Grid for office list */}
                  {locations.map((l: any) => (
                    <div key={l.country}>
                      <p className="text-black font-semibold text-lg">
                        {l.country}
                      </p>
                      <p className="text-gray-500 text-md">{l.name} Office</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            {/* Contact Form (Right Side) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 mt-8 lg:mt-0" // Full width on mobile, 50% on large screens, spacing adjusted
            >
              {/* Assuming ContactForm is already responsive or uses basic inputs */}
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
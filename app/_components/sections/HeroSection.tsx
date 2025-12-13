// src/app/_components/sections/HeroSection.tsx
import Image from "next/image";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PageSectionData, ScrollHandler } from "../../_types";

type HeroSectionProps = {
  sectionData: PageSectionData;
  scrollToSection: ScrollHandler;
};

export default function HeroSection({
  sectionData,
  scrollToSection,
}: HeroSectionProps) {
  // SCROLL HOOKS FOR PARALLAX
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityFade = useTransform(scrollY, [0, 300], [1, 0]);

  // Logic to split the title (can be moved to a custom hook if reused)
  const heroTitleParts = useMemo(() => {
    const title = sectionData.title || "";
    const words = title.split(" ");
    return {
      firstPart: words.slice(0, 3).join(" "),
      secondPart: words.slice(3).join(" "),
    };
  }, [sectionData.title]);

  return (
    <section className="relative h-[85vh] md:h-screen w-full overflow-hidden mt-[-100px] sm:mt-[-110px]">
      {/* Parallax Background */}
      <motion.div
        style={{ y: yParallax }}
        className="absolute inset-0 top-0 left-0 right-0 h-[calc(100vh+150px)]"
      >
        <Image
          src={`/api/images/${sectionData.data.image_ref}`}
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
        className="absolute z-20 h-full flex items-center justify-center custom-container px-4"
      >
        <div className="">
          {/* ... Animation wrappers and content ... */}
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
              className="mb-4 inline-block"
            >
              <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm tracking-widest rounded-sm">
                ALTA MARITIME
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-bold mb-4 tracking-tight max-w-2xl ">
              {" "}
              {heroTitleParts.firstPart} <br className="block sm:hidden" />{" "}
              <span className="gradient-text font-black tracking-tight pb-3">
                {heroTitleParts.secondPart}
              </span>
            </h1>

            {/* Subtitle/Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-white/90 text-md sm:text-xl mb-8 max-w-2xl font-light leading-relaxed"
            >
              {sectionData.subtitle}
            </motion.p>
            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* Button 1: Explore Services */}
              <button
                className="text-md border border-[#00D9FF] bg-[#00D9FF] px-6 py-3 sm:px-8 sm:py-4 rounded-sm font-semibold whitespace-nowrap text-[#0A1628] flex items-center justify-center gap-1 hover:brightness-70 transition duration-300 hover:scale-[1.02]"
                onClick={() => scrollToSection("services")}
              >
                {sectionData.data.button1_text || "Explore Services"}{" "}
                <ArrowRight className="text-md" />
              </button>
              {/* Button 2: Contact Us */}
              <button
                className="px-6 py-3 sm:px-8 sm:py-4 rounded-sm font-semibold whitespace-nowrap text-white border border-white hover:bg-white hover:text-[#2A3544] transition duration-300 hover:scale-[1.02] flex items-center justify-center"
                onClick={() => scrollToSection("contact")}
              >
                {sectionData.data.button2_text || "Contact Us"}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
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
  );
}
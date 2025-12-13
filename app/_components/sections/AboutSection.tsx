// src/app/_components/sections/AboutSection.tsx
import { forwardRef, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PageSectionData } from "../../_types";

type AboutSectionProps = {
  sectionData: PageSectionData;
};

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>(
  ({ sectionData }, ref) => {
    // Memoize About Section Title and Subtitle Split
    const aboutSectionParts = useMemo(() => {
      const title = sectionData.title || "";
      const subtitle = sectionData.subtitle || "";

      if (!title || !subtitle)
        return {
          titleFirstPart: "",
          titleSecondPart: "",
          subtitlePart1: "",
          subtitlePart2: "",
        };

      const titleWords = title.split(" ");
      const subtitleSentences = subtitle.split(".");

      // Reconstruct the first subtitle part and ensure it ends with a period if it was present
      const sub1 = subtitleSentences.slice(0, 2).join(". ");
      const subtitlePart1 = sub1
        ? sub1 + (subtitleSentences.length > 2 ? "." : "")
        : "";
      const subtitlePart2 = subtitleSentences
        .slice(2)
        .filter((s) => s.trim().length > 0)
        .join(". ");

      return {
        titleFirstPart: titleWords.slice(0, 2).join(" "),
        titleSecondPart: titleWords.slice(2).join(" "),
        subtitlePart1: subtitlePart1,
        subtitlePart2: subtitlePart2,
      };
    }, [sectionData.title, sectionData.subtitle]);

    const statsList = sectionData.data.stats_list || [];

    return (
      <section
        ref={ref}
        id="about"
        className="flex items-center custom-container justify-between py-16 md:py-24 gap-y-12 gap-x-10 flex-col lg:flex-row"
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:max-w-[50%]"
        >
          <p className="rounded-sm bg-[#00D9FF]/15 w-fit px-3 py-1 text-[#00D9FF] ">
            Since 1994
          </p>
          {/* Title (Using memoized parts) */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold flex flex-col my-2">
            <span>{aboutSectionParts.titleFirstPart}</span>
            <span className="gradient-text font-black tracking-tight pb-2">
              {aboutSectionParts.titleSecondPart}
            </span>
          </h2>
          {/* Subtitle (Using memoized parts) */}
          <p className="text-lg text-gray-700 mb-4">
            {aboutSectionParts.subtitlePart1}
          </p>
          <p className="text-lg text-gray-700 mb-6">
            {aboutSectionParts.subtitlePart2}
          </p>
          <div className="flex item-center gap-5 sm:gap-10 justify-between sm:justify-start">
            {statsList.map((s) => (
              <div className="py-3" key={s.label}>
                <h3 className="text-[#00D9FF] text-2xl sm:text-3xl font-medium">
                  {s.value}
                </h3>
                <p className="text-sm sm:text-md text-[#2A3544]">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full lg:w-[50%] min-h-full"
        >
          <Image
            src={`/api/images/${sectionData.data.image_ref}`}
            alt="industry"
            width={600}
            height={400}
            className="z-[20] w-full h-full rounded-sm object-cover aspect-[4/3] lg:aspect-auto"
          ></Image>
          <div className="z-[-1] rounded-sm bg-[#00D9FF]/15 w-full absolute inset-0 rotate-3"></div>
        </motion.div>
      </section>
    );
  }
);

AboutSection.displayName = "AboutSection";

export default AboutSection;
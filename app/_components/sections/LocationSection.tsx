// src/app/_components/sections/LocationsSection.tsx
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { PageSectionData } from "../../_types";
import { Loader2 } from "lucide-react";

// --- START: Dynamic Import for InteractiveMap (The original FIX) ---
import dynamic from "next/dynamic";

const DynamicInteractiveMap = dynamic(
  () => import("../InteractiveMap"),
  {
    // CRITICAL FIX: prevents the map component from running on the server
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center w-full h-96 bg-gray-100 rounded-sm">
        <Loader2 className="w-8 h-8 text-[#0A1C30] animate-spin" />
      </div>
    ),
  }
);
// --- END: Dynamic Import ---

type LocationsSectionProps = {
  sectionData: PageSectionData;
};

const LocationsSection = forwardRef<HTMLDivElement, LocationsSectionProps>(
  ({ sectionData }, ref) => {
    return (
      <section
        ref={ref}
        id="locations"
        className="py-16 md:py-20 bg-[#0A1628]"
      >
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-extrabold text-4xl lg:text-5xl mb-3 sm:mb-4 text-white">
              {sectionData.title}
            </h2>
            <p className="mb-8 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {sectionData.subtitle}
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
    );
  }
);

LocationsSection.displayName = "LocationsSection";

export default LocationsSection;
// src/app/_components/sections/GallerySection.tsx
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { PageSectionData, GalleryImage } from "../../_types";

type GallerySectionProps = {
  sectionData: PageSectionData;
  gallery: GalleryImage[];
};

const GallerySection = forwardRef<HTMLDivElement, GallerySectionProps>(
  ({ sectionData, gallery }, ref) => {
    return (
      <section ref={ref} id="gallery" className="py-16 md:py-20">
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-bold text-5xl lg:text-[3.4rem] mb-3 sm:mb-4">
              {sectionData.title}
            </h2>
            <p className="mb-8 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {sectionData.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {gallery.slice(0, 6).map((img, index) => (
              <motion.div
                key={img._id.toString()}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-sm shadow-lg group cursor-pointer h-60 sm:h-80"
              >
                {/* Note: The original code used a standard <img> tag for the gallery, 
                    which is fine if optimization is handled elsewhere, but Image 
                    from next/image is generally preferred for performance. 
                    I'll keep the original structure for direct refactoring. */}
                <img
                  src={`/api/images/${img.image}`}
                  alt={`Gallery item ${img.title}`}
                  className="w-full h-full object-cover bg-gray-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white flex flex-col justify-end text-lg sm:text-2xl">
                  <p className="py-3 px-3">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

GallerySection.displayName = "GallerySection";

export default GallerySection;
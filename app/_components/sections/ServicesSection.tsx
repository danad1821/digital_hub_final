// src/app/_components/sections/ServicesSection.tsx
import { forwardRef } from "react";
import { BsBoxSeam } from "react-icons/bs";
import { LuShip } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { motion } from "framer-motion";

// Components & Types
import HomeInfoCard from "../cards/HomeInfoCard";
import { PageSectionData, Service } from "../../_types";

type ServicesSectionProps = {
  sectionData: PageSectionData;
  services: Service[];
  scheduleFileId: string | null;
};

// Icon mapping for services (Using a limited static set)
const icons = [
  <BsBoxSeam key="icon-1" />,
  <LuShip key="icon-2" />,
  <IoCalendarClearOutline key="icon-3" />,
];

const ServicesSection = forwardRef<HTMLDivElement, ServicesSectionProps>(
  ({ sectionData, services, scheduleFileId }, ref) => {
    return (
      <section
        ref={ref}
        id="services"
        className="py-16 md:py-20 bg-gray-50"
      >
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-bold text-5xl lg:text-[3.4rem]  mb-3 sm:mb-4">
              {sectionData.title}
            </h2>
            <p className="mb-8 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {sectionData.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {services.slice(0, 6).map((s, index) => {
              const isScheduleCard = index === 2 && scheduleFileId; // Only if file ID exists
              const serviceIcon = icons[index % icons.length];
              const cardContent = (
                <HomeInfoCard service={s as any} icon={serviceIcon} />
              );

              // Render as a clickable link if it's the schedule card
              return (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-full flex items-center justify-center cursor-pointer"
                >
                  {isScheduleCard ? (
                    <a
                      href={`/api/schedule/${scheduleFileId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex justify-center"
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <div className="w-full flex justify-center">
                      {cardContent}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
);

ServicesSection.displayName = "ServicesSection"; // Required for forwardRef

export default ServicesSection;
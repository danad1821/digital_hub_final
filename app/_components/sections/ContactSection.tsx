// src/app/_components/sections/ContactSection.tsx
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Pin } from "lucide-react";

// Components & Types
import ContactForm from "../ContactForm";
import { Location } from "../../_types";

type ContactSectionProps = {
  sectionData: any;
  locations: Location[];
};

const ContactSection = forwardRef<HTMLDivElement, ContactSectionProps>(
  ({ sectionData, locations }, ref) => {
    return (
      <section ref={ref} id="contact" className="py-16 md:py-20">
        <div className="custom-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-3 sm:mb-4">
              {sectionData.title}
            </h2>
            <p className="mb-8 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              {sectionData.subtitle}
            </p>
          </motion.div>

          <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-12">
            {/* Contact Info (Left Side) */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2"
            >
              <div className="border-b border-gray-200 pb-8 mb-8">
                <h3 className="font-medium text-2xl sm:text-3xl mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  {/* Mail */}
                  <div className="flex items-start gap-3 transition duration-300 hover:translate-x-1">
                    <div className="gradient-icon text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-sm text-xl sm:text-2xl flex-shrink-0">
                      <Mail />
                    </div>
                    <div>
                      <h4 className="font-medium text-xl sm:text-2xl">Email</h4>
                      <a
                        href="mailto:chartering@altamaritime.com"
                        className="text-gray-600 hover:text-[#00D9FF] text-base"
                      >
                        {sectionData?.data.email}
                      </a>
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex items-start gap-3 transition duration-300 hover:translate-x-1">
                    <div className="gradient-icon text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-sm text-xl sm:text-2xl flex-shrink-0">
                      <Phone />
                    </div>
                    <div>
                      <h4 className="font-medium text-xl sm:text-2xl">Phone</h4>
                      <a
                        href="tel:+1800maritime"
                        className="text-gray-600 hover:text-[#00D9FF] text-base"
                      >
                        {sectionData?.data.phone}
                      </a>
                    </div>
                  </div>
                  {/* Headquarters */}
                  <div className="flex items-start gap-3 transition duration-300 hover:translate-x-1">
                    <div className="gradient-icon text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-sm text-xl sm:text-2xl flex-shrink-0">
                      <Pin />
                    </div>
                    <div>
                      <h4 className="font-medium text-xl sm:text-2xl">
                        Headquarters
                      </h4>
                      <p className="text-gray-600 text-base">{sectionData.data.hq.split(" ").slice(0,3).join(" ")}</p>
                      <p className="text-gray-600 text-base">{sectionData.data.hq.split(" ").slice(3).join(" ")}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <h3 className="text-2xl sm:text-3xl my-4 font-medium">
                  Regional Offices
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {locations.map((l) => (
                    <div key={l.country}>
                      <p className="text-[#2A3544] text-xl mb-4">{l.country}</p>
                      <p className="text-gray-400 text-lg">{l.name} Office</p>
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
              className="w-full lg:w-1/2 mt-8 lg:mt-0"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
);

ContactSection.displayName = "ContactSection";

export default ContactSection;
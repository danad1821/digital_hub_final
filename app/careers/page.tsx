"use client";
import Header from "../_components/Header";
import {
  Ship,
  Globe,
  Briefcase,
  Users,
  Anchor,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const openPositions = [
  {
    title: "Senior Maritime Operations Manager",
    location: "Rotterdam, Netherlands",
    type: "Full-time",
  },
  {
    title: "Project Cargo Logistics Coordinator",
    location: "Houston, Texas, USA",
    type: "Full-time",
  },
  {
    title: "Naval Architect / Fleet Engineer",
    location: "Singapore",
    type: "Full-time",
  },
  {
    title: "Global Sales & Business Development",
    location: "Dubai, UAE",
    type: "Full-time",
  },
];

// --- Careers Page Component ---

export default function CareersPage() {
  const router = useRouter();
  return (
    <>
      {/* <Header /> */}
      <main className="min-h-screen">
        {/* 1. HERO SECTION - Career Focus */}
        <section className="relative h-[60vh] overflow-hidden flex items-center bg-[#0A1C30]">
          {/* Overlay */}
          <div className="absolute inset-0"></div>

          <div className="custom-container z-10 text-white pt-16 md:pt-20">
            <p className="bg-white/50 border border-white/50 w-fit px-2 py-1 rounded-sm text-sm">
              JOIN OUR GLOBAL TEAM
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight flex flex-col mt-2">
              <span className="gradient-text font-black tracking-tight bg-gradient-to-r from-[#00D9FF] to-white pb-2">
                Launch Your Maritime Career
              </span>
            </h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed">
              We seek visionary professionals to help us navigate the future of
              heavy lift and project cargo logistics.
            </p>
          </div>
        </section>

        {/* 3. WHY JOIN US - Benefits Section (Using the deep blue background) */}
        <section className="py-20 bg-[#0A1C30] text-white">
          <div className="custom-container">
            <div className="flex flex-wrap lg:flex-nowrap gap-10">
              <div className="lg:w-1/2">
                <p className="rounded-sm bg-[#00D9FF]/15 w-fit px-3 py-1 text-[#00D9FF] text-sm mb-2">
                  THE ALTA ADVANTAGE
                </p>
                <h2 className="text-4xl font-extrabold mb-4">
                  Invested in Your Growth and Future
                </h2>
                <p className="text-gray-300 mb-6">
                  We believe that our team is our most valuable asset. We offer
                  competitive packages designed to support your professional
                  journey and personal well-being.
                </p>

                {/* Benefits List */}
                <ul className="space-y-3 text-gray-200">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-[#00D9FF]" />
                    Competitive Compensation & Bonuses
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-[#00D9FF]" />
                    Comprehensive Health, Dental, and Vision Plans
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-[#00D9FF]" />
                    Global Mobility & Relocation Support
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-[#00D9FF]" />
                    Continuous Professional Development & Training
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5 text-[#00D9FF]" />
                    Generous Paid Time Off and Parental Leave
                  </li>
                </ul>
              </div>

              {/* Image/Visual Placeholder */}
              <div className="lg:w-1/2 flex items-center justify-center">
                <Image
                  src="/images/image1.jpeg"
                  alt="image"
                  width={100}
                  height={100}
                  className="w-full h-80 rounded-sm"
                ></Image>
              </div>
            </div>
          </div>
        </section>

        {/* 4. OPEN ROLES SECTION */}
        <section className="py-20 bg-gray-50">
          <div className="custom-container text-center max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4">
              Current Opportunities
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
              Find your next challenge in a dynamic, high-impact environment. We
              are actively hiring for positions across our global network.
            </p>

            {/* Roles List */}
            <div className="space-y-4">
              {openPositions.map((role, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white rounded-lg shadow hover:shadow-md transition duration-300 border-l-4 border-[#00D9FF]"
                >
                  <div className="text-left mb-2 sm:mb-0">
                    <h3 className="font-bold text-lg">{role.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {role.location} &bull; {role.type}
                    </p>
                  </div>
                  <button className="text-[#0A1C30] bg-[#00D9FF] px-4 py-2 rounded-sm font-semibold flex items-center gap-1 transition-all duration-300 hover:opacity-90">
                    View Details <Briefcase className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* If no roles */}
            {openPositions.length === 0 && (
              <p className="text-gray-500 italic p-10 border rounded-lg">
                We currently do not have any open positions, but we are always
                interested in connecting with top talent. Please check back
                soon!
              </p>
            )}
          </div>
        </section>

        {/* 5. CONTACT CTA - Footer/Final Section */}
        <section className="py-16 bg-[#00D9FF]/10">
          <div className="custom-container text-center">
            <h3 className="text-3xl font-bold mb-3 text-[#0A1C30]">
              Ready to Make an Impact?
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              Start your journey with a company that moves the world.
            </p>
            <button
              className="border border-[#0A1C30] bg-[#0A1C30] px-8 py-3 rounded-sm font-semibold whitespace-nowrap text-white flex items-center gap-1 mx-auto transition-all duration-300 hover:bg-opacity-90"
              onClick={() => {
                router.push("/application-portal");
              }}
            >
              Apply Now
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

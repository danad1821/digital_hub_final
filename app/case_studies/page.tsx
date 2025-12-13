"use client";
import Header from "../_components/Header";
import { Ship, Globe, Clock, Target, ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Mock Data for the page (Replace with actual data fetching/CMS) ---
const caseStudies = [
  {
    id: 1,
    title: "Relocation of a Full-Scale Power Plant to Southeast Asia",
    service: "Project Logistics & Heavy Lift Chartering",
    challenge: "Moving 15 oversized turbine sections and 400 TEUs of auxiliary equipment across three continents within a strict 90-day window.",
    solution: "Chartered an ice-class heavy lift vessel with dual 700-ton cranes. Executed complex lift plans at the departure port and managed multi-modal transport (river barges, specialized trailers) at the destination.",
    result: "Project completed 5 days ahead of schedule, with zero safety incidents and 100% cargo integrity maintained. Achieved a 15% cost saving over standard break-bulk methods.",
    icons: [<Ship />, <Clock />],
    tag: "Energy Sector",
  },
  {
    id: 2,
    title: "Delivery of Mining Equipment to a Remote South American Port",
    service: "Break Bulk & Remote Port Operations",
    challenge: "Transporting multiple 120-ton crushers and excavators to a port with shallow drafts and limited onshore lifting capacity.",
    solution: "Used a geared vessel capable of self-sustaining operations. Coordinated custom-built spreader beams for the lifts and deployed a specialized team to manage temporary port infrastructure.",
    result: "Critical mining equipment operational on site within the client's peak season timeline, avoiding major production delays.",
    icons: [<Globe />, <Target />],
    tag: "Mining",
  },
  // Add more studies here...
];

// --- Case Studies Page Component ---

export default function CaseStudiesPage() {
    const router = useRouter();
  return (
    <>
      {/* <Header /> */}
      <main className="min-h-screen">
        {/* 1. HERO SECTION - Text-Focused */}
        <section className="h-[40vh] flex items-center bg-[#0A1C30] text-white">
          <div className="custom-container pt-16 md:pt-20">
            <p className="bg-white/50 border border-white/50 w-fit px-2 py-1 rounded-sm text-sm">
              SUCCESS STORIES
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight flex flex-col mt-2">
              <span className="gradient-text font-black tracking-tight bg-gradient-to-r from-[#00FFFF] to-white pb-2">
                Proven Project Delivery
              </span>
            </h1>
            <p className="max-w-3xl text-lg font-light leading-relaxed text-gray-300">
              Explore how Alta Maritime navigates the most complex logistical challenges to deliver world-class results for our industrial partners.
            </p>
          </div>
        </section>
        
        {/* Horizontal Rule for separation */}
        <hr className="border-t-4 border-[#00FFFF]" />

        {/* 2. INTRO/FILTER BAR */}
        <section className="py-8 bg-gray-50 border-b border-gray-200">
          <div className="custom-container flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0A1C30] flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#00FFFF]" /> Explore Our Expertise
            </h2>
            {/* Simple Filter/Search Placeholder */}
            <div className="flex gap-3">
              <select className="p-2 border border-gray-300 rounded-sm bg-white text-gray-700">
                <option>All Sectors</option>
                <option>Energy</option>
                <option>Mining</option>
                <option>Construction</option>
              </select>
              <input 
                type="text" 
                placeholder="Search case studies..." 
                className="p-2 border border-gray-300 rounded-sm"
              />
            </div>
          </div>
        </section>

        {/* 3. CASE STUDY LISTING */}
        <section className="py-20">
          <div className="custom-container space-y-12 max-w-6xl mx-auto">
            
            {caseStudies.map((study, index) => (
              <div 
                key={study.id} 
                className="grid lg:grid-cols-3 gap-8 p-6 lg:p-10 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                {/* LEFT COLUMN: Summary & Visual Accent */}
                <div className="lg:col-span-1 border-r lg:border-r-2 pr-6 border-[#00FFFF]/50">
                    <p className="text-sm font-semibold text-gray-500 mb-2">{study.service}</p>
                    <h3 className="text-3xl font-extrabold text-[#0A1C30] mb-4">
                        {study.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-medium text-[#0A1C30] bg-[#00FFFF]/30 px-3 py-1 rounded-full">{study.tag}</span>
                        {/* Minimal Icon Visual */}
                        {study.icons.map((Icon, idx) => (
                           <div key={idx} className="text-[#00FFFF]">{Icon}</div>
                        ))}
                    </div>
                     <button
                        className="mt-4 border border-[#0A1C30] bg-[#0A1C30] px-4 py-2 rounded-sm font-semibold text-white flex items-center gap-1 transition-all duration-300 hover:opacity-90"
                        onClick={() => { /* router.push(`/case-studies/${study.id}`); */ }}
                      >
                        Read Full Story <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {/* RIGHT COLUMN: Challenge, Solution, Result */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Challenge Block */}
                    <div>
                        <h4 className="font-bold text-xl mb-1 text-[#00FFFF]">The Challenge</h4>
                        <p className="text-gray-700 leading-relaxed border-l-4 border-red-500 pl-3">
                            {study.challenge}
                        </p>
                    </div>

                    {/* Solution Block */}
                    <div>
                        <h4 className="font-bold text-xl mb-1 text-[#00FFFF]">Our Solution</h4>
                        <p className="text-gray-700 leading-relaxed border-l-4 border-green-500 pl-3">
                            {study.solution}
                        </p>
                    </div>
                    
                    {/* Result Block */}
                    <div>
                        <h4 className="font-bold text-xl mb-1 text-[#00FFFF]">The Result</h4>
                        <p className="text-gray-700 leading-relaxed border-l-4 border-blue-500 pl-3">
                            {study.result}
                        </p>
                    </div>
                </div>

              </div>
            ))}
            
            {/* CTA for more/contact */}
            <div className="text-center pt-8">
                 <p className="text-xl font-medium mb-4">
                    Have a complex project? Let's discuss a tailored solution.
                </p>
                <button
                    className="border border-[#0A1C30] bg-[#0A1C30] px-6 py-3 rounded-sm font-semibold text-white flex items-center gap-1 mx-auto transition-all duration-300 hover:bg-opacity-90"
                    onClick={() => {  router.push("/contact");  }}
                >
                    Contact Us for a Consultation
                </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
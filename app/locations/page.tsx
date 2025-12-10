import Header from "@/app/_components/Header";
import InteractiveMap from "../_components/InteractiveMap";

export default function LocationsPage() {
  return (
    <>
      {/* Header component is assumed to be the same as used in ContactUs */}
      <Header />

      <main className="bg-gray-50 py-12 w-full min-h-screen">
        <div className="custom-container">
          {/* Centered Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
            Global Shipping Locations
          </h1>
          <div className="mt-12 p-6 bg-white rounded-sm shadow-md">
            <p className="text-lg text-gray-600">
              Explore our key operational hubs. Click on any pin on the map to
              visualize the active shipping routes originating from that
              location. Our network ensures reliable and efficient global
              maritime logistics.
            </p>
          </div>

          {/* Content Section - Similar structure to the Contact page */}
          <section className="py-8">
            {/* 1. Map Container - Takes full width */}
            <InteractiveMap />

            {/* 2. Optional: Add a section for detailed location list below the map */}
          </section>
        </div>
      </main>
    </>
  );
}

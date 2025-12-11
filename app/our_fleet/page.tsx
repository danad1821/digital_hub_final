import Header from "../_components/Header";

export default function OurFleetPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        {/* Main content container, max-width, centering, and custom-container class */}
        <div className="max-w-7xl mx-auto custom-container">
          {/* Header Section */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
            Our Fleet
          </h1>
          {/* Descriptive Subtitle (similar to the Services Page summary) */}
          <p className="text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            A diverse and modern fleet, optimized for efficiency and reliability in global maritime operations.
          </p>

          {/* Content Section - You can add your fleet details here */}
          <section className="p-5">
            {/* Example content structure - replace with your actual fleet components */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Fleet Card Example 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-2xl font-semibold text-[#0A1C30] mb-2">Vessel Name A</h3>
                <p className="text-gray-600 mb-4">Type: Bulk Carrier</p>
                <ul className="list-disc list-inside text-gray-500">
                    <li>Capacity: 80,000 DWT</li>
                    <li>Year Built: 2018</li>
                    <li>Range: Global</li>
                </ul>
              </div>
              
              {/* Fleet Card Example 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <h3 className="text-2xl font-semibold text-[#0A1C30] mb-2">Vessel Name B</h3>
                <p className="text-gray-600 mb-4">Type: Container Ship</p>
                <ul className="list-disc list-inside text-gray-500">
                    <li>Capacity: 4,000 TEU</li>
                    <li>Year Built: 2020</li>
                    <li>Range: Asia-Europe</li>
                </ul>
              </div>

              {/* Add more fleet cards as needed */}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
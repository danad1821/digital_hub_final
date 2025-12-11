import Header from "../_components/Header"

export default function SafetyPage(){
    return(
        <>
        <Header/>
        {/* Changed bg-gray-40 to min-h-screen bg-gray-50 py-12 for consistent look */}
        <main className="min-h-screen bg-gray-50 py-12"> 
            {/* Main content container, max-width, centering, and custom-container class */}
            <div className="max-w-7xl mx-auto custom-container">
                
                {/* Header Section (consistent with other pages) */}
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
                    Safety & Quality Commitment
                </h1>
                {/* Descriptive Subtitle */}
                <p className="text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                    Our unwavering dedication to the highest standards of safety, quality, and environmental stewardship in all maritime operations.
                </p>

                {/* Content Section - Placeholder for safety details */}
                <section className="p-5">
                    {/* Example content area for safety certifications, policies, etc. */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
                        <h2 className="text-2xl font-bold text-[#0A1C30] mb-4">Core Safety Pillars</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Zero Harm Policy: Prioritizing the health and safety of personnel, environment, and assets.</li>
                            <li>ISM Code Compliance: Adherence to the International Safety Management Code.</li>
                            <li>Continuous Training: Investing in ongoing professional development for all crew members.</li>
                        </ul>
                    </div>
                </section>
            </div>
        </main>
        </>
    )
}
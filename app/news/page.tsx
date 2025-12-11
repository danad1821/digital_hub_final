import Header from "../_components/Header"

export default function NewsPage(){
    return(
        <>
        <Header/>
        <main className="min-h-screen bg-gray-50 py-12">
            {/* Main content container, max-width, centering, and custom-container class */}
            <div className="max-w-7xl mx-auto custom-container">
                {/* Header Section */}
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
                    Latest News & Updates
                </h1>
                {/* Descriptive Subtitle */}
                <p className="text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto">
                    Stay informed on our company milestones, industry trends, and maritime logistics insights.
                </p>

                {/* News Content Section - Placeholder for news items */}
                <section className="p-5">
                    {/* Example News Grid - You would replace this with actual news components */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* News Card Example 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
                            <span className="text-sm font-semibold text-[#00FFFF] uppercase">Press Release</span>
                            <h3 className="text-xl font-bold text-[#0A1C30] mt-2 mb-3">
                                New Regional Hub Opens in Rotterdam
                            </h3>
                            <p className="text-gray-600 text-sm">
                                We are excited to announce the launch of our state-of-the-art logistics center in Europe's largest port.
                            </p>
                            <p className="text-xs text-gray-400 mt-4">October 25, 2025</p>
                        </div>
                        
                        {/* News Card Example 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
                            <span className="text-sm font-semibold text-[#00FFFF] uppercase">Industry Update</span>
                            <h3 className="text-xl font-bold text-[#0A1C30] mt-2 mb-3">
                                Navigating Green Shipping Regulations
                            </h3>
                            <p className="text-gray-600 text-sm">
                                An analysis of the latest IMO mandates and how our fleet is adapting to sustainable practices.
                            </p>
                            <p className="text-xs text-gray-400 mt-4">October 10, 2025</p>
                        </div>

                        {/* Add more news cards as needed */}
                    </div>
                </section>
            </div>
        </main>
        </>
    )
}
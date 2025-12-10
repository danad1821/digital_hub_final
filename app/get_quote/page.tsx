import Header from '@/app/_components/Header';
import QuoteForm from '@/app/_components/QuoteForm';
import { ShieldCheck, Globe, Zap, Headset } from 'lucide-react'; // Import icons for value props and assistance

export default function GetQuotePage() {
    return (
        <>
            <Header />
            
            {/* MAIN SECTION: Responsive Layout 
              - Uses p-4 for padding on all screens, px-8 on medium screens and up.
              - Uses grid layout: single column by default, two columns on 'lg' screens.
            */}
            <main className="min-h-screen bg-gray-50 p-4 md:p-8">
                
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left Column: Quote Form (Takes 2/3 width on large screens) */}
                    <section className="quote-form-section lg:col-span-2">
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-[#0A1C30] mb-2">
                                Get an Instant Shipping Quote
                            </h1>
                            <p className="page-intro text-lg text-gray-600">
                                Enter your shipment details below and receive a fast, accurate estimate.
                            </p>
                        </div>
                        
                        <QuoteForm /> 
                        
                    </section>
                    
                    {/* Right Column: Support Sidebar (Takes 1/3 width on large screens) */}
                    <aside className="support-sidebar space-y-8 p-6 lg:p-0">
                        
                        {/* Need Assistance Block */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-[#0A1C30] flex items-center">
                                <Headset className="w-5 h-5 mr-2 text-[#00FFFF]" />
                                Need Assistance?
                            </h2>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center">
                                   
                                    <span className="font-medium">Call us:</span> +1 (800) 555-1234
                                </li>
                                <li className="flex items-center">
                                    <span className="font-medium">Live Chat Support: </span> Available 24/7 
                                </li>
                                <li className="text-sm text-gray-500 pt-2 italic">
                                    (For complex shipments, contact a specialist.)
                                </li>
                            </ul>
                        </div>
                        
                        {/* Why Choose Us Block */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-[#0A1C30]">
                                Why Choose Us?
                            </h2>
                            <div className="value-props space-y-3">
                                <p className="flex items-center text-gray-700 font-medium">
                                    <ShieldCheck className="w-5 h-5 mr-3 text-green-500" /> 
                                    Transparent Pricing
                                </p>
                                <p className="flex items-center text-gray-700 font-medium">
                                    <Globe className="w-5 h-5 mr-3 text-blue-500" /> 
                                    Global Coverage
                                </p>
                                <p className="flex items-center text-gray-700 font-medium">
                                    <Zap className="w-5 h-5 mr-3 text-yellow-500" /> 
                                    Fastest Transit Times
                                </p>
                            </div>
                        </div>

                    </aside>
                    
                </div>
            </main>
        </>
    );
}
// _components/ServiceCard.tsx

import Image from "next/image";
import { FaChevronRight } from "react-icons/fa"; 

// 1. IMPROVEMENT: Define a strong TypeScript Interface
interface Service {
    image: string;
    category: string;
    items: Object[];
    description: string;
}

export default function ServiceCard({ service }: { service: Service }) {
    return (
        // 2. IMPROVEMENT: Apply responsive Flexbox sizing and hover effect
        <div className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] 
                        bg-[#0A1C30] text-gray-300 rounded-xl shadow-lg 
                        hover:shadow-2xl hover:scale-[1.02] transition duration-300 overflow-hidden 
                        flex flex-col"> {/* Use flex-col for internal stacking */}
            
            {/* --- 1. Image Area (IMPROVEMENT: Full-width, rectangular image) --- */}
            <div className="relative h-48 w-full">
                <Image
                    src={service.image}
                    alt={service.category}
                    fill // IMPROVEMENT: Use 'fill' for better responsiveness
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20"></div> 
            </div>
            
            {/* --- 2. Content Area (IMPROVEMENT: Added padding and flex-grow) --- */}
            <div className="p-6 flex flex-col flex-grow">
                
                {/* Category Title (Stronger emphasis) */}
                <h3 className="text-xl font-bold text-[#FF8C00] mb-3 border-b pb-2 border-gray-700">
                    {service.category}
                </h3>
                
                {/* Description */}
                <p className="text-gray-400 mb-4 text-sm">
                    {service.description}
                </p>
                
                {/* IMPROVEMENT: List of key services for better scannability */}
                <ul className="space-y-1 text-sm text-gray-300 list-none mb-4">
                    {service.items.slice(0, 3).map((item: any) => (
                        <li key={item} className="flex items-start">
                            <FaChevronRight className="w-3 h-3 text-[#FF8C00] mr-2 mt-1 flex-shrink-0" />
                            {item.name}
                        </li>
                    ))}
                    {service.items.length > 3 && (
                        <li className="text-xs text-gray-500 pt-1">
                            + {service.items.length - 3} more services
                        </li>
                    )}
                </ul>

                {/* --- 3. CTA Button (IMPROVEMENT: Forced to bottom with mt-auto) --- */}
                <button 
                    className="text-center bg-[#FF8C00] text-[#0A1C30] font-semibold rounded-lg p-2 cursor-pointer
                                mt-auto hover:bg-orange-500 transition duration-300 shadow-md">
                    Know More
                </button>
            </div>
        </div>
    );
}
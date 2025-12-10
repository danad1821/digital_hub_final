// _components/ServiceCard.tsx

import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

// 1. IMPROVEMENT: Define a strong TypeScript Interface
interface Service {
  icon: any;
  serviceName: string;
  summary: string;
}

export default function ValueCard({ service }: { service: Service }) {
  const router = useRouter();
  return (
    <div
      className="
      bg-white 
      rounded-sm 
      p-6 
      shadow-md 
      hover:shadow-xl 
      transition 
      duration-300 
      hover:-translate-y-1 
      h-full
      flex flex-col
      w-[300px]
    "
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{service.serviceName}</h3>
      <p className="text-gray-600 leading-relaxed text-base">{service.summary}</p>
    </div>
  );
}

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

export default function HomeInfoCard({ service }: { service: Service }) {
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
      <div
        className="
        bg-gradient-to-br from-blue-300 to-indigo-600 
        text-white
        w-12 
        h-12 
        flex 
        items-center 
        justify-center 
        rounded-sm 
        mb-4 
        text-2xl
      "
      >
        {service.icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{service.serviceName}</h3>
      <p className="text-gray-600 leading-relaxed text-base">{service.summary}</p>
    </div>
  );
}

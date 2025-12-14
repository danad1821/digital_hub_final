// _components/ServiceCard.tsx

import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

// 1. IMPROVEMENT: Define a strong TypeScript Interface


export default function HomeInfoCard({
  service,
  icon,
}: {
  service: any;
  icon: any;
}) {
  const router = useRouter();
  return (
    <div
      className="
      text-grey-800
      bg-white 
      rounded-sm 
      p-6 
      shadow-lg 
      hover:shadow-2xl 
      transition 
      duration-300 
      hover:-translate-y-1 
      w-[300px] h-[300px]

      lg:w-[350px] lg:h-[300px]
      
      flex flex-col
      hover:text-[#00D9FF]
    "
    >
      <div
        className="
        gradient-icon
        text-white
        w-18
        h-18 
        flex 
        items-center 
        justify-center 
        rounded-sm 
        mb-4 
        text-3xl
        
        transition duration-100 rotate-icon
      "
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 ">
        {service.serviceName}
      </h3>
      {/* Set the summary text to use remaining space and manage overflow */}
      <p className=" text-lg text-gray-600 leading-relaxed text-base overflow-hidden text-ellipsis grow">
        {service.summary}
      </p>
    </div>
  );
}
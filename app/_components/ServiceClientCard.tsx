import { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

// Define the expected structure for clarity and type safety
interface Service {
  _id: string;
  serviceName: string;
  summary: string;
  description: string;
  // Assuming 'icon' is not needed here as per the original ServiceClientCard
}

export default function ServiceClientCard({ s }: { s: Service }) {
  // 1. State for controlling the expanded/collapsed view
  const [isExpanded, setIsExpanded] = useState(false);

  // 2. Toggle function
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    // Replicating the HomeInfoCard container styling
    <div
      key={s._id}
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
        w-full
      "
    >
      {/* Title/Service Name */}
      <h4 className="text-xl font-bold text-gray-800 mb-2">{s.serviceName}</h4>
      
      {/* Summary - Always visible */}
      <div>
        <p className="text-gray-600 leading-relaxed text-base mb-4">{s.summary}</p>
      </div>

      {/* Description - Conditionally rendered */}
      {isExpanded && (
        <div className="mb-4">
          <p className="text-gray-600 leading-relaxed text-base border-l-4 border-[#0A1C30] pl-4">
            {s.description}
          </p>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleExpanded}
        className="
          mt-auto 
          flex 
          items-center 
          justify-start 
          font-semibold 
          text-[#0A1C30] 
          hover:text-[#0A1C30] 
          transition
        "
      >
        <span className="mr-2">
          {isExpanded ? 'Show Less Details' : 'Show Full Description'}
        </span>
        <FaChevronRight 
          className={`
            transition-transform 
            duration-300 
            ${isExpanded ? 'rotate-90' : 'rotate-0'}
          `}
        />
      </button>
    </div>
  );
}
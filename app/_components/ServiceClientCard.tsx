// ServiceClientCard.tsx
import { useState, forwardRef, Ref, useEffect } from 'react'; // 👈 Import useEffect
import { FaChevronRight } from 'react-icons/fa';

interface Service {
  _id: string;
  category: string; 
  serviceName: string;
  summary: string;
  description: string;
}

interface ServiceClientCardProps {
  s: Service;
  isInitiallyExpanded: boolean; // 👈 New prop to force initial expansion
}

const ServiceClientCard = forwardRef<HTMLDivElement, ServiceClientCardProps>(
  ({ s, isInitiallyExpanded }, ref: Ref<HTMLDivElement>) => {
    
    // 1. State for controlling the expanded/collapsed view, initialized based on prop
    const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);

    // 2. Sync local state with prop when prop changes
    useEffect(() => {
        setIsExpanded(isInitiallyExpanded);
    }, [isInitiallyExpanded]);
    
    // 3. Toggle function
    const toggleExpanded = () => {
      // Allow manual collapse/expand only if the service wasn't forced open, 
      // or if the user clicks again after it was forced open.
      setIsExpanded(!isExpanded);
    };

    return (
      <div
        ref={ref} 
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
        {isExpanded && ( // Now uses the state managed by the parent/synced with prop
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
);

ServiceClientCard.displayName = 'ServiceClientCard';

export default ServiceClientCard;
import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: any;
  colorClass: string;
}

export default function MetricCard({
  title,
  value,
  icon: Icon,
  colorClass,
}: MetricCardProps) {
  return (
    // COLOR CHANGE: Background changed from [#0A1C30] to [#0A1C30] and border changed from gray-100 to gray-700
    <div className="w-75 bg-[#0A1C30] text-white p-5 rounded-xl shadow-lg border border-gray-700 flex items-center justify-between transition hover:shadow-xl duration-300">
      <div className="flex flex-col">
        {/* COLOR CHANGE: Title text color changed from gray-500 to gray-400 */}
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        {/* COLOR CHANGE: Value text color changed from [#0A1C30] to white */}
        <h2 className="text-3xl font-extrabold text-white mt-1">{value}</h2>
      </div>
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
        <Icon className={`w-8 h-8 ${colorClass}`} />
      </div>
    </div>
  );
}
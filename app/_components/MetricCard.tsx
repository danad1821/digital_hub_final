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
    <div className="w-75 bg-[##0A1C30] text-white p-5 rounded-xl shadow-lg border border-gray-100 flex items-center justify-between transition hover:shadow-xl duration-300">
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <h2 className="text-3xl font-extrabold text-[#0A1C30] mt-1">{value}</h2>
      </div>
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
        <Icon className={`w-8 h-8 ${colorClass}`} />
      </div>
    </div>
  );
}

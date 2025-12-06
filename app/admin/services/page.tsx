"use client";

import { useState } from "react";
import AddServiceModal from "@/app/_components/AddServiceModal";
import ServiceCard from "@/app/_components/ServiceCard";
import { Plus, Search } from "lucide-react";

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Filter services by name
  const filteredServices = services.filter((s) =>
    s.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveService = (service: any) => {
    setServices((prev) => {
      const exists = prev.some((s) => s._id === service._id);
      if (exists) {
        return prev.map((s) => (s._id === service._id ? service : s));
      }
      return [...prev, service];
    });

    setShowModal(false);
    setSelectedService(null);
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <main className="p-8 text-white">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3 bg-[#11001C] p-2 px-4 rounded-lg border border-gray-700">
          <Search className="text-[#00FFFF] w-5 h-5" />
          <input
            type="text"
            placeholder="Search services..."
            className="bg-transparent focus:outline-none text-gray-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setSelectedService(null);
            setShowModal(true);
          }}
          className="flex items-center bg-[#00FFFF] text-[#11001C] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Service
        </button>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onEdit={() => {
              setSelectedService(service);
              setShowModal(true);
            }}
            onDelete={() => handleDeleteService(service._id)}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <AddServiceModal
          initialService={selectedService}
          onSave={handleSaveService}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}

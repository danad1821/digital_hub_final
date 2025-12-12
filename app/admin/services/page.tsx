"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import AddServiceModal from "@/app/_components/modals/AddServiceModal";
import ServiceCard from "@/app/_components/cards/ServiceCard";
import { Plus, Search } from "lucide-react";
import axios from "axios";

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  /** ---------------------------
   * LOAD ALL SERVICES
   * --------------------------*/
  const getAllServices = useCallback(async () => {
    try {
      const res = await axios.get("/api/services");
      const data = res.data?.services || res.data || [];

      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load services:", error);
    }
  }, []);

  /** ---------------------------
   * FILTER SERVICES
   * --------------------------*/
  const filteredServices = useMemo(() => {
    return services.filter((s) =>
      s.serviceName.toLowerCase().includes(search.toLowerCase())
    );
  }, [services, search]);

  /** ---------------------------
   * SAVE (ADD OR EDIT)
   * --------------------------*/
  const handleSaveService = useCallback(
    async (service: any) => {
      try {
        if (selectedService) {
          // UPDATE
          const res = await axios.put(`/api/services/${service._id}`, service);
          const updated = res.data?.service || res.data;

          setServices((prev) =>
            prev.map((s) => (s._id === updated._id ? updated : s))
          );
        } else {
          // CREATE
          console.log("Service: ", service)
          const res = await axios.post(`/api/services`, service);
          const created = res.data?.service || res.data;

          setServices((prev) => [...prev, created]);
        }

        setShowModal(false);
        setSelectedService(null);
      } catch (error) {
        console.error("Save service failed:", error);
      }
    },
    [selectedService]
  );

  /** ---------------------------
   * DELETE SERVICE
   * --------------------------*/
  const handleDeleteService = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }, []);

  /** ---------------------------
   * LOAD SERVICES ON MOUNT
   * --------------------------*/
  useEffect(() => {
    getAllServices();
  }, [getAllServices]);

  return (
    <main className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-black">Services</h1>

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

      {/* Service Cards */}
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
          onClose={() => {
            setShowModal(false);
            setSelectedService(null);
          }}
        />
      )}
    </main>
  );
}

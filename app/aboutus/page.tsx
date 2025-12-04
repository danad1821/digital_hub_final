"use client";
import { useState, useEffect } from "react";
import axios from "axios";
export default function AboutUs() {
  const [services, setServices] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(0);

  const getAllServices = async () => {
    try {
      const response = await axios.get("/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  useEffect(() => {
    getAllServices();
  }, []);

  return (
    <main>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-center my-4">
        About Us
      </h1>
      <section className="flex flex-wrap justify-center items-center">
        {services.length > 0 ? (
          services.map((service: any) => (
            <h2
              key={service._id}
              onClick={() => setSelectedCategory(services.indexOf(service))}
              className="text-center bg-[#FF8C00] text-[#0A1C30] font-semibold rounded-lg p-2 mx-1 cursor-pointer
                                mt-auto hover:bg-orange-500 transition duration-300 shadow-md"
            >
              {service.category}
            </h2>
          ))
        ) : (
          <></>
        )}
      </section>
      <section>
        {services[selectedCategory]?.items.map((item: any, index: any) => (
          <div key={index}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

"use client";
import { useState, useEffect } from "react";
// import { useParams } from "next/navigation"; // Temporarily commented out due to environment resolution error
import axios from "axios";
import { Loader2, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Header from "../_components/Header";

interface ServiceItem {
  name: string;
  description: string;
}

interface Service {
  _id: string;
  category: string;
  description: string;
  items: ServiceItem[];
}

export default function AboutUs() {
  const values = [{serviceName: 'Integrity'}];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="custom-container">
          {/* Header */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center text-[#0A1C30] mb-4">
            About Us
          </h1>
          <p className="text-xl text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Discover our specialized maritime solutions tailored to your needs.
          </p>
          <section className="flex items-center justify-around">
            <div className="bg-white rounded-sm max-w-1/2">
              <h2>Our Vision</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                vel pulvinar nisl, sit amet faucibus lacus. Cras faucibus lorem
                eros, non varius felis luctus molestie. Cras fringilla felis ac
                metus mattis semper.  
              </p>
            </div>
            <div className="w-1/3 text-center">|</div>
            <div className="bg-white rounded-sm max-w-1/2">
              <h2>Our Mission</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                vel pulvinar nisl, sit amet faucibus lacus. Cras faucibus lorem
                eros, non varius felis luctus molestie. Cras fringilla felis ac
                metus mattis semper.</p>
            </div>
          </section>
          <section>
            <h2>SOur Values</h2>
            <p>
              Phasellus tellus metus, ornare quis purus quis, aliquet mollis
              nisi. Pellentesque magna mauris, vehicula nec lacinia a, cursus in
              nibh. Cras ac felis non leo semper tristique eu a leo. Donec vitae
              risus in nunc pharetra molestie. Quisque quam neque, vehicula in
              turpis nec, vestibulum maximus arcu. Cras mollis justo velit, ac
              porta ipsum condimentum a. Vivamus ut tincidunt nunc. Sed feugiat
              est libero, a congue orci feugiat et. Aenean eu nibh at velit
              consectetur maximus a facilisis est. Nunc mattis ultricies dolor,
              sit amet ultrices mauris interdum mattis. Nam porttitor ipsum quis
              ornare pulvinar. Nam sapien risus, eleifend in semper sed,
              vestibulum non ipsum. Suspendisse egestas odio sit amet leo
              venenatis sollicitudin vitae id leo. Donec viverra a ipsum
              faucibus pharetra. Maecenas efficitur aliquet nisl, at posuere
              orci vulputate in.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

import Image from "next/image";
import homeImage from "@/public/images/image4.jpeg";
import ServiceCard from "./_components/ServiceCard";

const services = [
  {
    category: "Shipping",
    items: [
      "Agency",
      "Brokerage",
      "Chartering",
      "P&I representation",
      "Sale & purchase",
    ],
    description:
      "This category encompasses the core activities of ship representation and cargo facilitation. We act as agents for various shipping lines and charterers, handling all aspects of vessel operations, from port services and securing vessels for cargo to managing legal and insurance interests and facilitating the trade of ships themselves. Our extensive network ensures seamless movement for General Cargo, Dry Bulk, and Containerized trade.",
  },
  {
    category: "Logistics",
    items: ["Forwarding", "Cargo clearing", "NOVCC", "Project Cargo"],
    description:
      "Logistics is about providing complete, end-to-end solutions that move your goods reliably. We offer competitive door-to-door shipping solutions, manage customs compliance through strong third-party cooperation ($Cargo clearing$), and operate our own Non-Vessel Operating Common Carrier for optimized container services. We also specialize in the complex planning and execution required for oversized or specialized shipments.",
  },
  {
    category: "Bunkering",
    items: ["Brokerage", "Trading"],
    description: "As both a broker and a serious trader, our Bunkering services ensure reliable and competitive fuel supply for vessels in key regional markets. Our dual role allows us to secure optimal terms for our clients, whether we are arranging supply through our established network of world major traders or fulfilling the demand directly through our growing operational capabilities."
  },
  {
    category: "Cargo operation",
    items: ["Cargo Handling", "Cargo survey", "Tally"],
    description: "We own and operate specialized equipment, such as grabs and hoppers, to achieve high-rate discharge and handling of bulk cargo. Furthermore, we provide reliable, certified oversight through cooperation with accredited surveyors, offering detailed checks and accurate counting  to protect your interests and maintain integrity throughout the process."
  },
];

export default function Home() {
  return (
    <main className="">
      <div className="relative">
        <div className="inset-0 absolute flex flex-col justify-center custom-container z-10 text-white">
          <h1 className="font-medium text-2xl">Alta Maritime</h1>
          <h2 className="font-medium text-lg">
            A network of shipping, forwarding and custom clearing agencies,
            operating in the East Mediterranean and North African regions.
          </h2>
        </div>
        <div className="absolute bg-gray-500 opacity-25 inset-0 z-1"></div>
        <Image
          src={homeImage}
          alt="ship image"
          height={300}
          className="w-full"
        />
      </div>
      <section>
        <h2 className="font-medium text-lg text-center my-1">Our Services</h2>
        <div className="custom-container flex flex-wrap justify-center items-center">
          {services.map((service) => (
            <ServiceCard key={service.category} service={service} />
          ))}
        </div>
      </section>
    </main>
  );
}

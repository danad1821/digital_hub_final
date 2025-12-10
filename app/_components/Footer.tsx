"use client";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Anchor } from "lucide-react";
import { MdOutlineEmail, MdOutlineLocalPhone } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Helper function to convert a service name to a URL-safe slug
// e.g., "Heavy Lift Cargo" -> "Heavy Lift Cargo" (assuming the service category matches)
const getServiceCategoryName = (slug: string) => {
  switch (slug) {
    case "heavy-lift":
      return "Heavy Lift Cargo";
    case "break-bulk":
      return "Break Bulk Shipping";
    case "project-logistics":
      return "Project Logistics";
    case "port-operations":
      return "Port Operations";
    case "relocation":
      return "Machinery Relocation";
    case "chartering":
      return "Cargo Chartering";
    default:
      return slug;
  }
};

export default function Footer() {
  const pathname = usePathname();
  if(pathname === '/admin'){
    return(
      <></>
    )
  }
  const serviceLinks = [
    // ⚠️ The 'name' value here MUST exactly match the 'category' value in your database
    // for the scrolling functionality in AboutUs.tsx to work.
    { name: "Heavy Lift Cargo", href: "/services?name=Heavy%20Lift%20Cargo" },
    {
      name: "Break Bulk Shipping",
      href: "/services?name=Break%20Bulk%20Shipping",
    },
    { name: "Project Logistics", href: "/services?name=Project%20Logistics" },
    { name: "Port Operations", href: "/services?name=Port%20Operations" },
    {
      name: "Machinery Relocation",
      href: "/services?name=Machinery%20Relocation",
    },
    { name: "Cargo Chartering", href: "/services?name=Cargo%20Chartering" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Fleet", href: "/our_fleet" },
    { name: "Case Studies", href: "/case_studies" },
    { name: "Careers", href: "/careers" },
    { name: "News & Updates", href: "/news" },
    { name: "Safety Standards", href: "/safety" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ];

  // Social links (using placeholder links)
  const socialLinks = [
    { icon: FaLinkedin, href: "1" },
    { icon: FaTwitter, href: "2" },
    { icon: FaFacebook, href: "3" },
  ];

  // Use a deep navy blue background
  const footerBg = "bg-[#0A1C30]";
  // Use white/light gray text for contrast
  const textColor = "text-white";
  // Accent color for hover effects (used the subtle orange from the logo)
  const hoverColor = "hover:text-[#00FFFF]";

  // Helper component for link columns
  const LinkColumn = ({
    title,
    links,
  }: {
    title: string;
    links: typeof serviceLinks | typeof companyLinks | typeof legalLinks;
  }) => (
    <div className="flex flex-col gap-4">
      <h4 className={`text-xl font-semibold mb-2 text-white`}>{title}</h4>
      <ul className="space-y-3 text-base">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`text-gray-300 transition duration-150 ${hoverColor}`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className={`${footerBg} ${textColor} font-sans`}>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 custom-container">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Logo, Slogan, and Socials */}
          <div className="flex flex-col gap-6">
            {/* Logo Block */}
            <div className="flex items-center gap-2">
              <Anchor className="text-3xl text-[#00FFFF]" />{" "}
              {/* Placeholder ship icon */}
              <h3 className="text-2xl font-bold text-white">ALTA MARITIME</h3>
            </div>

            {/* Slogan */}
            <p className="text-sm text-gray-400 max-w-xs">
              Global maritime logistics solutions with expertise in heavy lift
              cargo and project management.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-2 mt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 border border-gray-700/50 rounded-md transition duration-200 text-gray-300 ${hoverColor}`}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <LinkColumn title="Services" links={serviceLinks} />

          {/* Column 3: Company */}
          <LinkColumn title="Company" links={companyLinks} />

          {/* Column 4: Get In Touch */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xl font-semibold text-white">Get In Touch</h4>

            {/* Email */}
            <Link
              href="mailto:info@altamaritime.com"
              className={`flex items-start gap-3 text-base text-gray-300 ${hoverColor} transition duration-150`}
            >
              <MdOutlineEmail className="text-2xl flex-shrink-0 mt-0.5 text-[#00FFFF]" />
              <span>info@altamaritime.com</span>
            </Link>

            {/* Phone */}
            <Link
              href="tel:+180062748463"
              className={`flex items-start gap-3 text-base text-gray-300 ${hoverColor} transition duration-150`}
            >
              <MdOutlineLocalPhone className="text-2xl flex-shrink-0 mt-0.5 text-[#00FFFF]" />
              <span>+1 (800) MARITIME</span>
            </Link>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm font-semibold text-gray-400 mb-1">
                24/7 Operations Center
              </p>
              <p className="text-sm text-gray-500">
                Emergency: +1 (800) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* --- Bottom Legal Bar --- */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <p className="text-sm text-gray-500 order-2 md:order-1 mt-6 md:mt-0">
              &copy; {new Date().getFullYear()} Alta Maritime. All rights
              reserved.
            </p>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm order-1 md:order-2">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-gray-400 ${hoverColor} transition duration-150`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

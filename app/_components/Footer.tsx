"use client";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { MdOutlineEmail, MdOutlineLocalPhone } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Helper function to convert a service name to a URL-safe slug
// e.g., "Heavy Lift Cargo" -> "Heavy Lift Cargo" (assuming the service category matches)

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/admin") {
    return <></>;
  }
  const serviceLinks = [
    // ⚠️ The 'name' value here MUST exactly match the 'category' value in your database
    // for the scrolling functionality in AboutUs.tsx to work.
    { name: "Heavy Lift Cargo", href: "/" },
    {
      name: "Break Bulk Shipping",
      href: "/",
    },
    { name: "Project Logistics", href: "/" },
    { name: "Port Operations", href: "/" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/" },
    { name: "Terms of Service", href: "/" },
    { name: "Cookie Policy", href: "/" },
  ];

  // Use a deep navy blue background
  const footerBg = "bg-[#0A1C30]";
  // Use white/light gray text for contrast
  const textColor = "text-white";
  // Accent color for hover effects (used the subtle orange from the logo)
  const hoverColor = "hover:text-[#00D9FF]";

  // Helper component for link columns
  const LinkColumn = ({
    title,
    links,
  }: {
    title: string;
    links: typeof serviceLinks | typeof legalLinks;
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
      <div className="max-w-7xl py-16 custom-container">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Column 1: Logo, Slogan, and Socials */}
          <div className="flex flex-col gap-6">
            {/* Logo Block */}
            <div className="flex items-center gap-2">
              <Image
                src="/images/ultamaritime.svg"
                alt="alta maritime logo"
                width={200}
                height={100}
              />
            </div>

            {/* Slogan */}
            <p className="text-sm text-gray-400 max-w-xs">
              Global maritime logistics solutions with expertise in heavy lift
              cargo and project management.
            </p>
          </div>

          {/* Column 2: Services */}
          <LinkColumn title="Services" links={serviceLinks} />

          {/* Column 4: Get In Touch */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xl font-semibold text-white">Get In Touch</h4>

            {/* Email */}
            <Link
              href="mailto:chartering@altamaritime.com"
              className={`flex items-start gap-3 text-base text-gray-300 ${hoverColor} transition duration-150`}
            >
              <MdOutlineEmail className="text-2xl flex-shrink-0 mt-0.5 text-[#00D9FF]" />
              <span>chartering@altamaritime.com</span>
            </Link>

            {/* Phone */}
            <Link
              href="tel:+180062748463"
              className={`flex items-start gap-3 text-base text-gray-300 ${hoverColor} transition duration-150`}
            >
              <MdOutlineLocalPhone className="text-2xl flex-shrink-0 mt-0.5 text-[#00D9FF]" />
              <span>
                P: +86-21-6521 8923
                <br />
                M: +86 1366 1933
              </span>
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

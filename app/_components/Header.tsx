// Header.tsx
"use client";

import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define the navigation links
const NAV_LINKS = [
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  { name: "Locations", href: "/locations" },
  { name: "Contact", href: "/contact" },
  { name: "Get Quote", href: "/get_quote" },
];

const MobileSidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  // ... (MobileSidebar component remains the same) ...
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500 opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden
                    ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 flex flex-col h-full">
          <button onClick={onClose} className="self-end p-2 mb-4">
            <IoClose className="text-3xl text-black" />
          </button>

          <ul className="list-none flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li
                key={link.name}
                className="text-lg font-medium py-2 border-b border-gray-100"
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="text-black hover:text-blue-600"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      // Set threshold to 100px
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]); // FIX: Dependency should be 'scrolled' to prevent constant re-rendering/bugs.

  if (pathname === "/admin") {
    return <></>;
  }

  // --- Dynamic Classes Configuration ---
  const baseClasses =
    "py-4 flex items-center w-full px-0 sticky top-0 z-50 transition-all duration-300 ease-in-out ";

  // State 1 (Transparent): Transparent BG, White Text
  const transparentStateClasses = "bg-transparent text-black shadow-none";

  // State 2 (Scrolled): White BG, Dark Text, Shadow
  const solidStateClasses = "bg-white shadow-md text-black";

  const dynamicClasses = scrolled ? solidStateClasses : transparentStateClasses;

  return (
    <header className={`${baseClasses} ${dynamicClasses}`}>
      <nav className="flex flex-nowrap w-full custom-container">
        <ul className="list-none w-full flex justify-between items-center">
          {/* Logo/Site Title */}
          <li
            className={`text-2xl font-medium transition-colors duration-300 ${scrolled ? "text-black" : "text-black"}`}
          >
            ALTA MARITIME
          </li>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center gap-6">
            {NAV_LINKS.map((link) => {
              
              const isCTA = link.name === 'Get Quote';

              // 1. Define base classes for regular links (depends on scroll state)
              const regularLinkClasses = `font-medium transition duration-150 ${
                scrolled ? "text-gray-700 hover:text-blue-600" : "text-black hover:text-gray-300"
              }`;
              
              // 2. Define classes for the CTA button (always solid, but colors might adjust slightly)
              const ctaClasses = `
                px-5 py-2 rounded-sm font-semibold whitespace-nowrap
                ${scrolled 
                  ? 'bg-[#00FFFF] text-black hover:bg-[#00FFFF]' // Darker blue on white background
                  : 'bg-[#00FFFF] text-black hover:bg-[#00FFFF]' // Same button, but add a slight border when transparent
                }
              `;

              return (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className={isCTA ? ctaClasses : regularLinkClasses}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </div>

          {/* Hamburger Button (No change needed here, color logic is already fine) */}
          <div className="lg:hidden">
            <button onClick={toggleSidebar} className="p-2">
              <RxHamburgerMenu
                className={`text-3xl transition-colors duration-300 ${scrolled ? "text-black" : "text-black"}`}
              />
            </button>
          </div>
        </ul>
      </nav>

      <MobileSidebar isOpen={isOpen} onClose={toggleSidebar} />
    </header>
  );
}
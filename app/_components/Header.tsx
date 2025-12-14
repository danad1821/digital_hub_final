// Header.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ⭐ NEW: Interface for the prop passed from page.tsx
interface HeaderProps {
  // Function passed from page.tsx to handle the smooth scroll
  scrollToSection: (sectionId: string) => void;
}

// Define the navigation links
const NAV_LINKS = [
  // ⭐ UPDATED: Using 'id' instead of 'href' for internal use
  { name: "Services", id: "services" },
  { name: "About", id: "about" },
  { name: "Gallery", id: "gallery" },
  { name: "Locations", id: "locations" }, // Corresponds to global map section
  { name: "Contact", id: "contact" },
  { name: "Get Quote", id: "contact" }, // Get Quote references the contact section
];

// ⭐ UPDATED: Accept scrollToSection as a prop
export default function Header({ scrollToSection }: HeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // --- FIX: Optimized useEffect for scroll handling ---
  useEffect(() => {
    const handleScroll = () => {
      // Functional update check for 'scrolled' to prevent stale state issues,
      // although checking against 50 is sufficient for this simple logic.
      // We'll rely on the simple check and correct dependency array [].
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // ⭐ FIX: Dependency array is now empty ([]), ensuring listener is added once.
          // The component will re-render when setScrolled updates, but the effect logic is stable.

  // Prevent rendering the header on the admin path
  if (pathname && pathname.startsWith("/admin")) {
    return <></>;
  }

  // Mobile menu links need to handle closing the menu on click AND scrolling
  const handleLinkClick = useCallback((id: string) => {
      // ⭐ NEW: Call the scroll function passed from the parent page
      scrollToSection(id);
      if (isOpen) {
        setIsOpen(false);
      }
    },
    [scrollToSection, isOpen] // Dependencies: scrollToSection (stable from parent) and isOpen
  );

  // --- Dynamic Classes Configuration ---
  const baseClasses =
    "py-15 flex items-center w-full px-0 sticky top-0 z-50 transition-all duration-300 ease-in-out ";

  // State 1 (Transparent): Transparent BG, White Text
  const transparentStateClasses = "bg-transparent text-white shadow-none";

  // State 2 (Scrolled): White BG, Dark Text, Shadow
  const solidStateClasses = "bg-white shadow-md text-black";

  const dynamicClasses = scrolled || isOpen ? solidStateClasses : transparentStateClasses;

  return (
    <header className={`${baseClasses} ${dynamicClasses}`}>
      <nav className="flex flex-col w-full custom-container">
        
        {/* Top Bar (Logo and Hamburger) */}
        <div className="flex flex-nowrap w-full justify-between items-center h-16 sm:h-20">
          
          {/* Logo/Site Title - Remains a Next.js Link to the homepage */}
          <Link href="/" onClick={() => setIsOpen(false)}
            className={`text-2xl font-medium transition-colors duration-300 ${scrolled || isOpen ? "text-black" : "text-white"}`}
          >
            ALTA MARITIME
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center justify-center gap-6">
            {NAV_LINKS.map((link) => {
              
              const isCTA = link.name === 'Get Quote';

              // 1. Define base classes for regular links (depends on scroll state)
              const regularLinkClasses = `transition duration-150 cursor-pointer ${
                scrolled || isOpen ? "text-gray-800 hover:text-[#00D9FF]" : "text-white hover:text-[#00D9FF]"
              }`;
              
              // 2. Define classes for the CTA button (always solid)
              const ctaClasses = `
                py-2 px-4 rounded-sm whitespace-nowrap text-gray-800 cursor-pointer text-center
                bg-[#00D9FF] hover:bg-[#00FFFF]/80
              `;

              return (
                <li key={link.name} className="list-none">
                  {/* ⭐ UPDATED: Use a button with onClick for programmatic smooth scroll */}
                  <button 
                    onClick={() => handleLinkClick(link.id)} 
                    className={isCTA ? ctaClasses : regularLinkClasses}
                  >
                    {link.name}
                  </button>
                </li>
              );
            })}
          </div>

          {/* Hamburger/Close Button */}
          <div className="lg:hidden">
            <button onClick={toggleSidebar} className="py-2 text-white">
              {isOpen ? (
                // Always black when open for contrast against the white dropdown
                <IoClose className={`text-3xl text-black`} /> 
              ) : (
                // Color changes based on scroll state when closed
                <RxHamburgerMenu className={`text-3xl ${scrolled || isOpen ? "text-black" : "text-white"}`} />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Dropdown Navigation */}
        {isOpen && (
          <ul 
            // FIXED white background and dark text, matching the original sidebar
            className={`lg:hidden flex flex-col space-y-2 pb-4 pt-2 bg-white text-black border-t border-gray-200`}
          >
            {NAV_LINKS.map((link) => {
              const isCTA = link.name === 'Get Quote';
              
              return (
                // ⭐ UPDATED: key is now link.id
                <li key={link.name}>
                  {/* ⭐ UPDATED: Use a button with onClick for programmatic smooth scroll */}
                  <button 
                    onClick={() => handleLinkClick(link.id)} 
                    // Styling for regular links and CTA in the mobile dropdown
                    className={`block py-2 transition duration-200 text-base w-full text-left
                      ${isCTA 
                        ? 'bg-[#00D9FF] flex items-center justify-center text-gray-800 font-medium w-full text-center rounded-sm mt-2 hover:bg-[#00FFFF]/80' 
                        // Use gray-700 text and bright blue hover for regular links on white background
                        : 'text-gray-800 hover:text-[#00D9FF] hover:bg-gray-100 px-4'
                      }
                    `}
                  >
                    {link.name}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

      </nav>
    </header>
  );
}
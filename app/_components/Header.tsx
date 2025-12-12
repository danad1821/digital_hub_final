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

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]); 

  // Prevent rendering the header on the admin path
  if (pathname && pathname.startsWith("/admin")) {
    return <></>;
  }

  // --- Dynamic Classes Configuration ---
  const baseClasses =
    "py-15 flex items-center w-full px-0 sticky top-0 z-50 transition-all duration-300 ease-in-out ";

  // State 1 (Transparent): Transparent BG, White Text
  const transparentStateClasses = "bg-transparent text-white shadow-none";

  // State 2 (Scrolled): White BG, Dark Text, Shadow
  const solidStateClasses = "bg-white shadow-md text-black";

  const dynamicClasses = scrolled || isOpen ? solidStateClasses : transparentStateClasses;
  
  // Mobile menu links need to handle closing the menu on click
  const handleLinkClick = () => {
      if (isOpen) {
          setIsOpen(false);
      }
  };

  return (
    <header className={`${baseClasses} ${dynamicClasses}`}>
      <nav className="flex flex-col w-full custom-container">
        
        {/* Top Bar (Logo and Hamburger) */}
        <div className="flex flex-nowrap w-full justify-between items-center h-16 sm:h-20">
          
          {/* Logo/Site Title */}
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
              const regularLinkClasses = `transition duration-150 ${
                scrolled || isOpen ? "text-gray-700 hover:text-[#00D9FF]" : "text-white hover:text-[#00D9FF]"
              }`;
              
              // 2. Define classes for the CTA button (always solid)
              const ctaClasses = `
                py-2 px-4 rounded-sm whitespace-nowrap text-black
                bg-[#00D9FF] hover:bg-[#00FFFF]/80
              `;

              return (
                <li key={link.name} className="list-none">
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
        
        {/* ⭐️ MODIFIED: Mobile Dropdown Navigation (Fixed White/Black Colors) ⭐️ */}
        {isOpen && (
          <ul 
            // FIXED white background and dark text, matching the original sidebar
            className={`lg:hidden flex flex-col space-y-2 pb-4 pt-2 bg-white text-black border-t border-gray-200`}
          >
            {NAV_LINKS.map((link) => {
                const isCTA = link.name === 'Get Quote';
                
                return (
                    <li key={link.name}>
                        <Link 
                            href={link.href} 
                            onClick={handleLinkClick}
                            // Styling for regular links and CTA in the mobile dropdown
                            className={`block py-2 transition duration-200 text-base
                                ${isCTA 
                                    ? 'bg-[#00D9FF] text-black font-medium w-full text-center rounded-sm mt-2 hover:bg-[#00FFFF]/80' 
                                    // Use gray-700 text and bright blue hover for regular links on white background
                                    : 'text-gray-700 hover:text-[#00D9FF] hover:bg-gray-100' 
                                }
                            `}
                        >
                            {link.name}
                        </Link>
                    </li>
                );
            })}
          </ul>
        )}

      </nav>
    </header>
  );
}
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Loader } from "lucide-react"; // Added LogOut and Loader icons
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import axios from "axios"; // Added axios

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // New state for loading indicator
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  // Function to handle the logout process
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Make a GET request to the logout API route
      await axios.get("/api/users/logout");

      // On successful logout (cookie deleted by server), redirect to the login page
      router.push("/admin"); // Assuming /admin is your admin login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Optional: Show an error notification to the user
      alert("Logout failed. Please try again."); 
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Skip rendering the header on the admin base path (likely the login page)
  if (pathname === "/admin") {
    return <></>;
  }

  // Component for the Logout Button
  const LogoutButton = ({ isMobile = false }) => (
    <div
      onClick={handleLogout}
      className={`
        flex items-center justify-center cursor-pointer font-medium border border-white py-1 px-4 rounded-md 
        transition duration-200 
        ${isMobile ? 'w-fit py-2' : ''}
        ${isLoggingOut
          ? 'bg-gray-500 text-white border-gray-500 disabled:cursor-not-allowed'
          : 'text-white hover:bg-[#00FFFF] hover:text-[#0A1C30] hover:border-[#00FFFF]'
        }
      `}
    >
      {isLoggingOut ? (
        <>
          <Loader className="w-5 h-5 mr-2 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </>
      )}
    </div>
  );

  return (
    <header className="bg-[#0A1C30] shadow-lg sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop & Mobile Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-[#00FFFF] font-bold text-xl tracking-wider">
            ALTA MARITIME
          </div>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center space-x-6">
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/services">Services</Link>
            </li>
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/pages">Pages</Link>
            </li>
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/gallery">Gallery</Link>
            </li>
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/messages">Messages</Link>
            </li>
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/locations">Locations</Link>
            </li>

            <li>
              <LogoutButton />
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            disabled={isLoggingOut} // Disable while logging out
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {open && (
          <ul className="md:hidden flex flex-col space-y-4 pb-4 pt-2 border-t border-gray-700">
            {/* Navigation links (kept as is) */}
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/services" onClick={() => setOpen(false)}>
                Services
              </Link>
            </li>
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/pages" onClick={() => setOpen(false)}>
                Pages
              </Link>
            </li>
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/gallery" onClick={() => setOpen(false)}>
                Gallery
              </Link>
            </li>
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/locations" onClick={() => setOpen(false)}>
                Locations
              </Link>
            </li>
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/messages" onClick={() => setOpen(false)}>
                Messages
              </Link>
            </li>

            {/* Mobile Logout Button */}
            <li>
              <LogoutButton isMobile={true} />
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
// Header.tsx
'use client';

import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5'; // Using a close icon for the sidebar
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define the navigation links
const NAV_LINKS = [
  { name: 'About us', href: '/about_us' },
  { name: 'Partners & Agents', href: '/partners_and_agents' },
  { name: 'Map', href: '/map' },
  { name: 'Contact us', href: '/contact_us' },
];


const MobileSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <>
      {/* Overlay to close the sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-500 opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Close button at the top */}
          <button onClick={onClose} className="self-end p-2 mb-4">
            <IoClose className="text-3xl" />
          </button>
          
          {/* Navigation Links */}
          <ul className="list-none flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.name} className="text-lg font-medium py-2 border-b border-gray-100">
                <Link href={link.href} onClick={onClose}>
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

  const toggleSidebar = () => setIsOpen(!isOpen);

  if(pathname === "/admin"){
    return(
      <></>
    )
  }

  return (
    <header className="py-4 flex items-center bg-white px-0 sticky top-0 z-50 shadow-md">
      <nav className="flex flex-nowrap w-full custom-container">
        <ul className="list-none w-full flex justify-between items-center">
          
          {/* Logo/Site Title (Always Visible) */}
          <li className="text-2xl font-medium">Alta Maritime</li>
          
          {/* Desktop Navigation Links (Visible on 'lg' screens and up) */}
          <div className="hidden lg:flex items-center justify-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.name} className="font-medium hover:text-blue-600 transition duration-150">
                <a href={link.href}>
                  {link.name}
                </a>
              </li>
            ))}
          </div>
          
          {/* Hamburger Button (Visible ONLY on mobile/tablet) */}
          <div className="lg:hidden">
            <button onClick={toggleSidebar} className="p-2">
              <RxHamburgerMenu className="text-3xl text-gray-800" />
            </button>
          </div>
          
        </ul>
      </nav>
      
      {/* The Sidebar Component */}
      <MobileSidebar isOpen={isOpen} onClose={toggleSidebar} />
    </header>
  );
}
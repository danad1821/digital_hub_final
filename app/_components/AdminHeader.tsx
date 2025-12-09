"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);

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
              <Link href="/admin/about">About</Link>
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

            <li
              className="text-white font-medium border border-white py-1 px-4 rounded-md cursor-pointer 
                hover:bg-[#00FFFF] hover:text-[#0A1C30] hover:border-[#00FFFF] transition duration-200"
            >
              Logout
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {open && (
          <ul className="md:hidden flex flex-col space-y-4 pb-4 pt-2 border-t border-gray-700">
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/services" onClick={() => setOpen(false)}>
                Services
              </Link>
            </li>
            <li className="text-white hover:text-[#00FFFF] transition duration-200">
              <Link href="/admin/about" onClick={() => setOpen(false)}>
                About
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

            <li
              className="text-white font-medium border border-white py-2 px-4 w-fit rounded-md cursor-pointer 
                hover:bg-[#00FFFF] hover:text-[#0A1C30] hover:border-[#00FFFF] transition duration-200"
            >
              Logout
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}

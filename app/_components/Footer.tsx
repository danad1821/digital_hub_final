// Footer.tsx
import React from 'react';
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    // Contact Information (Used for titles)
    const contactInfo = {
        headOffice: {
            name: "Head Office (Lebanon)",
        },
        algeriaOffice: {
            name: "Algeria Office",
        }
    };

    // Placeholder Links (Replace with actual routes)
    const quickLinks = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/aboutus" },
        { name: "Partners & Agents", href: "/partners_and_agents" },
        { name: "map", href: "/map" },
        { name: "Contact Us", href: "/contactus" },
    ];

    // Placeholder for social links
    const socialLinks = [
        { icon: FaFacebook, href: "" },
        { icon: FaLinkedin, href: "" },
        { icon: FaTwitter, href: "" },
    ];


    return (
        <footer className="bg-[#0A1C30] text-gray-300">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 custom-container">
                
                {/* --- Main FLEX Container: Logo, Links, Offices ---
                  - flex-wrap: Allows columns to wrap onto a new line on smaller screens.
                  - gap-y-8: Provides vertical spacing when columns wrap.
                  - gap-x-12: Provides horizontal spacing on desktop.
                */}
                <div className="flex flex-wrap gap-y-8 gap-x-12">
                    
                    {/* Column 1: Company Logo & Slogan (Takes up ~50% on tablets, more on mobile) */}
                    <div className="w-full sm:w-[calc(50%-0.75rem)] lg:w-96">
                        <h3 className="text-2xl font-bold text-[#FF8C00] mb-4">
                            ALTA MARITIME
                        </h3>
                        <p className="text-base text-gray-400">
                            Your trusted partner in shipping & freight forwarding.
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            East Med & North Africa Specialists | Est. 2002
                        </p>
                    </div>

                    {/* Column 2: Quick Links (Fixed Width / Less than 25%) */}
                    <div className="min-w-[10rem] lg:flex-1">
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} className="hover:text-[#FF8C00] transition duration-150">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Head Office Title (Fixed Width / Less than 25%) */}
                    <div className="min-w-[10rem] lg:flex-1">
                        <h4 className="text-lg font-semibold text-white mb-4">
                            {contactInfo.headOffice.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                            See Contact Page for Details
                        </p>
                    </div>

                    {/* Column 4: Algeria Office Title (Fixed Width / Less than 25%) */}
                    <div className="min-w-[10rem] lg:flex-1 pt-1 pb-1">
                        <h4 className="text-lg font-semibold text-white mb-4">
                            {contactInfo.algeriaOffice.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                            See Contact Page for Details
                        </p>
                    </div>
                    
                </div>
                
                {/* --- Separator --- */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                    
                    {/* --- Socials & Copyright Row (Already uses Flex) --- */}
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        
                        {/* Social Media Icons */}
                        <div className="space-x-4 text-white text-2xl order-2 md:order-1 mt-6 md:mt-0 flex gap-1">
                            {socialLinks.map((social) => (
                                <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#FF8C00] transition duration-150">
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                        
                        {/* Copyright */}
                        <p className="text-sm text-gray-500 order-1 md:order-2">
                            &copy; {new Date().getFullYear()} Alta Maritime. All rights reserved.
                        </p>
                        
                    </div>
                </div>
            </div>
        </footer>
    );
}
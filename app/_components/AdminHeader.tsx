import Link from "next/link"

export default function AdminHeader(){
    // Utility classes for the custom colors:
    // Dark Navy: bg-[#0A1C30] / text-[#0A1C30] / border-[#0A1C30]
    // Cyan/Aqua: text-[#00FFFF] / hover:text-[#00FFFF] / hover:bg-[#00FFFF]

    return(
        // Header with Dark Navy background, fixed position, and a shadow
        <header className="bg-[#0A1C30] shadow-lg sticky top-0 z-10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="flex items-center h-16 space-x-6">
                    
                    {/* Brand/Logo (Cyan text, bold, pushes items to the right) */}
                    <li className="text-[#00FFFF] font-bold text-xl tracking-wider mr-auto">
                        ALTA MARITIME
                    </li>
                    
                    {/* Navigation Links */}
                    <li className="text-white hover:text-[#00FFFF] transition duration-200">
                        <Link href='/admin/services'>Services</Link>
                    </li>
                    <li className="text-white hover:text-[#00FFFF] transition duration-200">
                        <Link href='/admin/gallery'>Gallery</Link>
                    </li>
                    <li className="text-white hover:text-[#00FFFF] transition duration-200">
                        <Link href='/admin/messages'>Messages</Link>
                    </li>
                    
                    {/* Logout Button (Styled as a distinct button) */}
                    <li className="text-white font-medium border border-white py-1 px-4 rounded-md cursor-pointer 
                                   hover:bg-[#00FFFF] hover:text-[#0A1C30] hover:border-[#00FFFF] transition duration-200">
                        Logout
                    </li>
                </ul>
            </nav>
        </header>
    )
}
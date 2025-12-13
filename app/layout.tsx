import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";



export const metadata: Metadata = {
  title: "Alta Maritime",
  description: "Your trusted partner in shipping & freight forwarding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased bg-white text-gray-800 overflow-x-none"
      >
        {/* <Header/> */}
        {children}
        <Footer/>
      </body>
    </html>
  );
}

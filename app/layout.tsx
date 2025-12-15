import type { Metadata } from "next";
import "./globals.css";

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
      </body>
    </html>
  );
}

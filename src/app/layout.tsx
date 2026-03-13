import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BAZAGOD | Luxury Hotel on Lake Tanganyika — Bujumbura, Burundi",
  description:
    "An exclusive luxury retreat on the shores of Lake Tanganyika in Bujumbura, Burundi. Refined rooms, world-class amenities, and unforgettable views.",
  keywords: ["luxury hotel", "Bujumbura", "Burundi", "Lake Tanganyika", "BAZAGOD"],
  openGraph: {
    title: "BAZAGOD — Luxury Hotel, Bujumbura",
    description: "Where luxury meets the heart of Africa. Lake Tanganyika, Burundi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
      <body className="antialiased bg-charcoal text-cream min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

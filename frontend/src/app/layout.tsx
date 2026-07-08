import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ServiceIcons from "@/components/ServiceIcons";
import Footer from "@/components/Footer";
import LiveChatButton from "@/components/LiveChatButton";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "A9 Global Travels & Tours | Luxury Travel Myanmar",
  description:
    "A9 Global Travels & Tours — Your premier IATA-accredited luxury travel partner in Myanmar. Offering premium tours, hotel bookings, car rentals, visa services, and travel insurance. Experience world-class travel with personalized service since 2015.",
  keywords: [
    "Luxury Travel Myanmar",
    "Myanmar Tours",
    "Yangon Travel Agency",
    "IATA Accredited",
    "A9 Global",
    "Travel Myanmar",
    "Hotel Booking Yangon",
    "Visa Services Myanmar",
    "Car Rental Myanmar",
    "Travel Insurance",
  ],
  openGraph: {
    title: "A9 Global Travels & Tours | Luxury Travel Myanmar",
    description:
      "Premium travel experiences crafted for the discerning explorer. IATA-accredited luxury travel agency in Yangon, Myanmar.",
    type: "website",
    locale: "en_US",
    siteName: "A9 Global Travels & Tours",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} overflow-x-hidden`}>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900`}>
        <Navbar />
        <ServiceIcons />
        <main>{children}</main>
        <Footer />
        <LiveChatButton />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1B2A4A",
              color: "#FFFFFF",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "12px",
            },
            success: {
              iconTheme: {
                primary: "#D4AF37",
                secondary: "#0A1628",
              },
            },
          }}
        />
      </body>
    </html>
  );
}

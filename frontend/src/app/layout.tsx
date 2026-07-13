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
  metadataBase: new URL("https://a9travel.com"),
  title: {
    default: "A9 Global Travels & Tours | Luxury Travel Myanmar",
    template: "%s | A9 Global Travel",
  },
  description:
    "Your premier IATA-accredited luxury travel partner in Myanmar. Premium tours, hotels, cars, visas, insurance. Since 2015.",
  keywords: [
    "Myanmar Tours", "Yangon Travel Agency", "IATA Travel Myanmar",
    "Hotel Booking Yangon", "Visa Services Myanmar", "Car Rental Myanmar",
    "Travel Insurance Myanmar", "Luxury Travel Myanmar",
  ],
  openGraph: {
    type: "website",
    siteName: "A9 Global Travels & Tours",
    title: "A9 Global Travels & Tours | Luxury Travel Myanmar",
    description: "Premium travel experiences in Myanmar.",
    url: "https://a9travel.com",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "A9 Global Travels & Tours",
    description: "Premium travel experiences in Myanmar.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [{ url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" }],
    apple: { url: "/favicon-180x180.png", sizes: "180x180" },
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

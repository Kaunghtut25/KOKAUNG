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
    icon: [
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: [
      { url: "/favicon-180x180.png", sizes: "180x180" },
    ],
  },
};
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "name": "A9 Global Travels & Tours",
  "url": "https://a9travel.com",
  "logo": "https://a9travel.com/favicon-192x192.png",
  "description": "Your premier IATA-accredited luxury travel partner in Myanmar. Premium tours, hotels, cars, visas, insurance.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Yangon",
    "addressCountry": "MM"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+959123456789",
    "contactType": "customer service"
  },
  "sameAs": []
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} overflow-x-hidden`}>
      <head>
        <meta name="google-site-verification" content="5Jm0-k00otih6d0kErhwREEJ5NNdqCUyCt2Cr9n7ZCs" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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

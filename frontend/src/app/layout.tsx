import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootClient from "@/components/RootClient";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://a9travel.com"),
  title: {
    default: "A9 Global Travels & Tours | Luxury Travel in Myanmar",
    template: "%s | A9 Global Travel",
  },
  description:
    "Your premier IATA-accredited luxury travel partner in Myanmar since 2015. Premium tours, hotels, cars, visas, insurance & cruises — book your journey today.",
  keywords: [
    "Myanmar Tours", "Yangon Travel Agency", "IATA Travel Myanmar",
    "Hotel Booking Yangon", "Visa Services Myanmar", "Car Rental Myanmar",
    "Travel Insurance Myanmar", "Luxury Travel Myanmar",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "A9 Global Travels & Tours",
    title: "A9 Global Travels & Tours | Luxury Travel in Myanmar",
    description: "A9 Global Travels & Tours: your premier IATA-accredited luxury travel partner in Myanmar. Premium tours, hotels, cars, visas & insurance since 2015.",
    url: "https://a9travel.com",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "A9 Global Travels Myanmar luxury travel preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "A9 Global Travels & Tours",
    description: "A9 Global Travels & Tours: your premier IATA-accredited luxury travel partner in Myanmar. Premium tours, hotels, cars, visas & insurance since 2015.",
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
    "telephone": "+959781617111",
    "email": "info@a9globaltravel.com",
    "contactType": "customer service"
  },
  "sameAs": ["https://facebook.com/a9globaltravel", "https://instagram.com/a9globaltravel"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} overflow-x-hidden`}>
      <head>
        <meta name="x-version" content="v4-toggle-fix-20260729-1255" />
        <meta name="google-site-verification" content="5Jm0-k00otih6d0kErhwREEJ5NNdqCUyCt2Cr9n7ZCs" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* FIX: 2026-08-12 zoom-stable global viewport vars */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){function u(){var v=window.visualViewport,w=v?v.width:window.innerWidth,h=v?v.height:window.innerHeight,d=document.documentElement;d.style.setProperty("--vvw",w+"px");d.style.setProperty("--vvh",h+"px");}u();if(window.visualViewport){window.visualViewport.addEventListener("resize",u);window.visualViewport.addEventListener("scroll",u);}window.addEventListener("resize",u);})();` }} />
      </head>
      <body className={`${inter.className} min-h-screen bg-white text-gray-900`}>
        <RootClient>{children}</RootClient>
        <GoogleAnalytics />
      </body>
    </html>
  );
}

// Need to import GoogleAnalytics separately for server component
import GoogleAnalytics from "@/components/GoogleAnalytics";

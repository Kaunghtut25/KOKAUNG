"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import ServiceIcons from "@/components/ServiceIcons";
import Footer from "@/components/Footer";
import LiveChatWidget from "@/components/LiveChatWidget";
import { Toaster } from "react-hot-toast";

export default function RootClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/auth");

  if (isAdmin) {
    return (
      <>
        <main>{children}</main>
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
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ServiceIcons />
      <main>{children}</main>
      <Footer />
      <LiveChatWidget />
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
    </>
  );
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flight Search & Booking - Myanmar to Worldwide",
  description:
    "Search and book flights from Myanmar to worldwide destinations. Best fares with A9 Global Travels.",
};

export default function FlightsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

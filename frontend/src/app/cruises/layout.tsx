import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Cruise Bookings & River Cruises",
  description: "Book cruises worldwide and Myanmar river cruises with A9 Global Travels. Halong Bay, Mekong River, Irrawaddy and more.",
};
export default function CruisesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

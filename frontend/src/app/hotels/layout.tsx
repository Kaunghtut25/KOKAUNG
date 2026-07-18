import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Hotel Booking in Myanmar & Worldwide",
  description: "Book luxury hotels in Myanmar and worldwide with A9 Global Travels. Best rates, instant confirmation, premium service.",
};
export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

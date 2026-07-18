import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Car Rental & Chauffeur Service Myanmar",
  description: "Premium car rental and chauffeur services in Yangon, Myanmar. SUVs, sedans, vans for hire with professional drivers.",
};
export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

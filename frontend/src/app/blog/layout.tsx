import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Travel Blog & Tips - Myanmar Travel Guide",
  description: "Read the latest travel tips, destination guides, and industry news from A9 Global Travels blog.",
};
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

interface FallbackResult {
  id: string;
  title: string;
  destination: string;
  price: number;
  airline: string;
  duration: string;
  image: string;
}

export function searchFallbackData(query: string, destination?: string): FallbackResult[] {
  const q = (query || destination || "").toLowerCase().trim();
  const allResults: FallbackResult[] = [
    { id: "1", title: "Yangon City Tour", destination: "Yangon", price: 120, airline: "A9 Global", duration: "3 days", image: "/images/unsplash-9.jpg" },
    { id: "2", title: "Bagan Temple Discovery", destination: "Bagan", price: 280, airline: "A9 Global", duration: "4 days", image: "/images/unsplash-18.jpg" },
    { id: "3", title: "Inle Lake Adventure", destination: "Inle Lake", price: 350, airline: "A9 Global", duration: "5 days", image: "/images/unsplash-34.jpg" },
    { id: "4", title: "Bangkok Express", destination: "Bangkok", price: 180, airline: "Thai Airways", duration: "3 days", image: "/images/unsplash-9.jpg" },
    { id: "5", title: "Singapore Highlights", destination: "Singapore", price: 420, airline: "Singapore Airlines", duration: "4 days", image: "/images/unsplash-15.jpg" },
    { id: "6", title: "Dubai Luxury Package", destination: "Dubai", price: 890, airline: "Emirates", duration: "5 days", image: "/images/unsplash-11.jpg" },
    { id: "7", title: "Tokyo Explorer", destination: "Tokyo", price: 750, airline: "ANA", duration: "6 days", image: "/images/unsplash-21.jpg" },
    { id: "8", title: "Bali Paradise", destination: "Bali", price: 520, airline: "Garuda Indonesia", duration: "5 days", image: "/images/unsplash-18.jpg" },
  ];
  if (!q) return allResults.slice(0, 6);
  return allResults.filter(r => r.destination.toLowerCase().includes(q) || r.title.toLowerCase().includes(q));
}

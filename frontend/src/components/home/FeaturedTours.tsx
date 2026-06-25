import Link from 'next/link';
import { TourCard } from '@/components/tours/TourCard';

const PLACEHOLDER_TOURS = [
  {
    id: '1',
    title: 'Inle Lake Luxury Escape',
    slug: 'inle-lake-luxury',
    destination: 'Inle Lake',
    price: 2500000,
    duration: { days: 4, nights: 3 },
    coverImage: 'https://images.unsplash.com/photo-1559592413-7cec4b0ef6ab?w=800',
    rating: 4.9,
  },
  {
    id: '2',
    title: 'Bagan Sunrise Odyssey',
    slug: 'bagan-sunrise',
    destination: 'Bagan',
    price: 1800000,
    duration: { days: 3, nights: 2 },
    coverImage: 'https://images.unsplash.com/photo-1583417319070-4a3eb8f2c187?w=800',
    rating: 4.8,
  },
  {
    id: '3',
    title: 'Myeik Archipelago Voyage',
    slug: 'myeik-voyage',
    destination: 'Myeik',
    price: 4500000,
    duration: { days: 7, nights: 6 },
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    rating: 5.0,
  },
];

export function FeaturedTours() {
  return (
    <section className="py-20 px-4 bg-cloud-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-sky-900 mb-4">
            Featured <span className="text-gold-400">Journeys</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Handpicked luxury experiences designed for the discerning traveler
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLACEHOLDER_TOURS.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/tours" className="btn-outline-gold">
            View All Tours
          </Link>
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { Star } from 'lucide-react';

interface TourCardProps {
  tour: {
    id: string;
    title: string;
    slug: string;
    destination: string;
    price: number;
    duration: { days: number; nights: number };
    coverImage: string;
    rating: number;
  };
}

export function TourCard({ tour }: TourCardProps) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group glass-card overflow-hidden hover:shadow-gold transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={tour.coverImage}
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-gold-400 text-white text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          {tour.rating}
        </div>
      </div>

      <div className="p-6">
        <p className="text-sky-600 text-sm font-medium mb-1">{tour.destination}</p>
        <h3 className="text-xl font-serif font-bold text-sky-900 mb-2 group-hover:text-gold-600 transition-colors">
          {tour.title}
        </h3>
        <p className="text-slate-500 text-sm mb-4">
          {tour.duration.days} Days / {tour.duration.nights} Nights
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gold-600">{formatPrice(tour.price)}</span>
          <span className="text-sky-600 text-sm font-medium group-hover:underline">View Details →</span>
        </div>
      </div>
    </Link>
  );
}

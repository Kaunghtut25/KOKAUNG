import Link from 'next/link';
import Image from 'next/image';

const DESTINATIONS = [
  { name: 'Inle Lake', slug: 'inle-lake', image: 'https://images.unsplash.com/photo-1559592413-7cec4b0ef6ab?w=600' },
  { name: 'Bagan', slug: 'bagan', image: 'https://images.unsplash.com/photo-1583417319070-4a3eb8f2c187?w=600' },
  { name: 'Ngwe Saung', slug: 'ngwe-saung', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' },
  { name: 'Kyaiktiyo', slug: 'kyaiktiyo', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600' },
];

export function DestinationsGrid() {
  return (
    <section className="py-20 px-4 bg-sky-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-sky-900 mb-4">
            Dream <span className="text-gold-400">Destinations</span>
          </h2>
          <p className="text-slate-600">Discover Myanmar&apos;s most breathtaking landscapes</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-gold transition-all duration-300"
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-gold-400 transition-colors">
                  {dest.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

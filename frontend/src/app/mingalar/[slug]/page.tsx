'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default function MingalarDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [travelers, setTravelers] = useState(1);
  const [travelDate, setTravelDate] = useState('');

  // Resolve slug to item — mingalar is a section in kalayData
  const item = kalayData.mingalar?.items?.find(
    (d: { slug: string; title: string }) =>
      d.slug === slug || d.title.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!item) {
    notFound();
  }

  const handleBookNow = () => {
    const bookUrl = new URL('/book-now', window.location.origin);
    bookUrl.searchParams.set('type', 'mingalar');
    bookUrl.searchParams.set('title', item.title);
    bookUrl.searchParams.set('travelers', String(travelers));
    bookUrl.searchParams.set('travelDate', travelDate);
    window.location.href = bookUrl.toString();
  };

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTravelDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Image */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <Link
            href="/mingalar"
            className="mb-4 inline-flex items-center gap-2 text-sm text-orange-400 transition-colors hover:text-orange-300"
          >
            ← Back to Sky Lounge
          </Link>
          <h1 className="text-4xl font-bold text-white md:text-5xl">{item.title}</h1>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-gray-300">{item.desc}</p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
              {/* Service Title with Icon */}
              <div className="mb-4 flex items-center gap-3">
                {item.icon && (
                  <span className="text-3xl">{item.icon}</span>
                )}
                <h2 className="text-xl font-bold text-white">{item.title}</h2>
              </div>

              {/* Description Snippet */}
              <p className="mb-6 text-sm leading-relaxed text-gray-400">
                {item.desc.substring(0, 100)}{item.desc.length > 100 ? '...' : ''}
              </p>

              {/* Travel Date */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white
                    focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Guests Counter */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Guests
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700
                      text-lg text-white transition-colors hover:border-orange-500 hover:text-orange-400"
                  >
                    −
                  </button>
                  <span className="min-w-[3rem] text-center text-lg font-semibold text-white">
                    {travelers}
                  </span>
                  <button
                    onClick={() => setTravelers(travelers + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700
                      text-lg text-white transition-colors hover:border-orange-500 hover:text-orange-400"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price: On Request */}
              <div className="mb-6 rounded-lg border border-gray-800 bg-gray-800/50 p-4 text-center">
                <p className="text-lg font-bold text-orange-400">Price on Request</p>
                <p className="text-xs text-gray-500">Contact us for pricing details</p>
              </div>

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="mb-3 w-full rounded-lg bg-orange-500 px-6 py-3.5 font-semibold text-white
                  transition-all hover:bg-orange-600 active:scale-[0.98]"
              >
                Contact Us
              </button>

              <p className="text-center text-xs text-gray-500">
                No payment required to book
              </p>
            </div>

            {/* Back Link (mobile-friendly duplicate) */}
            <div className="mt-4 text-center lg:hidden">
              <Link
                href="/mingalar"
                className="text-sm text-orange-400 transition-colors hover:text-orange-300"
              >
                ← Back to Sky Lounge
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

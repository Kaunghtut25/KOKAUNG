import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-sky-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-serif font-bold text-gold-400 mb-4">
              Heaven on the Clouds
            </h3>
            <p className="text-sky-100 max-w-md">
              Future-built luxury travel experiences across Myanmar. Discover paradise above the clouds.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gold-400 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sky-100">
              <li><Link href="/tours" className="hover:text-white transition-colors">Tours</Link></li>
              <li><Link href="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold-400 mb-4">Contact</h4>
            <ul className="space-y-2 text-sky-100 text-sm">
              <li>Yangon, Myanmar</li>
              <li>+95 9 XXX XXX XXX</li>
              <li>hello@heavenonclouds.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sky-700 mt-8 pt-8 text-center text-sky-200 text-sm">
          © {new Date().getFullYear()} Heaven on the Clouds. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

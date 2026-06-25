import Link from 'next/link';

const navLinks = [
  { href: '/tours', label: 'Tours' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold bg-gradient-hero bg-clip-text text-transparent">
              Heaven on Clouds
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-gold-400 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-600 hover:text-sky-600 transition-colors">
              Login
            </Link>
            <Link href="/tours" className="btn-gold text-sm py-2 px-4">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

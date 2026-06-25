import Link from 'next/link';

const adminLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/tours', label: 'Tours' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/users', label: 'Users' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-16">
      <aside className="w-64 bg-sky-900 text-white p-6">
        <h2 className="text-xl font-serif font-bold text-gold-400 mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-2 rounded-lg hover:bg-sky-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 bg-cloud-white">{children}</main>
    </div>
  );
}

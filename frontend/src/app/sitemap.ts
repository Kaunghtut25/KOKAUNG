import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://a9globaltravel.com';
  const now = new Date();
  return [
    { url: base, lastModified: now, priority: 1 },
    { url: base+'/tours', lastModified: now, priority: 0.9 },
    { url: base+'/hotels', lastModified: now, priority: 0.9 },
    { url: base+'/cars', lastModified: now, priority: 0.9 },
    { url: base+'/visas', lastModified: now, priority: 0.9 },
    { url: base+'/insurance', lastModified: now, priority: 0.8 },
    { url: base+'/cruises', lastModified: now, priority: 0.8 },
    { url: base+'/mingalar', lastModified: now, priority: 0.7 },
    { url: base+'/blog', lastModified: now, priority: 0.7 },
    { url: base+'/about', lastModified: now, priority: 0.6 },
    { url: base+'/contact', lastModified: now, priority: 0.6 },
    { url: base+'/book-now', lastModified: now, priority: 0.8 },
    { url: base+'/faq', lastModified: now, priority: 0.5 },
    { url: base+'/terms', lastModified: now, priority: 0.3 },
    { url: base+'/privacy', lastModified: now, priority: 0.3 },
  ];
}

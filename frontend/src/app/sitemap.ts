import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.a9travel.com';
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, priority: 1 },
    { url: base + '/tours', lastModified: now, priority: 0.9 },
    { url: base + '/hotels', lastModified: now, priority: 0.9 },
    { url: base + '/cars', lastModified: now, priority: 0.9 },
    { url: base + '/visas', lastModified: now, priority: 0.9 },
    { url: base + '/insurance', lastModified: now, priority: 0.8 },
    { url: base + '/cruises', lastModified: now, priority: 0.8 },
    { url: base + '/mingalar', lastModified: now, priority: 0.7 },
    { url: base + '/blog', lastModified: now, priority: 0.7 },
    { url: base + '/about', lastModified: now, priority: 0.6 },
    { url: base + '/contact', lastModified: now, priority: 0.6 },
    { url: base + '/book-now', lastModified: now, priority: 0.8 },
    { url: base + '/faq', lastModified: now, priority: 0.5 },
    { url: base + '/terms', lastModified: now, priority: 0.3 },
    { url: base + '/privacy', lastModified: now, priority: 0.3 },
  ];

  // Tour detail pages (real slugs, de-duplicated)
  const tourSlugs = [
    'mandalay-royal-heritage',
    'mergui-archipelago-adventure',
    'yangon-city-highlights',
    'mrauk-u-ancient-kingdom',
    'bagan-temple-explorer',
    'kalaw-trekking-experience',
    'pyin-oo-lwin-hill-station',
  ];
  tourSlugs.forEach((slug) => {
    urls.push({ url: base + '/tours/' + slug, lastModified: now, priority: 0.8 });
  });

  // Hotel detail pages
  const hotelSlugs = [
    'sule-shangri-la-yangon',
    'inle-princess-resort',
    'sanctum-inle-resort',
    'novotel-yangon-max',
    'eastern-palace-mandalay',
    'bagan-lodge',
  ];
  hotelSlugs.forEach((slug) => {
    urls.push({ url: base + '/hotels/' + slug, lastModified: now, priority: 0.8 });
  });

  // Car detail pages
  const carSlugs = ['toyota-probox', 'honda-cr-v', 'mercedes-s-class', 'ford-transit', 'toyota-hiace'];
  carSlugs.forEach((slug) => {
    urls.push({ url: base + '/cars/' + slug, lastModified: now, priority: 0.7 });
  });

  return urls;
}

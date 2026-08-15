import { MetadataRoute } from 'next';
import { getAll } from '@/lib/persistentStore';

// FIX 2026-08-16: dynamic sitemap from real store data — no stale hardcoded slugs
// (previous hardcoded slugs like kalaw-trekking-experience 404'd; live slug is "kalaw")
function slugify(title: string): string {
  return String(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    { url: base + '/accessibility', lastModified: now, priority: 0.3 },
  ];

  // Dynamic collections from the real datastore; graceful empty on store failure.
  try {
    const tours = (await getAll('tours')) as Record<string, unknown>[];
    const seen = new Set<string>();
    for (const t of tours) {
      if (t.status === 'inactive') continue;
      const slug = slugify(t.title as string);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      urls.push({ url: base + '/tours/' + slug, lastModified: now, priority: 0.8 });
    }
  } catch { /* store unavailable: static pages only */ }

  try {
    const hotels = (await getAll('hotels')) as Record<string, unknown>[];
    const seen = new Set<string>();
    for (const h of hotels) {
      if (h.status === 'inactive') continue;
      const slug = slugify(h.name as string);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      urls.push({ url: base + '/hotels/' + slug, lastModified: now, priority: 0.8 });
    }
  } catch { /* store unavailable */ }

  try {
    const cars = (await getAll('cars')) as Record<string, unknown>[];
    const seen = new Set<string>();
    for (const c of cars) {
      if (c.status === 'inactive') continue;
      const slug = slugify(c.name as string);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      urls.push({ url: base + '/cars/' + slug, lastModified: now, priority: 0.7 });
    }
  } catch { /* store unavailable */ }

  return urls;
}

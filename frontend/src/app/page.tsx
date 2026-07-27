import { getAll } from "@/lib/persistentStore";
import HomePageClient from "@/components/HomePageClient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ mode?: string }> }) {
  const siteConfig = await fetchSiteConfig();
  let initialMode: 'flights' | 'buses' = 'flights';
  if (searchParams) {
    const params = await searchParams;
    if (params.mode === 'buses') initialMode = 'buses';
  }
  return <HomePageClient siteConfig={siteConfig} initialMode={initialMode} />;
}
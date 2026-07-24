import { getAll } from "@/lib/persistentStore";
import HomePageClient from "@/components/HomePageClient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function HomePage() {
  const siteConfig = await fetchSiteConfig();
  return <HomePageClient siteConfig={siteConfig} />;
}

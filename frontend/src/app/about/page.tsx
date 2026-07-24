import { getAll } from "@/lib/persistentStore";
import AboutClient from "./aboutclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function AboutPage() {
  const siteConfig = await fetchSiteConfig();
  return <AboutClient siteConfig={siteConfig || {}} />;
}

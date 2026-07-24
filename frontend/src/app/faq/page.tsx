import { getAll } from "@/lib/persistentStore";
import FaqClient from "./faqclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function FaqPage() {
  const siteConfig = await fetchSiteConfig();
  return <FaqClient siteConfig={siteConfig || {}} />;
}

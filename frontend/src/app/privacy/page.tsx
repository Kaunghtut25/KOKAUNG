import { getAll } from "@/lib/persistentStore";
import PrivacyClient from "./privacyclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function PrivacyPage() {
  const siteConfig = await fetchSiteConfig();
  return <PrivacyClient siteConfig={siteConfig || {}} />;
}

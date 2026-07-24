import { getAll } from "@/lib/persistentStore";
import ContactClient from "./contactclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function ContactPage() {
  const siteConfig = await fetchSiteConfig();
  return <ContactClient siteConfig={siteConfig || {}} />;
}

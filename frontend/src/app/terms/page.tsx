import { getAll } from "@/lib/persistentStore";
import TermsClient from "./termsclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function TermsPage() {
  const siteConfig = await fetchSiteConfig();
  return <TermsClient siteConfig={siteConfig || {}} />;
}

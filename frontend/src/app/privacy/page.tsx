import { getAll } from "@/lib/persistentStore";
import PrivacyClient from "./privacyclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function PrivacyPage() {
  const siteConfig = await fetchSiteConfig();
  const safeConfig = { ...(siteConfig || {}) };
  if (Array.isArray((safeConfig as any).privacy)) {
    (safeConfig as any).privacy = (safeConfig as any).privacy.map((it: any) => ({
      ...it,
      content: typeof it.content === "string" ? it.content.replace(/\+?95 ?9 ?123 ?456 ?789/g, "+95 9 781 617 111") : it.content,
    }));
  }
  return <PrivacyClient siteConfig={safeConfig} />;
}

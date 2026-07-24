import { getAll } from "@/lib/persistentStore";
import BlogClient from "./blogclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function BlogPage() {
  const siteConfig = await fetchSiteConfig();
  const moduleOn = siteConfig?.moduleToggles?.["blog"] !== false;
  if (!moduleOn) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-center"><h1 className="text-3xl text-white font-light mb-3">Coming Soon</h1><p className="text-white/40">This section is temporarily unavailable.</p></div></div>;
  return <BlogClient siteConfig={siteConfig || {}} />;
}

import { getAll } from "@/lib/persistentStore";
import BlogClient from "./blogclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

export default async function BlogPage() {
  const siteConfig = await fetchSiteConfig();
  return <BlogClient siteConfig={siteConfig || {}} />;
}

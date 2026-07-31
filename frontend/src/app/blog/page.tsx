import { getAll } from "@/lib/persistentStore";
import BlogClient from "./blogclient";

async function fetchSiteConfig() {
  try { const items = await getAll("site-config" as any); return items?.[0] || null; }
  catch { return null; }
}

async function getBlogPosts(): Promise<any[]> {
  try {
    const raw = await getAll("blog" as any) as any[];
    if (!raw || raw.length === 0) return [];
    return raw.map((p: any) => ({
      _id: p.id || p._id || "",
      slug: (p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      title: p.title || "",
      content: p.content || p.description || "",
      image: typeof p.images === "string" ? JSON.parse(p.images)[0] : (Array.isArray(p.images) ? p.images[0] : (p.image || p.img || "")),
      author: p.author || "A9 Global",
      tags: typeof p.tags === "string" ? p.tags.split(",").map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(p.tags) ? p.tags : []),
      createdAt: p.createdAt || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const [posts, siteConfig] = await Promise.all([getBlogPosts(), fetchSiteConfig()]);
  // FIX: 2026-08-01 blog module always on (stored site-config had moduleToggles.blog=false)
  return <BlogClient posts={posts} siteConfig={siteConfig || {}} />;
}
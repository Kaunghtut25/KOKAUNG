'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import BackButton from '@/components/BackButton';
import Link from 'next/link';
import { useI18n } from "@/lib/i18n";
import { mmLookup, mmBlogs } from "@/lib/mm-content";
import Image from "next/image";

interface BlogPost {
  _id: string; slug: string; title: string; content: string; image: string;
  author: string; tags: string[]; createdAt: string;
}


export default function BlogDetailPage() {
  const { t, lang } = useI18n();
  const params = useParams();
  const slug = params?.slug as string;
  const [apiPosts, setApiPosts] = useState<Record<string, BlogPost>>({});
  const [postsLoaded, setPostsLoaded] = useState(false);

  // Fetch real blog posts from API (server-side Redis) so list-page slugs resolve
  useEffect(() => {
    let cancelled = false;
    fetch('/api/blog', { cache: 'no-store' })
      .then(function(r) { return r.json(); })
      .then(function(j: any) {
        if (cancelled) return;
        var arr = (j && (j.data || j)) || [];
        if (!Array.isArray(arr)) return;
        var map: Record<string, BlogPost> = {};
        arr.forEach(function(p: any) {
          var ps = p.slug || (p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          if (ps) map[ps] = p;
          if (p._id) map[p._id] = p;
          if (p.id) map[p.id] = p;
        });
        setApiPosts(map);
      })
      .catch(function(e) { console.error('blog api fetch failed', e); })
      .finally(function() { if (!cancelled) setPostsLoaded(true); });
    return function() { cancelled = true; };
  }, []);

  // FIX 2026-08-16 (P0): no fabricated seed/fallback posts — real DB content only
  const allPosts: Record<string, BlogPost> = { ...apiPosts };

  // Find post by slug (works during SSR)
  var found: BlogPost | undefined = slug ? allPosts[slug] : undefined;
  if (!found && slug) {
    found = Object.values(allPosts).find(function(p: any) {
      return (p.slug || '').includes(slug) || 
        (p.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(slug) ||
        (p._id || '').includes(slug);
    });
  }

  const post = useMemo(() => {
    if (lang !== "mm" || !found) return found;
    return { ...found, ...mmLookup(mmBlogs, found) };
  }, [found, lang]);

  // FIX 2026-08-16 (P0): fabricated static posts removed — real DB content only
  if (!postsLoaded) {
    return (
      <main className="min-h-screen bg-white pt-24 text-center">
        <div className="text-gray-500 py-16">{t("blog.loading")}</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-white pt-24 text-center">
      <BackButton />

        <h1 className="text-4xl font-bold text-[#0A1628] mb-4">{t("blog.notFound")}</h1>
        <p className="text-gray-600 mb-8">{t("blog.notFoundDesc")}</p>
        <Link href="/blog" className="text-[#8A6C0B] font-semibold hover:underline">← {t("blog.back")}</Link>
      </main>
    );
  }

  // Render markdown-like content
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold text-[#0A1628] mt-8 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{block.slice(3)}</h2>;
      }
      if (block.startsWith('- **')) {
        return (
          <div key={i} className="my-2 pl-4 border-l-2 border-[#D4AF37]/30">
            <p className="text-gray-800"><strong className="text-[#0A1628]">{block.slice(4, block.indexOf('**:') + 1)}</strong>{block.slice(block.indexOf('**:') + 2)}</p>
          </div>
        );
      }
      if (block.startsWith('- ')) {
        return <li key={i} className="ml-6 text-gray-700 list-disc my-1">{block.slice(2)}</li>;
      }
      return <p key={i} className="text-gray-700 leading-relaxed mb-4">{block}</p>;
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <BackButton />
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image alt={post.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images_v2/hero-blog-v2.jpg'; }} src={post.image || '/images_v2/hero-blog-v2.jpg'} width={1600} height={900} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
          <div className="flex flex-wrap gap-2 mb-3">
            {(post.tags || []).map(tag => (
              <span key={tag} className="px-3 py-1 bg-[#D4AF37]/80 text-white text-xs font-medium rounded-full">{tag}</span>
            ))}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{post.title}</h1>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <span>{post.author}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-lg max-w-none">
          {renderContent(post.content)}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20 text-center">
          <h2 className="text-xl font-bold text-[#0A1628] mb-2">{t("blog.inspired")}</h2>
          <p className="text-gray-600 mb-6">{t("blog.ctaDesc")}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href={"/book-now?type=blog&title=" + encodeURIComponent(post.title) + "&destination=" + encodeURIComponent(post.tags?.join(", ") || "") + "&requests=" + encodeURIComponent("Blog: " + post.title)} className="px-6 py-3 bg-[#D4AF37] text-[#0A1628] font-semibold rounded-full hover:bg-[#C19B2F] transition-colors">{t("blog.bookNow")}</Link>
            <Link href="/contact" className="px-6 py-3 border border-[#D4AF37] text-[#8A6C0B] font-semibold rounded-full hover:bg-[#D4AF37]/10 transition-colors">{t("blog.contactUs")}</Link>
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="text-[#8A6C0B] font-semibold hover:underline">← {t("blog.back")}</Link>
        </div>
      </article>
    </main>
  );
}

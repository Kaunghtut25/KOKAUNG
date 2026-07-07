'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get<BlogPost[]>('/blog');
        const data = res.data as unknown as BlogPost[];
        setPosts(data);
      } catch {
        // Fallback data
        setPosts([
          {
            _id: '1', title: 'Top 10 Must-Visit Destinations in Myanmar',
            content: 'Myanmar is a land of golden pagodas, ancient temples, and breathtaking landscapes. From the plains of Bagan to the serene waters of Inle Lake, here are the top 10 destinations you must visit.',
            image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800&q=80',
            author: 'A9 Global Team', tags: ['Myanmar', 'Travel Tips', 'Destinations'],
            createdAt: new Date().toISOString(),
          },
          {
            _id: '2', title: 'Travel Tips: How to Get the Best Flight Deals',
            content: 'Booking flights can be expensive, but with these insider tips you can save hundreds on your next trip. Learn when to book, which days to fly, and how to use price alerts.',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109bb05?w=800&q=80',
            author: 'A9 Global Team', tags: ['Flights', 'Travel Tips', 'Budget'],
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            _id: '3', title: 'Visa Guide: Everything You Need to Know',
            content: 'Planning an international trip? Our comprehensive visa guide covers requirements for popular destinations including Thailand, Singapore, Japan, and more.',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
            author: 'A9 Global Team', tags: ['Visa', 'Guide', 'International'],
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative pt-24 pb-12 px-4 bg-[#0A1628]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            A9 Global Blog
          </h1>
          <p className="text-gray-400 text-lg">
            Travel tips, destination guides, and the latest news from around the world
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'; }}
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-bold text-[#0A1628] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{post.author}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  tags: string;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get<BlogPost[]>('/admin/blog');
      setPosts((res.data as unknown as BlogPost[]) || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`/api/admin/blog/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, image, tags }),
        });
      } else {
        await api.post('/admin/blog', {
          title, content, image: image || '/images/unsplash-5.jpg',
          author: 'A9 Global Team',
          tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
          createdAt: new Date().toISOString(),
        });
      }
      setTitle(''); setContent(''); setImage(''); setTags(''); setEditingId(null);
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (post: BlogPost) => {
    setTitle(post.title);
    setContent(post.content);
    setImage(post.image);
    setTags(Array.isArray(post.tags) ? (post.tags as unknown as string[]).join(', ') : post.tags || '');
    setEditingId(post._id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6 px-4 max-w-5xl mx-auto" style={{ paddingTop: '5rem' }}>
      <h1 className="text-3xl font-bold text-[#0A1628] mb-8">📝 Blog Management</h1>

      {/* Create/Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 mb-8 border border-gray-200 space-y-4">
        <h2 className="text-lg font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" required
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Post content" required rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL (optional)"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm" />
        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C5A028]">
            {editingId ? 'Update' : 'Publish'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setTitle(''); setContent(''); setImage(''); setTags(''); }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">Cancel</button>
          )}
        </div>
      </form>

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? <p className="text-gray-500">Loading...</p> :
          posts.map((post: BlogPost) => (
            <div key={post._id} className="bg-white rounded-xl p-5 border border-gray-200 flex items-start gap-4">
              <img src={post.image} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#0A1628] truncate">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{post.content}</p>
                <span className="text-xs text-gray-400 mt-2 block">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(post)} className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(post._id)} className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  tags: string;
  createdAt: string;
  phone?: string;
  email?: string;
}

export default function AdminBlogPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [tags, setTags] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageSize, setImageSize] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const handleImageUrlChange = (url: string) => {
    setImageUrlInput(url);
    setImage(url);
    setImagePreview(url);
    setUploadError('');
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processImageFile(file);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setUploadError('Only image files are accepted.'); return; }
    setUploading(true); setUploadError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      const blob = data.uploads?.[0];
      const url = blob.url;
      setImage(url);
      setImagePreview(url);
    } catch (err: any) {
      setUploadError('Upload failed. Try URL paste instead.');
    } finally { setUploading(false); }
  };

  const processImageFile = async (file: File) => {
    const sizeKB = (file.size / 1024).toFixed(1);
    setImageSize(sizeKB + ' KB');
    // Show local preview first
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
    // Upload to server
    await uploadFile(file);
  };

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
        await fetch('/api/admin/blog/' + editingId, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title, content, image, tags, phone, email }),
        });
      } else {
        await api.post('/admin/blog', {
          title, content, image: image || '/images_v2/unsplash-5-v2.jpg',
          author: 'A9 Global Team',
          tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
          phone, email,
          createdAt: new Date().toISOString(),
        });
      }
      setTitle(''); setContent(''); setImage(''); setTags(''); setPhone(''); setEmail('');
      setEditingId(null); setImagePreview(''); setImageSize(''); setUploadError('');
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await fetch('/api/admin/blog/' + id, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (post: BlogPost) => {
    setTitle(post.title);
    setContent(post.content);
    setImage(post.image);
    setTags(Array.isArray(post.tags) ? (post.tags as unknown as string[]).join(', ') : post.tags || '');
    setPhone(post.phone || '');
    setEmail(post.email || '');
    setEditingId(post._id);
    if (post.image) {
      setImagePreview(post.image);
    } else {
      setImagePreview('');
    }
    setImageSize('');
    setUploadError('');
  };

  return (
    <div className="min-h-screen bg-[#0A1628] text-white pt-6 px-4 max-w-5xl mx-auto" style={{ paddingTop: '5rem' }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#0A1628]">📝 Blog Management</h1>
        <Link href="/admin/dashboard" className="text-[#D4AF37] hover:text-[#C5A028] text-sm">← Dashboard</Link>
      </div>

      {/* Create/Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10 space-y-4">
        <h2 className="text-lg font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" required
          className="w-full px-4 py-2 border border-white/10 bg-white/5 text-white rounded-lg text-sm placeholder:text-white/30" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Post content" required rows={4}
          className="w-full px-4 py-2 border border-white/10 bg-white/5 text-white rounded-lg text-sm placeholder:text-white/30" />

        <div>
          <label className="block text-sm text-gray-600 mb-1">Image</label>
          <input
            type="text"
            name="imageUrl"
            value={image}
            onChange={(e) => { setImage(e.target.value); setImagePreview(e.target.value); setUploadError(''); }}
            placeholder="https://... or pick a file below"
            className="w-full px-4 py-2 border border-white/10 bg-white/5 text-white rounded-lg text-sm placeholder:text-white/30"
          />
          {/* Drag & Drop Zone */}
          <div
            className={'border-2 border-dashed rounded-lg p-6 text-center mt-2 cursor-pointer transition-colors ' + (dragOver ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-300')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            <p className="text-sm text-gray-500">Drag &amp; drop image here or click to upload</p>
            {uploading && <p className="text-xs text-[#D4AF37] mt-1">Uploading...</p>}
            {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            {imageSize && <p className="text-xs text-gray-500 mt-1">File size: {imageSize}</p>}
            <p className="text-xs text-gray-400 mt-1">Recommended: 800x600px (JPEG, max 1MB)</p>
          </div>
          <input
            type="text"
            value={imageUrlInput}
            onChange={(e) => {
              handleImageUrlChange(e.target.value);
            }}
            placeholder="Or paste image URL"
            className="w-full mt-2 px-3 py-2 border border-white/10 bg-white/5 text-white rounded-lg text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
          {imagePreview && (
            <div className="mt-2">
              <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
            </div>
          )}
        </div>

        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma separated)"
          className="w-full px-4 py-2 border border-white/10 bg-white/5 text-white rounded-lg text-sm placeholder:text-white/30" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)"
            className="w-full px-4 py-2 border border-white/10 bg-white/5 text-white rounded-lg text-sm placeholder:text-white/30" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)"
            className="w-full px-4 py-2 border border-white/10 bg-white/5 text-white rounded-lg text-sm placeholder:text-white/30" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg font-medium hover:bg-[#C5A028]">
            {editingId ? 'Update' : 'Publish'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setTitle(''); setContent(''); setImage(''); setTags(''); setPhone(''); setEmail(''); setImagePreview(''); setImageSize(''); setUploadError(''); }}
              className="px-6 py-2 bg-white/10 text-white/70 rounded-lg font-medium hover:bg-gray-300">Cancel</button>
          )}
        </div>
      </form>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p className="text-gray-500">Loading...</p> :
          posts.map((post: BlogPost) => (
            <div key={post._id} className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10 flex items-start gap-4 hover:border-[#D4AF37]/30 transition-all">
              <img src={post.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{post.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mt-1">{post.content}</p>
                {(post.phone || post.email) && (
                  <div className="text-xs text-gray-400 mt-1 space-x-3">
                    {post.phone && <span>📞 {post.phone}</span>}
                    {post.email && <span>✉️ {post.email}</span>}
                  </div>
                )}
                <span className="text-xs text-gray-500 mt-2 block">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleEdit(post)} className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-100">Edit</button>
                <button onClick={() => handleDelete(post._id)} className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-100">Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

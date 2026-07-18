"use client";

import { useState, useEffect, useRef } from "react";
import { put } from "@vercel/blob";
import Link from "next/link";
import toast from "react-hot-toast";

interface LoungeItem {
  _id?: string;
  id?: string;
  img: string;
  icon: string;
  title: string;
  description: string;
  phone?: string;
  email?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function AdminMingalarPage() {
  const [items, setItems] = useState<LoungeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LoungeItem | null>(null);
  const [form, setForm] = useState<LoungeItem>({ img: "", icon: "✨", title: "", description: "", phone: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [imageSize, setImageSize] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUrlChange = (url: string) => {
    setImageUrlInput(url);
    setForm(prev => ({ ...prev, img: url }));
    setImagePreview(url);
    setUploadError("");
  };

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token") || "";
    }
    return "";
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

  const uploadFile = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are accepted.");
      return "";
    }
    setUploading(true);
    setUploadError("");
    try {
      const blob = await put(file.name, file, { access: "public" });
      const url = blob.url;
      setImagePreview(url);
      setForm(prev => ({ ...prev, img: url }));
      setImageUrlInput(url);
      return url;
    } catch {
      setUploadError("Upload failed. Try URL paste instead.");
      return "";
    } finally {
      setUploading(false);
    }
  };

  const processImageFile = async (file: File) => {
    const sizeKB = (file.size / 1024).toFixed(1);
    setImageSize(sizeKB + " KB");
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

  const seedDefaults = async (token: string) => {
    const defaults = [
      { img: "/images_v2/unsplash-22-v2.jpg", icon: "🍽️", title: "Fine Dining", description: "Premium buffet & a la carte menu", phone: "", email: "" },
      { img: "/images_v2/unsplash-3-v2.jpg", icon: "🍸", title: "Open Bar", description: "Complimentary drinks & cocktails", phone: "", email: "" },
      { img: "/images_v2/unsplash-6-v2.jpg", icon: "💻", title: "Workspace", description: "High-speed WiFi & work stations", phone: "", email: "" },
      { img: "/images_v2/unsplash-37-v2.jpg", icon: "🚿", title: "Shower Suites", description: "Refresh before your flight", phone: "", email: "" },
      { img: "/images_v2/unsplash-41-v2.jpg", icon: "😴", title: "Nap Pods", description: "Rest in private sleeping pods", phone: "", email: "" },
      { img: "/images_v2/unsplash-33-v2.jpg", icon: "🛎️", title: "Concierge", description: "Priority check-in & boarding", phone: "", email: "" },
    ];
    for (const d of defaults) {
      try {
        await fetch(API_BASE + "/admin/mingalar", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          body: JSON.stringify(d),
        });
      } catch {}
    }
  };

  const fetchItems = async () => {
    const token = getToken();
    try {
      const res = await fetch(API_BASE + "/admin/mingalar", {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data || []);
        if (list.length === 0) {
          await seedDefaults(token);
          const res2 = await fetch(API_BASE + "/admin/mingalar", {
            headers: { Authorization: "Bearer " + token },
          });
          if (res2.ok) {
            const data2 = await res2.json();
            setItems(Array.isArray(data2) ? data2 : (data2.data || []));
          } else {
            setItems([]);
          }
        } else {
          setItems(list);
        }
      } else {
        toast.error("Failed to load");
      }
    } catch {
      toast.error("Failed to load");
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.img) { toast.error("Title and image required"); return; }
    setSaving(true);
    const token = getToken();
    try {
      const url = editing?._id || editing?.id
        ? API_BASE + "/admin/mingalar/" + (editing._id || editing.id)
        : API_BASE + "/admin/mingalar";
      const method = editing?._id || editing?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editing?._id || editing?.id ? "Updated!" : "Created!");
        setEditing(null);
        setForm({ img: "", icon: "✨", title: "", description: "", phone: "", email: "" });
        setImagePreview("");
        setImageSize("");
        setUploadError("");
        fetchItems();
      } else {
        toast.error("Save failed");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: LoungeItem) => {
    if (!confirm("Delete this item?")) return;
    const token = getToken();
    try {
      const res = await fetch(API_BASE + "/admin/mingalar/" + (item._id || item.id), {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        toast.success("Deleted");
        fetchItems();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item: LoungeItem) => {
    setEditing(item);
    setForm({ ...item });
    if (item.img) {
      setImagePreview(item.img);
    } else {
      setImagePreview("");
    }
    setImageSize("");
    setUploadError("");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">✨ Sky Lounge Manager</h1>
          <p className="text-gray-400 text-sm mt-1">Manage Mingalar Sky Lounge cards</p>
        </div>
        <Link href="/admin/dashboard" className="text-[#D4AF37] hover:text-[#C5A028] text-sm">← Dashboard</Link>
      </div>

      {/* Form */}
      <div className="bg-[#1a2744] rounded-xl p-6 mb-6 border border-gray-700">
        <h2 className="text-white font-semibold mb-4">{editing ? "Edit Card" : "Add New Card"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Image</label>
            <input
              type="text"
              name="imageUrl"
              value={form.img}
              onChange={e => { setForm({...form, img: e.target.value}); setImagePreview(e.target.value); setUploadError(""); }}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              placeholder="https://... or pick a file below"
            />
            {/* Drag & Drop Zone */}
            <div
              className={"border-2 border-dashed rounded-lg p-6 text-center mt-2 cursor-pointer transition-colors " + (dragOver ? "border-[#D4AF37] bg-gray-800/50" : "border-gray-600")}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              <p className="text-sm text-gray-500">Drag &amp; drop image here or click to upload</p>
              {uploading && <p className="text-xs text-[#D4AF37] mt-1">Uploading...</p>}
              {uploadError && <p className="text-xs text-red-400 mt-1">{uploadError}</p>}
              {imageSize && <p className="text-xs text-gray-500 mt-1">File size: {imageSize}</p>}
              <p className="text-xs text-gray-400 mt-1">Recommended: 800x600px (JPEG, max 1MB)</p>
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  placeholder="Or paste image URL"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-600" />
              </div>
            )}
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Icon (emoji)</label>
            <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="🍽️" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Title</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="Fine Dining" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Description</label>
            <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="Premium buffet & a la carte" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Phone</label>
            <input value={form.phone || ""} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="+95 1 234 5678" />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Email</label>
            <input value={form.email || ""} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="info@skylounge.com" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#D4AF37] text-[#0A1628] font-bold rounded-lg hover:bg-[#C5A028] transition-colors disabled:opacity-50">
            {saving ? "Saving..." : editing ? "Update" : "Add"} Card
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm({ img: "", icon: "✨", title: "", description: "", phone: "", email: "" }); setImagePreview(""); setImageSize(""); setUploadError(""); }} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Cards List */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No cards yet. Add your first lounge card above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item._id || item.id} className="bg-[#1a2744] rounded-xl overflow-hidden border border-gray-700">
              <div className="flex items-center gap-3 p-4 pb-0">
                <img src={item.img} alt={item.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <span>{item.icon}</span> {item.title}
                </h3>
              </div>
              <div className="p-4 pt-3">
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                {(item.phone || item.email) && (
                  <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                    {item.phone && <p>📞 {item.phone}</p>}
                    {item.email && <p>✉️ {item.email}</p>}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEdit(item)} className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500">Edit</button>
                  <button onClick={() => handleDelete(item)} className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

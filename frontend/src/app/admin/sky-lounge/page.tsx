"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface LoungeItem {
  _id?: string;
  id?: string;
  img: string;
  icon: string;
  title: string;
  description: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function AdminMingalarPage() {
  const [items, setItems] = useState<LoungeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LoungeItem | null>(null);
  const [form, setForm] = useState<LoungeItem>({ img: "", icon: "✨", title: "", description: "" });
  const [saving, setSaving] = useState(false);

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token") || "";
    }
    return "";
  };

  const seedDefaults = async (token: string) => {
    const defaults = [
      { img: "/images_v2/unsplash-22-v2.jpg", icon: "🍽️", title: "Fine Dining", description: "Premium buffet & a la carte menu" },
      { img: "/images_v2/unsplash-3-v2.jpg", icon: "🍸", title: "Open Bar", description: "Complimentary drinks & cocktails" },
      { img: "/images_v2/unsplash-6-v2.jpg", icon: "💻", title: "Workspace", description: "High-speed WiFi & work stations" },
      { img: "/images_v2/unsplash-37-v2.jpg", icon: "🚿", title: "Shower Suites", description: "Refresh before your flight" },
      { img: "/images_v2/unsplash-41-v2.jpg", icon: "😴", title: "Nap Pods", description: "Rest in private sleeping pods" },
      { img: "/images_v2/unsplash-33-v2.jpg", icon: "🛎️", title: "Concierge", description: "Priority check-in & boarding" },
    ];
    for (const d of defaults) {
      try {
        await fetch(`${API_BASE}/admin/mingalar`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(d),
        });
      } catch {}
    }
  };

  const fetchItems = async () => {
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/admin/mingalar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.data || []);
        if (list.length === 0) {
          await seedDefaults(token);
          const res2 = await fetch(`${API_BASE}/admin/mingalar`, {
            headers: { Authorization: `Bearer ${token}` },
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
        ? `${API_BASE}/admin/mingalar/${editing._id || editing.id}`
        : `${API_BASE}/admin/mingalar`;
      const method = editing?._id || editing?.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editing?._id || editing?.id ? "Updated!" : "Created!");
        setEditing(null);
        setForm({ img: "", icon: "✨", title: "", description: "" });
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
      const res = await fetch(`${API_BASE}/admin/mingalar/${item._id || item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
            <label className="block text-gray-400 text-sm mb-1">Image URL</label>
            <input value={form.img} onChange={e => setForm({...form, img: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="Image URL or /images_v2/..." />
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
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#D4AF37] text-[#0A1628] font-bold rounded-lg hover:bg-[#C5A028] transition-colors disabled:opacity-50">
            {saving ? "Saving..." : editing ? "Update" : "Add"} Card
          </button>
          {editing && (
            <button onClick={() => { setEditing(null); setForm({ img: "", icon: "✨", title: "", description: "" }); }} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">
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
              <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <span>{item.icon}</span> {item.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
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

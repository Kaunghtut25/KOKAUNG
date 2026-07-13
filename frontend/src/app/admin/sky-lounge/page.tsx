"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface LoungeItem {
  _id?: string;
  id?: string;
  img: string;
  icon: string;
  title: string;
  desc: string;
}

export default function AdminMingalarPage() {
  const [items, setItems] = useState<LoungeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<LoungeItem | null>(null);
  const [form, setForm] = useState<LoungeItem>({ img: "", icon: "✨", title: "", desc: "" });

  const fetchItems = async () => {
    try {
      const res = await api.get("/admin/mingalar");
      setItems(res.data || []);
    } catch { toast.error("Failed to load"); }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.img) { toast.error("Title and image required"); return; }
    try {
      if (editing?._id || editing?.id) {
        await api.put(`/admin/mingalar/${editing._id || editing.id}`, form);
        toast.success("Updated!");
      } else {
        await api.post("/admin/mingalar", form);
        toast.success("Created!");
      }
      setEditing(null);
      setForm({ img: "", icon: "✨", title: "", desc: "" });
      fetchItems();
    } catch { toast.error("Save failed"); }
  };

  const handleDelete = async (item: LoungeItem) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/admin/mingalar/${item._id || item.id}`);
      toast.success("Deleted");
      fetchItems();
    } catch { toast.error("Delete failed"); }
  };

  const handleEdit = (item: LoungeItem) => {
    setEditing(item);
    setForm({ ...item });
  };

  return (
    <>
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
              <input value={form.img} onChange={e => setForm({...form, img: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="https://images.unsplash.com/..." />
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
              <input value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm" placeholder="Premium buffet & a la carte" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="px-6 py-2 bg-[#D4AF37] text-[#0A1628] font-bold rounded-lg hover:bg-[#C5A028] transition-colors">
              {editing ? "Update" : "Add"} Card
            </button>
            {editing && (
              <button onClick={() => { setEditing(null); setForm({ img: "", icon: "✨", title: "", desc: "" }); }} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">
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
                  <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
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
    </>
  );
}
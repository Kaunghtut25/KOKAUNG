"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

interface Destination {
  _id?: string; id?: string;
  city: string; country: string;
  image: string; minPrice: string;
  bestTime: string; description: string;
  highlights: string;
}

export default function AdminDestinationsPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [saving, setSaving] = useState(false);

  const empty: Destination = { city: "", country: "", image: "", minPrice: "", bestTime: "", description: "", highlights: "" };

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/destinations");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const openNew = () => { setEditing({ ...empty }); setModal(true); };
  const openEdit = (d: Destination) => { setEditing({ ...d }); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const url = editing._id || editing.id
        ? `/api/admin/destinations?id=${editing._id || editing.id}`
        : "/api/admin/destinations";
      const method = editing._id || editing.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        await load();
        closeModal();
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm(t("admin.dest.confirmDel"))) return;
    try {
      await fetch(`/api/admin/destinations?id=${id}`, { method: "DELETE" });
      await load();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-white/60 text-lg">{t("admin.dest.loading")}</div></div>;

  return (
    <div className="min-h-screen bg-[#0A1628] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-white">{t("admin.dest.title")} ({items.length})</h1>
          <button onClick={openNew} className="bg-[#D4AF37] text-[#0A1628] px-5 py-2 rounded-lg font-medium hover:bg-[#C4A030] transition">{t("admin.dest.addNew")}</button>
        </div>

        {items.length === 0 ? (
          <div className="text-white/60 text-center py-16 text-lg">{t("admin.dest.empty")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((d: any) => (
              <div key={d.id || d._id} className="bg-[#0F1E35] border border-white/10 rounded-xl p-5 hover:border-[#D4AF37]/40 transition group">
                {d.image && <Image alt={d.city} className="w-full h-40 object-cover rounded-lg mb-4" src={typeof d.images === "string" ? JSON.parse(d.images)[0] || d.image : (d.image || "")} width={1600} height={900} sizes="100vw" />}
                <h3 className="text-white font-semibold text-lg">{d.city}, {d.country}</h3>
                <p className="text-[#D4AF37] text-sm mt-1">{d.minPrice}</p>
                <p className="text-white/50 text-xs mt-1">{d.bestTime}</p>
                <p className="text-white/60 text-sm mt-2 line-clamp-2">{d.description}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => openEdit(d)} className="text-white/70 hover:text-[#D4AF37] text-sm px-3 py-1 border border-white/20 rounded hover:border-[#D4AF37] transition">Edit</button>
                  <button onClick={() => del(d.id || d._id)} className="text-red-400/70 hover:text-red-400 text-sm px-3 py-1 border border-red-400/20 rounded hover:border-red-400 transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1E35] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-white font-semibold mb-4">{editing._id || editing.id ? t("admin.dest.editD") : t("admin.dest.newD")}</h2>
            <div className="space-y-3">
              {[
                { key: "city", label: t("admin.dest.fCity") },
                { key: "country", label: t("admin.dest.fCountry") },
                { key: "image", label: t("admin.dest.fImageUrl") },
                { key: "minPrice", label: t("admin.dest.fMinPrice") },
                { key: "bestTime", label: t("admin.dest.fBestTime") },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-white/60 text-xs block mb-1">{f.label}</label>
                  <input className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={editing[f.key as keyof Destination] || ""} onChange={e => setEditing({ ...editing, [f.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="text-white/60 text-xs block mb-1">{t("admin.form.description")}</label>
                <textarea className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none h-20 resize-none" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">{t("admin.dest.highlights")}</label>
                <input className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={editing.highlights} onChange={e => setEditing({ ...editing, highlights: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={saving} className="flex-1 bg-[#D4AF37] text-[#0A1628] py-2.5 rounded-lg font-medium hover:bg-[#C4A030] disabled:opacity-50 transition">{saving ? t("admin.common.saving") : t("common.save")}</button>
              <button onClick={closeModal} className="flex-1 border border-white/20 text-white/60 py-2.5 rounded-lg hover:border-white/40 transition">{t("common.cancel")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
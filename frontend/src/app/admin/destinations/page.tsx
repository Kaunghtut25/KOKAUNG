"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";

interface Destination {
  _id?: string; id?: string;
  city: string; country: string;
  image: string; minPrice: string;
  bestTime: string; description: string;
  highlights: string;
  rating?: number; reviews?: number;
  duration?: string; tags?: string;
  groupSize?: number;
}

function toSlug(text: string): string {
  return (text || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminDestinationsPage() {
  const { t } = useI18n();
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  const [items, setItems] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Destination | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const empty: Destination = { city: "", country: "", image: "", minPrice: "", bestTime: "", description: "", highlights: "", rating: 4.5, reviews: 0, duration: "", tags: "", groupSize: 10 };

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/destinations", { headers: { Authorization: `Bearer ${token}` } });
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      await fetch(`/api/admin/destinations?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      await load();
    } catch (e) { console.error(e); }
  };

  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) { setUploadMsg(t("admin.common.imgOnly")); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadMsg(t("admin.dest.dropDims")); return; }
    setUploading(true); setUploadMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      const url = data?.uploads?.[0]?.url;
      if (!url) { setUploadMsg(t("admin.common.uploadFailed")); return; }
      setEditing({ ...editing, image: url });
      setUploadMsg(t("admin.dest.dropDone"));
    } catch (e) { console.error(e); setUploadMsg(t("admin.common.uploadFailed")); }
    setUploading(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) uploadImage(f);
  };

  const firstImg = (d: any): string => {
    if (typeof d.images === "string") {
      try { const arr = JSON.parse(d.images); if (Array.isArray(arr) && arr[0]) return arr[0]; } catch { /* ignore */ }
    }
    return d.image || (Array.isArray(d.images) ? d.images[0] : "") || "";
  };

  const parseTags = (tags?: string): string[] =>
    (tags || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);

  if (loading) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-white/60 text-lg">{t("admin.dest.loading")}</div></div>;

  return (
    <div className="min-h-screen bg-[#0A1628] p-6">
      {/* ─── Header (table design, same as admin hotels/tours) ─── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {t("admin.dest.title")} ({items.length})
          </h1>
        </div>
        <button onClick={openNew} className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2">
          <span>🌍</span> {t("admin.dest.addNew")}
        </button>
      </div>

      {/* ─── Destinations Table (zoom-safe: overflow-x-auto, no card grid) ─── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.dest.thDest")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.dest.thPrice")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.dest.thBestTime")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.dest.thRating")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.dest.thDuration")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.dest.thTags")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.dest.thActions")}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-white/50">
                    <span className="text-3xl block mb-2">🌍</span>
                    {t("admin.dest.empty")}
                  </td>
                </tr>
              ) : (
                items.map((d: any) => {
                  const thumb = firstImg(d);
                  const tags = parseTags(d.tags);
                  return (
                    <tr key={d.id || d._id} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {thumb ? (
                              <Image alt={d.city} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} src={thumb} width={1600} height={900} sizes="100vw" />
                            ) : <span className="text-white/20 text-lg">🌍</span>}
                          </div>
                          <div>
                            <span className="text-white font-medium">{d.city}</span>
                            {d.country && <span className="text-white/50 text-xs block">{d.country}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white">{d.minPrice || "—"}</td>
                      <td className="p-4 text-white/70 text-xs max-w-[220px]">{d.bestTime || "—"}</td>
                      <td className="p-4 text-yellow-400 text-sm">
                        {"⭐".repeat(Math.max(0, Math.min(5, Math.round(Number(d.rating) || 0))))} <span className="text-white/50">({Number(d.reviews) || 0})</span>
                      </td>
                      <td className="p-4 text-white/70">{d.duration || "—"}</td>
                      <td className="p-4">
                        {tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {tags.map((tag, ti) => (
                              <span key={ti} className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] font-medium border border-[#D4AF37]/20">{tag}</span>
                            ))}
                          </div>
                        ) : <span className="text-white/40">—</span>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/destinations/${toSlug(d.city)}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors">
                            {t("admin.common.view")}
                          </Link>
                          <button onClick={() => openEdit(d)} className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors">
                            {t("admin.common.edit")}
                          </button>
                          <button onClick={() => del(d.id || d._id)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                            {t("admin.common.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Add/Edit Modal (dropzone + fields, unchanged) ─── */}
      {modal && editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1E35] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-white font-semibold mb-4">{editing._id || editing.id ? t("admin.dest.editD") : t("admin.dest.newD")}</h2>
            <div className="space-y-3">
              {[
                { key: "city", label: t("admin.dest.fCity") },
                { key: "country", label: t("admin.dest.fCountry") },
                { key: "minPrice", label: t("admin.dest.fMinPrice") },
                { key: "bestTime", label: t("admin.dest.fBestTime") },
                { key: "rating", label: t("admin.dest.fRating"), type: "number" },
                { key: "reviews", label: t("admin.dest.fReviews"), type: "number" },
                { key: "duration", label: t("admin.dest.fDuration") },
                { key: "tags", label: t("admin.dest.fTags") },
                { key: "groupSize", label: t("admin.dest.fGroupSize"), type: "number" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-white/60 text-xs block mb-1">{f.label}</label>
                  <input type={f.type === "number" ? "number" : "text"} step={f.type === "number" ? "0.1" : undefined} className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none" value={(editing[f.key as keyof Destination] ?? "") as any} onChange={e => setEditing({ ...editing, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} />
                </div>
              ))}
              <div>
                <label className="text-white/60 text-xs block mb-1">{t("admin.dest.fImageUrl")}</label>
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={onDrop}
                  className="border-2 border-dashed border-white/20 hover:border-[#D4AF37] rounded-lg p-4 text-center cursor-pointer transition group"
                  onClick={() => document.getElementById("dest-img-input")?.click()}
                >
                  {editing.image ? (
                    <div className="relative">
                      <img src={editing.image} alt={editing.city || "destination"} className="w-full h-40 object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-lg">
                        <span className="text-xs text-white bg-black/60 px-2 py-1 rounded">{t("admin.dest.dropReplace")}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="text-3xl mb-2">📷</div>
                      <div className="text-white/70 text-sm">{t("admin.dest.dropHint")}</div>
                      <div className="text-white/40 text-xs mt-1">{t("admin.dest.dropDims")}</div>
                    </div>
                  )}
                  {uploading && <div className="text-[#D4AF37] text-sm mt-2">{t("admin.dest.dropUploading")}</div>}
                  {uploadMsg && <div className="text-[#D4AF37] text-xs mt-2">{uploadMsg}</div>}
                </div>
                <input id="dest-img-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }} />
                <input type="text" className="w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none mt-2" placeholder="https://…" value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} />
              </div>
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

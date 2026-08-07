"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminFormModal from "@/components/AdminFormModal";
import { useI18n } from "@/lib/i18n";

interface Tour {
  id: string;
  title: string;
  destination: string;
  description: string;
  priceMMK: number;
  priceUSD: number;
  duration: string;
  images: any;
  amenities: any;
  included: any;
  excluded: any;
  phone: string;
  email: string;
  address: string;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  row: number;
  status: string;
  featured: boolean;
  tourType?: string;
  createdAt?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const emptyTour: Tour = {
  id: "",
  title: "",
  destination: "",
  description: "",
  priceMMK: 0,
  priceUSD: 0,
  duration: "",
  images: "",
  amenities: "",
  included: "",
  excluded: "",
  phone: "",
  email: "",
  address: "",
  maxGroupSize: 0,
  rating: 4.5,
  reviewCount: 0,
  row: 1,
  status: "active",
  featured: false,
  tourType: "",
};

const ADMIN_MYANMAR_CITIES = [
  'bagan', 'yangon', 'mandalay', 'inle', 'ngapali', 'mingun', 'sagaing',
  'pyin oo lwin', 'hsipaw', 'mrauk u', 'loikaw', 'kyaiktiyo', 'dawei',
  'myeik', 'kawthaung', 'putao', 'naypyidaw', 'taunggyi', 'kalaw',
  'pindaya', 'bago', 'popa', 'mount popa', 'thanlyin',
].flatMap((c) => [c, `, ${c}`, `,${c}`]);

function detectTourType(tour: any): 'inbound' | 'outbound' {
  if (tour.tourType === 'inbound' || tour.tourType === 'outbound') return tour.tourType;
  const dest = String(tour.destination || '').toLowerCase();
  if (dest === 'myanmar' || dest.includes('myanmar')) return 'inbound';
  if (ADMIN_MYANMAR_CITIES.some((c) => dest.includes(c))) return 'inbound';
  return 'outbound';
}

export default function AdminToursPage() {
  const { t } = useI18n();
  const [tours, setTours] = useState<Tour[]>([]);
  const [typeFilter, setTypeFilter] = useState<"all" | "inbound" | "outbound">("all");
  const countInbound = (tours || []).filter((t: any) => detectTourType(t) === 'inbound').length;
  const countOutbound = (tours || []).filter((t: any) => detectTourType(t) === 'outbound').length;
  const visibleTours = (tours || []).filter(
    (t: any) => typeFilter === 'all' || detectTourType(t) === typeFilter
  );
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour>(emptyTour);
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imageList, setImageList] = useState<string[]>([]);
  const [itineraryDays, setItineraryDays] = useState<{day:number;title:string;description:string;meals:string;accommodation:string}[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  // Ensure token is available before first render
  const [tokenReady, setTokenReady] = React.useState(false);
  React.useEffect(() => { setTokenReady(true); }, []);
  const fetchTours = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/tours`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const tours = Array.isArray(data) ? data : (data?.tours || []); setTours(tours.filter(Boolean));
      }
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const parseImageList = (imagesStr: any): string[] => {
    if (!imagesStr) return [];
    // Supabase returns actual arrays, seed data returns JSON strings
    if (Array.isArray(imagesStr)) return imagesStr.filter((s: unknown) => typeof s === "string" && s);
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed)) return parsed.filter((u: unknown) => typeof u === "string" && u);
    } catch { /* not JSON */ }
    return imagesStr.split(",").map((s: string) => s.trim()).filter((s: string) => s && (s.startsWith("http") || s.startsWith("/")));
  };

  const parseItinerary = (raw: any): {day:number;title:string;description:string;meals:string;accommodation:string}[] => {
    if (!raw) return [];
    if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === "object") {
      return raw.map((d:any,i:number) => ({day:d.day||i+1,title:d.title||"",description:d.description||"",meals:Array.isArray(d.meals)?d.meals.join(", "):(d.meals||""),accommodation:d.accommodation||""}));
    }
    try { const p=JSON.parse(raw); if(Array.isArray(p)) return p.map((d:any,i:number)=>({day:d.day||i+1,title:d.title||"",description:d.description||"",meals:Array.isArray(d.meals)?d.meals.join(", "):(d.meals||""),accommodation:d.accommodation||""})); } catch {}
    return [];
  };

  const getFirstImage = (imagesStr: any): string => {
    const list = parseImageList(imagesStr);
    return list[0] || "";
  };

  const openCreateModal = () => {
    setEditingTour(emptyTour);
    setImageUrlInput("");
    setImagePreviewUrl("");
    setImageList([]);
    setUploadError("");
    setIsNew(true);
    setModalOpen(true);
  };

  const openEditModal = (tour: Tour) => {
    setEditingTour({ ...tour });
    const imgs = parseImageList(tour.images);
    setImageList(imgs);
    setImageUrlInput(imgs[0] || "");
    setImagePreviewUrl(imgs[0] || "");
    setUploadError("");
    setIsNew(false);
    setModalOpen(true);
  };

  // Normalize string/array fields (Supabase arrays vs seed strings)
  const asString = (v: any): string => {
    if (!v) return "";
    if (Array.isArray(v)) return v.join(", ");
    return String(v);
  };

  const addImage = () => {
    if (!imageUrlInput.trim()) return;
    const newList = [...imageList, imageUrlInput.trim()];
    setImageList(newList);
    setImageUrlInput("");
    setImagePreviewUrl("");
    setEditingTour((prev) => ({ ...prev, images: JSON.stringify(newList) }));
  };

  const removeImage = (index: number) => {
    const newList = imageList.filter((_, i) => i !== index);
    setImageList(newList);
    setEditingTour((prev) => ({ ...prev, images: JSON.stringify(newList) }));
  };

  const moveImage = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= imageList.length) return;
    const newList = [...imageList];
    [newList[fromIndex], newList[toIndex]] = [newList[toIndex], newList[fromIndex]];
    setImageList(newList);
    setEditingTour((prev) => ({ ...prev, images: JSON.stringify(newList) }));
  };

  const addItineraryDay = () => {
    const newDay = itineraryDays.length + 1;
    setItineraryDays([...itineraryDays, { day: newDay, title: `Day ${newDay}`, description: "", meals: "Breakfast", accommodation: "" }]);
  };

  const removeItineraryDay = (index: number) => {
    const updated = itineraryDays.filter((_,i) => i !== index).map((d,i) => ({ ...d, day: i+1 }));
    setItineraryDays(updated);
  };

  const updateItineraryDay = (index: number, field: string, value: string) => {
    const updated = [...itineraryDays];
    updated[index] = { ...updated[index], [field]: field === "day" ? parseInt(value)||1 : value };
    setItineraryDays(updated);
  };

  const handleFieldChange = (field: keyof Tour, value: string | number) => {
    setEditingTour((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUrlChange = (value: string) => {
    setImageUrlInput(value);
    setImagePreviewUrl(value);
    setUploadError("");
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are accepted.");
      return;
    }
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();
      if (data.success && data.uploads?.[0]) {
        const newUrl = `/api/upload?id=${data.uploads[0].id}`;
        const newList = [...imageList, newUrl];
        setImageList(newList);
        setEditingTour((prev) => ({ ...prev, images: JSON.stringify(newList) }));
        setImageUrlInput("");
        setImagePreviewUrl("");
      } else {
        setUploadError(data.error || "Upload failed. Please try again.");
      }
    } catch {
      setUploadError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = "";
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isNew
        ? `${API_BASE}/admin/tours`
        : `${API_BASE}/admin/tours/${editingTour.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...editingTour, itinerary: itineraryDays.length > 0 ? itineraryDays.map(d => ({day:d.day,title:d.title,description:d.description,meals:d.meals.split(",").map((m:any)=>m.trim()).filter((m:any)=>m),accommodation:d.accommodation||undefined})) : [] }),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchTours();
      } else {
        const err = await res.json();
        alert(err.message || t("admin.common.saveFailed"));
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert(t("admin.common.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/tours/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchTours();
      } else {
        alert(t("admin.common.deleteFailed"));
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert(t("admin.common.deleteFailed"));
    }
  };

  const formatNumber = (n: number) =>
    new Intl.NumberFormat("en-US").format(n);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-600 text-white font-medium border border-green-400",
      inactive: "bg-red-600 text-white font-medium border border-red-400",
      featured: "bg-[#D4AF37] text-[#0A1628] font-bold border border-[#D4AF37]",
    };
    return `px-2 py-0.5 rounded-full text-xs font-medium border ${
      map[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }`;
  };

  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.title")}</label>
          <input
            type="text"
            value={editingTour.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.destination")}</label>
          <input
            type="text"
            value={editingTour.destination}
            onChange={(e) =>
              handleFieldChange("destination", e.target.value)
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          {t("admin.form.description")}
        </label>
        <textarea
          value={editingTour.description}
          onChange={(e) =>
            handleFieldChange("description", e.target.value)
          }
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">
            {t("admin.form.priceMmk")}
          </label>
          <input
            type="number"
            value={editingTour.priceMMK}
            onChange={(e) =>
              handleFieldChange("priceMMK", Number(e.target.value))
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            {t("admin.form.priceUsd")}
          </label>
          <input
            type="number"
            value={editingTour.priceUSD}
            onChange={(e) =>
              handleFieldChange("priceUSD", Number(e.target.value))
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">
            {t("admin.form.duration")}
          </label>
          <input
            type="text"
            value={editingTour.duration}
            onChange={(e) =>
              handleFieldChange("duration", e.target.value)
            }
            placeholder={t("admin.form.durationPh")}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            {t("admin.form.maxGroupSize")}
          </label>
          <input
            type="number"
            value={editingTour.maxGroupSize}
            onChange={(e) =>
              handleFieldChange("maxGroupSize", Number(e.target.value))
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      
      {/* ─── Contact Information ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.phone")}</label>
          <input
            type="tel"
            name="phone"
            placeholder="Contact phone"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            value={editingTour.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.email")}</label>
          <input
            type="email"
            name="email"
            placeholder="Contact email"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            value={editingTour.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.address")}</label>
          <input
            type="text"
            name="address"
            placeholder={t("admin.form.addressPh")}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            value={editingTour.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
          />
        </div>
      </div>
{/* ─── Multi-Image Management ─── */}
      <div>
        <label className="block text-white/70 text-sm mb-1">
          {t("admin.form.images")}
        </label>
        <div
          className="flex gap-2 mb-3 flex-wrap"
          onDragOver={(e) => { e.preventDefault(); (e.currentTarget as HTMLDivElement).style.borderColor = '#D4AF37'; }}
          onDragLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = ''; }}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 rounded-lg bg-gold/10 text-gold text-sm font-medium hover:bg-gold/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? t("admin.form.uploading") : t("admin.form.uploadImage")}
          <p className="text-xs text-gray-400 mt-1">{t("admin.form.recommended")}</p>
          </button>
          <input
            type="text"
            value={imageUrlInput}
            onChange={(e) => {
              handleImageUrlChange(e.target.value);
            }}
            placeholder={t("admin.form.imageUrl")}
            className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
          />
          <button
            type="button"
            onClick={addImage}
            disabled={!imageUrlInput.trim()}
            className="px-4 py-2 rounded-lg bg-gold/10 text-gold text-sm font-medium hover:bg-gold/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Add
          </button>
        </div>
        {uploadError && (
          <p className="text-red-400 text-xs mb-2">{uploadError}</p>
        )}

        
        <div className="mt-3">
          <input
            type="text"
            name="imageUrl"
            placeholder={t("admin.form.pasteUrl")}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
            value={imageUrlInput}
            onChange={(e) => {
              handleImageUrlChange(e.target.value);
            }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
          />
        </div>
{/* Image Preview & List */}
        {imageList.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageList.map((url, index) => (
              <div key={`${url}-${index}`} className="relative group">
                <div className="w-full aspect-[4/3] rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='75'><rect fill='%231a1a2e' width='100' height='75'/><text x='50' y='42' text-anchor='middle' fill='%23555' font-size='12'>Invalid</text></svg>";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                    className="p-1.5 rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1.5 rounded bg-red-500/80 text-white hover:bg-red-600 text-xs"
                    title="Remove"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === imageList.length - 1}
                    className="p-1.5 rounded bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
                <span className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
            <span className="text-white/20 text-2xl block mb-1">🖼️</span>
            <p className="text-white/30 text-sm">{t("admin.form.noImages")}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          {t("admin.form.amenities")}
        </label>
        <input
          type="text"
          value={asString(editingTour.amenities)}
          onChange={(e) =>
            handleFieldChange("amenities", e.target.value)
          }
          placeholder={t("admin.form.amenitiesPh")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          {t("admin.form.included")}
        </label>
        <input
          type="text"
          value={asString(editingTour.included)}
          onChange={(e) =>
            handleFieldChange("included", e.target.value)
          }
          placeholder={t("admin.form.includedPh")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          {t("admin.form.excluded")}
        </label>
        <input
          type="text"
          value={asString(editingTour.excluded)}
          onChange={(e) =>
            handleFieldChange("excluded", e.target.value)
          }
          placeholder={t("admin.form.excludedPh")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.status")}</label>
          <select
            value={editingTour.status}
            onChange={(e) =>
              handleFieldChange("status", e.target.value)
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          >
            <option value="active">{t("admin.form.active")}</option>
            <option value="inactive">{t("admin.form.inactive")}</option>
            <option value="featured">{t("admin.form.featured")}</option>
          </select>
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.tourType")}</label>
          <select
            value={editingTour.tourType || ""}
            onChange={(e) => handleFieldChange("tourType", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          >
            <option value="">{t("admin.form.autoDetect")}</option>
            <option value="inbound">{t("admin.form.inbound")}</option>
            <option value="outbound">{t("admin.form.outbound")}</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={editingTour.featured}
              onChange={(e) =>
                handleFieldChange("featured", e.target.checked ? 1 : 0)
              }
              className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-gold checked:border-gold focus:ring-gold/30 cursor-pointer"
            />
            <span className="text-white/70 text-sm">
              {t("admin.form.featuredHome")}
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.rating")}</label>
          <input type="number" min={1} max={5} step={0.1} value={editingTour.rating} onChange={(e) => handleFieldChange("rating", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors" />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.reviewCount")}</label>
          <input type="number" min={0} value={editingTour.reviewCount} onChange={(e) => handleFieldChange("reviewCount", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors" />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.row")}</label>
          <select value={editingTour.row} onChange={(e) => handleFieldChange("row", Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors">
            {[1,2,3,4,5,6,7].map((r) => (<option key={r} value={r}>{t("admin.form.row")} {r}</option>))}
          </select>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">
          {t("admin.tours.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#D4AF37]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {t("admin.tours.title")}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {t("admin.tours.subtitle")}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2"
        >
          <span>✈️</span> {t("admin.tours.addNew")}
        </button>
      </div>

      {/* ─── Inbound / Outbound / All Tabs ─── */}
      <div className="flex flex-wrap items-center gap-2 mt-6">
        {[
          { key: 'all', label: t('admin.tours.tabAll'), count: (tours || []).length },
          { key: 'inbound', label: t('admin.tours.tabInbound'), count: countInbound },
          { key: 'outbound', label: t('admin.tours.tabOutbound'), count: countOutbound },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTypeFilter(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              typeFilter === tab.key
                ? 'bg-gold text-deepblue-dark shadow-lg shadow-gold/25'
                : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-xs px-2 py-0.5 rounded-full ${
              typeFilter === tab.key
                ? 'bg-deepblue-dark/15 text-deepblue-dark'
                : 'bg-white/10 text-white/40'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ─── Tours Table ─── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  {t("admin.tours.thTour")}
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  {t("admin.tours.thDestination")}
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  {t("admin.tours.thPriceMmk")}
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  {t("admin.tours.thPriceUsd")}
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  {t("admin.tours.thDuration")}
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  {t("admin.tours.thRating")}
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  {t("admin.tours.thStatus")}
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  {t("admin.tours.thType")}
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  {t("admin.tours.thActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleTours.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="p-10 text-center text-white/30"
                  >
                    <span className="text-3xl block mb-2">✈️</span>
                    {t("admin.tours.empty")}
                    one.
                  </td>
                </tr>
              ) : (
                visibleTours
                  .filter(Boolean)
                  .map((tour: any) => {
                  const thumb = getFirstImage(tour.images);
                  return (
                    <tr
                      key={tour.id}
                      className="border-b border-white/5 hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={tour.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display =
                                    "none";
                                }}
                              />
                            ) : null}
                            {!thumb && (
                              <span className="text-white/20 text-lg">✈️</span>
                            )}
                          </div>
                          <span className="text-white font-medium">
                            {tour.title}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-white/70">
                        {tour.destination}
                      </td>
                      <td className="p-4 text-white">
                        {formatNumber(tour.priceMMK)} Ks
                      </td>
                      <td className="p-4 text-white">
                        ${formatNumber(tour.priceUSD)}
                      </td>
                      <td className="p-4 text-white/70">{tour.duration}</td>
                      <td className="p-4 text-yellow-400 text-sm">
                        {typeof tour.rating === "number" || typeof tour.rating === "string" ? "⭐".repeat(Math.max(0, Math.min(5, Math.round(Number(tour.rating) || 4)))) : "⭐".repeat(4)} <span className="text-white/50">({Number(tour.reviewCount) || 0})</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className={getStatusBadge(tour.status)}>
                            {tour.status === "featured" ? t("admin.form.featured") : tour.status === "inactive" ? t("admin.form.inactive") : t("admin.form.active")}
                          </span>
                          {tour.featured && (
                            <span className="text-xs" title={t("admin.form.featured")}>⭐</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${detectTourType(tour) === 'inbound' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'}`}>
                          {detectTourType(tour) === 'inbound' ? t('admin.form.inboundShort') : t('admin.form.outboundShort')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/tours/${tour.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors">
                            {t("admin.tours.view")}
                          </Link>
                          <button
                            onClick={() => openEditModal(tour)}
                            className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors"
                          >
                            {t("admin.tours.edit")}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(tour.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                          >
                            {t("admin.tours.delete")}
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

      {/* ─── Add/Edit Modal ─── */}
      <AdminFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isNew ? t("admin.tours.addNewModal") : t("admin.tours.editTitle")}
        onSubmit={handleSubmit}
        submitLabel={isNew ? t("admin.tours.create") : t("admin.tours.update")}
        isLoading={saving}
      >
        {renderFormFields()}
      </AdminFormModal>

      {/* ─── Delete Confirmation ─── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-deepblue-dark border border-white/10 rounded-xl p-6 max-w-sm w-full z-10">
            <h3 className="text-lg font-bold text-white mb-2">
              {t("admin.tours.confirmDelete")}
            </h3>
            <p className="text-white/60 text-sm mb-6">
              {t("admin.tours.deleteMsg")}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white transition-colors text-sm"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

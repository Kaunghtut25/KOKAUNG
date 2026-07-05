"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminFormModal from "@/components/AdminFormModal";

interface Tour {
  id: string;
  title: string;
  destination: string;
  description: string;
  priceMMK: number;
  priceUSD: number;
  duration: string;
  images: string;
  amenities: string;
  included: string;
  excluded: string;
  maxGroupSize: number;
  status: string;
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
  maxGroupSize: 0,
  status: "active",
};

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour>(emptyTour);
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchTours = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/tours`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTours(Array.isArray(data) ? data : data.tours || []);
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

  const getFirstImage = (imagesStr: string): string => {
    if (!imagesStr) return "";
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
      const parts = imagesStr.split(",");
      const first = parts[0]?.trim();
      if (first && (first.startsWith("http") || first.startsWith("/"))) return first;
    }
    return "";
  };

  const openCreateModal = () => {
    setEditingTour(emptyTour);
    setImageUrlInput("");
    setImagePreviewUrl("");
    setIsNew(true);
    setModalOpen(true);
  };

  const openEditModal = (tour: Tour) => {
    setEditingTour({ ...tour });
    const firstImg = getFirstImage(tour.images);
    setImageUrlInput(firstImg);
    setImagePreviewUrl(firstImg);
    setIsNew(false);
    setModalOpen(true);
  };

  const handleFieldChange = (field: keyof Tour, value: string | number) => {
    setEditingTour((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUrlChange = (value: string) => {
    setImageUrlInput(value);
    setImagePreviewUrl(value);
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
        body: JSON.stringify(editingTour),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchTours();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save tour");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save tour");
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
        alert("Failed to delete tour");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete tour");
    }
  };

  const formatNumber = (n: number) =>
    new Intl.NumberFormat("en-MM").format(n);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      inactive: "bg-red-500/20 text-red-400 border-red-500/30",
      featured: "bg-gold/20 text-gold border-gold/30",
    };
    return `px-2 py-0.5 rounded-full text-xs font-medium border ${
      map[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }`;
  };

  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">Title</label>
          <input
            type="text"
            value={editingTour.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">Destination</label>
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
          Description
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
            Price MMK
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
            Price USD
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
            Duration
          </label>
          <input
            type="text"
            value={editingTour.duration}
            onChange={(e) =>
              handleFieldChange("duration", e.target.value)
            }
            placeholder="e.g. 3 Days / 2 Nights"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Max Group Size
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

      {/* ─── Image URL with Preview ─── */}
      <div>
        <label className="block text-white/70 text-sm mb-1">
          Images (comma-separated URLs)
        </label>
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => {
                handleImageUrlChange(e.target.value);
                handleFieldChange("images", e.target.value);
              }}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <div
            className="w-[200px] h-[150px] rounded-lg border border-white/10 bg-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center"
          >
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const fallback = parent.querySelector(".img-fallback");
                    if (fallback) (fallback as HTMLElement).style.display = "flex";
                  }
                }}
              />
            ) : null}
            <span
              className={`img-fallback text-white/20 text-xs text-center px-2 ${imagePreviewUrl ? "hidden" : "flex"} items-center justify-center w-full h-full`}
            >
              Image Preview
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          Amenities (comma-separated)
        </label>
        <input
          type="text"
          value={editingTour.amenities}
          onChange={(e) =>
            handleFieldChange("amenities", e.target.value)
          }
          placeholder="WiFi, Breakfast, Transport"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          Included (comma-separated)
        </label>
        <input
          type="text"
          value={editingTour.included}
          onChange={(e) =>
            handleFieldChange("included", e.target.value)
          }
          placeholder="Hotel, Meals, Guide"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          Excluded (comma-separated)
        </label>
        <input
          type="text"
          value={editingTour.excluded}
          onChange={(e) =>
            handleFieldChange("excluded", e.target.value)
          }
          placeholder="Flights, Visa Fees"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Status</label>
        <select
          value={editingTour.status}
          onChange={(e) =>
            handleFieldChange("status", e.target.value)
          }
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="featured">Featured</option>
        </select>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">
          Loading tours...
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
            Manage Tour Packages
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Create and manage your tour offerings
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2"
        >
          <span>✈️</span> Add New Tour
        </button>
      </div>

      {/* ─── Tours Table ─── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Tour
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Destination
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Price (MMK)
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Price (USD)
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Duration
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Status
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tours.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-white/30"
                  >
                    <span className="text-3xl block mb-2">✈️</span>
                    No tours found. Click &quot;Add New Tour&quot; to create
                    one.
                  </td>
                </tr>
              ) : (
                tours.map((tour) => {
                  const thumb = getFirstImage(tour.images);
                  return (
                    <tr
                      key={tour.id}
                      className="border-b border-white/5 hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-[60px] h-[60px] rounded-lg border border-white/10 bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
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
                      <td className="p-4">
                        <span className={getStatusBadge(tour.status)}>
                          {tour.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(tour)}
                            className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(tour.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                          >
                            Delete
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
        title={isNew ? "Add New Tour" : "Edit Tour"}
        onSubmit={handleSubmit}
        submitLabel={isNew ? "Create Tour" : "Update Tour"}
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
              Confirm Delete
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to delete this tour? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

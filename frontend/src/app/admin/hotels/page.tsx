"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminFormModal from "@/components/AdminFormModal";

interface RoomType {
  name: string;
  priceMMK: number;
  priceUSD: number;
  capacity: number;
  available: number;
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  rating: number;
  pricePerNightMMK: number;
  pricePerNightUSD: number;
  availableRooms: number;
  totalRooms: number;
  amenities: string;
  images: string;
  roomTypes: RoomType[];
  status: string;
  featured: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const emptyRoomType: RoomType = {
  name: "",
  priceMMK: 0,
  priceUSD: 0,
  capacity: 2,
  available: 1,
};

const emptyHotel: Hotel = {
  id: "",
  name: "",
  location: "",
  address: "",
  description: "",
  rating: 3,
  pricePerNightMMK: 0,
  pricePerNightUSD: 0,
  availableRooms: 0,
  totalRooms: 0,
  amenities: "",
  images: "",
  roomTypes: [],
  status: "active",
  featured: false,
};

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel>(emptyHotel);
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchHotels = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/hotels`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setHotels(Array.isArray(data) ? data : data.hotels || []);
      }
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const getFirstImage = (imagesStr: string): string => {
    if (!imagesStr) return "";
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
      const parts = imagesStr.split(",");
      const first = parts[0]?.trim();
      if (
        first &&
        (first.startsWith("http") || first.startsWith("/"))
      )
        return first;
    }
    return "";
  };

  const openCreateModal = () => {
    setEditingHotel(emptyHotel);
    setImageUrlInput("");
    setImagePreviewUrl("");
    setIsNew(true);
    setModalOpen(true);
  };

  const openEditModal = (hotel: Hotel) => {
    setEditingHotel({
      ...hotel,
      roomTypes: hotel.roomTypes?.length ? [...hotel.roomTypes] : [],
    });
    const firstImg = getFirstImage(hotel.images);
    setImageUrlInput(firstImg);
    setImagePreviewUrl(firstImg);
    setIsNew(false);
    setModalOpen(true);
  };

  const handleFieldChange = (field: keyof Hotel, value: string | number) => {
    setEditingHotel((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUrlChange = (value: string) => {
    setImageUrlInput(value);
    setImagePreviewUrl(value);
  };

  const handleRoomTypeChange = (
    index: number,
    field: keyof RoomType,
    value: string | number
  ) => {
    setEditingHotel((prev) => {
      const updated = [...prev.roomTypes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, roomTypes: updated };
    });
  };

  const addRoomType = () => {
    setEditingHotel((prev) => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { ...emptyRoomType }],
    }));
  };

  const removeRoomType = (index: number) => {
    setEditingHotel((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isNew
        ? `${API_BASE}/admin/hotels`
        : `${API_BASE}/admin/hotels/${editingHotel.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingHotel),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchHotels();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save hotel");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save hotel");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/hotels/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchHotels();
      } else {
        alert("Failed to delete hotel");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete hotel");
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

  const renderStars = (rating: number) =>
    "⭐".repeat(Math.max(0, Math.min(5, rating)));

  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">Name</label>
          <input
            type="text"
            value={editingHotel.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Location
          </label>
          <input
            type="text"
            value={editingHotel.location}
            onChange={(e) =>
              handleFieldChange("location", e.target.value)
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Address</label>
        <input
          type="text"
          value={editingHotel.address}
          onChange={(e) => handleFieldChange("address", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          Description
        </label>
        <textarea
          value={editingHotel.description}
          onChange={(e) =>
            handleFieldChange("description", e.target.value)
          }
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Rating (1-5)
          </label>
          <input
            type="number"
            min={1}
            max={5}
            value={editingHotel.rating}
            onChange={(e) =>
              handleFieldChange("rating", Number(e.target.value))
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Available Rooms
          </label>
          <input
            type="number"
            value={editingHotel.availableRooms}
            onChange={(e) =>
              handleFieldChange("availableRooms", Number(e.target.value))
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Total Rooms
          </label>
          <input
            type="number"
            value={editingHotel.totalRooms}
            onChange={(e) =>
              handleFieldChange("totalRooms", Number(e.target.value))
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Price/Night MMK
          </label>
          <input
            type="number"
            value={editingHotel.pricePerNightMMK}
            onChange={(e) =>
              handleFieldChange(
                "pricePerNightMMK",
                Number(e.target.value)
              )
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Price/Night USD
          </label>
          <input
            type="number"
            value={editingHotel.pricePerNightUSD}
            onChange={(e) =>
              handleFieldChange(
                "pricePerNightUSD",
                Number(e.target.value)
              )
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          Amenities (comma-separated)
        </label>
        <input
          type="text"
          value={editingHotel.amenities}
          onChange={(e) =>
            handleFieldChange("amenities", e.target.value)
          }
          placeholder="Pool, WiFi, Gym, Restaurant"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
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
          <div className="w-[200px] h-[150px] rounded-lg border border-white/10 bg-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center">
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement)
                    .parentElement;
                  if (parent) {
                    const fallback =
                      parent.querySelector(".img-fallback");
                    if (fallback)
                      (fallback as HTMLElement).style.display = "flex";
                  }
                }}
              />
            ) : null}
            <span
              className={`img-fallback text-white/20 text-xs text-center px-2 ${
                imagePreviewUrl ? "hidden" : "flex"
              } items-center justify-center w-full h-full`}
            >
              Image Preview
            </span>
          </div>
        </div>
      </div>

      {/* ─── Room Types (Dynamic) ─── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-white/70 text-sm font-medium">
            Room Types
          </label>
          <button
            type="button"
            onClick={addRoomType}
            className="px-3 py-1 rounded bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-colors"
          >
            + Add Room Type
          </button>
        </div>
        {editingHotel.roomTypes.length === 0 && (
          <p className="text-white/30 text-sm italic">
            No room types added yet.
          </p>
        )}
        <div className="space-y-3">
          {editingHotel.roomTypes.map((rt, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-xs font-medium">
                  Room Type #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeRoomType(index)}
                  className="text-red-400 text-xs hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div>
                  <label className="block text-white/40 text-xs mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={rt.name}
                    onChange={(e) =>
                      handleRoomTypeChange(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Deluxe"
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1">
                    Price MMK
                  </label>
                  <input
                    type="number"
                    value={rt.priceMMK}
                    onChange={(e) =>
                      handleRoomTypeChange(
                        index,
                        "priceMMK",
                        Number(e.target.value)
                      )
                    }
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1">
                    Price USD
                  </label>
                  <input
                    type="number"
                    value={rt.priceUSD}
                    onChange={(e) =>
                      handleRoomTypeChange(
                        index,
                        "priceUSD",
                        Number(e.target.value)
                      )
                    }
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={rt.capacity}
                    onChange={(e) =>
                      handleRoomTypeChange(
                        index,
                        "capacity",
                        Number(e.target.value)
                      )
                    }
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1">
                    Available
                  </label>
                  <input
                    type="number"
                    value={rt.available}
                    onChange={(e) =>
                      handleRoomTypeChange(
                        index,
                        "available",
                        Number(e.target.value)
                      )
                    }
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">Status</label>
          <select
            value={editingHotel.status}
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
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={editingHotel.featured}
              onChange={(e) =>
                handleFieldChange("featured", e.target.checked ? 1 : 0)
              }
              className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-gold checked:border-gold focus:ring-gold/30 cursor-pointer"
            />
            <span className="text-white/70 text-sm">
              ⭐ Featured — Show on homepage
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">
          Loading hotels...
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
            Manage Hotels
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage your hotel listings and room types
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2"
        >
          <span>🏨</span> Add New Hotel
        </button>
      </div>

      {/* ─── Hotels Table ─── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Hotel
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Location
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Rating
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Price/Night
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Rooms
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
              {hotels.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-white/30"
                  >
                    <span className="text-3xl block mb-2">🏨</span>
                    No hotels found. Click &quot;Add New Hotel&quot; to
                    create one.
                  </td>
                </tr>
              ) : (
                hotels.map((hotel) => {
                  const thumb = getFirstImage(hotel.images);
                  return (
                    <tr
                      key={hotel.id}
                      className="border-b border-white/5 hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-[60px] h-[60px] rounded-lg border border-white/10 bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (
                                    e.target as HTMLImageElement
                                  ).style.display = "none";
                                }}
                              />
                            ) : null}
                            {!thumb && (
                              <span className="text-white/20 text-lg">
                                🏨
                              </span>
                            )}
                          </div>
                          <span className="text-white font-medium">
                            {hotel.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-white/70">
                        {hotel.location}
                      </td>
                      <td className="p-4 text-yellow-400">
                        {renderStars(hotel.rating)}
                      </td>
                      <td className="p-4 text-white">
                        {formatNumber(hotel.pricePerNightMMK)} Ks
                      </td>
                      <td className="p-4 text-white/70">
                        {hotel.availableRooms}/{hotel.totalRooms}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={getStatusBadge(hotel.status)}
                          >
                            {hotel.status}
                          </span>
                          {hotel.featured && (
                            <span className="text-xs" title="Featured">⭐</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(hotel)}
                            className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm(hotel.id)
                            }
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
        title={isNew ? "Add New Hotel" : "Edit Hotel"}
        onSubmit={handleSubmit}
        submitLabel={isNew ? "Create Hotel" : "Update Hotel"}
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
              Are you sure you want to delete this hotel? This action
              cannot be undone.
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

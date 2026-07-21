"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminFormModal from "@/components/AdminFormModal";

interface Pricing {
  duration: string;
  priceMMK: number;
  priceUSD: number;
}

interface Car {
  id: string;
  carType: string;
  description: string;
  capacity: number;
  features: string;
  images: string;
  pricing: Pricing[];
  transmission: string;
  seats: number;
  status: string;
  phone: string;
  email: string;
  pickupLocation: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const emptyPricing: Pricing = { duration: "", priceMMK: 0, priceUSD: 0 };

const emptyCar: Car = {
  id: "",
  carType: "",
  description: "",
  capacity: 4,
  features: "",
  images: "",
  pricing: [],
  transmission: "Automatic",
  seats: 4,
  status: "active",
  phone: "",
  email: "",
  pickupLocation: "",
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car>(emptyCar);
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("admin_token") || "");
  }, []);

  const fetchCars = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/cars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCars(Array.isArray(data) ? data : data.cars || []);
      }
    } catch (err) {
      console.error("Failed to fetch cars:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const getFirstImage = (imagesStr: any): string => {
    if (!imagesStr) return "";
    // If it's already an array, return first element
    if (Array.isArray(imagesStr)) return imagesStr[0] || "";
    // If it's a string, try parsing as JSON first
    try {
      const parsed = JSON.parse(imagesStr);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch { /* not JSON */ }
    // Fallback: split by comma
    if (typeof imagesStr === "string") {
      const parts = imagesStr.split(",");
      const first = parts[0]?.trim();
      if (first && (first.startsWith("http") || first.startsWith("/"))) return first;
    }
    return "";
  };

  const openCreateModal = () => {
    setEditingCar(emptyCar);
    setImageUrlInput("");
    setImagePreviewUrl("");
    setUploadError("");
    setIsNew(true);
    setModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar({
      ...car,
      pricing: car.pricing?.length ? [...car.pricing] : [],
    });
    const firstImg = getFirstImage(car.images);
    setImageUrlInput(firstImg);
    setImagePreviewUrl(firstImg);
    setUploadError("");
    setIsNew(false);
    setModalOpen(true);
  };

  const handleFieldChange = (field: keyof Car, value: string | number) => {
    setEditingCar((prev) => ({ ...prev, [field]: value }));
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
        setImageUrlInput(newUrl);
        setImagePreviewUrl(newUrl);
        handleFieldChange("images", JSON.stringify([newUrl]));
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

  const handlePricingChange = (
    index: number,
    field: keyof Pricing,
    value: string | number
  ) => {
    setEditingCar((prev) => {
      const updated = [...prev.pricing];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, pricing: updated };
    });
  };

  const addPricing = () => {
    setEditingCar((prev) => ({
      ...prev,
      pricing: [...prev.pricing, { ...emptyPricing }],
    }));
  };

  const removePricing = (index: number) => {
    setEditingCar((prev) => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isNew
        ? `${API_BASE}/admin/cars`
        : `${API_BASE}/admin/cars/${editingCar.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingCar),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchCars();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save car");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save car");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/cars/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchCars();
      } else {
        alert("Failed to delete car");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete car");
    }
  };

  const formatNumber = (n: number) =>
    new Intl.NumberFormat("en-MM").format(n);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-600 text-white font-medium border border-green-400",
      inactive: "bg-red-600 text-white font-medium border border-red-400",
    };
    return `px-2 py-0.5 rounded-full text-xs font-medium border ${
      map[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }`;
  };

  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Car Name / Model
          </label>
          <input
            type="text"
            value={editingCar.carType}
            onChange={(e) =>
              handleFieldChange("carType", e.target.value)
            }
            placeholder="e.g. Toyota Alphard"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Seats
          </label>
          <input
            type="number"
            value={editingCar.seats}
            onChange={(e) =>
              handleFieldChange("seats", Number(e.target.value))
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Transmission
          </label>
          <select
            value={editingCar.transmission}
            onChange={(e) =>
              handleFieldChange("transmission", e.target.value)
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="CVT">CVT</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">
            Capacity (luggage/people)
          </label>
          <input
            type="number"
            value={editingCar.capacity}
            onChange={(e) =>
              handleFieldChange("capacity", Number(e.target.value))
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          Description
        </label>
        <textarea
          value={editingCar.description}
          onChange={(e) =>
            handleFieldChange("description", e.target.value)
          }
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">
          Features (comma-separated)
        </label>
        <input
          type="text"
          value={editingCar.features}
          onChange={(e) =>
            handleFieldChange("features", e.target.value)
          }
          placeholder="AC, GPS, Leather Seats"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={editingCar.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            placeholder="Contact phone"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={editingCar.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="Contact email"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">Pickup Location</label>
          <input
            type="text"
            name="pickupLocation"
            value={editingCar.pickupLocation}
            onChange={(e) => handleFieldChange("pickupLocation", e.target.value)}
            placeholder="Pickup location"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      {/* ─── Image URL with Preview ─── */}
      <div>
        <label className="block text-white/70 text-sm mb-1">
          Images (upload file or enter URL)
        </label>
        <div className="flex gap-2 mb-3">
          <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
          onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setEditingCar((prev) => { return { ...prev, images: ev.target?.result as string }; }); reader.readAsDataURL(file); } }}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-sm text-gray-500 mb-2">Drag & drop image here</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 rounded-lg bg-gold/10 text-gold text-sm font-medium hover:bg-gold/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "📁 Upload Image"}
          </button>
          <input
            type="text"
            value={imageUrlInput}
            onChange={(e) => {
              handleImageUrlChange(e.target.value);
              handleFieldChange("images", e.target.value);
            }}
            placeholder="https://..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        {uploadError && (
          <p className="text-red-400 text-xs mb-2">{uploadError}</p>
        )}
        <input
          type="text"
          name="imageUrl"
          value={imageUrlInput}
          onChange={(e) => {
            handleImageUrlChange(e.target.value);
            handleFieldChange("images", e.target.value);
          }}
          placeholder="Or paste image URL"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors mt-2"
        />
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
                    (fallback as HTMLElement).style.display =
                      "flex";
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
        <p className="text-xs text-gray-400 mt-1">Recommended: 1200x630px (JPEG, max 2MB)</p>
      </div>

      {/* ─── Pricing (Dynamic) ─── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-white/70 text-sm font-medium">
            Pricing Options
          </label>
          <button
            type="button"
            onClick={addPricing}
            className="px-3 py-1 rounded bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-colors"
          >
            + Add Pricing
          </button>
        </div>
        {editingCar.pricing.length === 0 && (
          <p className="text-white/30 text-sm italic">
            No pricing options added yet.
          </p>
        )}
        <div className="space-y-3">
          {editingCar.pricing.map((p, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-xs font-medium">
                  Option #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removePricing(index)}
                  className="text-red-400 text-xs hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <label className="block text-white/40 text-xs mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={p.duration}
                    onChange={(e) =>
                      handlePricingChange(
                        index,
                        "duration",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Half Day"
                    className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1">
                    Price MMK
                  </label>
                  <input
                    type="number"
                    value={p.priceMMK}
                    onChange={(e) =>
                      handlePricingChange(
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
                    value={p.priceUSD}
                    onChange={(e) =>
                      handlePricingChange(
                        index,
                        "priceUSD",
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

      <div>
        <label className="block text-white/70 text-sm mb-1">Status</label>
        <select
          value={editingCar.status}
          onChange={(e) =>
            handleFieldChange("status", e.target.value)
          }
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">
          Loading cars...
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
            Manage Cars
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage your vehicle fleet and pricing
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2"
        >
          <span>🚗</span> Add New Car
        </button>
      </div>

      {/* ─── Cars Table ─── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Vehicle
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Seats
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Transmission
                </th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">
                  Pricing
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
              {cars.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-white/30"
                  >
                    <span className="text-3xl block mb-2">🚗</span>
                    No cars found. Click &quot;Add New Car&quot; to
                    create one.
                  </td>
                </tr>
              ) : (
                cars.map((car) => {
                  const thumb = getFirstImage(car.images);
                  return (
                    <tr
                      key={car.id}
                      className="border-b border-white/5 hover:bg-white/[0.04] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt={car.carType}
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
                                🚗
                              </span>
                            )}
                          </div>
                          <span className="text-white font-medium">
                            {car.carType}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-white/70">
                        {car.seats || car.capacity} seats
                      </td>
                      <td className="p-4 text-white/70">
                        {car.transmission || "—"}
                      </td>
                      <td className="p-4 text-white/70">
                        {car.pricing && car.pricing.length > 0
                          ? `${car.pricing.length} option${car.pricing.length > 1 ? "s" : ""}`
                          : "—"}
                      </td>
                      <td className="p-4">
                        <span className={getStatusBadge(car.status)}>
                          {(car.status || "active").charAt(0).toUpperCase() + (car.status || "active").slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/cars/${car.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors">
                            View
                          </Link>
                          <button
                            onClick={() => openEditModal(car)}
                            className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm(car.id)
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
        title={isNew ? "Add New Car" : "Edit Car"}
        onSubmit={handleSubmit}
        submitLabel={isNew ? "Create Car" : "Update Car"}
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
              Are you sure you want to delete this car? This action cannot
              be undone.
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

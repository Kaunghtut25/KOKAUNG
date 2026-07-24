"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminFormModal from "@/components/AdminFormModal";

interface Insurance {
  id: string;
  planName: string;
  image: string;
  coverageAmountMMK: number;
  coverageAmountUSD: number;
  premiumPriceMMK: number;
  premiumPriceUSD: number;
  duration: string;
  benefits: string;
  exclusions: string;
  phone: string;
  email: string;
  officeAddress: string;
  status: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const emptyInsurance: Insurance = {
  id: "",
  planName: "",
  image: "",
  coverageAmountMMK: 0,
  coverageAmountUSD: 0,
  premiumPriceMMK: 0,
  premiumPriceUSD: 0,
  duration: "",
  benefits: "",
  exclusions: "",
  phone: "",
  email: "",
  officeAddress: "",
  status: "active",
};

export default function AdminInsurancePage() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<Insurance>(emptyInsurance);
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

  const fetchInsurances = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/insurances`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInsurances(Array.isArray(data) ? data : data.insurances || []);
      }
    } catch (err) {
      console.error("Failed to fetch insurances:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInsurances();
  }, [fetchInsurances]);

  const openCreateModal = () => {
    setEditingInsurance(emptyInsurance);
    setImageUrlInput("");
    setImagePreviewUrl("");
    setUploadError("");
    setIsNew(true);
    setModalOpen(true);
  };

  const openEditModal = (insurance: Insurance) => {
    setEditingInsurance({ ...insurance });
    setImageUrlInput(insurance.image || "");
    setImagePreviewUrl(insurance.image || "");
    setUploadError("");
    setIsNew(false);
    setModalOpen(true);
  };

  const handleFieldChange = (field: keyof Insurance, value: string | number) => {
    setEditingInsurance((prev) => ({ ...prev, [field]: value }));
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
        handleFieldChange("image", newUrl);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isNew
        ? `${API_BASE}/admin/insurances`
        : `${API_BASE}/admin/insurances/${editingInsurance.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingInsurance),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchInsurances();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save insurance plan");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save insurance plan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/insurances/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchInsurances();
      } else {
        alert("Failed to delete insurance plan");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete insurance plan");
    }
  };

  const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-600 text-white font-medium border border-green-400",
      inactive: "bg-red-600 text-white font-medium border border-red-400",
    };
    return `px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`;
  };

  const renderFormFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-white/70 text-sm mb-1">Plan Name</label>
        <input
          type="text"
          value={editingInsurance.planName}
          onChange={(e) => handleFieldChange("planName", e.target.value)}
          placeholder="e.g. Basic Travel Insurance"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Image (upload file or enter URL)</label>
        <div
          className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center cursor-pointer hover:border-gold/50 transition-colors"
          onDrop={(e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) uploadFile(file); }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <p className="text-sm text-white/40 mb-2">
            {uploading ? "Uploading..." : "Drag &amp; drop image here or click to upload"}
          </p>
          {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}
        </div>
        <input
          type="text"
          name="imageUrl"
          value={editingInsurance.image}
          onChange={(e) => { handleFieldChange("image", e.target.value); handleImageUrlChange(e.target.value); }}
          placeholder="Or paste image URL"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm mt-2 focus:outline-none focus:border-gold/50 transition-colors"
        />
        {editingInsurance.image && (
          <img src={editingInsurance.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg mt-2" />
        )}
        <p className="text-xs text-gray-400 mt-1">Recommended: 800x600px (JPEG, max 1MB)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">Coverage Amount MMK</label>
          <input
            type="number"
            value={editingInsurance.coverageAmountMMK}
            onChange={(e) => handleFieldChange("coverageAmountMMK", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">Coverage Amount USD</label>
          <input
            type="number"
            value={editingInsurance.coverageAmountUSD}
            onChange={(e) => handleFieldChange("coverageAmountUSD", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">Premium Price MMK</label>
          <input
            type="number"
            value={editingInsurance.premiumPriceMMK}
            onChange={(e) => handleFieldChange("premiumPriceMMK", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">Premium Price USD</label>
          <input
            type="number"
            value={editingInsurance.premiumPriceUSD}
            onChange={(e) => handleFieldChange("premiumPriceUSD", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Duration</label>
        <input
          type="text"
          value={editingInsurance.duration}
          onChange={(e) => handleFieldChange("duration", e.target.value)}
          placeholder="e.g. 7 Days, 30 Days"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Benefits (comma-separated)</label>
        <textarea
          value={editingInsurance.benefits}
          onChange={(e) => handleFieldChange("benefits", e.target.value)}
          rows={3}
          placeholder="Medical expenses, Trip cancellation, Baggage loss"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Exclusions (comma-separated)</label>
        <textarea
          value={editingInsurance.exclusions}
          onChange={(e) => handleFieldChange("exclusions", e.target.value)}
          rows={3}
          placeholder="Pre-existing conditions, Extreme sports"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">Phone</label>
          <input
            type="text"
            value={editingInsurance.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            placeholder="e.g. +95 9 123 456 789"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">Email</label>
          <input
            type="email"
            value={editingInsurance.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="e.g. insurance@a9.com"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Office Address</label>
        <input
          type="text"
          value={editingInsurance.officeAddress}
          onChange={(e) => handleFieldChange("officeAddress", e.target.value)}
          placeholder="e.g. No. 123, Main Street, Yangon"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Status</label>
        <select
          value={editingInsurance.status}
          onChange={(e) => handleFieldChange("status", e.target.value)}
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
        <div className="text-gold/70 animate-pulse text-lg">Loading insurance plans...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#D4AF37]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Manage Insurance
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage travel insurance plans
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2"
        >
          <span>🛡️</span> Add New Plan
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Image</th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Plan Name</th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Coverage</th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Premium</th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {insurances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/30">
                    No insurance plans found. Click &quot;Add New Plan&quot; to create one.
                  </td>
                </tr>
              ) : (
                insurances.map((insurance) => (
                  <tr
                    key={insurance.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      {insurance.image ? (
                        <img src={insurance.image} alt={insurance.planName} className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white/20 text-xs">N/A</div>
                      )}
                    </td>
                    <td className="p-4 text-white font-medium">{insurance.planName}</td>
                    <td className="p-4 text-white">
                      {formatNumber(insurance.coverageAmountMMK)} Ks
                    </td>
                    <td className="p-4 text-white">
                      {formatNumber(insurance.premiumPriceMMK)} Ks
                    </td>
                    <td className="p-4">
                      <span className={getStatusBadge(insurance.status)}>
                        {(insurance.status || "active").charAt(0).toUpperCase() + (insurance.status || "active").slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/insurance/${insurance.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                          View
                        </Link>
                        <button
                          onClick={() => openEditModal(insurance)}
                          className="px-3 py-1 rounded bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(insurance.id)}
                          className="px-3 py-1 rounded bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isNew ? "Add New Insurance Plan" : "Edit Insurance Plan"}
        onSubmit={handleSubmit}
        submitLabel={isNew ? "Create Plan" : "Update Plan"}
        isLoading={saving}
      >
        {renderFormFields()}
      </AdminFormModal>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-deepblue-dark border border-white/10 rounded-xl p-6 max-w-sm w-full z-10">
            <h3 className="text-lg font-bold text-white mb-2">Confirm Delete</h3>
            <p className="text-white/60 text-sm mb-6">
              Are you sure you want to delete this insurance plan? This action cannot be undone.
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
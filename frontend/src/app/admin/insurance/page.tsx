"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminFormModal from "@/components/AdminFormModal";

interface Insurance {
  id: string;
  planName: string;
  coverageAmountMMK: number;
  coverageAmountUSD: number;
  premiumPriceMMK: number;
  premiumPriceUSD: number;
  duration: string;
  benefits: string;
  exclusions: string;
  status: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const emptyInsurance: Insurance = {
  id: "",
  planName: "",
  coverageAmountMMK: 0,
  coverageAmountUSD: 0,
  premiumPriceMMK: 0,
  premiumPriceUSD: 0,
  duration: "",
  benefits: "",
  exclusions: "",
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

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

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
    setIsNew(true);
    setModalOpen(true);
  };

  const openEditModal = (insurance: Insurance) => {
    setEditingInsurance({ ...insurance });
    setIsNew(false);
    setModalOpen(true);
  };

  const handleFieldChange = (field: keyof Insurance, value: string | number) => {
    setEditingInsurance((prev) => ({ ...prev, [field]: value }));
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

  const formatNumber = (n: number) => new Intl.NumberFormat("en-MM").format(n);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      inactive: "bg-red-500/20 text-red-400 border-red-500/30",
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
        <h1 className="text-3xl font-bold text-white">Manage Insurance</h1>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all"
        >
          🛡️ Add New Plan
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/50 font-medium">Plan Name</th>
                <th className="text-left p-4 text-white/50 font-medium">Coverage</th>
                <th className="text-left p-4 text-white/50 font-medium">Premium</th>
                <th className="text-left p-4 text-white/50 font-medium">Status</th>
                <th className="text-left p-4 text-white/50 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {insurances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/30">
                    No insurance plans found. Click &quot;Add New Plan&quot; to create one.
                  </td>
                </tr>
              ) : (
                insurances.map((insurance) => (
                  <tr
                    key={insurance.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-white font-medium">{insurance.planName}</td>
                    <td className="p-4 text-white">
                      {formatNumber(insurance.coverageAmountMMK)} Ks
                    </td>
                    <td className="p-4 text-white">
                      {formatNumber(insurance.premiumPriceMMK)} Ks
                    </td>
                    <td className="p-4">
                      <span className={getStatusBadge(insurance.status)}>
                        {insurance.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
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

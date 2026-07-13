"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminFormModal from "@/components/AdminFormModal";

interface Visa {
  id: string;
  country: string;
  countryCode: string;
  processingTime: string;
  visaFeeMMK: number;
  visaFeeUSD: number;
  requirements: string;
  additionalInfo: string;
  status: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const emptyVisa: Visa = {
  id: "",
  country: "",
  countryCode: "",
  processingTime: "",
  visaFeeMMK: 0,
  visaFeeUSD: 0,
  requirements: "",
  additionalInfo: "",
  status: "active",
};

export default function AdminVisasPage() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<Visa>(emptyVisa);
  const [isNew, setIsNew] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  const fetchVisas = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/visas`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVisas(Array.isArray(data) ? data : data.visas || []);
      }
    } catch (err) {
      console.error("Failed to fetch visas:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchVisas();
  }, [fetchVisas]);

  const openCreateModal = () => {
    setEditingVisa(emptyVisa);
    setIsNew(true);
    setModalOpen(true);
  };

  const openEditModal = (visa: Visa) => {
    setEditingVisa({ ...visa });
    setIsNew(false);
    setModalOpen(true);
  };

  const handleFieldChange = (field: keyof Visa, value: string | number) => {
    setEditingVisa((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = isNew
        ? `${API_BASE}/admin/visas`
        : `${API_BASE}/admin/visas/${editingVisa.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingVisa),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchVisas();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save visa");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save visa");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/visas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchVisas();
      } else {
        alert("Failed to delete visa");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete visa");
    }
  };

  const formatNumber = (n: number) => new Intl.NumberFormat("en-MM").format(n);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-600 text-white font-medium border border-green-400",
      inactive: "bg-red-600 text-white font-medium border border-red-400",
    };
    return `px-2 py-0.5 rounded-full text-xs font-medium border ${map[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`;
  };

  const renderFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">Country</label>
          <input
            type="text"
            value={editingVisa.country}
            onChange={(e) => handleFieldChange("country", e.target.value)}
            placeholder="e.g. Thailand"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">Country Code</label>
          <input
            type="text"
            value={editingVisa.countryCode}
            onChange={(e) => handleFieldChange("countryCode", e.target.value)}
            placeholder="e.g. TH"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Processing Time</label>
        <input
          type="text"
          value={editingVisa.processingTime}
          onChange={(e) => handleFieldChange("processingTime", e.target.value)}
          placeholder="e.g. 3-5 Working Days"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">Visa Fee MMK</label>
          <input
            type="number"
            value={editingVisa.visaFeeMMK}
            onChange={(e) => handleFieldChange("visaFeeMMK", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">Visa Fee USD</label>
          <input
            type="number"
            value={editingVisa.visaFeeUSD}
            onChange={(e) => handleFieldChange("visaFeeUSD", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Requirements (comma-separated)</label>
        <textarea
          value={editingVisa.requirements}
          onChange={(e) => handleFieldChange("requirements", e.target.value)}
          rows={3}
          placeholder="Passport valid 6+ months, 2 passport photos, Bank statement"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Additional Info</label>
        <textarea
          value={editingVisa.additionalInfo}
          onChange={(e) => handleFieldChange("additionalInfo", e.target.value)}
          rows={3}
          placeholder="Any additional information about this visa service"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">Status</label>
        <select
          value={editingVisa.status}
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
        <div className="text-gold/70 animate-pulse text-lg">Loading visas...</div>
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
            Manage Visas
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Manage visa services by country
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2"
        >
          <span>🛂</span> Add New Visa
        </button>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Country</th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Processing Time</th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Fee</th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Status</th>
                <th className="text-left p-4 text-white/40 font-semibold uppercase tracking-wider text-[11px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/30">
                    No visas found. Click &quot;Add New Visa&quot; to create one.
                  </td>
                </tr>
              ) : (
                visas.map((visa) => (
                  <tr
                    key={visa.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 text-white font-medium">
                      {visa.countryCode && (
                        <span className="text-white/40 mr-2">{visa.countryCode}</span>
                      )}
                      {visa.country}
                    </td>
                    <td className="p-4 text-white/70">{visa.processingTime}</td>
                    <td className="p-4 text-white">{formatNumber(visa.visaFeeMMK)} Ks</td>
                    <td className="p-4">
                      <span className={getStatusBadge(visa.status)}>{visa.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(visa)}
                          className="px-3 py-1 rounded bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(visa.id)}
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
        title={isNew ? "Add New Visa" : "Edit Visa"}
        onSubmit={handleSubmit}
        submitLabel={isNew ? "Create Visa" : "Update Visa"}
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
              Are you sure you want to delete this visa service? This action cannot be undone.
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

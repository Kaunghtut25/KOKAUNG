"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminFormModal from "@/components/AdminFormModal";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { useClientRole } from "@/lib/useClientRole";

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
  const isViewer = useClientRole() === "viewer";
  const { t } = useI18n();
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
      setUploadError(t("admin.common.uploadFailed"));
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
      const res = await fetch(`${API_BASE}/admin/insurances/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchInsurances();
      } else {
        alert(t("admin.common.deleteFailed"));
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert(t("admin.common.deleteFailed"));
    }
  };

  const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);

  const getStatusBadge = (status?: string) => {
    const color = (status || "active") === "active"
      ? { bg: "#16a34a", text: "#fff", border: "#4ade80" }
      : (status || "active") === "inactive"
      ? { bg: "#dc2626", text: "#fff", border: "#f87171" }
      : (status || "active") === "featured"
      ? { bg: "#D4AF37", text: "#0A1628", border: "#D4AF37", fontWeight: "bold" as const }
      : { bg: "rgba(107,114,128,0.2)", text: "#9ca3af", border: "rgba(107,114,128,0.3)" };
    return {
      backgroundColor: color.bg,
      color: color.text,
      borderColor: color.border,
      fontWeight: (color as any).fontWeight || undefined,
    } as React.CSSProperties;
  };

    const renderFormFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.planName")}</label>
        <input
          type="text"
          value={editingInsurance.planName}
          onChange={(e) => handleFieldChange("planName", e.target.value)}
          placeholder={t("admin.insurance.phName")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.imageEnter")}</label>
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
          <p className="text-sm text-white/60 mb-2">
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
          <Image alt="Preview" className="w-20 h-20 object-cover rounded-lg mt-2" src={editingInsurance.image} width={1600} height={900} sizes="100vw" />
        )}
        <p className="text-xs text-gray-400 mt-1">{t("admin.form.recommended1mb")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.coverageMmk")}</label>
          <input
            type="number"
            value={editingInsurance.coverageAmountMMK}
            onChange={(e) => handleFieldChange("coverageAmountMMK", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.coverageUsd")}</label>
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
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.premiumMmk")}</label>
          <input
            type="number"
            value={editingInsurance.premiumPriceMMK}
            onChange={(e) => handleFieldChange("premiumPriceMMK", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.premiumUsd")}</label>
          <input
            type="number"
            value={editingInsurance.premiumPriceUSD}
            onChange={(e) => handleFieldChange("premiumPriceUSD", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.duration")}</label>
        <input
          type="text"
          value={editingInsurance.duration}
          onChange={(e) => handleFieldChange("duration", e.target.value)}
          placeholder={t("admin.insurance.phDur")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.benefits")}</label>
        <textarea
          value={editingInsurance.benefits}
          onChange={(e) => handleFieldChange("benefits", e.target.value)}
          rows={3}
          placeholder={t("admin.insurance.phBen")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.exclusions")}</label>
        <textarea
          value={editingInsurance.exclusions}
          onChange={(e) => handleFieldChange("exclusions", e.target.value)}
          rows={3}
          placeholder={t("admin.insurance.phExc")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.phone")}</label>
          <input
            type="text"
            value={editingInsurance.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            placeholder="e.g. +95 9 123 456 789"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.email")}</label>
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
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.officeAddress")}</label>
        <input
          type="text"
          value={editingInsurance.officeAddress}
          onChange={(e) => handleFieldChange("officeAddress", e.target.value)}
          placeholder={t("admin.insurance.phAddr")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.status")}</label>
        <select
          value={editingInsurance.status}
          onChange={(e) => handleFieldChange("status", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        >
          <option value="active">{t("admin.form.active")}</option>
          <option value="inactive">{t("admin.form.inactive")}</option>
        </select>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gold/70 animate-pulse text-lg">{t("admin.insurance.loading")}</div>
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
            {t("admin.insurance.title")}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {t("admin.insurance.subtitle")}
          </p>
        </div>
        {!isViewer && ((
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2"
        >
          <span>🛡️</span> {t("admin.insurance.addNew")}
        </button>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.visas.thImage")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.insurance.thPlan")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.insurance.thCoverage")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.insurance.thPremium")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.tours.thStatus")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.tours.thActions")}</th>
              </tr>
            </thead>
            <tbody>
              {insurances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    {t("admin.insurance.empty")}
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
                        <Image alt={insurance.planName} className="w-10 h-10 object-cover rounded" src={insurance.image} width={1600} height={900} sizes="100vw" />
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
                      <span style={getStatusBadge(insurance.status)} className="px-2 py-0.5 rounded-full text-xs font-medium border">
                        {insurance.status === "inactive" ? t("admin.form.inactive") : t("admin.form.active")}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/insurance/${insurance.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                          {t("admin.common.view")}
                        </Link>
                        {!isViewer && (<>
                        <button
                          onClick={() => openEditModal(insurance)}
                          className="px-3 py-1 rounded bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-colors"
                        >
                          {t("admin.common.edit")}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(insurance.id)}
                          className="px-3 py-1 rounded bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                        >
                          {t("admin.common.delete")}
                        </button>
                        </>)}
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
        title={isNew ? t("admin.insurance.addNewModal") : t("admin.insurance.editTitle")}
        onSubmit={handleSubmit}
        submitLabel={isNew ? t("admin.insurance.create") : t("admin.insurance.update")}
        isLoading={saving}
      >
        {renderFormFields()}
      </AdminFormModal>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-deepblue-dark border border-white/10 rounded-xl p-6 max-w-sm w-full z-10">
            <h3 className="text-lg font-bold text-white mb-2">{t("admin.common.confirmDelete")}</h3>
            <p className="text-white/60 text-sm mb-6">
              {t("admin.insurance.deleteMsg")}
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
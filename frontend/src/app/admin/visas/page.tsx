"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminFormModal from "@/components/AdminFormModal";
import { useI18n } from "@/lib/i18n";
import { useClientRole } from "@/lib/useClientRole";
import Image from "next/image";

interface Visa {
  id: string;
  country: string;
  countryCode: string;
  image: string;
  processingTime: string;
  visaFeeMMK: number;
  visaFeeUSD: number;
  requirements: string;
  additionalInfo: string;
  phone: string;
  email: string;
  officeAddress: string;
  status: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const emptyVisa: Visa = {
  id: "",
  country: "",
  countryCode: "",
  image: "",
  processingTime: "",
  visaFeeMMK: 0,
  visaFeeUSD: 0,
  requirements: "",
  additionalInfo: "",
  phone: "",
  email: "",
  officeAddress: "",
  status: "active",
};

export default function AdminVisasPage() {
  const { t } = useI18n();
  const isViewer = useClientRole() === "viewer";
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<Visa>(emptyVisa);
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
    setImageUrlInput("");
    setImagePreviewUrl("");
    setUploadError("");
    setIsNew(true);
    setModalOpen(true);
  };

  const openEditModal = (visa: Visa) => {
    setEditingVisa({ ...visa });
    setImageUrlInput(visa.image || "");
    setImagePreviewUrl(visa.image || "");
    setUploadError("");
    setIsNew(false);
    setModalOpen(true);
  };

  const handleFieldChange = (field: keyof Visa, value: string | number) => {
    setEditingVisa((prev) => ({ ...prev, [field]: value }));
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
      const res = await fetch(`${API_BASE}/admin/visas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchVisas();
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.country")}</label>
          <input
            type="text"
            value={editingVisa.country}
            onChange={(e) => handleFieldChange("country", e.target.value)}
            placeholder={t("admin.visas.phCountry")}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.countryCode")}</label>
          <input
            type="text"
            value={editingVisa.countryCode}
            onChange={(e) => handleFieldChange("countryCode", e.target.value)}
            placeholder={t("admin.visas.phCode")}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
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
          value={editingVisa.image}
          onChange={(e) => { handleFieldChange("image", e.target.value); handleImageUrlChange(e.target.value); }}
          placeholder="Or paste image URL"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm mt-2 focus:outline-none focus:border-gold/50 transition-colors"
        />
        {editingVisa.image && (
          <Image alt="Preview" className="w-20 h-20 object-cover rounded-lg mt-2" src={editingVisa.image} width={1600} height={900} sizes="100vw" />
        )}
        <p className="text-xs text-gray-400 mt-1">{t("admin.form.recommended1mb")}</p>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.processingTime")}</label>
        <input
          type="text"
          value={editingVisa.processingTime}
          onChange={(e) => handleFieldChange("processingTime", e.target.value)}
          placeholder={t("admin.visas.phProc")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.visaFeeMmk")}</label>
          <input
            type="number"
            value={editingVisa.visaFeeMMK}
            onChange={(e) => handleFieldChange("visaFeeMMK", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.visaFeeUsd")}</label>
          <input
            type="number"
            value={editingVisa.visaFeeUSD}
            onChange={(e) => handleFieldChange("visaFeeUSD", Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.requirements")}</label>
        <textarea
          value={editingVisa.requirements}
          onChange={(e) => handleFieldChange("requirements", e.target.value)}
          rows={3}
          placeholder={t("admin.visas.phReq")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.additionalInfo")}</label>
        <textarea
          value={editingVisa.additionalInfo}
          onChange={(e) => handleFieldChange("additionalInfo", e.target.value)}
          rows={3}
          placeholder={t("admin.visas.phAdd")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.phone")}</label>
          <input
            type="text"
            value={editingVisa.phone}
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            placeholder="e.g. +95 9 123 456 789"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-1">{t("admin.form.email")}</label>
          <input
            type="email"
            value={editingVisa.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="e.g. visas@a9.com"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.officeAddress")}</label>
        <input
          type="text"
          value={editingVisa.officeAddress}
          onChange={(e) => handleFieldChange("officeAddress", e.target.value)}
          placeholder={t("admin.visas.phAddr")}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gold/50 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/70 text-sm mb-1">{t("admin.form.status")}</label>
        <select
          value={editingVisa.status}
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
        <div className="text-gold/70 animate-pulse text-lg">{t("admin.visas.loading")}</div>
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
            {t("admin.visas.title")}
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {t("admin.visas.subtitle")}
          </p>
        </div>
{!isViewer && (
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-lg bg-gold text-deepblue-dark font-semibold text-sm hover:bg-gold/90 transition-all flex items-center gap-2"
        >
          <span>🛂</span> {t("admin.visas.addNew")}
        </button>
        )}
      </div>

      {isViewer && (
        <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-200">{t("admin.readOnly.banner")}</div>
      )}

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.visas.thImage")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.visas.thCountry")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.visas.thProcessing")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.visas.thFee")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.tours.thStatus")}</th>
                <th className="text-left p-4 text-white/60 font-semibold uppercase tracking-wider text-[11px]">{t("admin.tours.thActions")}</th>
              </tr>
            </thead>
            <tbody>
              {visas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50">
                    {t("admin.visas.empty")}
                  </td>
                </tr>
              ) : (
                visas.map((visa) => (
                  <tr
                    key={visa.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      {visa.image ? (
                        <Image alt={visa.country} className="w-10 h-10 object-cover rounded" src={visa.image} width={1600} height={900} sizes="100vw" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-white/20 text-xs">N/A</div>
                      )}
                    </td>
                    <td className="p-4 text-white font-medium">
                      {visa.countryCode && (
                        <span className="text-white/60 mr-2">{visa.countryCode}</span>
                      )}
                      {visa.country}
                    </td>
                    <td className="p-4 text-white/70">{visa.processingTime}</td>
                    <td className="p-4 text-white">{formatNumber(visa.visaFeeMMK)} Ks</td>
                    <td className="p-4">
                      <span style={getStatusBadge(visa.status)} className="px-2 py-0.5 rounded-full text-xs font-medium border">{visa.status === "inactive" ? t("admin.form.inactive") : t("admin.form.active")}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/visas/${visa.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                          {t("admin.common.view")}
                        </Link>
{!isViewer && (<>
                        <button
                          onClick={() => openEditModal(visa)}
                          className="px-3 py-1 rounded bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-colors"
                        >
                          {t("admin.common.edit")}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(visa.id)}
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
        title={isNew ? t("admin.visas.addNewModal") : t("admin.visas.editTitle")}
        onSubmit={handleSubmit}
        submitLabel={isNew ? t("admin.visas.create") : t("admin.visas.update")}
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
              {t("admin.visas.deleteMsg")}
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
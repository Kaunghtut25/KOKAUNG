"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import toast from "react-hot-toast";
import { useClientRole } from "@/lib/useClientRole";

interface KnowledgeItem {
  id?: string;
  topic: string;
  keywords: string;
  question: string;
  answer: string;
  status: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";
const EMPTY: KnowledgeItem = { topic: "", keywords: "", question: "", answer: "", status: "active" };

export default function AdminKnowledgePage() {
  const isViewer = useClientRole() === "viewer";
  const { t } = useI18n();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<KnowledgeItem | null>(null);
  const [form, setForm] = useState<KnowledgeItem>(EMPTY);
  const [saving, setSaving] = useState(false);

  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/knowledge`, { headers: { Authorization: "Bearer " + getToken() } });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error(t("admin.common.failedLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const startAdd = () => { setEditing(null); setForm(EMPTY); };
  const startEdit = (it: KnowledgeItem) => {
    setEditing(it);
    setForm({ topic: it.topic || "", keywords: it.keywords || "", question: it.question || "", answer: it.answer || "", status: it.status || "active" });
  };

  const save = async () => {
    if (!form.topic.trim()) { toast.error(t("admin.knowledge.topic") + " required"); return; }
    if (!form.answer.trim()) { toast.error(t("admin.knowledge.answer") + " required"); return; }
    setSaving(true);
    try {
      const url = editing?.id ? `${API_BASE}/admin/knowledge?id=${encodeURIComponent(editing.id)}` : `${API_BASE}/admin/knowledge`;
      const res = await fetch(url, {
        method: editing?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + getToken() },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("bad status");
      toast.success(editing?.id ? t("admin.common.updated") : t("admin.common.created"));
      startAdd();
      await load();
    } catch {
      toast.error(t("admin.common.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (it: KnowledgeItem) => {
    if (!it.id) return;
    if (!window.confirm(t("admin.common.confirmDelete") + ": " + (it.topic || it.question || it.id))) return;
    try {
      const res = await fetch(`${API_BASE}/admin/knowledge?id=${encodeURIComponent(it.id)}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + getToken() },
      });
      if (!res.ok) throw new Error("bad status");
      toast.success(t("admin.common.deleted"));
      if (editing?.id === it.id) startAdd();
      await load();
    } catch {
      toast.error(t("admin.common.deleteFailed"));
    }
  };

  const inputCls = "w-full border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] bg-white/5 text-white";
  const labelCls = "block text-sm font-medium text-white/70 mb-1";

  return (
    <div className="text-white p-4 md:p-6">
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link href="/admin/dashboard" className="text-sm text-white/50 hover:text-[#D4AF37]">{t("admin.common.dashboardBack")}</Link>
            <h1 className="text-xl font-bold text-white mt-1">🧠 {t("admin.knowledge.title")}</h1>
            <p className="text-sm text-white/50 mt-1">{t("admin.knowledge.hint")}</p>
          </div>
          {!isViewer && ((
          <button
            onClick={startAdd}
            className="bg-[#D4AF37] text-[#0A1628] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#C5A028]"
          >
            + {t("admin.knowledge.add")}
          </button>
          ))}
        </div>

      {isViewer && (
        <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-200">{t("admin.readOnly.banner")}</div>
      )}

        {/* Form */}
        <div className="bg-white/5 rounded-lg shadow-sm border border-white/10 p-4 mb-6">
          <h2 className="font-semibold text-white mb-3">{editing ? t("admin.knowledge.edit") : t("admin.knowledge.add")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t("admin.knowledge.topic")}</label>
              <input className={inputCls} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Cancellation Policy" />
            </div>
            <div>
              <label className={labelCls}>{t("admin.knowledge.keywords")}</label>
              <input className={inputCls} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="cancel, refund, ဖျက်သိမ်း, ပြန်အမ်း" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>{t("admin.knowledge.question")}</label>
              <input className={inputCls} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="e.g. Can I cancel my tour booking?" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>{t("admin.knowledge.answer")}</label>
              <textarea className={inputCls + " min-h-[110px]"} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="The exact answer the chatbot should give..." />
            </div>
            <div>
              <label className={labelCls}>{t("admin.knowledge.status")}</label>
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} disabled={saving || isViewer} className="bg-[#D4AF37] text-[#0A1628] px-5 py-2 rounded-md text-sm font-bold hover:opacity-90 disabled:opacity-50">
              {saving ? t("admin.common.saving") : (editing ? t("admin.common.update") : t("admin.knowledge.add"))}
            </button>
            {editing && (
              <button onClick={startAdd} className="px-4 py-2 rounded-md text-sm border border-white/10 hover:bg-white/10 text-white">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-8 text-white/50">{t("admin.common.saving")}...</div>
        ) : items.length === 0 ? (
          <div className="bg-white/5 rounded-lg border border-dashed border-white/10 p-8 text-center text-white/50">
            No knowledge entries yet — add your first one above.
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((it) => (
              <div key={it.id} className="bg-white/5 rounded-lg shadow-sm border border-white/10 p-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white truncate">{it.topic}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${it.status === "inactive" ? "bg-white/10 text-white/50" : "bg-green-500/20 text-green-400"}`}>
                      {it.status === "inactive" ? "Inactive" : "Active"}
                    </span>
                  </div>
                  {it.keywords && <div className="text-xs text-white/40 mt-0.5 truncate">🔑 {it.keywords}</div>}
                  {it.question && <div className="text-xs text-white/50 mt-0.5 truncate">❓ {it.question}</div>}
                  <div className="text-sm text-white/60 mt-1 line-clamp-2 whitespace-pre-wrap">{it.answer}</div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {!isViewer && (<>
                  <button onClick={() => startEdit(it)} className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/10 text-white">{t("admin.common.edit")}</button>
                  <button onClick={() => remove(it)} className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10">{t("admin.common.delete")}</button>
                  </>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

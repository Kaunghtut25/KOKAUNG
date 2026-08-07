"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";

interface UserRow {
  id?: string; _id?: string;
  name?: string; email?: string; role?: string;
  authorities?: string[];
  isPrimary?: boolean;
  createdAt?: string;
}

const inputCls = "w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none";

const ROLES = [
  { value: "admin", labelKey: "admin.users.role.admin", descKey: "admin.users.roleDesc.admin" },
  { value: "staff", labelKey: "admin.users.role.staff", descKey: "admin.users.roleDesc.staff" },
  { value: "editor", labelKey: "admin.users.role.editor", descKey: "admin.users.roleDesc.editor" },
  { value: "viewer", labelKey: "admin.users.role.viewer", descKey: "admin.users.roleDesc.viewer" },
];

const AUTHORITIES = [
  { key: "tours", labelKey: "admin.users.auth.tours" },
  { key: "hotels", labelKey: "admin.users.auth.hotels" },
  { key: "cars", labelKey: "admin.users.auth.cars" },
  { key: "cruises", labelKey: "admin.users.auth.cruises" },
  { key: "visas", labelKey: "admin.users.auth.visas" },
  { key: "insurances", labelKey: "admin.users.auth.insurance" },
  { key: "bookings", labelKey: "admin.users.auth.bookings" },
  { key: "users", labelKey: "admin.users.auth.users" },
  { key: "settings", labelKey: "admin.users.auth.settings" },
  { key: "blog", labelKey: "admin.users.auth.blog" },
  { key: "destinations", labelKey: "admin.users.auth.destinations" },
  { key: "sky-lounge", labelKey: "admin.users.auth.sky" },
];

// FIX: 2026-08-04 admin-users-v2b — admin API routes require the bearer token
function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
  return { ...extra, Authorization: `Bearer ${token}` };
}

const roleColor: Record<string, string> = {
  admin: "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30",
  staff: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  editor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  viewer: "bg-white/10 text-white/50 border-white/20",
};

export default function AdminUsersPage() {
  const { t } = useI18n();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" });
  const [auths, setAuths] = useState<string[]>(AUTHORITIES.map((a) => a.key));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", { headers: authHeaders() });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", email: "", password: "", role: "admin" });
    setAuths(AUTHORITIES.map((a) => a.key));
    setError("");
    setModal(true);
  };

  const openEdit = (u: UserRow) => {
    setEditId(u.id || u._id || null);
    setForm({ name: u.name || "", email: u.email || "", password: "", role: u.role || "admin" });
    setAuths(Array.isArray(u.authorities) && u.authorities.length ? u.authorities : AUTHORITIES.map((a) => a.key));
    setError("");
    setModal(true);
  };

  const toggleAuth = (key: string) => {
    setAuths((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError(t("admin.users.errNameEmail"));
      return;
    }
    if (!editId && !form.password) {
      setError(t("admin.users.errPwReq"));
      return;
    }
    if (form.password && form.password.length < 6) {
      setError(t("admin.users.errPwLen"));
      return;
    }
    setSaving(true); setError("");
    try {
      const url = editId ? `/api/admin/users?id=${encodeURIComponent(editId)}` : "/api/admin/users";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ ...form, authorities: auths }),
      });
      const data = await res.json();
      if (res.ok) {
        setModal(false);
        setForm({ name: "", email: "", password: "", role: "admin" });
        await load();
      } else {
        setError(data.message || t("admin.users.errSave"));
      }
    } catch (e) { console.error(e); setError(t("admin.users.errSave")); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm(t("admin.users.confirmDel"))) return;
    try {
      await fetch(`/api/admin/users?id=${id}`, { method: "DELETE", headers: authHeaders() });
      await load();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-white/60 text-lg">{t("admin.users.loading")}</div></div>;

  return (
    <div className="min-h-screen bg-[#0A1628] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <h1 className="text-3xl font-light text-white">{t("admin.users.title")} ({users.length})</h1>
          <button onClick={openAdd}
            className="bg-[#D4AF37] text-[#0A1628] px-5 py-2 rounded-lg font-medium hover:bg-[#C4A030] transition">
            {t("admin.users.addNew")}
          </button>
        </div>

        <p className="text-white/60 text-sm mb-6">{t("admin.users.subtitle")} <span className="text-[#D4AF37]">/auth/login</span>. Passwords are stored hashed — never in plaintext. Assign roles & authorities to control what each user can access.</p>

        {users.length === 0 ? (
          <div className="text-white/60 text-center py-16 text-lg">{t("admin.users.empty")}</div>
        ) : (
          <div className="bg-[#0F1E35] border border-white/10 rounded-xl overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0A1628]">
                <tr className="text-white/60 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">{t("admin.book.name")}</th>
                  <th className="px-5 py-3">{t("admin.book.email")}</th>
                  <th className="px-5 py-3">{t("admin.users.role")}</th>
                  <th className="px-5 py-3">{t("admin.users.authorities")}</th>
                  <th className="px-5 py-3">{t("admin.users.created")}</th>
                  <th className="px-5 py-3 text-right">{t("admin.dash.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id || u._id} className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-5 py-3">
                      <span className="text-white font-medium">{u.name || "—"}</span>
                      {u.isPrimary && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded-full px-2 py-0.5">{t("admin.users.primary")}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-white/60 text-sm">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 ${roleColor[u.role || "admin"] || roleColor.admin}`}>
                        {u.role || "admin"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(u.authorities || []).slice(0, 6).map((a) => (
                          <span key={a} className="text-[10px] bg-white/5 text-white/50 border border-white/10 rounded px-1.5 py-0.5">{a}</span>
                        ))}
                        {(u.authorities || []).length > 6 && (
                          <span className="text-[10px] text-white/60">+{(u.authorities || []).length - 6}</span>
                        )}
                        {(!u.authorities || u.authorities.length === 0) && <span className="text-white/50 text-xs">{t("admin.users.allAuth")}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white/60 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}</td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(u)}
                        className="text-[#D4AF37]/80 hover:text-[#D4AF37] text-sm px-3 py-1 border border-[#D4AF37]/20 rounded hover:border-[#D4AF37] transition mr-2">
                        {t("admin.common.edit")}
                      </button>
                      {!u.isPrimary && (
                        <button onClick={() => del(u.id || u._id || "")}
                          className="text-red-400/70 hover:text-red-400 text-sm px-3 py-1 border border-red-400/20 rounded hover:border-red-400 transition">
                          {t("admin.common.delete")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1E35] border border-white/20 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-white font-semibold mb-4">{editId ? t("admin.users.editTitle") : t("admin.users.addTitle")}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-white/60 text-xs block mb-1">{t("admin.users.fullName")}</label>
                <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t("admin.users.phName")} />
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">{t("admin.book.email")}</label>
                <input className={inputCls} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@a9globaltravel.com.mm" />
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">
                  {t("admin.users.password")} {editId ? t("admin.users.pwKeep") : t("admin.users.pwMin")}
                </label>
                <input className={inputCls} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">{t("admin.users.roleAuth")}</label>
                <select className={inputCls} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{t(r.labelKey)}</option>)}
                </select>
                <p className="text-white/50 text-xs mt-1">{t(ROLES.find(r => r.value === form.role)?.descKey || "")}</p>
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">{t("admin.users.sectionAccess")}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {AUTHORITIES.map((a) => (
                    <label key={a.key} className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded border cursor-pointer transition ${auths.includes(a.key) ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"}`}>
                      <input type="checkbox" checked={auths.includes(a.key)} onChange={() => toggleAuth(a.key)} className="accent-[#D4AF37]" />
                      {t(a.labelKey)}
                    </label>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 border border-white/20 text-white/70 py-2.5 rounded-lg hover:bg-white/5 transition">{t("common.cancel")}</button>
              <button onClick={save} disabled={saving}
                className="flex-1 bg-[#D4AF37] text-[#0A1628] py-2.5 rounded-lg font-medium hover:bg-[#C4A030] transition disabled:opacity-50">
                {saving ? t("admin.common.saving") : editId ? t("admin.users.saveChanges") : t("admin.users.createUser")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

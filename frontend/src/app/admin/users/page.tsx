"use client";

import { useState, useEffect, useCallback } from "react";

interface UserRow {
  id?: string; _id?: string;
  name?: string; email?: string; role?: string;
  authorities?: string[];
  isPrimary?: boolean;
  createdAt?: string;
}

const inputCls = "w-full bg-[#0A1628] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D4AF37] outline-none";

const ROLES = [
  { value: "admin", label: "Admin — full access", desc: "Everything" },
  { value: "staff", label: "Staff — manage content", desc: "CRUD content, no user management" },
  { value: "editor", label: "Editor — edit content", desc: "Content edits & bookings" },
  { value: "viewer", label: "Viewer — read only", desc: "View dashboard & data" },
];

const AUTHORITIES = [
  { key: "tours", label: "Tours" },
  { key: "hotels", label: "Hotels" },
  { key: "cars", label: "Cars" },
  { key: "cruises", label: "Cruises" },
  { key: "visas", label: "Visas" },
  { key: "insurances", label: "Insurance" },
  { key: "bookings", label: "Bookings" },
  { key: "users", label: "Users" },
  { key: "settings", label: "Settings" },
  { key: "blog", label: "Blog" },
  { key: "destinations", label: "Destinations" },
  { key: "sky-lounge", label: "Sky Lounge" },
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
      setError("Name and email are required.");
      return;
    }
    if (!editId && !form.password) {
      setError("Password is required for new users.");
      return;
    }
    if (form.password && form.password.length < 6) {
      setError("Password must be at least 6 characters.");
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
        setError(data.message || "Failed to save user");
      }
    } catch (e) { console.error(e); setError("Failed to save user"); }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this user? They will no longer be able to log in.")) return;
    try {
      await fetch(`/api/admin/users?id=${id}`, { method: "DELETE", headers: authHeaders() });
      await load();
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="min-h-screen bg-[#0A1628] flex items-center justify-center"><div className="text-white/60 text-lg">Loading users...</div></div>;

  return (
    <div className="min-h-screen bg-[#0A1628] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-white">Manage Users ({users.length})</h1>
          <button onClick={openAdd}
            className="bg-[#D4AF37] text-[#0A1628] px-5 py-2 rounded-lg font-medium hover:bg-[#C4A030] transition">
            + Add New User
          </button>
        </div>

        <p className="text-white/40 text-sm mb-6">Create admin accounts so your team can log in at <span className="text-[#D4AF37]">/auth/login</span>. Passwords are stored hashed — never in plaintext. Assign roles & authorities to control what each user can access.</p>

        {users.length === 0 ? (
          <div className="text-white/40 text-center py-16 text-lg">No users yet. Click "+ Add New User" to create the first admin account.</div>
        ) : (
          <div className="bg-[#0F1E35] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#0A1628]">
                <tr className="text-white/40 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Authorities</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id || u._id} className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-5 py-3">
                      <span className="text-white font-medium">{u.name || "—"}</span>
                      {u.isPrimary && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded-full px-2 py-0.5">Primary</span>
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
                          <span className="text-[10px] text-white/40">+{(u.authorities || []).length - 6}</span>
                        )}
                        {(!u.authorities || u.authorities.length === 0) && <span className="text-white/30 text-xs">all</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "—"}</td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(u)}
                        className="text-[#D4AF37]/80 hover:text-[#D4AF37] text-sm px-3 py-1 border border-[#D4AF37]/20 rounded hover:border-[#D4AF37] transition mr-2">
                        Edit
                      </button>
                      {!u.isPrimary && (
                        <button onClick={() => del(u.id || u._id || "")}
                          className="text-red-400/70 hover:text-red-400 text-sm px-3 py-1 border border-red-400/20 rounded hover:border-red-400 transition">
                          Delete
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
            <h2 className="text-xl text-white font-semibold mb-4">{editId ? "Edit User" : "Add New User"}</h2>
            <div className="space-y-3">
              <div>
                <label className="text-white/60 text-xs block mb-1">Full Name</label>
                <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Su Myat" />
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">Email</label>
                <input className={inputCls} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="name@a9globaltravel.com.mm" />
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">
                  Password {editId ? "(leave blank to keep current)" : "(min 6 characters)"}
                </label>
                <input className={inputCls} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">Role / Authorities</label>
                <select className={inputCls} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                <p className="text-white/30 text-xs mt-1">{ROLES.find(r => r.value === form.role)?.desc}</p>
              </div>
              <div>
                <label className="text-white/60 text-xs block mb-1">Section Access</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {AUTHORITIES.map((a) => (
                    <label key={a.key} className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded border cursor-pointer transition ${auths.includes(a.key) ? "bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"}`}>
                      <input type="checkbox" checked={auths.includes(a.key)} onChange={() => toggleAuth(a.key)} className="accent-[#D4AF37]" />
                      {a.label}
                    </label>
                  ))}
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 border border-white/20 text-white/70 py-2.5 rounded-lg hover:bg-white/5 transition">Cancel</button>
              <button onClick={save} disabled={saving}
                className="flex-1 bg-[#D4AF37] text-[#0A1628] py-2.5 rounded-lg font-medium hover:bg-[#C4A030] transition disabled:opacity-50">
                {saving ? "Saving..." : editId ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
